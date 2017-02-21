var vows       = require('vows');
var ytdl       = require('..');
var downloader = require('../lib/downloader');
var fs         = require('fs');
var path       = require('path');
var assert     = require('assert');
var video1     = 'http://www.youtube.com/watch?v=90AiXO1pAiA';

vows.describe('customBinary').addBatch({
  'download to temp folder': {
    'topic': function() {
      'use strict';

      downloader('/tmp', this.callback);
    },

    'custom binary was downloaded': function(errOrStatus) {
      assert.isNotNull(errOrStatus);
    }

  },

  'a video downloaded with custom binary path': {
    'topic': function() {
      'use strict';

      var tmpPath = '/tmp/youtube-dl';
      var dl = ytdl(video1, [], {path: tmpPath});
      var cb = this.callback;

      dl.on('error', cb);

      dl.on('info', function(info) {
        var pos = 0;
        var progress;

        dl.on('data', function(data) {
          pos += data.length;
          progress = pos / info.size;
        });

        dl.on('end', function() {
          cb(null, progress, info);
        });

        var filepath = path.join(__dirname, info._filename);
        dl.pipe(fs.createWriteStream(filepath));
      });

    },

    'data returned using custom path': function(err, progress, data) {
      'use strict';
      if (err) { throw err; }

      assert.equal(progress, 1);
      assert.isObject(data);
      assert.equal(data.id, '90AiXO1pAiA');
      assert.isTrue(/lol-90AiXO1pAiA/.test(data._filename));
      assert.isTrue(data.size > 1010000);
    },

    'file was downloaded': function(err, progress, data) {
      'use strict';
      if (err) { throw err; }

      // Check existance.
      var filepath = path.join(__dirname, data._filename);
      var exists = fs.existsSync(filepath);
      if (exists) {
        // Delete file after each test.
        fs.unlinkSync(filepath);
      } else {
        assert.isTrue(exists);
      }
    }
  }
}).export(module);
