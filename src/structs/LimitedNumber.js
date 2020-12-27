'use strict';

function LimitedNumber(min, max) {
  class LN extends Number {
    constructor(from) {
      from = Number(from);
      if (from > max) {
        from = max;
      }
      if (from < min) {
        from = min;
      }
      super(from);
    }
  }
  return LN;
}

module.exports = LimitedNumber;
