'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EverkineticParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Fetcher = require('./Fetcher');

var _PageNumberExtractor = require('./extractors/PageNumberExtractor');

var _PageExtractor = require('./extractors/PageExtractor');

var _ExerciseExtractor = require('./extractors/ExerciseExtractor');

var _PhotosExtractor = require('./extractors/PhotosExtractor');

var _PhotosDownloader = require('./PhotosDownloader');

var _HomeDocumentFactory = require('./factories/HomeDocumentFactory');

var _PageDocumentFactory = require('./factories/PageDocumentFactory');

var _ExerciseDocumentFactory = require('./factories/ExerciseDocumentFactory');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var EverkineticParser = exports.EverkineticParser = function () {
    function EverkineticParser() {
        _classCallCheck(this, EverkineticParser);

        this.fetcher = new _Fetcher.Fetcher();
        this.homeDocumentFactory = new _HomeDocumentFactory.HomeDocumentFactory();
        this.pageDocumentFactory = new _PageDocumentFactory.PageDocumentFactory();
        this.exerciseDocumentFactory = new _ExerciseDocumentFactory.ExerciseDocumentFactory();
    }

    _createClass(EverkineticParser, [{
        key: 'crawl',
        value: function crawl() {
            var _this = this;

            return this.getTotalPages().then(function (totalPages) {
                return _this.getPages(totalPages);
            }).then(function (exerciseUrls) {
                return _this.getExercises(exerciseUrls);
            }).then(function (exercises) {
                return _this.writeOutputToJSON(exercises);
            }).then(function (exercises) {
                return _this.parsePhotos(exercises);
            }).then(function (exercises) {
                return _this.downloadPhotos(exercises);
            });
        }
    }, {
        key: 'getTotalPages',
        value: function getTotalPages() {
            var pageNumberExtractor = new _PageNumberExtractor.PageNumberExtractor(this.fetcher, this.homeDocumentFactory);
            return pageNumberExtractor.extract();
        }
    }, {
        key: 'getPages',
        value: function getPages(totalPages) {
            var pageExtractor = new _PageExtractor.PageExtractor(totalPages, this.fetcher, this.pageDocumentFactory);
            return pageExtractor.extract();
        }
    }, {
        key: 'getExercises',
        value: function getExercises(exerciseUrls) {
            var exerciseExtractor = new _ExerciseExtractor.ExerciseExtractor(exerciseUrls, this.fetcher, this.exerciseDocumentFactory);
            return exerciseExtractor.extract();
        }
    }, {
        key: 'parsePhotos',
        value: function parsePhotos(photos) {
            return new _PhotosExtractor.PhotosExtractor(photos).extract();
        }
    }, {
        key: 'downloadPhotos',
        value: function downloadPhotos(photos) {
            return new _PhotosDownloader.PhotosDownloader(photos).download();
        }
    }, {
        key: 'writeOutputToJSON',
        value: function writeOutputToJSON(output) {
            var outputFilename = 'exercises-output.json';
            fs.writeFile(outputFilename, JSON.stringify(output, null, 4), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('JSON saved to ' + outputFilename);
                }
            });

            return output;
        }
    }]);

    return EverkineticParser;
}();
//# sourceMappingURL=index.js.map