
if (document.querySelector('#player')) {
    // On the player page

    var name = document.querySelector('#player').attributes['streamer'].value;

    jwplayer('player').setup({
        file: 'rtmp://home.gigavoid.com:1935/live/' + name,
        image: '/static/imgs/gvsurgedefault.png',
        width: '100%',
        aspectratio: '16:9'
    });
}
