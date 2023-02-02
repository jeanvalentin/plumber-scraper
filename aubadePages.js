
const { mkdirSync, writeFileSync } = require('fs');
const puppeteer = require('puppeteer');
const { DOWNLOADS_PATH } = require('./constants.js');
const linksPages = require('./aubadePages.json');

(async () => {
  mkdirSync(DOWNLOADS_PATH, { recursive: true });

  const bigList = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (const linksPage of linksPages) {
    await page.goto(linksPage);
    const links = await page.$$eval('ul li ul li a', e => e.map(v => v.toString()));
    console.log(links);
    bigList.push(...links);
    writeFileSync(`${DOWNLOADS_PATH}/aubadeLinks.json`, JSON.stringify(bigList));
  }
  await page.close();
  await browser.close();
})();
