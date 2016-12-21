'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageDocument = exports.PageDocument = function () {
    function PageDocument($) {
        _classCallCheck(this, PageDocument);

        this.$ = $;
    }

    _createClass(PageDocument, [{
        key: 'extract',
        value: function extract() {
            var _this = this;

            var pageExercisesUrls = [];

            this.$('article').each(function (i, el) {
                pageExercisesUrls[i] = _this.$(el).find('h3').find('a').attr('href');
            });

            return pageExercisesUrls;
        }
    }]);

    return PageDocument;
}();

var PageDocumentFactory = exports.PageDocumentFactory = function () {
    function PageDocumentFactory() {
        _classCallCheck(this, PageDocumentFactory);
    }

    _createClass(PageDocumentFactory, [{
        key: 'get',
        value: function get($) {
            return new PageDocument($);
        }
    }]);

    return PageDocumentFactory;
}();
//# sourceMappingURL=PageDocumentFactory.js.map