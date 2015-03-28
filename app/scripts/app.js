
if (document.querySelector('#player')) {
    // On the player page

    var name = document.querySelector('#player').getAttribute('streamer');

    jwplayer('player').setup({
        file: 'rtmp://home.gigavoid.com:1935/live/' + name,
        image: '/static/imgs/gvsurgedefault.png',
        width: '100%',
        aspectratio: '16:9',
        autostart: true
    });

    setInterval(function() {
        getViewers(name, function (err, viewers) {
            if (err) return;
            document.querySelector('.viewers').innerText = 'Viewers: ' + viewers;
        });
    }, 5000);
} else {
    // Home page
    let imgs = [];

    let nodeList = document.querySelectorAll('.listimg');
    for (let i = 0; i < nodeList.length; i++) {
            imgs.push({
                element: nodeList[i],
                defaultSrc: nodeList[i].src
            });
    }
    let n = 0;
    setInterval(() => {
        n++;
        if (n >= imgs.length) {
            n = 0;
        }
        let img = imgs[n];
        img.element.src = img.defaultSrc + '?t=' + (+new Date());
    }, 2000);


    let viewerLabels = document.querySelectorAll('.viewers');

    let i = 0;
    setInterval(() => {
        i++;
        if (i >= viewerLabels.length) {
            i = 0;
        }

        let label = viewerLabels[i];
        getViewers(label.getAttribute('streamer'), function (err, viewers) {
            if (err) return;
            label.innerHTML = viewers;
        });
    }, 5000);
}

function getViewers(streamer, cb) {
    let req = new XMLHttpRequest();
    req.open('GET', '/' + streamer + '/viewers');

    req.onload = function() {
        if (req.status == 200) {
            cb(null, parseInt(JSON.parse(req.responseText).viewers));
        } else {
            cb(req.responseText);
        }
    };

    req.send();
}
