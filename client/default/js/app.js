(function () {
  $(document).ready(function () {
    // bind cmd button
    $('#cmdButton').bind('click', function (e) {
      var cmdInputVal = $('#cmdInput').val();
      if (null != cmdInputVal && '' !== cmdInputVal) {
        addCommand(cmdInputVal);
      }
    });
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
      var cmdLog = $('#cmdLog');
      cmdLog.append(command + '\n');
      cmdLog[0].scrollTop = cmdLog[0].scrollHeight;
    }, function (code, errorprops, params) {
      alert('code: ' + code + ', errorprops: ' + JSON.stringify(errorprops));
    });
  };
})();