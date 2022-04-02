import { isOfBaseType, truncateString } from '@douile/bot-utilities';


export type LimitedString = (value: unknown) => string;

export default function limitedString(maxLength: number, ending?: string): LimitedString {
  return function(value: unknown) {
    if (isOfBaseType(value, String)) {
      return truncateString(value as string, maxLength, ending);
    }
    return truncateString(String(value), maxLength, ending);
  }
}

/*
export default function LimitedString(maxLength: number, ending?: string): unknown {
  class LS extends String {
    constructor(from: unknown) {
      if (isOfBaseType(from, String)) {
        from = truncateString(from as string, maxLength, ending);
      }
      super(from);
    }
  }
  return LS;
}
*/
