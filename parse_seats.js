const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('seats.json', 'utf8'));
  console.log('Successfully loaded seats.json');
} catch(e) {
  console.log('seats.json not found or invalid.');
}
