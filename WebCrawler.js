const axios = require('axios');
const parser = require('node-html-parser');
const pages = require('./Pages');

class WebCrawler {
    async crawl() {
        let data = [];
        for (const page of pages) {
            data = data.concat(await this.getPageData(page.url, page.location));
        }

        return data;
    }

    async getPageData(url, location) {
        console.log(`Crawling address: ${url}`);
        const response = await axios.get(url);

        const document = parser.parse(response.data);
        const containerData = document.querySelector('.slider-container .slider.grouplesson-overview');
        const items = containerData.querySelectorAll('div');

        const crawledLessons = [];
        for (const item of items) {
            const crawledLesson = {
                crawledDate: Date.now(),
                location: location,
                day: item.querySelector('span.h2').innerHTML,
                date: item.querySelector('span.big-paragraph').innerHTML,
                classes: []
            };

            const lessons = item.querySelectorAll('ul.grouplesson-list li');
            for (const lesson of lessons) {
                const article = lesson.querySelector('article');
                const time = article.querySelectorAll('time span');
                crawledLesson.classes.push({
                    available_places: parseInt(article.attributes['data-places-available']) || 0,
                    status: article.attributes['data-status'],
                    name: article.attributes['data-name'],
                    room: article.attributes['data-room'],
                    timeStart: time[0].innerHTML,
                    timeEnd: time[1].innerHTML,
                    teacher: article.querySelector('div span').innerHTML.replace(/^\s+|\s+$/gm,'')
                });
            }

            crawledLessons.push(crawledLesson);
        }

        console.log(`Found a total of ${crawledLessons.length} lessons in ${items.length} days on location: ${location}`);
        return crawledLessons;
    }
}

module.exports = WebCrawler;