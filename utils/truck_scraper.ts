import axios from 'axios';
import { load } from 'cheerio';
import { Ad } from '../models/ad';

export async function scrapeTruckItem(url: string): Promise<Ad> {
  try {
    const response = await axios.get(url);

    const $ = load(response.data);

    const title = $('span.offer-title.big-text.fake-title').text().trim();

    const id = $('#ad_id:first').text().trim();

    const price = $('.price-wrapper')
      .find('.offer-price__number')
      .text()
      .trim()
      .split(/\s{1,}/g)
      .join(' ');

    const details = $('.offer-params.with-vin li')
      .toArray()
      .map((item) => {
        return $(item).text().trim();
      })
      .filter((item) => {
        return (
          item.toLowerCase().includes('przebieg') ||
          item.toLowerCase().includes('moc') ||
          item.toLowerCase().includes('rejestracja') ||
          item.toLowerCase().includes('produkcji')
        );
      })
      .map((item) => {
        return item.split(/\s{1,}/g).join(' ');
      });

    const mileage = details
      .find((item) => {
        return item.toLowerCase().includes('przebieg');
      })
      ?.slice(9);

    const power = details
      .find((item) => {
        return item.toLowerCase().includes('moc');
      })
      ?.slice(4);

    const registrationDate = details
      .find((item) => {
        return item.toLowerCase().includes('rejestracja');
      })
      ?.slice(21);

    const productionDate = details
      .find((item) => {
        return item.toLowerCase().includes('produkcji');
      })
      ?.slice(14);

    return {
      title,
      id,
      price,
      mileage,
      power,
      registrationDate,
      productionDate,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      title: '',
      id: '',
      price: '',
    };
  }
}
