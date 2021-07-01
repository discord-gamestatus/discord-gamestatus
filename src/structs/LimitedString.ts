import { isOfBaseType, truncateString } from '@douile/bot-utilities';

export default function LimitedString(maxLength: number, ending?: string) {
  class LS extends String {
    constructor(from: any) {
      if (isOfBaseType(from, String)) {
        from = truncateString(from, maxLength, ending);
      }
      super(from);
    }
  }
  return LS;
}
