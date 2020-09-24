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
  DEBUG:      1 << 0,
  VERBOOSE:   1 << 1
};

// TODO: Spell verbose properly

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

const logFlag = function(check, logger) {
  const logF = logger ? logger : console.log;
  return function() {
    if (check()) logF.apply(this, arguments);
  }
}

const debugLog = logFlag(isDebug);

const verbooseLog = logFlag(isVerboose, console.debug);

exports.DEBUG_FLAGS = DEBUG_FLAGS;
exports.setDebugFlag = setDebugFlag;
exports.isDebug = isDebug;
exports.isVerboose = isVerboose;
exports.debugLog = debugLog;
exports.verbooseLog = verbooseLog;
