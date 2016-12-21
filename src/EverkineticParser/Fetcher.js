var rp = require('request-promise');
var cheerio = require('cheerio');

export class Fetcher {

    constructor() {
        this.rpOptions = {
            simple: true,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
    }

    fetch(url) {
        this.rpOptions.uri = url;
        return rp(this.rpOptions);
    }
}