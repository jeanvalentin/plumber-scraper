
const { mkdirSync, writeFileSync, existsSync } = require('fs');
const puppeteer = require('puppeteer');
const { DOWNLOADS_PATH } = require('./constants.js');
const links = require('./aubadeLinks.json');


(async () => {
  mkdirSync(DOWNLOADS_PATH, { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const getJsonValue = async selector => await (await (await page.$(selector)).getProperty('textContent')).jsonValue();
  for (const link of links) {
    const linkUrl = new URL(link);
    const filename = `${`${linkUrl.host}${linkUrl.pathname}`.replace(/\W+/g, '-')}.json`;
    if (existsSync(`${DOWNLOADS_PATH}/${filename}`)) continue;
    console.log(link);
    try {
      await page.goto(link);
      const data = {
        name: (await getJsonValue('p.label')).trim(),
        telephone: (await getJsonValue('span[itemprop=telephone]')).replace(/[^\+0-9]/g, ''),
        addressLine1: (await getJsonValue('span[itemprop=streetAddress]')).trim(),
        postcode: (await getJsonValue('span[itemprop=postalCode]')).trim(),
        city: (await getJsonValue('span[itemprop=addressLocality]')).trim(),
        email: (await getJsonValue('a#crafter-email')).trim(),
      };

      writeFileSync(`${DOWNLOADS_PATH}/${filename}`, JSON.stringify(data));
      console.log(`${filename} saved`);
    } catch {
      console.log('error');
    }
  }
  await page.close();
  await browser.close();
})();
