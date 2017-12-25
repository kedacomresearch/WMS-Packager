/**
 * Created by Gan on 2017/11/9.
 */
const fs = require('fs');
const request = require('request');
const Promise = require('bluebird');
const path = require('path');

let pathToDownload = path.join(__dirname, 'download');   //默认下载路径，当前目录download

function prepareDownload() {
    if(!fs.existsSync(pathToDownload)) {
        fs.mkdir(pathToDownload, err => {
            if(err) {
                console.log(err);
                process.exit();
            }
        });
    }
}

function downloader(fileToDownload) {
    return new Promise( (resolve, reject) => {
        let filename = path.join(pathToDownload,  fileToDownload.name);

        if(fs.existsSync(filename)) {
            resolve({
                path: filename,
                link: fileToDownload.link,
                sha1: fileToDownload.sha1
            });
        } else {
            console.log(`${fileToDownload.name}, starts to download!`);
            let link = fileToDownload.link,
                sha1 = fileToDownload.sha1;
            if(link && typeof link === 'string') {
                let writeStream = fs.createWriteStream(filename);

                writeStream.on('close', () => {
                    resolve({
                        path: filename,
                        link: link,
                        sha1: sha1,
                        prefix: fileToDownload.prefix
                    });
                });
                writeStream.on('error', () => {
                    console.log(`${filename} downloaded error!`);
                    reject(Error(`${filename} downloaded error!`));
                });
                request(link).pipe(writeStream)
            } else {
                reject(Error(`${filename} download link error!`));
            }
        }
    });
}

module.exports = {
    prepareDownload,
    downloader
};


