'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var fs = require('fs');

var PhotosDownloader = exports.PhotosDownloader = function () {
    function PhotosDownloader(photos) {
        _classCallCheck(this, PhotosDownloader);

        this.photos = photos;
        this.imagePath = './assets/exercises/images/';
        this.mkdirSyncRecursive(this.imagePath);
    }

    _createClass(PhotosDownloader, [{
        key: 'download',
        value: function download() {
            var _this = this;

            var readFile = function readFile(callback) {
                if (_this.photos.length > 0) {
                    (function () {
                        var file = _this.photos.shift(),
                            uri = file.url,
                            filename = _this.imagePath + file.filename;
                        console.log('Downloading exercise image ' + filename);

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
    }]);

    return PhotosDownloader;
}();
//# sourceMappingURL=PhotosDownloader.js.map