var http = require('http');

const THREE_MINUTES = 60000 * 3;
const PORT = 3000;

class Server {
    constructor() {
        this.application = http.createServer((request, response) => {
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(this.result, null , 4));
        });
    }

    async start() {
        this.result = await this.job();
        this.crawlEveryMinute();

        console.log(`Started server on port: ${PORT}`);
        this.application.listen(PORT);
    }

    setJob(job) {
        this.job = job;
    }

    crawlEveryMinute() {
        setInterval(async () => {
            this.result = await this.job();
        }, THREE_MINUTES);
    }
}

module.exports = Server;