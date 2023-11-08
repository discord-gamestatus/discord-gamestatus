/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2023 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

export type LimitedNumber = (value: unknown) => number;
export default function limitedNumber(min: number, max: number): LimitedNumber {
  return (value: unknown): number => {
    let f = Number(value);
    if (f > max) f = max;
    if (f < min) f = min;
    return f;
  };
}
