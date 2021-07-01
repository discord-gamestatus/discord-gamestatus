export default function LimitedNumber(min: number, max: number) {
  class LN extends Number {
    constructor(from: any) {
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
