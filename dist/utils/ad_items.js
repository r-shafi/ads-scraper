"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItems = void 0;
function addItems($) {
    const addItemsInPage = $('article[data-testid="listing-ad"]').toArray();
    return addItemsInPage.map((item) => {
        const id = item.attribs['id'];
        const url = $(item).find('a').attr('href');
        return { id, url };
    });
}
exports.addItems = addItems;
