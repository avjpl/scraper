const puppeteer = require('puppeteer');
const get = require('async-get-file');

const url = '';
const downloadFolder = '';

const options = {
  directory: `./downloads/${downloadFolder.trim()}`,
};

const self = {
  browser: null,
  page: null,

  init: async () => {
    self.browser = await puppeteer.launch({ headless: true });
    self.page = await self.browser.newPage();

    await self.page.goto(url, { waitUntil: 'networkidle0' });
  },

  videos: async () => {
    const rows = await self.page.$$('.list-group .list-group-horizontal');

    for await (let row of rows) {
      const title = await row.$eval('.card-title', title => {
        const text = title.innerText.trim();

        return text;
      });


      await row.click();

      const videoSrc = await self.page.$eval('video', video => video.src);

      await get(videoSrc, {
        ...options,
        filename: `${title.replace('#', ' - ')}.mp4`,
      });
    }

    await self.browser.close();
  }
}

module.exports = self;
