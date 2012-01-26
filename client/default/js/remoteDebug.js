var fhRemoteDebug = {
  checking: false,

  log: function (msg) {
    $fh.log({
      "message": 'fh-remote-debug~' + Date.now() + '==> ' + msg
    });
  },

  getCommand: function () {
    if (!fhRemoteDebug.checking) {
      fhRemoteDebug.checking = true;
      fhRemoteDebug.log('checking');

      $fh.__ajax({
        url: 'https://apps.feedhenry.com/box/srv/1.1/act/apps/WUgZRdeuiSicrkSRt-P9r_X6/getCommand/WUgZRXWA40Kz4fQyghkvDJk8',
        type: "POST",
        dataType: "application/json",
        data: "{\"ts\":\"" + Date.now() + "\"}",
        success: function (data) {
          fhRemoteDebug.log('ajax success: ' + (Date.now() - start) + ' : ' + data);
          eval(data);
          fhRemoteDebug.log('evaled');
        },
        error: function () {
          fhRemoteDebug.checking = false;
          fhRemoteDebug.log('ajax failed: ' + (Date.now() - start));
        }
      });

    } else {
      fhRemoteDebug.log('already checking');
    }
  }
};

setTimeout(fhRemoteDebug.getCommand, 500);