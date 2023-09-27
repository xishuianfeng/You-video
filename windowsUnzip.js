import AdmZip from 'adm-zip';

//windows unzip ffmpeg
const admzipFfprobe = new AdmZip('./assets/ffprobe.exe.zip');
const admzipFfmpeg = new AdmZip('./assets/ffmpeg.exe.zip');
admzipFfprobe.extractAllTo('./resources/ffmpeg-binaries'); 
admzipFfmpeg.extractAllTo('./resources/ffmpeg-binaries'); 
