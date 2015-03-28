var express = require('express');
var streaminfo = require('./streaminfo');
var app = express();

app.use('/static', express.static(__dirname + '/../out/static'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


app.get('/', function (req, res) {
    res.render('index', { streams: streaminfo.getStreams()});
});

app.get('/:name', function (req, res) {
    var name = req.params.name;

    res.render('stream', {
        stream: streaminfo.getStream(name)
    });
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

streaminfo.update();
setInterval(streaminfo.update, 3000);
