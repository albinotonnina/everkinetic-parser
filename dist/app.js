'use strict';

var _EverkineticParser = require('./EverkineticParser');

var everkineticParser = new _EverkineticParser.EverkineticParser();

everkineticParser.crawl().then(function () {
    console.log('terminated with success');
}).catch(function () {
    console.log('terminated with errors');
});
//# sourceMappingURL=app.js.map