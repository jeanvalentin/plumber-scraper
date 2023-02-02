const { mkdirSync, readdirSync, readFileSync } = require('fs');
const xlsx = require('xlsx');
const { DOWNLOADS_PATH, OUTPUT_PATH } = require('./constants.js');

mkdirSync(OUTPUT_PATH, { recursive: true });
const workbook = xlsx.utils.book_new();
const jsonFiles = readdirSync(DOWNLOADS_PATH).filter(v => /\.json$/.test(v));
const bigJson = jsonFiles.map(v => JSON.parse(readFileSync(`${DOWNLOADS_PATH}/${v}`))).sort((a, b) => a.name < b.name ? -1 : 1);
bigJson.forEach(v => {
  [v.addressLine1, v.addressLine2] = v.addressLine1.split(/  +/).map(w => w.trim());
});
const worksheet = xlsx.utils.json_to_sheet(bigJson);
xlsx.utils.book_append_sheet(workbook, worksheet);
const xlsSavePath = `${OUTPUT_PATH}/data_all.xlsx`;
xlsx.writeFile(workbook, xlsSavePath);
console.log(`Created ${xlsSavePath}`);
