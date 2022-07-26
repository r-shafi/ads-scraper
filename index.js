const fs = require('fs');

const axios = require('axios').default;
const cheerio = require('cheerio');

let currentPage = 1;
const BASE_URL = 'https://www.otomoto.pl/promoted';
const QUERY_PARAM = '?page=';

const ads = [];

async function scraper() {
  try {
    const response = await axios.get(`${BASE_URL}${QUERY_PARAM}${currentPage}`);
    const $ = cheerio.load(response.data);

    ads.push(
      ...$('.ooa-yznjgz')
        .toArray()
        .map((ad) => {
          const detailsPage = $(ad).find('.ooa-2aeoyd').attr('href');
          const image = $(ad).find('img').attr('src');
          const price = $(ad).find('.hidden-mobile.ooa-1fi95yf > span').text();
          const title = $(ad).find('h3 > a').text();
          const miscellaneous = $(ad)
            .find('ul > li')
            .toArray()
            .map((li) => $(li).text());

          return {
            title,
            image,
            price,
            detailsPage,
            miscellaneous,
          };
        })
    );

    console.log(`Page ${currentPage} Loaded!`);

    const nextButton = $('[data-testid="next-arrow"]');

    if (nextButton.length) {
      currentPage += 1;
      console.log('Going to Next Page...');
      await scraper();
    } else {
      console.log('No More Pages!');

      fs.writeFile('ads.json', JSON.stringify(ads, null, 2), 'utf-8', (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File Saved!');
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

scraper();
