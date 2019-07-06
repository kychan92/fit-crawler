const WebCrawler = require('./WebCrawler');
const Server = require('./Server');

const crawler = new WebCrawler();
const server = new Server();

server.setJob(async () => {
    console.log(`Triggering crawl on ${new Date().toUTCString()}`);

    return await crawler.crawl();
});

server.start();