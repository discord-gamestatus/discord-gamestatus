let isDebug = false;

const setDebug = function(debug) {
  isDebug = debug;
}

const debugLog = function() {
  if (isDebug) console.log.apply(this, arguments);
}

exports.setDebug = setDebug;
exports.debugLog = debugLog;
