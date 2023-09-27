import AdmZip from 'adm-zip';

//mac unzip ffmpeg
const admzipFfprobe = new AdmZip('./assets/ffprobe-universal.zip');
const admzipFfmpeg = new AdmZip('./assets/ffmpeg-universal.zip');
admzipFfprobe.extractAllTo('./resources/ffmpeg-binaries'); 
admzipFfmpeg.extractAllTo('./resources/ffmpeg-binaries'); 
