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

import { isOfBaseType, truncateString } from "@douile/bot-utilities";

export type LimitedString = (value: unknown) => string;

export default function limitedString(
  maxLength: number,
  ending?: string
): LimitedString {
  return function (value: unknown) {
    if (isOfBaseType(value, String)) {
      return truncateString(value as string, maxLength, ending);
    }
    return truncateString(String(value), maxLength, ending);
  };
}
