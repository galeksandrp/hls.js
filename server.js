var client = new WebTorrent()

var files = [];

function customLoader() {
  this.loader = new XMLHttpRequest();
  this.load = function(context, config, callbacks) {
    this.loader.open('GET', context.url);
    this.loader.responseType = context.responseType;
    if (context.rangeStart && context.rangeEnd) xhr.setRequestHeader('Range', 'bytes='+context.rangeStart+'-'+context.rangeEnd);
    this.loader.send();
    this.loader.onload = function(xhr) {
    var name = context.url.split('/');
      client.seed(new Blob([xhr.target.response], {type: 'video/MP2T'}), {name: name[name.length-1]}, function (torrent) {
    console.log('Client is seeding:', torrent.infoHash)
  })
      callbacks.onSuccess({data: xhr.target.response}, {}, context)
    };
    this.loader.onprogress = function(xhr) {
      callbacks.onProgress({}, context, context.progressData === true ? xhr.target.response : undefined)
    }
  }
  this.abort = function () {
    this.loader.abort();
  };
  this.destroy = function () {};
}

if(Hls.isSupported()) {
  var video = document.getElementById('video');
  var hls = new Hls({fLoader: customLoader});
  hls.loadSource('http://www.streambox.fr/playlists/x36xhzz/url_2/193039199_mp4_h264_aac_ld_7.m3u8');
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
  });
}