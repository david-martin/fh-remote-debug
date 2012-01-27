function addCommand() {
  var res = {
    "status": "ok"
  };
  var command = $params.command;

  var cache = $fh.cache({
    "act": "save",
    "key": "cmd",
    "val": command
  });

  if ('error' === cache.result) {
    res.status = 'error';
  }

  return res;
}

function getCommand() {
  var res = {
    "status": "ok"
  };

  var command = $fh.cache({
    "act": "load",
    "key": "cmd"
  });

  if (null != command.val && command.val.length > 0) {
    res.command = command.val;
    $fh.cache({
      "act": "remove",
      "key": "cmd"
    });
  } else {
    res.status = 'error';
  }

  return res;
}

function remoteLog() {
  var res = {
    "status": "ok"
  };
  var log = $params.log;

  var cache = $fh.cache({
    "act": "save",
    "key": "cmdLog",
    "val": log
  });

  if ('error' === cache.result) {
    res.status = 'error';
  }

  return res;
}

function getLog() {
  var res = {
    "status": "ok"
  };

  var log = $fh.cache({
    "act": "load",
    "key": "cmdLog"
  });

  if (null != log.val && log.val.length > 0) {
    res.log = log.val;
    $fh.cache({
      "act": "remove",
      "key": "cmdLog"
    });
  } else {
    res.status = 'error';
  }

  return res;
}