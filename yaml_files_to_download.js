/**
 * Created by Gan on 2017/11/9.
 */

const baseLink  = 'http://172.16.0.119/wms/mirrors/cerbero.repo/releases',
    mainFolder = [],
    filesToDownload = [],
    platform = process.platform === 'win32' ? 'windows' : 'linux',
    arch = 'x86_64',
    extname = 'yaml';

mainFolder.push({
    name: 'base',
    version: '1.12.3'
});
mainFolder.push({
    name: 'build-tools',
    version: '1.12.3'
});
mainFolder.push({
    name: 'gstreamer',
    version: '1.12.3'
});
mainFolder.push({
    name: 'ribbon',
    version: '0.4.0'
});
mainFolder.push({
    name: 'wms',
    version: '0.2.0'
});

mainFolder.forEach( folder => {
   let name = `${folder.name}-${platform}-${arch}-${folder.version}.${extname}`;
   filesToDownload.push({
       name: name,
       link: `${baseLink}/${folder.name}/${name}`,
       sha1: null
   }) ;
});

module.exports = filesToDownload;

