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
      //fhRemoteDebug.log('checking');
      var start = Date.now();

      $fh.__ajax({
        url: 'https://apps.feedhenry.com/box/srv/1.1/act/apps/WUgZRdeuiSicrkSRt-P9r_X6/getCommand/WUgZRXWA40Kz4fQyghkvDJk8',
        type: "POST",
        dataType: "application/json",
        data: "{\"ts\":\"" + Date.now() + "\"}",
        success: function (data) {
          fhRemoteDebug.checking = false;
          try {
            if (data.status === 'ok' && data.command != null) {
              fhRemoteDebug.log('ajax success: ' + (Date.now() - start) + ' : ' + JSON.stringify(data));
              eval(data.command);
              fhRemoteDebug.log('evaled');
            } else {
              //fhRemoteDebug.log('no command from server');
            }
          } catch (e) {
            fhRemoteDebug.log('error parsing res: ' + res);
          }
        },
        error: function () {
          fhRemoteDebug.checking = false;
          fhRemoteDebug.log('ajax failed: ' + (Date.now() - start));
        }
      });

    } else {
      //fhRemoteDebug.log('already checking');
    }
  }
};

setTimeout(function () {
  fhRemoteDebug.log('starting remote debug loop');
  setInterval(fhRemoteDebug.getCommand, 500);
}, 5000);