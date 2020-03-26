let isDebug = false;

const setDebug = function(debug) {
  isDebug = debug;
}

const getDebug = function() {
  return isDebug ? true : false;
}

const debugLog = function() {
  if (isDebug) console.log.apply(this, arguments);
}

exports.setDebug = setDebug;
exports.getDebug = getDebug;
exports.debugLog = debugLog;
