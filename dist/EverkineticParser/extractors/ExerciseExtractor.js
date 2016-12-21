"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExerciseExtractor = exports.ExerciseExtractor = function () {
    function ExerciseExtractor(exerciseUrls, fetcher, ExerciseDocumentFactory) {
        _classCallCheck(this, ExerciseExtractor);

        this.exerciseUrls = exerciseUrls;
        this.fetcher = fetcher;
        this.exerciseDocumentFactory = ExerciseDocumentFactory;
    }

    _createClass(ExerciseExtractor, [{
        key: "extract",
        value: function extract() {
            var _this = this;

            var exercisePromises = [];

            var _loop = function _loop(i) {
                exercisePromises.push(_this.fetcher.fetch(_this.exerciseUrls[i]).then(function (output) {
                    console.log("fetch exercise " + _this.exerciseUrls[i]);
                    return output;
                }));
            };

            for (var i = 0; i < this.exerciseUrls.length; i++) {
                _loop(i);
            }
            return Promise.all(exercisePromises).then(function (values) {
                return values.map(function ($) {
                    return _this.exerciseDocumentFactory.get($).extract();
                });
            });
        }
    }]);

    return ExerciseExtractor;
}();
//# sourceMappingURL=ExerciseExtractor.js.map