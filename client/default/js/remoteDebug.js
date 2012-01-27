var fhRemoteDebug = {
  checking: false,
  id: 'id-not-found',
  endpoint: null,

  log: function (msg) {
    $fh.log({
      "message": 'fh-remote-debug~' + Date.now() + '==> ' + msg
    });
  },

  getCommand: function () {
    if (!fhRemoteDebug.checking) {
      fhRemoteDebug.checking = true;

      if (fhRemoteDebug.endpoint !== null) {
        //fhRemoteDebug.log('checking');
        var start = Date.now();

        $fh.__ajax({
          url: fhRemoteDebug.endpoint.replace('<action>', 'getCommand'),
          type: "POST",
          dataType: "application/json",
          data: '{"ts":' + Date.now() + ',"id":"' + fhRemoteDebug.id + '"}',
          success: function (data) {
            fhRemoteDebug.checking = false;
            try {
              if (data.status === 'ok' && data.command != null) {
                fhRemoteDebug.log('ajax success: ' + (Date.now() - start) + ' : ' + JSON.stringify(data));
                var result, response;

                try {
                  result = eval(command);
                  response = result;
                  if (null != result && 'object' === typeof result) {
                    response = '[Object]';
                  }
                } catch (e) {
                  response = 'eval failed:' + e.toString();
                }
                fhRemoteDebug.log('evaled. sending response:' + response);
                fhRemoteDebug.sendLog(response);

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
        fhRemoteDebug.log('endpoint is null');
      }

    } else {
      //fhRemoteDebug.log('already checking');
    }
  },

  sendLog: function (msg) {
    $fh.__ajax({
      url: fhRemoteDebug.endpoint.replace('<action>', 'remoteLog'),
      type: "POST",
      dataType: "application/json",
      data: '{"ts":' + Date.now() + ',"id":"' + fhRemoteDebug.id + '","log":"' + msg + '"}',
      success: function (data) {
        fhRemoteDebug.log('response sent');
      },
      error: function () {
        fhRemoteDebug.log('response failed');
      }
    });
  }
};

setTimeout(function () {
  fhRemoteDebug.log('getting remoteDebug id');
  var src = document.getElementById("remoteDebugScript").src;

  var ids = src.substring(src.indexOf('#') + 1, src.length).split('~');
  fhRemoteDebug.id = ids[0];
  fhRemoteDebug.endpoint = src.replace(/\/static\/.+/, '/box/srv/1.1/act/' + ids[1] + '/' + ids[2] + '/<action>/' + ids[3]);

  fhRemoteDebug.log('starting remote debug loop with id:' + fhRemoteDebug.id + ', endpoint:' + fhRemoteDebug.endpoint);
  setInterval(fhRemoteDebug.getCommand, 500);
}, 5000);