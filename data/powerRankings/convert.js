import fs from 'fs';

// Read the JSON file
const rawData = fs.readFileSync('combined_rankings_2025-04-03.json', 'utf-8');
const parsedData = JSON.parse(rawData);

// Determine if parsedData is an array or an object containing the array.
let dataArray;
if (Array.isArray(parsedData)) {
  dataArray = parsedData;
} else if (parsedData.rankings && Array.isArray(parsedData.rankings)) {
  dataArray = parsedData.rankings;
} else if (parsedData.data && Array.isArray(parsedData.data)) {
  dataArray = parsedData.data;
} else {
  console.error("Expected JSON to be an array or to contain an array under 'rankings' or 'data'.");
  process.exit(1);
}

// Add _type property if it doesn't exist, and convert each object to a JSON string
const ndjson = dataArray.map(item => {
  if (!item._type) {
    item._type = "powerRanking";  // Set this to the correct schema type name
  }
  return JSON.stringify(item);
}).join('\n');

// Write the NDJSON string to a new file
fs.writeFileSync('combined_rankings_2025-04-03.ndjson', ndjson);
console.log('Conversion complete: combined_rankings_2025-04-03.ndjson created.');
