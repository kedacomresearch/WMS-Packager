/**
 * Created by Gan on 2017/11/9.
 */

const fileDownloader = require('./downloader');
const filesToDownload = require('./files_to_download');
const yamlFilesToDownload = require('./yaml_files_to_download');
const decompress = require('./decompress');
const path = require('path');
const yamlParser = require('./yaml');
const hasha = require('hasha');

fileDownloader.prepareDownload();

/*for(let i = 0; i < filesToDownload.length; i++) {
    downloadFile(filesToDownload[i]);
}*/

for(let i = 0; i < yamlFilesToDownload.length; i++) {
    downloadFile(yamlFilesToDownload[i]);
}

function downloadFile(fileObj) {
    fileDownloader.downloader(fileObj)
        .then(file => {
            console.log(file);
            console.log(` downloaded successfully!`);
            if(file.sha1) {
                // Get the sha1 hash of file
                hasha.fromFile(file.path, {algorithm: 'md5'})
                    .then(sha1 => {
                        if(sha1 === file.sha1) {
                            fileDecompression(file);
                        } else {
                            throw new Error(`${file.link} download unsuccessfully!`);
                        }
                });
            } else {
                fileDecompression(file);
            }
        })
        .catch( err => {
            throw err;
        })
}

function fileDecompression(fileObj) {
    let filepath = fileObj.path,
        filelink = fileObj.link;
    let extname = path.extname(filepath);
    switch (extname.toLowerCase()) {
        case '.zip':
        case '.bz2':
            decompress.doDecompress(filepath, fileObj.prefix)
                .then( (data) => {
                    console.log(`${data.file} extract done! Location: ${data.location}`);
                })
                .catch( err => {
                    console.log(err);
                });
            break;
        case '.yaml':
            getFilesToDownload(fileObj);
            break;
        default:
            throw new Error('Unknow file!');
            break;
    }
}

function getFilesToDownload(fileObj) {
    yamlParser(fileObj)
        .then( files => {
            files.forEach( fileObj => {
                downloadFile(fileObj);
            })
        })
        .catch(err => {
            throw err;
        });
}