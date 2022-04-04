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

import { EMBED_LIMITS } from "@douile/bot-utilities";

import LimitedString from "../LimitedString";
import LimitedNumber from "../LimitedNumber";

const TitleLimit = LimitedString(EMBED_LIMITS.title, "...");
const DescriptionLimit = LimitedString(EMBED_LIMITS.description, "...");
const ImageLimit = LimitedString(300);
const ColorLimit = LimitedNumber(0, 0xffffff);
const ColumnLimit = LimitedNumber(0, 6);
const EditLimit = LimitedNumber(1, 9e9);

export interface UpdateOptions {
  dots?: string[];
  title?: string;
  offlineTitle?: string;
  description?: string;
  offlineDescription?: string;
  color?: number;
  offlineColor?: number;
  image?: string;
  offlineImage?: string;
  columns?: number;
  maxEdits?: number;
  connectUpdate?: boolean;
  disconnectUpdate?: boolean;
}
export type UpdateOption = keyof UpdateOptions;

export const DEFAULT_OPTIONS: UpdateOptions = {
  dots: ["⚪", "⚫"],
  title: TitleLimit("{name} server status"),
  offlineTitle: TitleLimit(`server **{name}**`),
  description: DescriptionLimit(
    "Playing {map} with {numplayers}/{maxplayers} players\nConnect with {connect}"
  ),
  offlineDescription: DescriptionLimit("Server is offline"),
  color: ColorLimit(0x2894c2),
  offlineColor: ColorLimit(0xff0000),
  image: ImageLimit(""),
  offlineImage: ImageLimit(""),
  columns: ColumnLimit(3),
  maxEdits: EditLimit(900000),
  connectUpdate: false,
  disconnectUpdate: false,
};
