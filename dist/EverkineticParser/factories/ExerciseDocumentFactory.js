'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExerciseDocument = exports.ExerciseDocument = function () {
    function ExerciseDocument($) {
        _classCallCheck(this, ExerciseDocument);

        this.$ = $;
    }

    _createClass(ExerciseDocument, [{
        key: 'extract',
        value: function extract() {

            var exerciseObject = {};

            exerciseObject.title = this.getExerciseTitle();
            exerciseObject.slug = this.slugify(exerciseObject.title);
            exerciseObject.description = this.getExerciseDescription();
            exerciseObject.taxonomies = this.getExerciseTaxonomies();
            exerciseObject.steps = this.getExerciseSteps();
            exerciseObject.images = this.getExerciseImages(exerciseObject);

            return exerciseObject;
        }
    }, {
        key: 'getExerciseTitle',
        value: function getExerciseTitle() {
            return this.$('.entry-title').find('a').text();
        }
    }, {
        key: 'getExerciseDescription',
        value: function getExerciseDescription() {
            return this.$('.exercise-entry-content').children().first().text();
        }
    }, {
        key: 'getExerciseTaxonomies',
        value: function getExerciseTaxonomies() {
            var _this = this;

            var taxonomies = {};

            this.$('.exercise-taxonomies').find('a').each(function (index, element) {
                var splitFields = _this.$(element).attr('href').replace(_this.url + '/', '').split('/');

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
        value: function getExerciseSteps() {
            var _this2 = this;

            var steps = [];

            this.$('.exercise-entry-content').find('ol').children().each(function (index, element) {
                steps.push(_this2.$(element).text());
            });

            return steps;
        }
    }, {
        key: 'getExerciseImages',
        value: function getExerciseImages(exerciseObject) {
            var _this3 = this;

            var smallFormat = 0,
                mediumFormat = 1,
                largeFormat = 2; //some large images are not available while medium are

            var imageUrls = [];

            this.$('.download-exercise-images').children().eq(mediumFormat).find('a').each(function (index, element) {

                imageUrls.push({
                    url: _this3.$(element).attr('href'),
                    filename: exerciseObject.slug + '-' + index + '.png'
                });
            });

            return imageUrls;
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

    return ExerciseDocument;
}();

var ExerciseDocumentFactory = exports.ExerciseDocumentFactory = function () {
    function ExerciseDocumentFactory() {
        _classCallCheck(this, ExerciseDocumentFactory);
    }

    _createClass(ExerciseDocumentFactory, [{
        key: 'get',
        value: function get($) {
            return new ExerciseDocument($);
        }
    }]);

    return ExerciseDocumentFactory;
}();
//# sourceMappingURL=ExerciseDocumentFactory.js.map