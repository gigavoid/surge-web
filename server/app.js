var express = require('express');
var streaminfo = require('./streaminfo');
var app = express();
var fs = require('fs');

app.use('/static', express.static(__dirname + '/../out/static'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


function isFile(path, cb) {
    fs.lstat(path, function(err, stats) {
        cb (!err && stats.isFile());
    });
}

app.get('/', function (req, res) {
    res.render('index', { streams: streaminfo.getStreams()});
});

app.get('/thumb/:name', function (req, res) {
    var path = __dirname + '/thumbs/' + req.params.name.replace(/\W/g, '').toLowerCase() + '.jpg';

    isFile(path, function (file) {
        if (file) {
            res.sendFile(path);
        } else {
            res.redirect('/static/imgs/gvsurgedefault.png');
        }
    });
});

app.get('/:name', function (req, res) {
    var name = req.params.name;

    var stream = streaminfo.getStream(name);
    if (stream) {
        res.render('stream', {
            stream: stream
        });
    }
    else {
        res.status(404);
        res.render('404');
    }
});

var server = app.listen(process.env.PORT || 3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

streaminfo.update();
setInterval(streaminfo.update, 3000);
setInterval(streaminfo.genThumbs, 20000);
