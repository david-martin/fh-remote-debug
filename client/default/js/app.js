(function () {
  /*$fh = {
    env: function (cb) {
      cb({
        application: 'testapp',
        instance: 'testinst',
        domain: 'testdomain'
      });
    }
  };*/

  $(document).ready(function () {
    // bind cmd button
    $('#cmdButton').bind('click', function (e) {
      var cmdInputVal = $('#cmdInput').val();
      if (null != cmdInputVal && '' !== cmdInputVal) {
        addCommand(cmdInputVal);
      }
    });

    $('#embedId').bind('keyup', updateEmbedScript).val(randomString());
    updateEmbedScript();
  });

  var addCommand = function (command) {
    $fh.act({
      "act": "addCommand",
      "secure": true,
      "req": {
        "ts": Date.now(),
        "command" : command
      }
    }, function (res) {
      if (res && res.status === 'ok') {
        appendLog(command);
        getRemoteLog();
      } else {
        alert('error sending command');
      }
    }, function (code, errorprops, params) {
      alert('code: ' + code + ', errorprops: ' + JSON.stringify(errorprops));
    });
  };

  var appendLog = function (msg) {
    var cmdLog = $('#cmdLog');
    cmdLog.append(msg + '\n');
    cmdLog[0].scrollTop = cmdLog[0].scrollHeight;
  };

  var getRemoteLog = function () {
    var maxRetries = 5;
    var curRetries = 0;
    var getInProgress = false;
    var logInt;

    var logFn = function () {
      if (!getInProgress) {
        curRetries += 1;
        if (curRetries <= maxRetries) {
          getInProgress = true;
          $fh.act({
            "act": "getLog",
            "secure": true,
            "req": {
              "ts": Date.now()
            }
          }, function (res) {
            getInProgress = false;
            if (res && res.status === 'ok') {
              appendLog(' >>' + res.log);
              clearInterval(logInt);
            } else {
              //no log yet, wait for next interval
            }
          }, function (code, errorprops, params) {
            getInProgress = false;
            clearInterval(logInt);
            alert('code: ' + code + ', errorprops: ' + JSON.stringify(errorprops));
          });
        } else {
          appendLog(' >> maxRetries exceeded getting remote log response');
          clearInterval(logInt);
        }
      }
    };

    logInt = setInterval(logFn, 500);
  };

  var randomString = function () {
    var randomstring = '';

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var string_length = 18;
    for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
    }

    return randomstring;
  };

  var updateEmbedScript = function () {
    var src = document.location.protocol + '//' + document.location.host + $('#appJsScript').attr('src').replace('app.js', 'remoteDebug.js');

    $fh.env(function (res) {
      var appId = res.application;
      var instId = res.instance;
      var domain = res.domain;
      var embedId = $('#embedId').val();

      var idString = embedId + '~' + domain + '~' + appId + '~' + instId;
      $('.embedScript').text('<script id="remoteDebugScript" type="text/javascript" src="' + src + '#' + idString + '"></script>');
    });

  };
})();