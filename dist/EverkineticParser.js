'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var rp = require('request-promise');

var EverkineticParser = exports.EverkineticParser = function () {
    function EverkineticParser() {
        _classCallCheck(this, EverkineticParser);

        this.url = 'http://db.everkinetic.com';
        this.imagePath = './assets/exercises/images/';
        this.mkdirSyncRecursive(this.imagePath);

        this.rpOptions = {
            uri: this.url,
            simple: true,
            transform: function transform(body) {
                return cheerio.load(body);
            }
        };
    }

    _createClass(EverkineticParser, [{
        key: 'crawl',
        value: function crawl() {
            var _this = this;

            console.log('Start crawrling ' + this.url);

            return new Promise(function (resolve, reject) {

                _this.getTotalPages().then(function (output) {

                    var totalPages = output.pages;
                    // let totalPages = 1; //debug

                    _this.getPagesExercises(totalPages).then(function (output) {
                        resolve(output);
                        _this.getPhotos(output);
                        _this.writeOutputToJSON();
                    }).catch(function (err) {
                        reject(err.statusCode);
                    });
                });
            });
        }
    }, {
        key: 'getTotalPages',
        value: function getTotalPages() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                rp(_this2.rpOptions).then(function ($) {

                    var totalPages = Number($('.page-numbers').not('.next').last().text());

                    console.log('Found ' + totalPages + ' pages to crawl');

                    resolve({
                        pages: totalPages
                    });
                }).catch(function (err) {
                    reject(err.statusCode);
                });
            });
        }
    }, {
        key: 'getPagesExercises',
        value: function getPagesExercises(pages) {
            var _this3 = this;

            var pagePromises = [];
            for (var i = 1; i <= pages; i++) {
                pagePromises.push(this.getExercisesForPage(i));
            }

            return Promise.all(pagePromises).then(function (values) {
                var exercisesUrls = values.reduce(function (a, b) {
                    return a.concat(b);
                }, []);
                return _this3.parseExercises(exercisesUrls);
            });
        }
    }, {
        key: 'getExercisesForPage',
        value: function getExercisesForPage(pageNum) {
            var _this4 = this;

            this.rpOptions.uri = this.url + '/page/' + pageNum;

            return new Promise(function (resolve, reject) {
                rp(_this4.rpOptions).then(function ($) {
                    var pageExercisesUrls = [];
                    $('article').each(function (i) {
                        pageExercisesUrls[i] = $(this).find('h3').find('a').attr('href');
                    });
                    resolve(pageExercisesUrls);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'parseExercises',
        value: function parseExercises(exerciseUrls) {
            var exercisePromises = [];

            for (var i = 0; i < exerciseUrls.length; i++) {
                exercisePromises.push(this.parseExercise(exerciseUrls[i]));
            }

            return Promise.all(exercisePromises).then(function (exerciseObjects) {
                return exerciseObjects;
            });
        }
    }, {
        key: 'parseExercise',
        value: function parseExercise(exerciseUrl) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                rp({
                    uri: exerciseUrl,
                    transform: function transform(body) {
                        return cheerio.load(body);
                    }
                }).then(function ($) {
                    resolve(_this5.grabExerciseData($));
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'grabExerciseData',
        value: function grabExerciseData($) {
            var exerciseObject = {};

            exerciseObject.title = this.getExerciseTitle($);
            exerciseObject.slug = this.slugify(exerciseObject.title);
            exerciseObject.description = this.getExerciseDescription($);
            exerciseObject.taxonomies = this.getExerciseTaxonomies($);
            exerciseObject.steps = this.getExerciseSteps($);
            exerciseObject.images = this.getExerciseImages($, exerciseObject);

            console.log('Grabbed data for exercise ' + exerciseObject.title);

            return exerciseObject;
        }
    }, {
        key: 'getExerciseTitle',
        value: function getExerciseTitle($) {
            return $('.entry-title').find('a').text();
        }
    }, {
        key: 'getExerciseDescription',
        value: function getExerciseDescription($) {
            return $('.exercise-entry-content').children().first().text();
        }
    }, {
        key: 'getExerciseTaxonomies',
        value: function getExerciseTaxonomies($) {
            var _this6 = this;

            var taxonomies = {};

            $('.exercise-taxonomies').find('a').each(function (index, element) {
                var splitFields = $(element).attr('href').replace(_this6.url + '/', '').split('/');

                if (splitFields[0] === 'equipment') {
                    if (Array.isArray(taxonomies[splitFields[0]])) {
                        taxonomies[splitFields[0]].push(splitFields[1]);
                    } else {
                        taxonomies[splitFields[0]] = [splitFields[1]];
                    }
                } else {
                    taxonomies[splitFields[0]] = splitFields[1];
                }
            });

            return taxonomies;
        }
    }, {
        key: 'getExerciseSteps',
        value: function getExerciseSteps($) {

            var steps = [];

            $('.exercise-entry-content').find('ol').children().each(function (index, element) {
                steps.push($(element).text());
            });

            return steps;
        }
    }, {
        key: 'getExerciseImages',
        value: function getExerciseImages($, exerciseObject) {
            var _this7 = this;

            var smallFormat = 0,
                mediumFormat = 1,
                largeFormat = 2; //some large images are not available while medium are

            var imageUrls = [];

            $('.download-exercise-images').children().eq(mediumFormat).find('a').each(function (index, element) {

                imageUrls.push({
                    url: $(element).attr('href'),
                    filename: '' + _this7.imagePath + exerciseObject.slug + '-' + index + '.png'
                });
            });

            return imageUrls;
        }
    }, {
        key: 'getPhotos',
        value: function getPhotos(photos) {

            var flatPhotosArray = [];

            for (var i = 0; i < photos.length; i++) {
                for (var z = 0; z < photos[i].images.length; z++) {
                    flatPhotosArray.push(photos[i].images[z]);
                }
            }

            this.downloadPhotos(flatPhotosArray);
        }
    }, {
        key: 'downloadPhotos',
        value: function downloadPhotos(flatPhotosArray) {

            var readFile = function readFile(callback) {
                if (flatPhotosArray.length > 0) {
                    (function () {
                        var file = flatPhotosArray.shift(),
                            uri = file.url,
                            filename = file.filename;

                        request.head(uri, function (err, res, body) {

                            if (err || !res) {
                                console.log('no res', err);
                                return;
                            }

                            if (res.headers['content-length'] === 0 || res.headers['content-type'] !== 'image/png') {
                                console.log('no data for image', filename);
                                return;
                            }

                            request(uri).pipe(fs.createWriteStream(filename)).on('close', function () {
                                console.log('Downloading exercise image ' + filename);
                                readFile(callback);
                            });
                        });
                    })();
                } else {
                    callback();
                }
            };

            readFile(function () {
                console.log('There are no more exercise images to download');
            });
        }
    }, {
        key: 'mkdirSyncRecursive',
        value: function mkdirSyncRecursive(directory) {
            var path = directory.replace(/\/$/, '').split('/');

            for (var i = 1; i <= path.length; i++) {
                var segment = path.slice(0, i).join('/');
                !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
            }
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
        }
    }, {
        key: 'slugify',
        value: function slugify(text) {
            return text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
        }
    }]);

    return EverkineticParser;
}();
//# sourceMappingURL=EverkineticParser.js.map