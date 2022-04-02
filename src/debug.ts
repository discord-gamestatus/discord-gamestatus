/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2021 Douile

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

export enum DEBUG_FLAGS {
  ERROR = 1 << 0,
  WARN = 1 << 1,
  INFO = 1 << 2,
  DEBUG = 1 << 3,
  VERBOSE = 1 << 4,
}

export function setDebugFlag(error: boolean, warn: boolean, info: boolean, debug: boolean, verbose: boolean): void {
  DEBUG_FLAG = (error ? DEBUG_FLAGS.ERROR : 0) |
    (warn ? DEBUG_FLAGS.WARN : 0) |
    (info ? DEBUG_FLAGS.INFO : 0) |
    (debug ? DEBUG_FLAGS.DEBUG : 0) |
    (verbose ? DEBUG_FLAGS.VERBOSE : 0);
}

function isFlag(flag: number) {
  return function() {
    return (DEBUG_FLAG & flag) === flag;
  }
}

export const isError = isFlag(DEBUG_FLAGS.ERROR);
export const isWarn = isFlag(DEBUG_FLAGS.WARN);
export const isInfo = isFlag(DEBUG_FLAGS.INFO);
export const isDebug = isFlag(DEBUG_FLAGS.DEBUG);
export const isVerbose = isFlag(DEBUG_FLAGS.VERBOSE);

function logFlag(check: () => boolean, logger?: () => void) {
  const logF = logger ? logger : console.log;
  return function <T>(this: T, ...args: unknown[]) {
    if (check()) logF.call(this, ...args);
  }
}

export const errorLog = logFlag(isError, console.error);
export const warnLog = logFlag(isWarn, console.warn);
export const infoLog = logFlag(isInfo);
export const debugLog = logFlag(isDebug);
export const verboseLog = logFlag(isVerbose);
