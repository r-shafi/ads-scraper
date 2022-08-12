import { CheerioAPI } from 'cheerio';

export function addItems($: CheerioAPI) {
  const addItemsInPage = $('article[data-testid="listing-ad"]').toArray();

  return addItemsInPage.map((item) => {
    const id = item.attribs['id'];
    const url = $(item).find('a').attr('href');

    return { id, url };
  });
}
