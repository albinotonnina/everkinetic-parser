"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotosExtractor = exports.PhotosExtractor = function () {
    function PhotosExtractor(photos) {
        _classCallCheck(this, PhotosExtractor);

        this.photos = photos;
    }

    _createClass(PhotosExtractor, [{
        key: "extract",
        value: function extract() {
            var flatPhotosArray = [];

            for (var i = 0; i < this.photos.length; i++) {
                for (var z = 0; z < this.photos[i].images.length; z++) {
                    flatPhotosArray.push(this.photos[i].images[z]);
                }
            }

            return flatPhotosArray;
        }
    }]);

    return PhotosExtractor;
}();
//# sourceMappingURL=PhotosExtractor.js.map