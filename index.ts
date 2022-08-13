import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import fs from 'fs';
import { Ad } from './models/ad';
import { addItems } from './utils/ad_items';
import { scrapeTruckItem } from './utils/truck_scraper';

const BASE_URL =
  'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc';

const QUERY_PARAM = '&page=';

const allAds: Ad[] = [];
let currentPageIndex = 1;
let totalAdsCount = 0;

async function main() {
  console.log(`Scraping Page ${currentPageIndex}...`);
  try {
    const response = await axios.get(
      `${BASE_URL}${QUERY_PARAM}${currentPageIndex}`
    );

    const $ = load(response.data);

    if (currentPageIndex === 1) {
      totalAdsCount = getTotalAdsCount($);
<<<<<<< HEAD
      console.log(totalAdsCount);
=======
>>>>>>> c8d9f73 (main function to start program)
    }

    const items = addItems($);

    const scrapedAds = await Promise.all(
      items.map((item) => {
        return scrapeTruckItem(item.url!);
      })
    );

    allAds.push(...scrapedAds.filter((ad) => ad.id));

    getNextPageUrl($);
  } catch (error) {
    console.log(error);
  }
}

async function getNextPageUrl($: CheerioAPI) {
  currentPageIndex += 1;

  const nextPageButton = $('[data-testid="pagination-step-forwards"]');
  const lastPageNumber = Number(
    $('[data-testid="pagination-list-item"]').eq(-1).text()
  );

  if (
    currentPageIndex > lastPageNumber ||
    nextPageButton.hasClass('pagination-item__disabled')
  ) {
    const data = {
      total: totalAdsCount,
      data: allAds,
    };

<<<<<<< HEAD
    fs.writeFile('ads.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File Saved!');
      }
    });
    return;
=======
    fs.writeFile(
      'result.json',
      JSON.stringify(data, null, 2),
      'utf-8',
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File Saved!');
        }
      }
    );
>>>>>>> c8d9f73 (main function to start program)
  }

  await main();
}

function getTotalAdsCount($: CheerioAPI) {
  const totalAdsCount = $('h1[data-testid="results-heading"]').text();
  return Number(totalAdsCount.split(' ')[2]);
}

main();
