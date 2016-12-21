'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rp = require('request-promise');
var cheerio = require('cheerio');

var Fetcher = exports.Fetcher = function () {
    function Fetcher() {
        var requestpromise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : rp;

        _classCallCheck(this, Fetcher);

        this.rp = requestpromise;
    }

    _createClass(Fetcher, [{
        key: 'fetch',
        value: function fetch(url) {
            return this.rp({
                uri: url,
                simple: true
            }).then(function (body) {
                return cheerio.load(body);
            });
        }
    }]);

    return Fetcher;
}();
//# sourceMappingURL=Fetcher.js.map