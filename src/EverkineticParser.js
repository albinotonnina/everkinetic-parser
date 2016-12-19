var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var rp = require('request-promise');

export class EverkineticParser {

    constructor() {
        this.url = 'http://db.everkinetic.com';
        this.imagePath = './assets/exercises/images/';
        this.mkdirSyncRecursive(this.imagePath);

        this.rpOptions = {
            uri: this.url,
            simple: true,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
    }

    crawl() {
        console.log(`Start crawrling ${this.url}`);

        return new Promise((resolve, reject) => {

            this.getTotalPages().then((output) => {

                let totalPages = output.pages;
                // let totalPages = 1; //debug

                this.getPagesExercises(totalPages)
                    .then((output) => {
                        resolve(output);
                        this.getPhotos(output);
                        this.writeOutputToJSON();
                    })
                    .catch((err) => {
                        reject(err.statusCode);
                    })
            });

        });

    }

    getTotalPages() {
        return new Promise((resolve, reject) => {
            rp(this.rpOptions)
                .then(($) => {

                    const totalPages = Number($('.page-numbers').not('.next').last().text());

                    console.log(`Found ${totalPages} pages to crawl`);

                    resolve({
                        pages: totalPages
                    });
                })
                .catch((err) => {
                    reject(err.statusCode);
                })
        });
    }

    getPagesExercises(pages) {

        let pagePromises = [];
        for (let i = 1; i <= pages; i++) {
            pagePromises.push(this.getExercisesForPage(i))
        }

        return Promise.all(pagePromises).then(values => {
            const exercisesUrls = values.reduce((a, b) => a.concat(b), []);
            return this.parseExercises(exercisesUrls);
        });
    }

    getExercisesForPage(pageNum) {

        this.rpOptions.uri = `${this.url}/page/${pageNum}`;

        return new Promise((resolve, reject) => {
            rp(this.rpOptions)
                .then(($) => {
                    let pageExercisesUrls = [];
                    $('article').each(function (i) {
                        pageExercisesUrls[i] = $(this).find('h3').find('a').attr('href');
                    });
                    resolve(pageExercisesUrls);
                })
                .catch(function (err) {
                    reject(err);
                });
        });

    }

    parseExercises(exerciseUrls) {
        let exercisePromises = [];

        for (let i = 0; i < exerciseUrls.length; i++) {
            exercisePromises.push(this.parseExercise(exerciseUrls[i]));
        }

        return Promise.all(exercisePromises).then(exerciseObjects => {
            return exerciseObjects;
        });

    }

    parseExercise(exerciseUrl) {
        return new Promise((resolve, reject) => {
            rp({
                uri: exerciseUrl,
                transform: function (body) {
                    return cheerio.load(body);
                }
            })
                .then(($) => {
                    resolve(this.parseExerciseData($));
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    parseExerciseData($) {
        const exerciseObject = {};

        exerciseObject.title = this.getExerciseTitle($);
        exerciseObject.slug = this.slugify(exerciseObject.title);
        exerciseObject.description = this.getExerciseDescription($);
        exerciseObject.taxonomies = this.getExerciseTaxonomies($);
        exerciseObject.steps = this.getExerciseSteps($);
        exerciseObject.images = this.getExerciseImages($, exerciseObject);

        console.log(`Parsed data for exercise ${exerciseObject.title}`);

        return exerciseObject;
    }

    getExerciseTitle($) {
        return $('.entry-title').find('a').text();
    }

    getExerciseDescription($) {
        return $('.exercise-entry-content').children().first().text();
    }

    getExerciseTaxonomies($) {
        const taxonomies = {};

        $('.exercise-taxonomies').find('a').each((index, element) => {
            const splitFields = $(element).attr('href').replace(`${this.url}/`, '').split('/');

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

    getExerciseSteps($) {

        let steps = [];

        $('.exercise-entry-content').find('ol').children().each((index, element) => {
            steps.push($(element).text())
        });

        return steps;
    }

    getExerciseImages($, exerciseObject) {

        const smallFormat = 0, mediumFormat = 1, largeFormat= 2; //some large images are not available while medium are

        let imageUrls = [];

        $('.download-exercise-images').children().eq(mediumFormat).find('a').each((index, element) => {

            imageUrls.push({
                url: $(element).attr('href'),
                filename: `${this.imagePath}${exerciseObject.slug}-${index}.png`
            });

        });

        return imageUrls;
    }

    getPhotos(photos) {

        let flatPhotosArray = [];

        for (let i = 0; i < photos.length; i++) {
            for (let z = 0; z < photos[i].images.length; z++) {
                flatPhotosArray.push(photos[i].images[z]);
            }
        }

        this.downloadPhotos(flatPhotosArray);
    }

    downloadPhotos(flatPhotosArray) {

        let readFile = function (callback) {
            if (flatPhotosArray.length > 0) {
                let file = flatPhotosArray.shift(),
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

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                        console.log('Downloading exercise image ' + filename);
                        readFile(callback);
                    });

                });

            } else {
                callback();
            }
        };

        readFile(function () {
            console.log('There are no more exercise images to download');
        });
    }

    mkdirSyncRecursive(directory) {
        let path = directory.replace(/\/$/, '').split('/');

        for (let i = 1; i <= path.length; i++) {
            let segment = path.slice(0, i).join('/');
            !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
        }
    }

    writeOutputToJSON(output){
        const outputFilename = 'exercises-output.json';
        fs.writeFile(outputFilename, JSON.stringify(output, null, 4), err => {
            if(err) {
                console.log(err);
            } else {
                console.log(`JSON saved to ${outputFilename}`);
            }
        });
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }
}
