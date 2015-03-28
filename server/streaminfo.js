var xml2js = require('xml2js'),
    request = require('request'),
    fs = require('fs'),
    exec = require('child_process').exec;

var streamList = [];
var streamsByName = {};
var lastThumb = 0;

try {
    fs.mkdirSync(__dirname + '/thumbs');
} catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
}

module.exports = {
    update: function() {
        request('http://surge.gigavoid.com:1936/stat', function (err, resp) {
            if (err) {
                console.error('Could not update streamstats');
                return;
            }

            xml2js.parseString(resp.body, function (err, result){
                if (err) {
                    console.error('Could not parse streamstats');
                    return;
                }

                var streams = result.rtmp.server[0].application[0].live[0].stream;

                if (!streams) {
                    // No getStreams online
                    return;
                }

                var newList = [];
                var newObj = {};

                for (var i = 0; i < streams.length; i++) {
                    var stream = streams[i];
                    var name = stream.name[0];
                    var viewers = stream.client.length - 1;

                    var onePublisher = false;

                    for (var j = 0; j < stream.client.length; j++) {
                        var client = stream.client[j];
                        var publishing = client.publishing !== undefined;

                        if (publishing) {
                            onePublisher = true;
                        }
                    }

                    if (onePublisher) {
                        var streamObj = {
                            viewers: viewers,
                            name: name
                        };
                        newList.push(streamObj);
                        newObj[name] = streamObj;
                    }
                }

                newList.sort(function (a, b) {
                    return  b.viewers - a.viewers;
                });

                streamList = newList;
                streamsByName = newObj;
            });

        });
    },

    genThumbs: function () {
        lastThumb++;
        if (lastThumb >= streamList.length) {
            lastThumb = 0;
        }

        if (streamList.length > 0) {
            var stream = streamList[lastThumb];
            console.log('Generating thumbnail for stream #' + lastThumb + '(' + stream.name + ')');

            var slug = stream.name.replace(/\W/g, '');

            var command = 'ffmpeg -i rtmp://surge.gigavoid.com:1935/live/' + slug + ' -vframes 1 -y ' + __dirname +  '/thumbs/' + slug.toLowerCase() + '.jpg';
            exec(command, function (err) {
                if (err)
                    console.log('Could not generate thumbnail: ' + err);
            });
        }
    },

    getStream: function (name) {
        return streamsByName[name];
    },

    getStreams: function () {
        return streamList;
    }
};
