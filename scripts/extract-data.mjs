import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const html = readFileSync('adhd_asd_interaction_map.html', 'utf-8');
const outDir = 'hypothesis-engine/data';
mkdirSync(outDir, { recursive: true });

function extractArray(varName) {
  // Match: const varName = [ ... ];
  const regex = new RegExp(`const ${varName} = (\\[[\\s\\S]*?\\]);`, 'm');
  const match = html.match(regex);
  if (!match) throw new Error(`Could not find ${varName}`);
  return eval(match[1]);
}

function extractObject(varName) {
  // Match: const varName = { ... };
  const regex = new RegExp(`const ${varName} = (\\{[\\s\\S]*?\\});\\n`, 'm');
  const match = html.match(regex);
  if (!match) throw new Error(`Could not find ${varName}`);
  return eval(`(${match[1]})`);
}

// Extract arrays
const nodes = extractArray('nodes');
const loops = extractArray('loops');
const brainAtlas = extractArray('brainAtlas');
const layerDefinitions = extractArray('layerDefinitions');

// Extract objects
const nodeTagsById = extractObject('nodeTagsById');
const mechanismExpressionLinks = extractObject('mechanismExpressionLinks');
const pathwayHighlights = extractObject('pathwayHighlights');

// Write JSON files
const write = (name, data) => {
  writeFileSync(`${outDir}/${name}`, JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${outDir}/${name} (${Array.isArray(data) ? data.length + ' items' : Object.keys(data).length + ' keys'})`);
};

write('nodes.json', nodes);
write('loops.json', loops);
write('atlas.json', brainAtlas);
write('layers.json', layerDefinitions);
write('node-tags.json', nodeTagsById);
write('mechanism-expression-links.json', mechanismExpressionLinks);
write('pathway-highlights.json', pathwayHighlights);

console.log('\nExtraction complete.');
console.log(`Nodes: ${nodes.length}`);
console.log(`Loops: ${loops.length}`);
console.log(`Brain regions: ${brainAtlas.length}`);
console.log(`Layers: ${layerDefinitions.length}`);
