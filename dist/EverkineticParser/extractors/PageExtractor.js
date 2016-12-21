'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageExtractor = exports.PageExtractor = function () {
    function PageExtractor(totalPages, fetcher, PageDocumentFactory) {
        _classCallCheck(this, PageExtractor);

        this.totalPages = totalPages;
        this.fetcher = fetcher;
        this.pageDocumentFactory = PageDocumentFactory;
        this.url = 'http://db.everkinetic.com';
    }

    _createClass(PageExtractor, [{
        key: 'extract',
        value: function extract() {
            var _this = this;

            console.log('totalPages: ', this.totalPages);
            // this.totalPages = 3; //debug

            var pagePromises = [];

            var _loop = function _loop(i) {
                pagePromises.push(_this.fetcher.fetch(_this.url + '/page/' + i).then(function (output) {
                    console.log('fetch page ' + i);
                    return output;
                }));
            };

            for (var i = 1; i <= this.totalPages; i++) {
                _loop(i);
            }

            return Promise.all(pagePromises).then(function (values) {

                return values.map(function ($) {
                    return _this.pageDocumentFactory.get($).extract();
                }).reduce(function (a, b) {
                    return a.concat(b);
                }, []);
            });
        }
    }]);

    return PageExtractor;
}();
//# sourceMappingURL=PageExtractor.js.map