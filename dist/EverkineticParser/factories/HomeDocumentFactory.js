'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeDocument = exports.HomeDocument = function () {
    function HomeDocument(cheerio) {
        _classCallCheck(this, HomeDocument);

        this.$ = cheerio;
    }

    _createClass(HomeDocument, [{
        key: 'extract',
        value: function extract() {
            return Number(this.$('.page-numbers').not('.next').last().text());
        }
    }]);

    return HomeDocument;
}();

var HomeDocumentFactory = exports.HomeDocumentFactory = function () {
    function HomeDocumentFactory() {
        _classCallCheck(this, HomeDocumentFactory);
    }

    _createClass(HomeDocumentFactory, [{
        key: 'get',
        value: function get($) {
            return new HomeDocument($);
        }
    }]);

    return HomeDocumentFactory;
}();
//# sourceMappingURL=HomeDocumentFactory.js.map