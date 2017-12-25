/**
 * Created by Gan on 2017/11/15.
 */

const yaml = require('js-yaml');
const fs   = require('fs');
const Promise = require('bluebird');


// Get document, or throw exception on error

function yamlParser(fileObj) {
    let file = fileObj.path,
        link = fileObj.link,
        linkPrefix = link.substr(0, link.lastIndexOf('/'));

    try {
        fs.accessSync(file)
    } catch (err) {
        reject(err);
    }
    return new Promise( (resolve, reject) => {
        try {
            let doc = yaml.safeLoad(fs.readFileSync(file, 'utf8')),
                fileToDownload = [],
                element = null,
                count = 0;

            let packageName = Object.getOwnPropertyNames(doc.packages[0])[0];

            fileToDownload.push({
                name: packageName,
                link: `${linkPrefix}/${packageName}`,
                sha1: doc.packages[0][packageName].MD5Sum,
                prefix: doc.prefix
            });

/*            for(item in doc.component) {
                if(doc.component.hasOwnProperty(item)) {
                    count++;
                    element = doc.component[item];
                    if(element) {
                        fileToDownload.push({
                            name: element.runtime.filename,
                            link: `${linkPrefix}/${element.runtime.filename}`,
                            sha1: element.runtime.SHA1
                        });
                    }
                }
            }
            if(fileToDownload.length !== count) {
                reject(new Error('yaml parse error!'));
            }*/
            resolve(fileToDownload);
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });

}

module.exports = yamlParser;