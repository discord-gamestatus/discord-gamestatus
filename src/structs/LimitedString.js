'use strict';

const { isOfBaseType, truncateString } = require('@douile/bot-utilities');

function LimitedString(maxLength, ending) {
  class LS extends String {
    constructor(from) {
      if (isOfBaseType(from, String)) {
        from = truncateString(from, maxLength, ending);
      }
      super(from);
    }
  }
  return LS;
}

module.exports = LimitedString;
