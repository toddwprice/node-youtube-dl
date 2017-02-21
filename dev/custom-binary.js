'use strict';

const fs = require('fs');
const path = require('path');
const youtubedl = require('../lib/youtube-dl');

let url = 'https://www.youtube.com/watch?v=FSvNhxKJJyU';
let video = youtubedl(
  url, 
  [], 
  { path: path.join(__dirname, 'youtube-dl') }
);

let data = {
  videoFile: './video-download.mp4'
};

// Will be called when the download starts.
video.on('info', (info) => {
  data.metadata = {
    created_date: new Date(),
    file_type: 'video',
    file_format: info.format,
    file_url: info.url,
    file_webpage_url: info.webpage_url,
    file_author: info.uploader_url,
    file_title: info.fulltitle,
    file_description: info.description,
    file_width: info.width,
    file_height: info.height,
    file_size_bytes: info.size,
    file_thumbnail_url: info.thumbnail
    // additional_properties: JSON.stringify(info, null, 2)
  };
  console.log('Download started');

  //stream thumbnail if there is one
  // if (data.metadata.file_thumbnail_url) {
  //   data.thumbnailStream = fs.createWriteStream(path.join(data.baseDir, 'thumbnail.jpeg'));
  //   request(data.metadata.file_thumbnail_url).pipe(data.thumbnailStream);
  // }

});

video.pipe(fs.createWriteStream(data.videoFile));

video.on('end', () => {
  console.log('finished downloading!');
  console.log(data);
});
