/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2020 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

let DEBUG_FLAG = 0xff; // Default to full debug

const DEBUG_FLAGS = {
  ERROR:      1 << 0,
  WARN:       1 << 1,
  INFO:       1 << 2,
  DEBUG:      1 << 3,
  VERBOSE:    1 << 4,
};

// TODO: Spell verbose properly

const setDebugFlag = function(error, warn, info, debug, verbose) {
  DEBUG_FLAG =  (error ? DEBUG_FLAGS.ERROR : 0) |
                (warn ? DEBUG_FLAGS.WARN : 0) |
                (info ? DEBUG_FLAGS.INFO : 0) |
                (debug ? DEBUG_FLAGS.DEBUG : 0) |
                (verbose ? DEBUG_FLAGS.VERBOSE : 0);
}

const isFlag = function(flag) {
  return function() {
    return (DEBUG_FLAG & flag) === flag;
  }
}

const isError = isFlag(DEBUG_FLAGS.ERROR);
const isWarn = isFlag(DEBUG_FLAGS.WARN);
const isInfo = isFlag(DEBUG_FLAGS.INFO);
const isDebug = isFlag(DEBUG_FLAGS.DEBUG);
const isVerbose = isFlag(DEBUG_FLAGS.VERBOSE);

const logFlag = function(check, logger) {
  const logF = logger ? logger : console.log;
  return function() {
    if (check()) logF.apply(this, arguments);
  }
}

exports.DEBUG_FLAGS = DEBUG_FLAGS;
exports.setDebugFlag = setDebugFlag;
exports.isError = isError;
exports.isWarn = isWarn;
exports.isInfo = isInfo;
exports.isDebug = isDebug;
exports.isVerbose = isVerbose;
exports.errorLog = logFlag(isError, console.error);
exports.warnLog = logFlag(isWarn, console.warn);
exports.infoLog = logFlag(isInfo);
exports.debugLog = logFlag(isDebug);
exports.verboseLog = logFlag(isVerbose);
