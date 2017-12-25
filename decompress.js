/**
 * Created by Gan on 2017/11/15.
 */

const decompress = require('decompress');
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const decompressTarbz = require('decompress-tarbz2');
const child_process = require('child_process');

let pathToUnzip = path.join(__dirname, 'bin');   //默认安装路径，当前目录bin

const platform = process.platform === 'win32' ? 'windows' : 'linux';

if(process.argv.length > 2) {
    pathToUnzip = process.argv.slice(2).join("");
    if(!path.isAbsolute(pathToUnzip)) {
        pathToUnzip = path.join(__dirname, pathToUnzip);
    }
}

prepareUnzip(pathToUnzip);

function prepareUnzip(pathToUnzip) {
    if(fs.existsSync(pathToUnzip)) {
        return;
    }
    let tmpPath = pathToUnzip,
        sep = tmpPath.indexOf(path.sep) > -1 ? path.sep : '/';
    let pathArray = tmpPath.split(sep);

    let dir = '';
    for(let tmp of pathArray) {
        dir = path.join(dir, tmp);
        if(!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir);
            } catch (err) {
                throw err;
            }
        }
    }
}

function doDecompress(file, pathExtractTo) {
    if(!fs.existsSync(file)) {
        throw new Error(`File ${file} no exists!`);
    }

    if(pathExtractTo) {
        pathToUnzip = pathExtractTo;
        prepareUnzip(pathToUnzip);
    }

    let extname = path.extname(file),
        decompression = null;

    switch (extname.toLowerCase()) {
        case '.zip':
            decompression = decompress(file,pathToUnzip, {
                filter: file => {
			console.log('filter:');
			console.log(path.join(__dirname, file.path));
			console.log(file);
			return fs.existsSync(path.join(__dirname, file.path)) === false
		}
            });
            break;
        case '.bz2':
            if(platform === 'linux') {
                child_process.execFileSync('tar', ['-xjvf', file, '-C', pathToUnzip]);
            } else if(platform === 'windows') {
                decompression = decompress(file,pathToUnzip, {
                    filter: file => fs.existsSync(path.join(__dirname, file.path)) === false,
                    plugins: [
                        decompressTarbz()
                    ],
                });
            }
            break;
        default:
            throw new Error('Unsupported file format to decompress!');
    }

    return new Promise( (resolve, reject) => {

        if(platform === 'linux') {
            let arr = file.split(path.sep);
            resolve({
                file: arr[arr.length-1],
                location: pathToUnzip
            });
        } else if(platform === 'windows') {
            decompression.then(files => {
                let arr = file.split(path.sep);
                resolve({
                    file: arr[arr.length-1],
                    location: pathToUnzip
                });
            }).catch(err => {
                reject(err);
            });
        }
    } );
}

module.exports = {
    doDecompress
};
