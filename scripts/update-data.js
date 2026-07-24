#!/usr/bin/env node

/**
 * AGI Rating - Weekly Data Updater
 * Scrapes model data from Artificial Analysis, Arena.ai, and Vellum
 * Merges with existing data.js and outputs updated file
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'js', 'data.js');
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'data.js');

// Known provider mappings (provider name -> provider id)
const PROVIDER_MAP = {
  'Anthropic': 'anthropic',
  'OpenAI': 'openai',
  'Google': 'google',
  'Google DeepMind': 'google',
  'Meta': 'meta',
  'Meta Llama': 'meta',
  'xAI': 'xai',
  'DeepSeek': 'deepseek',
  'Alibaba': 'alibaba',
  'Alibaba/Qwen': 'alibaba',
  'Qwen': 'alibaba',
  'Moonshot AI': 'moonshot',
  'Moonshot': 'moonshot',
  'Zhipu AI': 'zhipu',
  'Zhipu': 'zhipu',
  'ByteDance': 'bytedance',
  'Mistral AI': 'mistral',
  'Mistral': 'mistral',
  'NVIDIA': 'nvidia',
  'Amazon': 'amazon',
  'AWS': 'amazon',
  'Apple': 'apple',
  'MiniMax': 'minimax',
  'StepFun': 'stepfun',
  'Inflection': 'inflection',
  'Cohere': 'cohere',
  'Xiaomi': 'xiaomi',
  'Inception': 'inception',
};

async function scrapeArtificialAnalysis(page) {
  console.log('Scraping Artificial Analysis...');
  const results = {};

  try {
    await page.goto('https://artificialanalysis.ai/leaderboards/models', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Wait for table to load
    await page.waitForSelector('table tbody tr', { timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // extra wait for dynamic content

    const rows = await page.evaluate(() => {
      const data = [];
      const tableRows = document.querySelectorAll('table tbody tr');
      tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return;

        // Extract model name and provider from the first cell
        const nameEl = cells[0];
        const name = nameEl?.textContent?.trim() || '';

        // Extract other metrics
        const intelligence = parseFloat(cells[1]?.textContent) || null;
        const speed = parseFloat(cells[2]?.textContent) || null;
        const pricing = cells[3]?.textContent?.trim() || '';
        const context = cells[4]?.textContent?.trim() || '';

        if (name) {
          data.push({ name, intelligence, speed, pricing, context });
        }
      });
      return data;
    });

    console.log(`  Found ${rows.length} models from Artificial Analysis`);
    rows.forEach(row => {
      results[row.name] = {
        intelligence: row.intelligence,
        speed: row.speed,
        pricing: row.pricing,
        context: row.context,
      };
    });
  } catch (err) {
    console.error('  Error scraping Artificial Analysis:', err.message);
  }

  return results;
}

async function scrapeArenaAi(page) {
  console.log('Scraping Arena.ai...');
  const results = {};

  try {
    await page.goto('https://arena.ai/leaderboard/text', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Wait for leaderboard to load
    await new Promise(r => setTimeout(r, 5000));

    const rows = await page.evaluate(() => {
      const data = [];
      // Try multiple selector patterns
      const tableRows = document.querySelectorAll('table tbody tr, [class*="row"], [class*="leaderboard"] > div');
      tableRows.forEach(row => {
        const text = row.textContent || '';
        // Look for model names and ELO scores
        const nameMatch = text.match(/([\w\s\-\.]+(?:GPT|Claude|Gemini|Llama|Mistral|Qwen|DeepSeek|Grok|Command|Nemotron|MiMo|Kimi|Gemma|Step|Phi)[\w\s\-\.]*)/i);
        const eloMatch = text.match(/(\d{4,5})/);

        if (nameMatch && eloMatch) {
          data.push({
            name: nameMatch[1].trim(),
            elo: parseInt(eloMatch[1]),
          });
        }
      });
      return data;
    });

    console.log(`  Found ${rows.length} models from Arena.ai`);
    rows.forEach(row => {
      results[row.name] = { elo: row.elo };
    });
  } catch (err) {
    console.error('  Error scraping Arena.ai:', err.message);
  }

  return results;
}

async function scrapeVellum(page) {
  console.log('Scraping Vellum...');
  const results = {};

  try {
    await page.goto('https://www.vellum.ai/llm-leaderboard', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    await new Promise(r => setTimeout(r, 5000));

    const rows = await page.evaluate(() => {
      const data = [];
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 2) return;

          const name = cells[0]?.textContent?.trim() || '';
          const scores = {};
          for (let i = 1; i < cells.length; i++) {
            const val = parseFloat(cells[i]?.textContent) || null;
            scores[`benchmark_${i}`] = val;
          }

          if (name) {
            data.push({ name, scores });
          }
        });
      });
      return data;
    });

    console.log(`  Found ${rows.length} models from Vellum`);
    rows.forEach(row => {
      results[row.name] = row.scores;
    });
  } catch (err) {
    console.error('  Error scraping Vellum:', err.message);
  }

  return results;
}

function normalizeModelName(name) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/\(.*?\)/g, '')
    .trim()
    .toLowerCase();
}

function findExistingModel(models, name) {
  const normalized = normalizeModelName(name);
  return models.find(m => {
    const mName = normalizeModelName(m.name);
    return mName === normalized ||
           mName.includes(normalized) ||
           normalized.includes(mName);
  });
}

function mergeData(existingModels, aaData, arenaData, vellumData) {
  const updated = [];
  const seen = new Set();

  for (const model of existingModels) {
    seen.add(model.id);

    // Try to find matching data from scraped sources
    const aaMatch = findExistingModel(Object.keys(aaData), model.name);
    const arenaMatch = findExistingModel(Object.keys(arenaData), model.name);
    const vellumMatch = findExistingModel(Object.keys(vellumData), model.name);

    const updatedModel = { ...model, scores: { ...model.scores } };

    if (aaMatch && aaData[aaMatch]) {
      const aa = aaData[aaMatch];
      updatedModel.scores.artificialAnalysis = {
        ...updatedModel.scores.artificialAnalysis,
        intelligence: aa.intelligence || updatedModel.scores.artificialAnalysis?.intelligence,
        speed: aa.speed || updatedModel.scores.artificialAnalysis?.speed,
      };
    }

    if (arenaMatch && arenaData[arenaMatch]) {
      const arena = arenaData[arenaMatch];
      updatedModel.scores.chatbotArena = {
        ...updatedModel.scores.chatbotArena,
        elo: arena.elo || updatedModel.scores.chatbotArena?.elo,
      };
    }

    updated.push(updatedModel);
  }

  return updated;
}

function generateDataJs(models, providers, categories, sources) {
  let output = `// AGI Rating - Consolidated LLM Data from Multiple Sources\n`;
  output += `// Data current as of: ${new Date().toISOString().split('T')[0]}\n`;
  output += `// Sources: Artificial Analysis, LLM Stats, Vellum, Chatbot Arena, LiveBench, WhatLLM, HuggingFace, OpenCompass\n`;
  output += `// Auto-updated by scripts/update-data.js\n\n`;

  // Providers
  output += `const PROVIDERS = {\n`;
  for (const [key, val] of Object.entries(providers)) {
    output += `  ${key}: { name: '${val.name}', color: '${val.color}', logo: '${val.logo}' },\n`;
  }
  output += `};\n\n`;

  // Categories
  output += `const CATEGORIES = {\n`;
  for (const [key, val] of Object.entries(categories)) {
    output += `  ${key}: '${val}',\n`;
  }
  output += `};\n\n`;

  // Sources
  output += `const SOURCES = {\n`;
  for (const [key, val] of Object.entries(sources)) {
    output += `  ${key}: { name: '${val.name}', url: '${val.url}', icon: '${val.icon}' },\n`;
  }
  output += `};\n\n`;

  // Models
  output += `const MODELS = [\n`;
  for (const model of models) {
    output += `  ${JSON.stringify(model, null, 4).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')},\n`;
  }
  output += `];\n\n`;

  // Helper functions
  output += `
function getProviders() {
  return Object.entries(PROVIDERS).map(([id, p]) => ({ id, ...p }));
}

function getModelsByCategory(category) {
  return MODELS.filter(m => m.categories && m.categories.includes(category));
}

function getTopScore(model) {
  var scores = [];
  if (model.scores.artificialAnalysis && model.scores.artificialAnalysis.intelligence) scores.push(model.scores.artificialAnalysis.intelligence);
  if (model.scores.llmStats && model.scores.llmStats.composite) scores.push(model.scores.llmStats.composite);
  if (model.scores.chatbotArena && model.scores.chatbotArena.elo) scores.push(model.scores.chatbotArena.elo / 25);
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function getCategoryLeaders() {
  var leaders = {};
  for (const [key, label] of Object.entries(CATEGORIES)) {
    const models = getModelsByCategory(key).slice(0, 5);
    if (models.length > 0) {
      leaders[key] = { label, models };
    }
  }
  return leaders;
}

// Export for use in other files
window.AGIRating = {
  MODELS,
  PROVIDERS,
  CATEGORIES,
  SOURCES,
  getProviders,
  getModelsByCategory,
  getTopScore,
  getCategoryLeaders,
};
`;

  return output;
}

async function main() {
  console.log('AGI Rating Data Updater');
  console.log('======================\n');

  // Read existing data
  let existingData = {};
  try {
    const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
    // Extract MODELS from existing file — safe: only reads our own generated data.js
    // ponytail: JSON.parse needs double quotes, data.js uses single quotes — swap first
    const modelsMatch = dataContent.match(/const MODELS = (\[[\s\S]*?\]);/);
    if (modelsMatch) {
      try {
        existingData.models = JSON.parse(modelsMatch[1]);
      } catch {
        // data.js uses single quotes — convert to double quotes for JSON.parse
        const fixed = modelsMatch[1]
          .replace(/'/g, '"')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        existingData.models = JSON.parse(fixed);
      }
      console.log(`Loaded ${existingData.models.length} existing models`);
    }
  } catch (err) {
    console.error('Error reading existing data:', err.message);
    existingData.models = [];
  }

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Scrape all sources
    const aaData = await scrapeArtificialAnalysis(page);
    const arenaData = await scrapeArenaAi(page);
    const vellumData = await scrapeVellum(page);

    // Merge data
    const updatedModels = mergeData(existingData.models || [], aaData, arenaData, vellumData);

    // Read existing providers/categories/sources from data.js
    let providers, categories, sources;
    try {
      const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
      const providersMatch = dataContent.match(/const PROVIDERS = (\{[\s\S]*?\});/);
      const categoriesMatch = dataContent.match(/const CATEGORIES = (\{[\s\S]*?\});/);
      const sourcesMatch = dataContent.match(/const SOURCES = (\{[\s\S]*?\});/);

      try {
        providers = providersMatch ? JSON.parse(providersMatch[1]) : {};
        categories = categoriesMatch ? JSON.parse(categoriesMatch[1]) : {};
        sources = sourcesMatch ? JSON.parse(sourcesMatch[1]) : {};
      } catch {
        const fix = s => s.replace(/'/g, '"').replace(/,\s*}/g, '}');
        providers = providersMatch ? JSON.parse(fix(providersMatch[1])) : {};
        categories = categoriesMatch ? JSON.parse(fix(categoriesMatch[1])) : {};
        sources = sourcesMatch ? JSON.parse(fix(sourcesMatch[1])) : {};
      }
    } catch (err) {
      console.error('Error reading existing config:', err.message);
      providers = {};
      categories = {};
      sources = {};
    }

    // Generate updated data.js
    const output = generateDataJs(updatedModels, providers, categories, sources);
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

    console.log(`\nUpdated data.js with ${updatedModels.length} models`);
    console.log(`Changes: ${Object.keys(aaData).length} from AA, ${Object.keys(arenaData).length} from Arena, ${Object.keys(vellumData).length} from Vellum`);

  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
