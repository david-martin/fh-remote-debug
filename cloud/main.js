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

