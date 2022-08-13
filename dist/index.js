"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const ad_items_1 = require("./utils/ad_items");
const truck_scraper_1 = require("./utils/truck_scraper");
const BASE_URL = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc';
const QUERY_PARAM = '&page=';
const allAds = [];
let currentPageIndex = 1;
let totalAdsCount = 0;
async function main() {
    console.log(`Scraping Page ${currentPageIndex}...`);
    try {
        const response = await axios_1.default.get(`${BASE_URL}${QUERY_PARAM}${currentPageIndex}`);
        const $ = (0, cheerio_1.load)(response.data);
        if (currentPageIndex === 1) {
            totalAdsCount = getTotalAdsCount($);
        }
        const items = (0, ad_items_1.addItems)($);
        const scrapedAds = await Promise.all(items.map((item) => {
            return (0, truck_scraper_1.scrapeTruckItem)(item.url);
        }));
        allAds.push(...scrapedAds.filter((ad) => ad.id));
        getNextPageUrl($);
    }
    catch (error) {
        console.log(error);
    }
}
async function getNextPageUrl($) {
    currentPageIndex += 1;
    const nextPageButton = $('[data-testid="pagination-step-forwards"]');
    const lastPageNumber = Number($('[data-testid="pagination-list-item"]').eq(-1).text());
    if (currentPageIndex > lastPageNumber ||
        nextPageButton.hasClass('pagination-item__disabled')) {
        const data = {
            total: totalAdsCount,
            data: allAds,
        };
        fs_1.default.writeFile('result.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('File Saved!');
            }
        });
    }
    await main();
}
function getTotalAdsCount($) {
    const totalAdsCount = $('h1[data-testid="results-heading"]').text();
    return Number(totalAdsCount.split(' ')[2]);
}
main();
