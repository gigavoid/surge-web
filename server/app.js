var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/../out/static'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
