
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import puppeteer from 'puppeteer';
import { DOWNLOADS_PATH } from './constants.js';

mkdirSync(DOWNLOADS_PATH, { recursive: true });

const existingIndices = readdirSync(DOWNLOADS_PATH).filter(v => /\.json$/.test(v)).map(v => v.replace(/\.json$/, '')).map(Number);
console.log(existingIndices);

const browser = await puppeteer.launch();
const page = await browser.newPage();
for (let currentIndex = 1; currentIndex <= 4802; currentIndex++) {
  if (existingIndices.includes(currentIndex)) continue;
  await page.goto(`https://www.plomberie-sanitaire.net/entreprise_localisation/toutes-les-regions/page/${currentIndex}/`);
  const articles = await page.$$eval('article.tile', e => e.map(article => {
    const title = article.querySelector('a');
    const name = title.innerText;
    const link = title.getAttribute('href');
    const addressLines = article.querySelector('div.tile__body');
    const addressLine1 = addressLines.querySelector('div:first-child').innerText;
    const addressLine2 = addressLines.querySelector('div:last-child').innerText.trim();
    const postcode = (addressLine2.match(/^[0-9]{5}/g) ?? [''])[0];
    const city = addressLine2.slice(postcode.length).trim();
    try {
      return {
        name,
        addressLine1,
        postcode,
        city,
        link,
      }
    } catch { }
    return {};
  }));
  // console.log(articles);
  writeFileSync(`${DOWNLOADS_PATH}/${currentIndex}.json`, JSON.stringify(articles));
  console.log(`${currentIndex}.json, ${articles.length} entries ${articles.length !== 12 ? ', attention' : ''}`);
}
await page.close();
await browser.close();
