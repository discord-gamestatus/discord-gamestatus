let DEBUG_FLAG = 0xff; // Default to full debug

const DEBUG_FLAGS = {
  DEBUG:      1 << 0,
  VERBOOSE:   1 << 1
};

const setDebugFlag = function(debug, verboose) {
  DEBUG_FLAG = (debug ? DEBUG_FLAGS.DEBUG : 0) | (verboose ? DEBUG_FLAGS.VERBOOSE : 0);
}

const isFlag = function(flag) {
  return function() {
    return (DEBUG_FLAG & flag) === flag;
  }
}

const isDebug = isFlag(DEBUG_FLAGS.DEBUG);

const isVerboose = isFlag(DEBUG_FLAGS.VERBOOSE);

const logFlag = function(check) {
  return function() {
    if (check()) console.log.apply(this, arguments);
  }
}

const debugLog = logFlag(isDebug);

const verbooseLog = logFlag(isVerboose);

exports.DEBUG_FLAGS = DEBUG_FLAGS;
exports.setDebugFlag = setDebugFlag;
exports.isDebug = isDebug;
exports.isVerboose = isVerboose;
exports.debugLog = debugLog;
exports.verbooseLog = verbooseLog;
