const puppeteer = require('puppeteer');
const get = require('async-get-file');

const url = '';

const options = {
  directory: './downloads/',
};

const self = {
  browser: null,
  page: null,
  idx: 1,

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
        filename: `${title.replace(/[#-]/g, ' - ')}.mp4`,
      });

      self.idx++;
    }

    await self.browser.close();
  }
}

module.exports = self;
