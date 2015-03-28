var xml2js = require('xml2js'),
    request = require('request');

var streamList = {};

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
                    // No streams online
                    return;
                }

                var newList = {};

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
                        newList[name] = {
                            viewers: viewers
                        }
                    }
                }

                streamList = newList;
            });

        });
    },

    streams: function() {
        return streamList;
    }
};
