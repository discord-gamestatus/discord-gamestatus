/*export default function LimitedNumber(min: number, max: number): unknown {
  class LN extends Number {
    constructor(from: unknown) {
      let f = Number(from);
      if (f > max) {
        f = max;
      }
      if (f < min) {
        f = min;
      }
      super(f);
    }
  }
  return LN;
}*/

export type LimitedNumber = (value: unknown) => number;
export default function limitedNumber(min: number, max: number): LimitedNumber {
  return (value: unknown): number => {
    let f = Number(value);
    if (f > max) f = max;
    if (f < min) f = min;
    return f;
  };
}
