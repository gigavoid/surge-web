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
                    var name = streams[i].name[0];
                    var viewers = streams[i].client.length - 1;


                    newList[name] = {
                        viewers: viewers
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
