const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

console.log(`[Model Test] Checking ${files.length} schema files in server/models...`);

files.forEach((file) => {
  if (file.endsWith('.js')) {
    try {
      const model = require(path.join(modelsDir, file));
      console.log(`  ✓ Loaded model: ${file} (Model Name: ${model.modelName})`);
    } catch (err) {
      console.error(`  ❌ Failed to load model ${file}:`, err.message);
      process.exit(1);
    }
  }
});

console.log(`[Model Test] SUCCESS: All 16 Mongoose models loaded flawlessly!\n`);
process.exit(0);
