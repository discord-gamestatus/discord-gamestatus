import typia from "typia";
import { RESTPatchAPIChannelMessageResult, RESTPostAPIChannelMessageResult, } from "discord-api-types/v10";
import { APIApplication, APIError, APIMessageResponse, Update, } from "../types.js";
export const isAPIApplication = (input: any): input is APIApplication => {
    return "object" === typeof input && null !== input && "string" === typeof (input as any).name;
};
export const isParseUpdate = (input: any): typia.Primitive<Update> => { const is = (input: any): input is Update => {
    const $io0 = (input: any): boolean => "number" === typeof input.id && (null === input.guild_id || "string" === typeof input.guild_id) && "string" === typeof input.channel_id && (null === input.message_id || "string" === typeof input.message_id) && "string" === typeof input.ip && ("7d2d" === input.type || "ageofchivalry" === input.type || "aoe2" === input.type || "alienarena" === input.type || "alienswarm" === input.type || "arkse" === input.type || "assettocorsa" === input.type || "atlas" === input.type || "avp2" === input.type || "avp2010" === input.type || "americasarmy" === input.type || "americasarmy2" === input.type || "americasarmy3" === input.type || "americasarmypg" === input.type || "arcasimracing" === input.type || "arma" === input.type || "arma2" === input.type || "arma2oa" === input.type || "armacwa" === input.type || "armar" === input.type || "arma3" === input.type || "armagetron" === input.type || "baldursgate" === input.type || "barotrauma" === input.type || "bat1944" === input.type || "bf1942" === input.type || "bfv" === input.type || "bf2" === input.type || "bf2142" === input.type || "bfbc2" === input.type || "bf3" === input.type || "bf4" === input.type || "bfh" === input.type || "breach" === input.type || "breed" === input.type || "brink" === input.type || "buildandshoot" === input.type || "cod" === input.type || "coduo" === input.type || "cod2" === input.type || "cod3" === input.type || "cod4" === input.type || "codwaw" === input.type || "codmw2" === input.type || "codmw3" === input.type || "callofjuarez" === input.type || "chaser" === input.type || "chrome" === input.type || "codenameeagle" === input.type || "commandos3" === input.type || "cacrenegade" === input.type || "conanexiles" === input.type || "contagion" === input.type || "contactjack" === input.type || "cs15" === input.type || "cs16" === input.type || "cs2d" === input.type || "cscz" === input.type || "css" === input.type || "csgo" === input.type || "crossracing" === input.type || "crysis" === input.type || "crysiswars" === input.type || "crysis2" === input.type || "daikatana" === input.type || "dmomam" === input.type || "darkesthour" === input.type || "daysofwar" === input.type || "dayz" === input.type || "dayzmod" === input.type || "deadlydozenpt" === input.type || "dh2005" === input.type || "descent3" === input.type || "deusex" === input.type || "devastation" === input.type || "dinodday" === input.type || "dirttrackracing2" === input.type || "discord" === input.type || "dnl" === input.type || "dod" === input.type || "dods" === input.type || "doi" === input.type || "doom3" === input.type || "dota2" === input.type || "drakan" === input.type || "empyrion" === input.type || "etqw" === input.type || "fear" === input.type || "f12002" === input.type || "f1c9902" === input.type || "farcry" === input.type || "farcry2" === input.type || "fortressforever" === input.type || "operationflashpoint" === input.type || "flashpoint" === input.type || "flashpointresistance" === input.type || "ffow" === input.type || "fivem" === input.type || "forrest" === input.type || "garrysmod" === input.type || "graw" === input.type || "graw2" === input.type || "giantscitizenkabuto" === input.type || "globaloperations" === input.type || "geneshift" === input.type || "mutantfactions" === input.type || "ges" === input.type || "gore" === input.type || "groundbreach" === input.type || "gunmanchronicles" === input.type || "hldm" === input.type || "hldms" === input.type || "hl2dm" === input.type || "halo" === input.type || "halo2" === input.type || "heretic2" === input.type || "hexen2" === input.type || "hidden" === input.type || "hll" === input.type || "had2" === input.type || "homefront" === input.type || "homeworld2" === input.type || "hurtworld" === input.type || "igi2" === input.type || "il2" === input.type || "insurgency" === input.type || "insurgencysandstorm" === input.type || "ironstorm" === input.type || "jamesbondnightfire" === input.type || "jc2mp" === input.type || "jc3mp" === input.type || "killingfloor" === input.type || "killingfloor2" === input.type || "kingpin" === input.type || "kisspc" === input.type || "kspdmp" === input.type || "kzmod" === input.type || "left4dead" === input.type || "left4dead2" === input.type || "m2mp" === input.type || "m2o" === input.type || "medievalengineers" === input.type || "mohaa" === input.type || "mohsh" === input.type || "mohbt" === input.type || "mohpa" === input.type || "mohab" === input.type || "moh2010" === input.type || "mohwf" === input.type || "minecraft" === input.type || "minecraftping" === input.type || "minecraftpe" === input.type || "minecraftbe" === input.type || "mnc" === input.type || "mordhau" === input.type || "mtavc" === input.type || "mtasa" === input.type || "mumble" === input.type || "mumbleping" === input.type || "nascarthunder2004" === input.type || "netpanzer" === input.type || "nmrih" === input.type || "ns" === input.type || "ns2" === input.type || "nfshp2" === input.type || "nab" === input.type || "nwn" === input.type || "nwn2" === input.type || "nexuiz" === input.type || "nitrofamily" === input.type || "nolf" === input.type || "nolf2" === input.type || "nucleardawn" === input.type || "openarena" === input.type || "openttd" === input.type || "painkiller" === input.type || "pixark" === input.type || "ps" === input.type || "postal2" === input.type || "prey" === input.type || "primalcarnage" === input.type || "prbf2" === input.type || "przomboid" === input.type || "quake1" === input.type || "quake2" === input.type || "quake3" === input.type || "quake4" === input.type || "quakelive" === input.type || "ragdollkungfu" === input.type || "r6" === input.type || "r6roguespear" === input.type || "r6ravenshield" === input.type || "rallisportchallenge" === input.type || "rallymasters" === input.type || "redorchestra" === input.type || "redorchestraost" === input.type || "redorchestra2" === input.type || "redline" === input.type || "rtcw" === input.type || "rfactor" === input.type || "ricochet" === input.type || "riseofnations" === input.type || "rs2" === input.type || "rune" === input.type || "rust" === input.type || "samp" === input.type || "savage2" === input.type || "spaceengineers" === input.type || "ss" === input.type || "ss2" === input.type || "shatteredhorizon" === input.type || "ship" === input.type || "shogo" === input.type || "shootmania" === input.type || "sin" === input.type || "sinep" === input.type || "soldat" === input.type || "sof" === input.type || "sof2" === input.type || "stalker" === input.type || "stbc" === input.type || "stvef" === input.type || "stvef2" === input.type || "squad" === input.type || "swbf" === input.type || "swbf2" === input.type || "swjk" === input.type || "swjk2" === input.type || "swrc" === input.type || "starbound" === input.type || "starmade" === input.type || "starsiege" === input.type || "suicidesurvival" === input.type || "swat4" === input.type || "svencoop" === input.type || "synergy" === input.type || "tacticalops" === input.type || "takeonhelicopters" === input.type || "teamfactor" === input.type || "tfc" === input.type || "tf2" === input.type || "teamspeak2" === input.type || "teamspeak3" === input.type || "terminus" === input.type || "terraria" === input.type || "tshock" === input.type || "thps3" === input.type || "thps4" === input.type || "thu2" === input.type || "towerunite" === input.type || "trackmania2" === input.type || "trackmaniaforever" === input.type || "tremulous" === input.type || "tribes1" === input.type || "tribesvengeance" === input.type || "tron20" === input.type || "turok2" === input.type || "universalcombat" === input.type || "unreal" === input.type || "unturned" === input.type || "ut" === input.type || "ut2003" === input.type || "ut2004" === input.type || "ut3" === input.type || "urbanterror" === input.type || "v8supercar" === input.type || "valheim" === input.type || "vcmp" === input.type || "ventrilo" === input.type || "vietcong" === input.type || "vietcong2" === input.type || "warsow" === input.type || "wheeloftime" === input.type || "wolfenstein2009" === input.type || "wolfensteinet" === input.type || "xpandrally" === input.type || "zombiemaster" === input.type || "zps" === input.type) && (null === input.title || "string" === typeof input.title) && (null === input.offline_title || "string" === typeof input.offline_title) && (null === input.description || "string" === typeof input.description) && (null === input.offline_description || "string" === typeof input.offline_description) && (null === input.color || "number" === typeof input.color) && (null === input.offline_color || "number" === typeof input.offline_color) && (null === input.image || "string" === typeof input.image) && (null === input.offline_image || "string" === typeof input.offline_image) && (null === input.dots || Array.isArray(input.dots) && input.dots.every((elem: any) => "string" === typeof elem)) && (null === input.columns || "number" === typeof input.columns);
    return "object" === typeof input && null !== input && $io0(input);
}; input = JSON.parse(input); return is(input) ? input as any : null; };
export const isMessageAPI = (input: any): input is APIError | APIMessageResponse => {
    const $io0 = (input: any): boolean => "number" === typeof input.code && "string" === typeof input.message;
    const $io1 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.channel_id && "string" === typeof input.content && ("object" === typeof input.author && null !== input.author && "string" === typeof (input.author as any).id) && "string" === typeof input.timestamp;
    const $iu0 = (input: any): any => (() => {
        if (undefined !== input.code)
            return $io0(input);
        if (undefined !== input.id)
            return $io1(input);
        return false;
    })();
    return "object" === typeof input && null !== input && $iu0(input);
};
export const validateAPIApplication = (input: any): typia.IValidation<APIApplication> => {
    const errors = [] as any[];
    const __is = (input: any): input is APIApplication => {
        return "object" === typeof input && null !== input && "string" === typeof (input as any).name;
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is APIApplication => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                })].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "APIApplication",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "APIApplication",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
export const validateRESTPatchAPIChannelMessageResult = (input: any): typia.IValidation<RESTPatchAPIChannelMessageResult> => {
    const errors = [] as any[];
    const __is = (input: any): input is RESTPatchAPIChannelMessageResult => {
        const $is_custom = (typia.createValidate as any).is_custom;
        const $io0 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.channel_id && ("object" === typeof input.author && null !== input.author && $io1(input.author)) && "string" === typeof input.content && "string" === typeof input.timestamp && (null === input.edited_timestamp || "string" === typeof input.edited_timestamp) && "boolean" === typeof input.tts && "boolean" === typeof input.mention_everyone && (Array.isArray(input.mentions) && input.mentions.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem))) && (Array.isArray(input.mention_roles) && input.mention_roles.every((elem: any) => "string" === typeof elem)) && (undefined === input.mention_channels || Array.isArray(input.mention_channels) && input.mention_channels.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem))) && (Array.isArray(input.attachments) && input.attachments.every((elem: any) => "object" === typeof elem && null !== elem && $io3(elem))) && (Array.isArray(input.embeds) && input.embeds.every((elem: any) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io4(elem))) && (undefined === input.reactions || Array.isArray(input.reactions) && input.reactions.every((elem: any) => "object" === typeof elem && null !== elem && $io12(elem))) && (undefined === input.nonce || "string" === typeof input.nonce || "number" === typeof input.nonce) && "boolean" === typeof input.pinned && (undefined === input.webhook_id || "string" === typeof input.webhook_id) && (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 6 === input.type || 7 === input.type || 8 === input.type || 9 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 14 === input.type || 15 === input.type || 16 === input.type || 17 === input.type || 18 === input.type || 19 === input.type || 20 === input.type || 21 === input.type || 22 === input.type || 23 === input.type || 24 === input.type || 25 === input.type || 26 === input.type || 27 === input.type || 28 === input.type || 29 === input.type || 30 === input.type || 31 === input.type || 32 === input.type) && (undefined === input.activity || "object" === typeof input.activity && null !== input.activity && $io14(input.activity)) && (undefined === input.application || "object" === typeof input.application && null !== input.application && false === Array.isArray(input.application) && $io15(input.application)) && (undefined === input.application_id || "string" === typeof input.application_id) && (undefined === input.message_reference || "object" === typeof input.message_reference && null !== input.message_reference && $io22(input.message_reference)) && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 1024 === input.flags || 4096 === input.flags || 8192 === input.flags) && (null === input.referenced_message || undefined === input.referenced_message || "object" === typeof input.referenced_message && null !== input.referenced_message && $io0(input.referenced_message)) && (undefined === input.interaction || "object" === typeof input.interaction && null !== input.interaction && $io23(input.interaction)) && (undefined === input.thread || "object" === typeof input.thread && null !== input.thread && $iu1(input.thread)) && (undefined === input.components || Array.isArray(input.components) && input.components.every((elem: any) => "object" === typeof elem && null !== elem && $io40(elem))) && (undefined === input.sticker_items || Array.isArray(input.sticker_items) && input.sticker_items.every((elem: any) => "object" === typeof elem && null !== elem && $io50(elem))) && (undefined === input.stickers || Array.isArray(input.stickers) && $is_custom("deprecated", "array", "Use `sticker_items` instead", input.stickers) && input.stickers.every((elem: any) => "object" === typeof elem && null !== elem && $io51(elem))) && (undefined === input.position || "number" === typeof input.position) && (undefined === input.role_subscription_data || "object" === typeof input.role_subscription_data && null !== input.role_subscription_data && $io52(input.role_subscription_data));
        const $io1 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.username && "string" === typeof input.discriminator && (null === input.global_name || "string" === typeof input.global_name) && (null === input.avatar || "string" === typeof input.avatar) && (undefined === input.bot || "boolean" === typeof input.bot) && (undefined === input.system || "boolean" === typeof input.system) && (undefined === input.mfa_enabled || "boolean" === typeof input.mfa_enabled) && (null === input.banner || undefined === input.banner || "string" === typeof input.banner) && (null === input.accent_color || undefined === input.accent_color || "number" === typeof input.accent_color) && (undefined === input.locale || "string" === typeof input.locale) && (undefined === input.verified || "boolean" === typeof input.verified) && (null === input.email || undefined === input.email || "string" === typeof input.email) && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || 1024 === input.flags || 8192 === input.flags || 16384 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 2097152 === input.flags || 4194304 === input.flags || 17592186044416 === input.flags || 1125899906842624 === input.flags || 2251799813685248 === input.flags) && (undefined === input.premium_type || 0 === input.premium_type || 1 === input.premium_type || 2 === input.premium_type || 3 === input.premium_type) && (undefined === input.public_flags || 1 === input.public_flags || 2 === input.public_flags || 4 === input.public_flags || 8 === input.public_flags || 16 === input.public_flags || 32 === input.public_flags || 64 === input.public_flags || 128 === input.public_flags || 256 === input.public_flags || 512 === input.public_flags || 1024 === input.public_flags || 8192 === input.public_flags || 16384 === input.public_flags || 65536 === input.public_flags || 131072 === input.public_flags || 262144 === input.public_flags || 524288 === input.public_flags || 1048576 === input.public_flags || 2097152 === input.public_flags || 4194304 === input.public_flags || 17592186044416 === input.public_flags || 1125899906842624 === input.public_flags || 2251799813685248 === input.public_flags) && (null === input.avatar_decoration || undefined === input.avatar_decoration || "string" === typeof input.avatar_decoration);
        const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.guild_id && (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 13 === input.type || 14 === input.type || 15 === input.type) && "string" === typeof input.name;
        const $io3 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.filename && (undefined === input.description || "string" === typeof input.description) && (undefined === input.content_type || "string" === typeof input.content_type) && "number" === typeof input.size && "string" === typeof input.url && "string" === typeof input.proxy_url && (null === input.height || undefined === input.height || "number" === typeof input.height) && (null === input.width || undefined === input.width || "number" === typeof input.width) && (undefined === input.ephemeral || "boolean" === typeof input.ephemeral) && (undefined === input.duration_secs || "number" === typeof input.duration_secs) && (undefined === input.waveform || "string" === typeof input.waveform) && (undefined === input.flags || 4 === input.flags);
        const $io4 = (input: any): boolean => (undefined === input.title || "string" === typeof input.title) && (undefined === input.type || "rich" === input.type || "image" === input.type || "video" === input.type || "gifv" === input.type || "article" === input.type || "link" === input.type || "auto_moderation_message" === input.type) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.url || "string" === typeof input.url) && (undefined === input.timestamp || "string" === typeof input.timestamp) && (undefined === input.color || "number" === typeof input.color) && (undefined === input.footer || "object" === typeof input.footer && null !== input.footer && $io5(input.footer)) && (undefined === input.image || "object" === typeof input.image && null !== input.image && $io6(input.image)) && (undefined === input.thumbnail || "object" === typeof input.thumbnail && null !== input.thumbnail && $io7(input.thumbnail)) && (undefined === input.video || "object" === typeof input.video && null !== input.video && false === Array.isArray(input.video) && $io8(input.video)) && (undefined === input.provider || "object" === typeof input.provider && null !== input.provider && false === Array.isArray(input.provider) && $io9(input.provider)) && (undefined === input.author || "object" === typeof input.author && null !== input.author && $io10(input.author)) && (undefined === input.fields || Array.isArray(input.fields) && input.fields.every((elem: any) => "object" === typeof elem && null !== elem && $io11(elem)));
        const $io5 = (input: any): boolean => "string" === typeof input.text && (undefined === input.icon_url || "string" === typeof input.icon_url) && (undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url);
        const $io6 = (input: any): boolean => "string" === typeof input.url && (undefined === input.proxy_url || "string" === typeof input.proxy_url) && (undefined === input.height || "number" === typeof input.height) && (undefined === input.width || "number" === typeof input.width);
        const $io7 = (input: any): boolean => "string" === typeof input.url && (undefined === input.proxy_url || "string" === typeof input.proxy_url) && (undefined === input.height || "number" === typeof input.height) && (undefined === input.width || "number" === typeof input.width);
        const $io8 = (input: any): boolean => (undefined === input.url || "string" === typeof input.url) && (undefined === input.proxy_url || "string" === typeof input.proxy_url) && (undefined === input.height || "number" === typeof input.height) && (undefined === input.width || "number" === typeof input.width);
        const $io9 = (input: any): boolean => (undefined === input.name || "string" === typeof input.name) && (undefined === input.url || "string" === typeof input.url);
        const $io10 = (input: any): boolean => "string" === typeof input.name && (undefined === input.url || "string" === typeof input.url) && (undefined === input.icon_url || "string" === typeof input.icon_url) && (undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url);
        const $io11 = (input: any): boolean => "string" === typeof input.name && "string" === typeof input.value && (undefined === input.inline || "boolean" === typeof input.inline);
        const $io12 = (input: any): boolean => "number" === typeof input.count && "boolean" === typeof input.me && ("object" === typeof input.emoji && null !== input.emoji && $io13(input.emoji));
        const $io13 = (input: any): boolean => (null === input.id || "string" === typeof input.id) && (null === input.name || "string" === typeof input.name) && (undefined === input.animated || "boolean" === typeof input.animated);
        const $io14 = (input: any): boolean => (1 === input.type || 2 === input.type || 3 === input.type || 5 === input.type) && (undefined === input.party_id || "string" === typeof input.party_id);
        const $io15 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && (undefined === input.name || "string" === typeof input.name) && (null === input.icon || undefined === input.icon || "string" === typeof input.icon) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.rpc_origins || Array.isArray(input.rpc_origins) && input.rpc_origins.every((elem: any) => "string" === typeof elem)) && (undefined === input.bot_public || "boolean" === typeof input.bot_public) && (undefined === input.bot_require_code_grant || "boolean" === typeof input.bot_require_code_grant) && (undefined === input.terms_of_service_url || "string" === typeof input.terms_of_service_url) && (undefined === input.privacy_policy_url || "string" === typeof input.privacy_policy_url) && (undefined === input.owner || "object" === typeof input.owner && null !== input.owner && $io1(input.owner)) && (undefined === input.summary || "string" === typeof input.summary && $is_custom("deprecated", "string", "This field will be removed in v11", input.summary)) && (undefined === input.verify_key || "string" === typeof input.verify_key) && (null === input.team || undefined === input.team || "object" === typeof input.team && null !== input.team && $io16(input.team)) && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.primary_sku_id || "string" === typeof input.primary_sku_id) && (undefined === input.slug || "string" === typeof input.slug) && (undefined === input.cover_image || "string" === typeof input.cover_image) && (undefined === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 64 === input.flags || 2048 === input.flags || 4096 === input.flags || 8192 === input.flags || 16384 === input.flags || 32768 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 8388608 === input.flags) && (undefined === input.tags || Array.isArray(input.tags) && (1 <= input.tags.length && 5 >= input.tags.length && "string" === typeof input.tags[0] && (undefined === input.tags[1] || "string" === typeof input.tags[1]) && (undefined === input.tags[2] || "string" === typeof input.tags[2]) && (undefined === input.tags[3] || "string" === typeof input.tags[3]) && (undefined === input.tags[4] || "string" === typeof input.tags[4]))) && (undefined === input.install_params || "object" === typeof input.install_params && null !== input.install_params && $io18(input.install_params)) && (undefined === input.custom_install_url || "string" === typeof input.custom_install_url) && (undefined === input.role_connections_verification_url || "string" === typeof input.role_connections_verification_url) && (undefined === input.approximate_guild_count || "number" === typeof input.approximate_guild_count) && (undefined === input.guild || "object" === typeof input.guild && null !== input.guild && $io19(input.guild));
        const $io16 = (input: any): boolean => (null === input.icon || "string" === typeof input.icon) && "string" === typeof input.id && (Array.isArray(input.members) && input.members.every((elem: any) => "object" === typeof elem && null !== elem && $io17(elem))) && "string" === typeof input.name && "string" === typeof input.owner_user_id;
        const $io17 = (input: any): boolean => (1 === input.membership_state || 2 === input.membership_state) && (Array.isArray(input.permissions) && (input.permissions.length === 1 && "*" === input.permissions[0])) && "string" === typeof input.team_id && ("object" === typeof input.user && null !== input.user && $io1(input.user));
        const $io18 = (input: any): boolean => Array.isArray(input.scopes) && input.scopes.every((elem: any) => "bot" === elem || "connections" === elem || "dm_channels.read" === elem || "email" === elem || "identify" === elem || "guilds" === elem || "guilds.join" === elem || "guilds.members.read" === elem || "gdm.join" === elem || "messages.read" === elem || "role_connections.write" === elem || "rpc" === elem || "rpc.notifications.read" === elem || "webhook.incoming" === elem || "voice" === elem || "applications.builds.upload" === elem || "applications.builds.read" === elem || "applications.store.update" === elem || "applications.entitlements" === elem || "relationships.read" === elem || "activities.read" === elem || "activities.write" === elem || "applications.commands" === elem || "applications.commands.update" === elem || "applications.commands.permissions.update" === elem) && "string" === typeof input.permissions;
        const $io19 = (input: any): boolean => "string" === typeof input.name && (null === input.icon || "string" === typeof input.icon) && (null === input.splash || "string" === typeof input.splash) && (null === input.banner || undefined === input.banner || "string" === typeof input.banner) && (null === input.description || undefined === input.description || "string" === typeof input.description) && (undefined === input.features || Array.isArray(input.features) && input.features.every((elem: any) => "ANIMATED_BANNER" === elem || "ANIMATED_ICON" === elem || "APPLICATION_COMMAND_PERMISSIONS_V2" === elem || "AUTO_MODERATION" === elem || "BANNER" === elem || "COMMUNITY" === elem || "CREATOR_MONETIZABLE_PROVISIONAL" === elem || "CREATOR_STORE_PAGE" === elem || "DEVELOPER_SUPPORT_SERVER" === elem || "DISCOVERABLE" === elem || "FEATURABLE" === elem || "HAS_DIRECTORY_ENTRY" === elem || "HUB" === elem || "INVITES_DISABLED" === elem || "INVITE_SPLASH" === elem || "LINKED_TO_HUB" === elem || "MEMBER_VERIFICATION_GATE_ENABLED" === elem || "MONETIZATION_ENABLED" === elem || "MORE_STICKERS" === elem || "NEWS" === elem || "PARTNERED" === elem || "PREVIEW_ENABLED" === elem || "PRIVATE_THREADS" === elem || "RAID_ALERTS_DISABLED" === elem || "RELAY_ENABLED" === elem || "ROLE_ICONS" === elem || "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE" === elem || "ROLE_SUBSCRIPTIONS_ENABLED" === elem || "TICKETED_EVENTS_ENABLED" === elem || "VANITY_URL" === elem || "VERIFIED" === elem || "VIP_REGIONS" === elem || "WELCOME_SCREEN_ENABLED" === elem)) && (undefined === input.verification_level || 0 === input.verification_level || 1 === input.verification_level || 2 === input.verification_level || 3 === input.verification_level || 4 === input.verification_level) && (null === input.vanity_url_code || undefined === input.vanity_url_code || "string" === typeof input.vanity_url_code) && "string" === typeof input.id && (undefined === input.welcome_screen || "object" === typeof input.welcome_screen && null !== input.welcome_screen && $io20(input.welcome_screen));
        const $io20 = (input: any): boolean => (null === input.description || "string" === typeof input.description) && (Array.isArray(input.welcome_channels) && input.welcome_channels.every((elem: any) => "object" === typeof elem && null !== elem && $io21(elem)));
        const $io21 = (input: any): boolean => "string" === typeof input.channel_id && "string" === typeof input.description && (null === input.emoji_id || "string" === typeof input.emoji_id) && (null === input.emoji_name || "string" === typeof input.emoji_name);
        const $io22 = (input: any): boolean => (undefined === input.message_id || "string" === typeof input.message_id) && "string" === typeof input.channel_id && (undefined === input.guild_id || "string" === typeof input.guild_id);
        const $io23 = (input: any): boolean => "string" === typeof input.id && (1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type) && "string" === typeof input.name && ("object" === typeof input.user && null !== input.user && $io1(input.user)) && (undefined === input.member || "object" === typeof input.member && null !== input.member && $io24(input.member));
        const $io24 = (input: any): boolean => Array.isArray(input.roles) && input.roles.every((elem: any) => "string" === typeof elem) && (null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since) && (undefined === input.pending || "boolean" === typeof input.pending) && (null === input.nick || undefined === input.nick || "string" === typeof input.nick) && "boolean" === typeof input.mute && "string" === typeof input.joined_at && "boolean" === typeof input.deaf && (null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until) && (null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar);
        const $io25 = (input: any): boolean => (null === input.name || "string" === typeof input.name) && (undefined === input.application_id || "string" === typeof input.application_id) && (null === input.icon || undefined === input.icon || "string" === typeof input.icon) && (undefined === input.owner_id || "string" === typeof input.owner_id) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (undefined === input.managed || "boolean" === typeof input.managed) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 3 === input.type && (undefined === input.recipients || Array.isArray(input.recipients) && input.recipients.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem)));
        const $io26 = (input: any): boolean => undefined !== input.name && null === input.name && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 1 === input.type && (undefined === input.recipients || Array.isArray(input.recipients) && input.recipients.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem)));
        const $io27 = (input: any): boolean => (undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration) && (undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user) && (null === input.topic || undefined === input.topic || "string" === typeof input.topic) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 0 === input.type && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io28 = (input: any): boolean => "string" === typeof input.id && (0 === input.type || 1 === input.type) && "string" === typeof input.allow && "string" === typeof input.deny;
        const $io29 = (input: any): boolean => (undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration) && (undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user) && (null === input.topic || undefined === input.topic || "string" === typeof input.topic) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 5 === input.type && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io30 = (input: any): boolean => (undefined === input.bitrate || "number" === typeof input.bitrate) && (undefined === input.user_limit || "number" === typeof input.user_limit) && (null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region) && (undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode) && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && 2 === input.type && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id);
        const $io31 = (input: any): boolean => (undefined === input.bitrate || "number" === typeof input.bitrate) && (undefined === input.user_limit || "number" === typeof input.user_limit) && (null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region) && (undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode) && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && 13 === input.type && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id);
        const $io32 = (input: any): boolean => "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && 4 === input.type;
        const $io33 = (input: any): boolean => (undefined === input.member || "object" === typeof input.member && null !== input.member && $io34(input.member)) && (undefined === input.thread_metadata || "object" === typeof input.thread_metadata && null !== input.thread_metadata && $io36(input.thread_metadata)) && (undefined === input.message_count || "number" === typeof input.message_count) && (undefined === input.member_count || "number" === typeof input.member_count) && (undefined === input.owner_id || "string" === typeof input.owner_id) && (undefined === input.total_message_sent || "number" === typeof input.total_message_sent) && (Array.isArray(input.applied_tags) && input.applied_tags.every((elem: any) => "string" === typeof elem)) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && (10 === input.type || 11 === input.type || 12 === input.type) && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io34 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && (undefined === input.user_id || "string" === typeof input.user_id) && "string" === typeof input.join_timestamp && (1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags) && (undefined === input.member || "object" === typeof input.member && null !== input.member && $io35(input.member));
        const $io35 = (input: any): boolean => (undefined === input.user || "object" === typeof input.user && null !== input.user && $io1(input.user)) && (null === input.nick || undefined === input.nick || "string" === typeof input.nick) && (null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar) && (Array.isArray(input.roles) && input.roles.every((elem: any) => "string" === typeof elem)) && "string" === typeof input.joined_at && (null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since) && "boolean" === typeof input.deaf && "boolean" === typeof input.mute && (1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags) && (undefined === input.pending || "boolean" === typeof input.pending) && (null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until);
        const $io36 = (input: any): boolean => "boolean" === typeof input.archived && (60 === input.auto_archive_duration || 1440 === input.auto_archive_duration || 4320 === input.auto_archive_duration || 10080 === input.auto_archive_duration) && "string" === typeof input.archive_timestamp && (undefined === input.locked || "boolean" === typeof input.locked) && (undefined === input.invitable || "boolean" === typeof input.invitable) && (undefined === input.create_timestamp || "string" === typeof input.create_timestamp);
        const $io37 = (input: any): boolean => Array.isArray(input.available_tags) && input.available_tags.every((elem: any) => "object" === typeof elem && null !== elem && $io38(elem)) && (null === input.default_reaction_emoji || "object" === typeof input.default_reaction_emoji && null !== input.default_reaction_emoji && $io39(input.default_reaction_emoji)) && (null === input.default_sort_order || 0 === input.default_sort_order || 1 === input.default_sort_order) && (0 === input.default_forum_layout || 1 === input.default_forum_layout || 2 === input.default_forum_layout) && (undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration) && (undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user) && (null === input.topic || undefined === input.topic || "string" === typeof input.topic) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 15 === input.type && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io38 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && "boolean" === typeof input.moderated && (null === input.emoji_id || "string" === typeof input.emoji_id) && (null === input.emoji_name || "string" === typeof input.emoji_name);
        const $io39 = (input: any): boolean => (null === input.emoji_id || "string" === typeof input.emoji_id) && (null === input.emoji_name || "string" === typeof input.emoji_name);
        const $io40 = (input: any): boolean => Array.isArray(input.components) && input.components.every((elem: any) => "object" === typeof elem && null !== elem && $iu0(elem)) && 1 === input.type;
        const $io41 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.label || "string" === typeof input.label) && (1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style) && (undefined === input.emoji || "object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) && $io42(input.emoji)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 2 === input.type;
        const $io42 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && (undefined === input.name || "string" === typeof input.name) && (undefined === input.animated || "boolean" === typeof input.animated);
        const $io43 = (input: any): boolean => "string" === typeof input.url && (undefined === input.label || "string" === typeof input.label) && 5 === input.style && (undefined === input.emoji || "object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) && $io42(input.emoji)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 2 === input.type;
        const $io44 = (input: any): boolean => Array.isArray(input.options) && input.options.every((elem: any) => "object" === typeof elem && null !== elem && $io45(elem)) && "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 3 === input.type;
        const $io45 = (input: any): boolean => "string" === typeof input.label && "string" === typeof input.value && (undefined === input.description || "string" === typeof input.description) && (undefined === input.emoji || "object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) && $io42(input.emoji)) && (undefined === input["default"] || "boolean" === typeof input["default"]);
        const $io46 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 5 === input.type;
        const $io47 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 6 === input.type;
        const $io48 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 7 === input.type;
        const $io49 = (input: any): boolean => (undefined === input.channel_types || Array.isArray(input.channel_types) && input.channel_types.every((elem: any) => 0 === elem || 1 === elem || 2 === elem || 3 === elem || 4 === elem || 5 === elem || 10 === elem || 11 === elem || 12 === elem || 13 === elem || 14 === elem || 15 === elem)) && "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 8 === input.type;
        const $io50 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type);
        const $io51 = (input: any): boolean => "string" === typeof input.id && (undefined === input.pack_id || "string" === typeof input.pack_id) && "string" === typeof input.name && (null === input.description || "string" === typeof input.description) && "string" === typeof input.tags && (undefined === input.asset || "" === input.asset) && (1 === input.type || 2 === input.type) && (1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type) && (undefined === input.available || "boolean" === typeof input.available) && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.user || "object" === typeof input.user && null !== input.user && $io1(input.user)) && (undefined === input.sort_value || "number" === typeof input.sort_value);
        const $io52 = (input: any): boolean => "string" === typeof input.role_subscription_listing_id && "string" === typeof input.tier_name && "number" === typeof input.total_months_subscribed && "boolean" === typeof input.is_renewal;
        const $iu0 = (input: any): any => (() => {
            if (1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style)
                return $io41(input);
            if (5 === input.style)
                return $io43(input);
            if (3 === input.type)
                return $io44(input);
            if (7 === input.type)
                return $io48(input);
            if (6 === input.type)
                return $io47(input);
            if (5 === input.type)
                return $io46(input);
            if (8 === input.type)
                return $io49(input);
            return false;
        })();
        const $iu1 = (input: any): any => (() => {
            if (3 === input.type)
                return $io25(input);
            if (1 === input.type)
                return $io26(input);
            if (5 === input.type)
                return $io29(input);
            if (0 === input.type)
                return $io27(input);
            if (13 === input.type)
                return $io31(input);
            if (2 === input.type)
                return $io30(input);
            if (4 === input.type)
                return $io32(input);
            if (10 === input.type || 11 === input.type || 12 === input.type)
                return $io33(input);
            if (undefined !== input.default_sort_order)
                return $io37(input);
            return false;
        })();
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is RESTPatchAPIChannelMessageResult => {
            const $is_custom = (typia.createValidate as any).is_custom;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), ("object" === typeof input.author && null !== input.author || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "APIUser",
                    value: input.author
                })) && $vo1(input.author, _path + ".author", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "APIUser",
                    value: input.author
                }), "string" === typeof input.content || $report(_exceptionable, {
                    path: _path + ".content",
                    expected: "string",
                    value: input.content
                }), "string" === typeof input.timestamp || $report(_exceptionable, {
                    path: _path + ".timestamp",
                    expected: "string",
                    value: input.timestamp
                }), null === input.edited_timestamp || "string" === typeof input.edited_timestamp || $report(_exceptionable, {
                    path: _path + ".edited_timestamp",
                    expected: "(null | string)",
                    value: input.edited_timestamp
                }), "boolean" === typeof input.tts || $report(_exceptionable, {
                    path: _path + ".tts",
                    expected: "boolean",
                    value: input.tts
                }), "boolean" === typeof input.mention_everyone || $report(_exceptionable, {
                    path: _path + ".mention_everyone",
                    expected: "boolean",
                    value: input.mention_everyone
                }), (Array.isArray(input.mentions) || $report(_exceptionable, {
                    path: _path + ".mentions",
                    expected: "Array<APIUser>",
                    value: input.mentions
                })) && input.mentions.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".mentions[" + _index1 + "]",
                    expected: "APIUser",
                    value: elem
                })) && $vo1(elem, _path + ".mentions[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".mentions[" + _index1 + "]",
                    expected: "APIUser",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".mentions",
                    expected: "Array<APIUser>",
                    value: input.mentions
                }), (Array.isArray(input.mention_roles) || $report(_exceptionable, {
                    path: _path + ".mention_roles",
                    expected: "Array<string>",
                    value: input.mention_roles
                })) && input.mention_roles.map((elem: any, _index2: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".mention_roles[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".mention_roles",
                    expected: "Array<string>",
                    value: input.mention_roles
                }), undefined === input.mention_channels || (Array.isArray(input.mention_channels) || $report(_exceptionable, {
                    path: _path + ".mention_channels",
                    expected: "(Array<APIChannelMention> | undefined)",
                    value: input.mention_channels
                })) && input.mention_channels.map((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".mention_channels[" + _index3 + "]",
                    expected: "APIChannelMention",
                    value: elem
                })) && $vo2(elem, _path + ".mention_channels[" + _index3 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".mention_channels[" + _index3 + "]",
                    expected: "APIChannelMention",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".mention_channels",
                    expected: "(Array<APIChannelMention> | undefined)",
                    value: input.mention_channels
                }), (Array.isArray(input.attachments) || $report(_exceptionable, {
                    path: _path + ".attachments",
                    expected: "Array<APIAttachment>",
                    value: input.attachments
                })) && input.attachments.map((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".attachments[" + _index4 + "]",
                    expected: "APIAttachment",
                    value: elem
                })) && $vo3(elem, _path + ".attachments[" + _index4 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".attachments[" + _index4 + "]",
                    expected: "APIAttachment",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".attachments",
                    expected: "Array<APIAttachment>",
                    value: input.attachments
                }), (Array.isArray(input.embeds) || $report(_exceptionable, {
                    path: _path + ".embeds",
                    expected: "Array<APIEmbed>",
                    value: input.embeds
                })) && input.embeds.map((elem: any, _index5: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $report(_exceptionable, {
                    path: _path + ".embeds[" + _index5 + "]",
                    expected: "APIEmbed",
                    value: elem
                })) && $vo4(elem, _path + ".embeds[" + _index5 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".embeds[" + _index5 + "]",
                    expected: "APIEmbed",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".embeds",
                    expected: "Array<APIEmbed>",
                    value: input.embeds
                }), undefined === input.reactions || (Array.isArray(input.reactions) || $report(_exceptionable, {
                    path: _path + ".reactions",
                    expected: "(Array<APIReaction> | undefined)",
                    value: input.reactions
                })) && input.reactions.map((elem: any, _index6: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".reactions[" + _index6 + "]",
                    expected: "APIReaction",
                    value: elem
                })) && $vo12(elem, _path + ".reactions[" + _index6 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".reactions[" + _index6 + "]",
                    expected: "APIReaction",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".reactions",
                    expected: "(Array<APIReaction> | undefined)",
                    value: input.reactions
                }), undefined === input.nonce || "string" === typeof input.nonce || "number" === typeof input.nonce || $report(_exceptionable, {
                    path: _path + ".nonce",
                    expected: "(number | string | undefined)",
                    value: input.nonce
                }), "boolean" === typeof input.pinned || $report(_exceptionable, {
                    path: _path + ".pinned",
                    expected: "boolean",
                    value: input.pinned
                }), undefined === input.webhook_id || "string" === typeof input.webhook_id || $report(_exceptionable, {
                    path: _path + ".webhook_id",
                    expected: "(string | undefined)",
                    value: input.webhook_id
                }), 0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 6 === input.type || 7 === input.type || 8 === input.type || 9 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 14 === input.type || 15 === input.type || 16 === input.type || 17 === input.type || 18 === input.type || 19 === input.type || 20 === input.type || 21 === input.type || 22 === input.type || 23 === input.type || 24 === input.type || 25 === input.type || 26 === input.type || 27 === input.type || 28 === input.type || 29 === input.type || 30 === input.type || 31 === input.type || 32 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(0 | 1 | 10 | 11 | 12 | 14 | 15 | 16 | 17 | 18 | 19 | 2 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 3 | 30 | 31 | 32 | 4 | 5 | 6 | 7 | 8 | 9)",
                    value: input.type
                }), undefined === input.activity || ("object" === typeof input.activity && null !== input.activity || $report(_exceptionable, {
                    path: _path + ".activity",
                    expected: "(APIMessageActivity | undefined)",
                    value: input.activity
                })) && $vo14(input.activity, _path + ".activity", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".activity",
                    expected: "(APIMessageActivity | undefined)",
                    value: input.activity
                }), undefined === input.application || ("object" === typeof input.application && null !== input.application && false === Array.isArray(input.application) || $report(_exceptionable, {
                    path: _path + ".application",
                    expected: "(Partial<APIApplication> | undefined)",
                    value: input.application
                })) && $vo15(input.application, _path + ".application", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".application",
                    expected: "(Partial<APIApplication> | undefined)",
                    value: input.application
                }), undefined === input.application_id || "string" === typeof input.application_id || $report(_exceptionable, {
                    path: _path + ".application_id",
                    expected: "(string | undefined)",
                    value: input.application_id
                }), undefined === input.message_reference || ("object" === typeof input.message_reference && null !== input.message_reference || $report(_exceptionable, {
                    path: _path + ".message_reference",
                    expected: "(APIMessageReference | undefined)",
                    value: input.message_reference
                })) && $vo22(input.message_reference, _path + ".message_reference", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".message_reference",
                    expected: "(APIMessageReference | undefined)",
                    value: input.message_reference
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 1024 === input.flags || 4096 === input.flags || 8192 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 1024 | 128 | 16 | 2 | 256 | 32 | 4 | 4096 | 64 | 8 | 8192 | undefined)",
                    value: input.flags
                }), null === input.referenced_message || undefined === input.referenced_message || ("object" === typeof input.referenced_message && null !== input.referenced_message || $report(_exceptionable, {
                    path: _path + ".referenced_message",
                    expected: "(APIMessage | null | undefined)",
                    value: input.referenced_message
                })) && $vo0(input.referenced_message, _path + ".referenced_message", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".referenced_message",
                    expected: "(APIMessage | null | undefined)",
                    value: input.referenced_message
                }), undefined === input.interaction || ("object" === typeof input.interaction && null !== input.interaction || $report(_exceptionable, {
                    path: _path + ".interaction",
                    expected: "(APIMessageInteraction | undefined)",
                    value: input.interaction
                })) && $vo23(input.interaction, _path + ".interaction", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".interaction",
                    expected: "(APIMessageInteraction | undefined)",
                    value: input.interaction
                }), undefined === input.thread || ("object" === typeof input.thread && null !== input.thread || $report(_exceptionable, {
                    path: _path + ".thread",
                    expected: "(APIDMChannel | APIGroupDMChannel | APIGuildCategoryChannel | APIGuildForumChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APINewsChannel | APITextChannel | APIThreadChannel | undefined)",
                    value: input.thread
                })) && $vu1(input.thread, _path + ".thread", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".thread",
                    expected: "(APIDMChannel | APIGroupDMChannel | APIGuildCategoryChannel | APIGuildForumChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APINewsChannel | APITextChannel | APIThreadChannel | undefined)",
                    value: input.thread
                }), undefined === input.components || (Array.isArray(input.components) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "(Array<APIActionRowComponent<APIMessageActionRowComponent>> | undefined)",
                    value: input.components
                })) && input.components.map((elem: any, _index7: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".components[" + _index7 + "]",
                    expected: "APIActionRowComponent<APIMessageActionRowComponent>",
                    value: elem
                })) && $vo40(elem, _path + ".components[" + _index7 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".components[" + _index7 + "]",
                    expected: "APIActionRowComponent<APIMessageActionRowComponent>",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "(Array<APIActionRowComponent<APIMessageActionRowComponent>> | undefined)",
                    value: input.components
                }), undefined === input.sticker_items || (Array.isArray(input.sticker_items) || $report(_exceptionable, {
                    path: _path + ".sticker_items",
                    expected: "(Array<APIStickerItem> | undefined)",
                    value: input.sticker_items
                })) && input.sticker_items.map((elem: any, _index8: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".sticker_items[" + _index8 + "]",
                    expected: "APIStickerItem",
                    value: elem
                })) && $vo50(elem, _path + ".sticker_items[" + _index8 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".sticker_items[" + _index8 + "]",
                    expected: "APIStickerItem",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".sticker_items",
                    expected: "(Array<APIStickerItem> | undefined)",
                    value: input.sticker_items
                }), undefined === input.stickers || (Array.isArray(input.stickers) && ($is_custom("deprecated", "array", "Use `sticker_items` instead", input.stickers) || $report(_exceptionable, {
                    path: _path + ".stickers",
                    expected: "Array (@deprecated Use `sticker_items` instead)",
                    value: input.stickers
                })) || $report(_exceptionable, {
                    path: _path + ".stickers",
                    expected: "(Array<APISticker> | undefined)",
                    value: input.stickers
                })) && input.stickers.map((elem: any, _index9: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".stickers[" + _index9 + "]",
                    expected: "APISticker",
                    value: elem
                })) && $vo51(elem, _path + ".stickers[" + _index9 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".stickers[" + _index9 + "]",
                    expected: "APISticker",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".stickers",
                    expected: "(Array<APISticker> | undefined)",
                    value: input.stickers
                }), undefined === input.position || "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "(number | undefined)",
                    value: input.position
                }), undefined === input.role_subscription_data || ("object" === typeof input.role_subscription_data && null !== input.role_subscription_data || $report(_exceptionable, {
                    path: _path + ".role_subscription_data",
                    expected: "(APIMessageRoleSubscriptionData | undefined)",
                    value: input.role_subscription_data
                })) && $vo52(input.role_subscription_data, _path + ".role_subscription_data", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".role_subscription_data",
                    expected: "(APIMessageRoleSubscriptionData | undefined)",
                    value: input.role_subscription_data
                })].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.username || $report(_exceptionable, {
                    path: _path + ".username",
                    expected: "string",
                    value: input.username
                }), "string" === typeof input.discriminator || $report(_exceptionable, {
                    path: _path + ".discriminator",
                    expected: "string",
                    value: input.discriminator
                }), null === input.global_name || "string" === typeof input.global_name || $report(_exceptionable, {
                    path: _path + ".global_name",
                    expected: "(null | string)",
                    value: input.global_name
                }), null === input.avatar || "string" === typeof input.avatar || $report(_exceptionable, {
                    path: _path + ".avatar",
                    expected: "(null | string)",
                    value: input.avatar
                }), undefined === input.bot || "boolean" === typeof input.bot || $report(_exceptionable, {
                    path: _path + ".bot",
                    expected: "(boolean | undefined)",
                    value: input.bot
                }), undefined === input.system || "boolean" === typeof input.system || $report(_exceptionable, {
                    path: _path + ".system",
                    expected: "(boolean | undefined)",
                    value: input.system
                }), undefined === input.mfa_enabled || "boolean" === typeof input.mfa_enabled || $report(_exceptionable, {
                    path: _path + ".mfa_enabled",
                    expected: "(boolean | undefined)",
                    value: input.mfa_enabled
                }), null === input.banner || undefined === input.banner || "string" === typeof input.banner || $report(_exceptionable, {
                    path: _path + ".banner",
                    expected: "(null | string | undefined)",
                    value: input.banner
                }), null === input.accent_color || undefined === input.accent_color || "number" === typeof input.accent_color || $report(_exceptionable, {
                    path: _path + ".accent_color",
                    expected: "(null | number | undefined)",
                    value: input.accent_color
                }), undefined === input.locale || "string" === typeof input.locale || $report(_exceptionable, {
                    path: _path + ".locale",
                    expected: "(string | undefined)",
                    value: input.locale
                }), undefined === input.verified || "boolean" === typeof input.verified || $report(_exceptionable, {
                    path: _path + ".verified",
                    expected: "(boolean | undefined)",
                    value: input.verified
                }), null === input.email || undefined === input.email || "string" === typeof input.email || $report(_exceptionable, {
                    path: _path + ".email",
                    expected: "(null | string | undefined)",
                    value: input.email
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || 1024 === input.flags || 8192 === input.flags || 16384 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 2097152 === input.flags || 4194304 === input.flags || 17592186044416 === input.flags || 1125899906842624 === input.flags || 2251799813685248 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 1024 | 1048576 | 1125899906842624 | 128 | 131072 | 16 | 16384 | 17592186044416 | 2 | 2097152 | 2251799813685248 | 256 | 262144 | 32 | 4 | 4194304 | 512 | 524288 | 64 | 65536 | 8 | 8192 | undefined)",
                    value: input.flags
                }), undefined === input.premium_type || 0 === input.premium_type || 1 === input.premium_type || 2 === input.premium_type || 3 === input.premium_type || $report(_exceptionable, {
                    path: _path + ".premium_type",
                    expected: "(0 | 1 | 2 | 3 | undefined)",
                    value: input.premium_type
                }), undefined === input.public_flags || 1 === input.public_flags || 2 === input.public_flags || 4 === input.public_flags || 8 === input.public_flags || 16 === input.public_flags || 32 === input.public_flags || 64 === input.public_flags || 128 === input.public_flags || 256 === input.public_flags || 512 === input.public_flags || 1024 === input.public_flags || 8192 === input.public_flags || 16384 === input.public_flags || 65536 === input.public_flags || 131072 === input.public_flags || 262144 === input.public_flags || 524288 === input.public_flags || 1048576 === input.public_flags || 2097152 === input.public_flags || 4194304 === input.public_flags || 17592186044416 === input.public_flags || 1125899906842624 === input.public_flags || 2251799813685248 === input.public_flags || $report(_exceptionable, {
                    path: _path + ".public_flags",
                    expected: "(1 | 1024 | 1048576 | 1125899906842624 | 128 | 131072 | 16 | 16384 | 17592186044416 | 2 | 2097152 | 2251799813685248 | 256 | 262144 | 32 | 4 | 4194304 | 512 | 524288 | 64 | 65536 | 8 | 8192 | undefined)",
                    value: input.public_flags
                }), null === input.avatar_decoration || undefined === input.avatar_decoration || "string" === typeof input.avatar_decoration || $report(_exceptionable, {
                    path: _path + ".avatar_decoration",
                    expected: "(null | string | undefined)",
                    value: input.avatar_decoration
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "string",
                    value: input.guild_id
                }), 0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 13 === input.type || 14 === input.type || 15 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(0 | 1 | 10 | 11 | 12 | 13 | 14 | 15 | 2 | 3 | 4 | 5)",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                })].every((flag: boolean) => flag);
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.filename || $report(_exceptionable, {
                    path: _path + ".filename",
                    expected: "string",
                    value: input.filename
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.content_type || "string" === typeof input.content_type || $report(_exceptionable, {
                    path: _path + ".content_type",
                    expected: "(string | undefined)",
                    value: input.content_type
                }), "number" === typeof input.size || $report(_exceptionable, {
                    path: _path + ".size",
                    expected: "number",
                    value: input.size
                }), "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "string",
                    value: input.proxy_url
                }), null === input.height || undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(null | number | undefined)",
                    value: input.height
                }), null === input.width || undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(null | number | undefined)",
                    value: input.width
                }), undefined === input.ephemeral || "boolean" === typeof input.ephemeral || $report(_exceptionable, {
                    path: _path + ".ephemeral",
                    expected: "(boolean | undefined)",
                    value: input.ephemeral
                }), undefined === input.duration_secs || "number" === typeof input.duration_secs || $report(_exceptionable, {
                    path: _path + ".duration_secs",
                    expected: "(number | undefined)",
                    value: input.duration_secs
                }), undefined === input.waveform || "string" === typeof input.waveform || $report(_exceptionable, {
                    path: _path + ".waveform",
                    expected: "(string | undefined)",
                    value: input.waveform
                }), undefined === input.flags || 4 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(4 | undefined)",
                    value: input.flags
                })].every((flag: boolean) => flag);
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.title || "string" === typeof input.title || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "(string | undefined)",
                    value: input.title
                }), undefined === input.type || "rich" === input.type || "image" === input.type || "video" === input.type || "gifv" === input.type || "article" === input.type || "link" === input.type || "auto_moderation_message" === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(\"article\" | \"auto_moderation_message\" | \"gifv\" | \"image\" | \"link\" | \"rich\" | \"video\" | undefined)",
                    value: input.type
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                }), undefined === input.timestamp || "string" === typeof input.timestamp || $report(_exceptionable, {
                    path: _path + ".timestamp",
                    expected: "(string | undefined)",
                    value: input.timestamp
                }), undefined === input.color || "number" === typeof input.color || $report(_exceptionable, {
                    path: _path + ".color",
                    expected: "(number | undefined)",
                    value: input.color
                }), undefined === input.footer || ("object" === typeof input.footer && null !== input.footer || $report(_exceptionable, {
                    path: _path + ".footer",
                    expected: "(APIEmbedFooter | undefined)",
                    value: input.footer
                })) && $vo5(input.footer, _path + ".footer", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".footer",
                    expected: "(APIEmbedFooter | undefined)",
                    value: input.footer
                }), undefined === input.image || ("object" === typeof input.image && null !== input.image || $report(_exceptionable, {
                    path: _path + ".image",
                    expected: "(APIEmbedImage | undefined)",
                    value: input.image
                })) && $vo6(input.image, _path + ".image", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".image",
                    expected: "(APIEmbedImage | undefined)",
                    value: input.image
                }), undefined === input.thumbnail || ("object" === typeof input.thumbnail && null !== input.thumbnail || $report(_exceptionable, {
                    path: _path + ".thumbnail",
                    expected: "(APIEmbedThumbnail | undefined)",
                    value: input.thumbnail
                })) && $vo7(input.thumbnail, _path + ".thumbnail", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".thumbnail",
                    expected: "(APIEmbedThumbnail | undefined)",
                    value: input.thumbnail
                }), undefined === input.video || ("object" === typeof input.video && null !== input.video && false === Array.isArray(input.video) || $report(_exceptionable, {
                    path: _path + ".video",
                    expected: "(APIEmbedVideo | undefined)",
                    value: input.video
                })) && $vo8(input.video, _path + ".video", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".video",
                    expected: "(APIEmbedVideo | undefined)",
                    value: input.video
                }), undefined === input.provider || ("object" === typeof input.provider && null !== input.provider && false === Array.isArray(input.provider) || $report(_exceptionable, {
                    path: _path + ".provider",
                    expected: "(APIEmbedProvider | undefined)",
                    value: input.provider
                })) && $vo9(input.provider, _path + ".provider", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".provider",
                    expected: "(APIEmbedProvider | undefined)",
                    value: input.provider
                }), undefined === input.author || ("object" === typeof input.author && null !== input.author || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "(APIEmbedAuthor | undefined)",
                    value: input.author
                })) && $vo10(input.author, _path + ".author", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "(APIEmbedAuthor | undefined)",
                    value: input.author
                }), undefined === input.fields || (Array.isArray(input.fields) || $report(_exceptionable, {
                    path: _path + ".fields",
                    expected: "(Array<APIEmbedField> | undefined)",
                    value: input.fields
                })) && input.fields.map((elem: any, _index10: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".fields[" + _index10 + "]",
                    expected: "APIEmbedField",
                    value: elem
                })) && $vo11(elem, _path + ".fields[" + _index10 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".fields[" + _index10 + "]",
                    expected: "APIEmbedField",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".fields",
                    expected: "(Array<APIEmbedField> | undefined)",
                    value: input.fields
                })].every((flag: boolean) => flag);
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.text || $report(_exceptionable, {
                    path: _path + ".text",
                    expected: "string",
                    value: input.text
                }), undefined === input.icon_url || "string" === typeof input.icon_url || $report(_exceptionable, {
                    path: _path + ".icon_url",
                    expected: "(string | undefined)",
                    value: input.icon_url
                }), undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url || $report(_exceptionable, {
                    path: _path + ".proxy_icon_url",
                    expected: "(string | undefined)",
                    value: input.proxy_icon_url
                })].every((flag: boolean) => flag);
            const $vo6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), undefined === input.proxy_url || "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "(string | undefined)",
                    value: input.proxy_url
                }), undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(number | undefined)",
                    value: input.height
                }), undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(number | undefined)",
                    value: input.width
                })].every((flag: boolean) => flag);
            const $vo7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), undefined === input.proxy_url || "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "(string | undefined)",
                    value: input.proxy_url
                }), undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(number | undefined)",
                    value: input.height
                }), undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(number | undefined)",
                    value: input.width
                })].every((flag: boolean) => flag);
            const $vo8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                }), undefined === input.proxy_url || "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "(string | undefined)",
                    value: input.proxy_url
                }), undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(number | undefined)",
                    value: input.height
                }), undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(number | undefined)",
                    value: input.width
                })].every((flag: boolean) => flag);
            const $vo9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                })].every((flag: boolean) => flag);
            const $vo10 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                }), undefined === input.icon_url || "string" === typeof input.icon_url || $report(_exceptionable, {
                    path: _path + ".icon_url",
                    expected: "(string | undefined)",
                    value: input.icon_url
                }), undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url || $report(_exceptionable, {
                    path: _path + ".proxy_icon_url",
                    expected: "(string | undefined)",
                    value: input.proxy_icon_url
                })].every((flag: boolean) => flag);
            const $vo11 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "string" === typeof input.value || $report(_exceptionable, {
                    path: _path + ".value",
                    expected: "string",
                    value: input.value
                }), undefined === input.inline || "boolean" === typeof input.inline || $report(_exceptionable, {
                    path: _path + ".inline",
                    expected: "(boolean | undefined)",
                    value: input.inline
                })].every((flag: boolean) => flag);
            const $vo12 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.count || $report(_exceptionable, {
                    path: _path + ".count",
                    expected: "number",
                    value: input.count
                }), "boolean" === typeof input.me || $report(_exceptionable, {
                    path: _path + ".me",
                    expected: "boolean",
                    value: input.me
                }), ("object" === typeof input.emoji && null !== input.emoji || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "APIPartialEmoji",
                    value: input.emoji
                })) && $vo13(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "APIPartialEmoji",
                    value: input.emoji
                })].every((flag: boolean) => flag);
            const $vo13 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(null | string)",
                    value: input.id
                }), null === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(null | string)",
                    value: input.name
                }), undefined === input.animated || "boolean" === typeof input.animated || $report(_exceptionable, {
                    path: _path + ".animated",
                    expected: "(boolean | undefined)",
                    value: input.animated
                })].every((flag: boolean) => flag);
            const $vo14 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [1 === input.type || 2 === input.type || 3 === input.type || 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(1 | 2 | 3 | 5)",
                    value: input.type
                }), undefined === input.party_id || "string" === typeof input.party_id || $report(_exceptionable, {
                    path: _path + ".party_id",
                    expected: "(string | undefined)",
                    value: input.party_id
                })].every((flag: boolean) => flag);
            const $vo15 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string | undefined)",
                    value: input.id
                }), undefined === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), null === input.icon || undefined === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string | undefined)",
                    value: input.icon
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.rpc_origins || (Array.isArray(input.rpc_origins) || $report(_exceptionable, {
                    path: _path + ".rpc_origins",
                    expected: "(Array<string> | undefined)",
                    value: input.rpc_origins
                })) && input.rpc_origins.map((elem: any, _index11: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".rpc_origins[" + _index11 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".rpc_origins",
                    expected: "(Array<string> | undefined)",
                    value: input.rpc_origins
                }), undefined === input.bot_public || "boolean" === typeof input.bot_public || $report(_exceptionable, {
                    path: _path + ".bot_public",
                    expected: "(boolean | undefined)",
                    value: input.bot_public
                }), undefined === input.bot_require_code_grant || "boolean" === typeof input.bot_require_code_grant || $report(_exceptionable, {
                    path: _path + ".bot_require_code_grant",
                    expected: "(boolean | undefined)",
                    value: input.bot_require_code_grant
                }), undefined === input.terms_of_service_url || "string" === typeof input.terms_of_service_url || $report(_exceptionable, {
                    path: _path + ".terms_of_service_url",
                    expected: "(string | undefined)",
                    value: input.terms_of_service_url
                }), undefined === input.privacy_policy_url || "string" === typeof input.privacy_policy_url || $report(_exceptionable, {
                    path: _path + ".privacy_policy_url",
                    expected: "(string | undefined)",
                    value: input.privacy_policy_url
                }), undefined === input.owner || ("object" === typeof input.owner && null !== input.owner || $report(_exceptionable, {
                    path: _path + ".owner",
                    expected: "(APIUser | undefined)",
                    value: input.owner
                })) && $vo1(input.owner, _path + ".owner", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".owner",
                    expected: "(APIUser | undefined)",
                    value: input.owner
                }), undefined === input.summary || "string" === typeof input.summary && ($is_custom("deprecated", "string", "This field will be removed in v11", input.summary) || $report(_exceptionable, {
                    path: _path + ".summary",
                    expected: "string (@deprecated This field will be removed in v11)",
                    value: input.summary
                })) || $report(_exceptionable, {
                    path: _path + ".summary",
                    expected: "(string | undefined)",
                    value: input.summary
                }), undefined === input.verify_key || "string" === typeof input.verify_key || $report(_exceptionable, {
                    path: _path + ".verify_key",
                    expected: "(string | undefined)",
                    value: input.verify_key
                }), null === input.team || undefined === input.team || ("object" === typeof input.team && null !== input.team || $report(_exceptionable, {
                    path: _path + ".team",
                    expected: "(APITeam | null | undefined)",
                    value: input.team
                })) && $vo16(input.team, _path + ".team", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".team",
                    expected: "(APITeam | null | undefined)",
                    value: input.team
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.primary_sku_id || "string" === typeof input.primary_sku_id || $report(_exceptionable, {
                    path: _path + ".primary_sku_id",
                    expected: "(string | undefined)",
                    value: input.primary_sku_id
                }), undefined === input.slug || "string" === typeof input.slug || $report(_exceptionable, {
                    path: _path + ".slug",
                    expected: "(string | undefined)",
                    value: input.slug
                }), undefined === input.cover_image || "string" === typeof input.cover_image || $report(_exceptionable, {
                    path: _path + ".cover_image",
                    expected: "(string | undefined)",
                    value: input.cover_image
                }), undefined === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 64 === input.flags || 2048 === input.flags || 4096 === input.flags || 8192 === input.flags || 16384 === input.flags || 32768 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 8388608 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1048576 | 131072 | 16 | 16384 | 2 | 2048 | 262144 | 32768 | 4 | 4096 | 524288 | 64 | 65536 | 8 | 8192 | 8388608 | undefined)",
                    value: input.flags
                }), undefined === input.tags || (Array.isArray(input.tags) || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "([string, (string | undefined)?, (string | undefined)?, (string | undefined)?, (string | undefined)?] | undefined)",
                    value: input.tags
                })) && ((1 <= input.tags.length && 5 >= input.tags.length || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "[string, (string | undefined), (string | undefined), (string | undefined), (string | undefined)]",
                    value: input.tags
                })) && [
                    "string" === typeof input.tags[0] || $report(_exceptionable, {
                        path: _path + ".tags[0]",
                        expected: "string",
                        value: input.tags[0]
                    }),
                    undefined === input.tags[1] || "string" === typeof input.tags[1] || $report(_exceptionable, {
                        path: _path + ".tags[1]",
                        expected: "(string | undefined)",
                        value: input.tags[1]
                    }),
                    undefined === input.tags[2] || "string" === typeof input.tags[2] || $report(_exceptionable, {
                        path: _path + ".tags[2]",
                        expected: "(string | undefined)",
                        value: input.tags[2]
                    }),
                    undefined === input.tags[3] || "string" === typeof input.tags[3] || $report(_exceptionable, {
                        path: _path + ".tags[3]",
                        expected: "(string | undefined)",
                        value: input.tags[3]
                    }),
                    undefined === input.tags[4] || "string" === typeof input.tags[4] || $report(_exceptionable, {
                        path: _path + ".tags[4]",
                        expected: "(string | undefined)",
                        value: input.tags[4]
                    })
                ].every((flag: boolean) => flag)) || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "([string, (string | undefined)?, (string | undefined)?, (string | undefined)?, (string | undefined)?] | undefined)",
                    value: input.tags
                }), undefined === input.install_params || ("object" === typeof input.install_params && null !== input.install_params || $report(_exceptionable, {
                    path: _path + ".install_params",
                    expected: "(APIApplicationInstallParams | undefined)",
                    value: input.install_params
                })) && $vo18(input.install_params, _path + ".install_params", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".install_params",
                    expected: "(APIApplicationInstallParams | undefined)",
                    value: input.install_params
                }), undefined === input.custom_install_url || "string" === typeof input.custom_install_url || $report(_exceptionable, {
                    path: _path + ".custom_install_url",
                    expected: "(string | undefined)",
                    value: input.custom_install_url
                }), undefined === input.role_connections_verification_url || "string" === typeof input.role_connections_verification_url || $report(_exceptionable, {
                    path: _path + ".role_connections_verification_url",
                    expected: "(string | undefined)",
                    value: input.role_connections_verification_url
                }), undefined === input.approximate_guild_count || "number" === typeof input.approximate_guild_count || $report(_exceptionable, {
                    path: _path + ".approximate_guild_count",
                    expected: "(number | undefined)",
                    value: input.approximate_guild_count
                }), undefined === input.guild || ("object" === typeof input.guild && null !== input.guild || $report(_exceptionable, {
                    path: _path + ".guild",
                    expected: "(APIPartialGuild | undefined)",
                    value: input.guild
                })) && $vo19(input.guild, _path + ".guild", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".guild",
                    expected: "(APIPartialGuild | undefined)",
                    value: input.guild
                })].every((flag: boolean) => flag);
            const $vo16 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string)",
                    value: input.icon
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), (Array.isArray(input.members) || $report(_exceptionable, {
                    path: _path + ".members",
                    expected: "Array<APITeamMember>",
                    value: input.members
                })) && input.members.map((elem: any, _index12: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".members[" + _index12 + "]",
                    expected: "APITeamMember",
                    value: elem
                })) && $vo17(elem, _path + ".members[" + _index12 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".members[" + _index12 + "]",
                    expected: "APITeamMember",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".members",
                    expected: "Array<APITeamMember>",
                    value: input.members
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "string" === typeof input.owner_user_id || $report(_exceptionable, {
                    path: _path + ".owner_user_id",
                    expected: "string",
                    value: input.owner_user_id
                })].every((flag: boolean) => flag);
            const $vo17 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [1 === input.membership_state || 2 === input.membership_state || $report(_exceptionable, {
                    path: _path + ".membership_state",
                    expected: "(1 | 2)",
                    value: input.membership_state
                }), (Array.isArray(input.permissions) || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "[\"*\"]",
                    value: input.permissions
                })) && ((input.permissions.length === 1 || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "[\"*\"]",
                    value: input.permissions
                })) && [
                    "*" === input.permissions[0] || $report(_exceptionable, {
                        path: _path + ".permissions[0]",
                        expected: "\"*\"",
                        value: input.permissions[0]
                    })
                ].every((flag: boolean) => flag)) || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "[\"*\"]",
                    value: input.permissions
                }), "string" === typeof input.team_id || $report(_exceptionable, {
                    path: _path + ".team_id",
                    expected: "string",
                    value: input.team_id
                }), ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                })].every((flag: boolean) => flag);
            const $vo18 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.scopes) || $report(_exceptionable, {
                    path: _path + ".scopes",
                    expected: "Array<OAuth2Scopes>",
                    value: input.scopes
                })) && input.scopes.map((elem: any, _index13: number) => "bot" === elem || "connections" === elem || "dm_channels.read" === elem || "email" === elem || "identify" === elem || "guilds" === elem || "guilds.join" === elem || "guilds.members.read" === elem || "gdm.join" === elem || "messages.read" === elem || "role_connections.write" === elem || "rpc" === elem || "rpc.notifications.read" === elem || "webhook.incoming" === elem || "voice" === elem || "applications.builds.upload" === elem || "applications.builds.read" === elem || "applications.store.update" === elem || "applications.entitlements" === elem || "relationships.read" === elem || "activities.read" === elem || "activities.write" === elem || "applications.commands" === elem || "applications.commands.update" === elem || "applications.commands.permissions.update" === elem || $report(_exceptionable, {
                    path: _path + ".scopes[" + _index13 + "]",
                    expected: "(\"activities.read\" | \"activities.write\" | \"applications.builds.read\" | \"applications.builds.upload\" | \"applications.commands\" | \"applications.commands.permissions.update\" | \"applications.commands.update\" | \"applications.entitlements\" | \"applications.store.update\" | \"bot\" | \"connections\" | \"dm_channels.read\" | \"email\" | \"gdm.join\" | \"guilds\" | \"guilds.join\" | \"guilds.members.read\" | \"identify\" | \"messages.read\" | \"relationships.read\" | \"role_connections.write\" | \"rpc\" | \"rpc.notifications.read\" | \"voice\" | \"webhook.incoming\")",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".scopes",
                    expected: "Array<OAuth2Scopes>",
                    value: input.scopes
                }), "string" === typeof input.permissions || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "string",
                    value: input.permissions
                })].every((flag: boolean) => flag);
            const $vo19 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), null === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string)",
                    value: input.icon
                }), null === input.splash || "string" === typeof input.splash || $report(_exceptionable, {
                    path: _path + ".splash",
                    expected: "(null | string)",
                    value: input.splash
                }), null === input.banner || undefined === input.banner || "string" === typeof input.banner || $report(_exceptionable, {
                    path: _path + ".banner",
                    expected: "(null | string | undefined)",
                    value: input.banner
                }), null === input.description || undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(null | string | undefined)",
                    value: input.description
                }), undefined === input.features || (Array.isArray(input.features) || $report(_exceptionable, {
                    path: _path + ".features",
                    expected: "(Array<GuildFeature> | undefined)",
                    value: input.features
                })) && input.features.map((elem: any, _index14: number) => "ANIMATED_BANNER" === elem || "ANIMATED_ICON" === elem || "APPLICATION_COMMAND_PERMISSIONS_V2" === elem || "AUTO_MODERATION" === elem || "BANNER" === elem || "COMMUNITY" === elem || "CREATOR_MONETIZABLE_PROVISIONAL" === elem || "CREATOR_STORE_PAGE" === elem || "DEVELOPER_SUPPORT_SERVER" === elem || "DISCOVERABLE" === elem || "FEATURABLE" === elem || "HAS_DIRECTORY_ENTRY" === elem || "HUB" === elem || "INVITES_DISABLED" === elem || "INVITE_SPLASH" === elem || "LINKED_TO_HUB" === elem || "MEMBER_VERIFICATION_GATE_ENABLED" === elem || "MONETIZATION_ENABLED" === elem || "MORE_STICKERS" === elem || "NEWS" === elem || "PARTNERED" === elem || "PREVIEW_ENABLED" === elem || "PRIVATE_THREADS" === elem || "RAID_ALERTS_DISABLED" === elem || "RELAY_ENABLED" === elem || "ROLE_ICONS" === elem || "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE" === elem || "ROLE_SUBSCRIPTIONS_ENABLED" === elem || "TICKETED_EVENTS_ENABLED" === elem || "VANITY_URL" === elem || "VERIFIED" === elem || "VIP_REGIONS" === elem || "WELCOME_SCREEN_ENABLED" === elem || $report(_exceptionable, {
                    path: _path + ".features[" + _index14 + "]",
                    expected: "(\"ANIMATED_BANNER\" | \"ANIMATED_ICON\" | \"APPLICATION_COMMAND_PERMISSIONS_V2\" | \"AUTO_MODERATION\" | \"BANNER\" | \"COMMUNITY\" | \"CREATOR_MONETIZABLE_PROVISIONAL\" | \"CREATOR_STORE_PAGE\" | \"DEVELOPER_SUPPORT_SERVER\" | \"DISCOVERABLE\" | \"FEATURABLE\" | \"HAS_DIRECTORY_ENTRY\" | \"HUB\" | \"INVITES_DISABLED\" | \"INVITE_SPLASH\" | \"LINKED_TO_HUB\" | \"MEMBER_VERIFICATION_GATE_ENABLED\" | \"MONETIZATION_ENABLED\" | \"MORE_STICKERS\" | \"NEWS\" | \"PARTNERED\" | \"PREVIEW_ENABLED\" | \"PRIVATE_THREADS\" | \"RAID_ALERTS_DISABLED\" | \"RELAY_ENABLED\" | \"ROLE_ICONS\" | \"ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE\" | \"ROLE_SUBSCRIPTIONS_ENABLED\" | \"TICKETED_EVENTS_ENABLED\" | \"VANITY_URL\" | \"VERIFIED\" | \"VIP_REGIONS\" | \"WELCOME_SCREEN_ENABLED\")",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".features",
                    expected: "(Array<GuildFeature> | undefined)",
                    value: input.features
                }), undefined === input.verification_level || 0 === input.verification_level || 1 === input.verification_level || 2 === input.verification_level || 3 === input.verification_level || 4 === input.verification_level || $report(_exceptionable, {
                    path: _path + ".verification_level",
                    expected: "(0 | 1 | 2 | 3 | 4 | undefined)",
                    value: input.verification_level
                }), null === input.vanity_url_code || undefined === input.vanity_url_code || "string" === typeof input.vanity_url_code || $report(_exceptionable, {
                    path: _path + ".vanity_url_code",
                    expected: "(null | string | undefined)",
                    value: input.vanity_url_code
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.welcome_screen || ("object" === typeof input.welcome_screen && null !== input.welcome_screen || $report(_exceptionable, {
                    path: _path + ".welcome_screen",
                    expected: "(APIGuildWelcomeScreen | undefined)",
                    value: input.welcome_screen
                })) && $vo20(input.welcome_screen, _path + ".welcome_screen", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".welcome_screen",
                    expected: "(APIGuildWelcomeScreen | undefined)",
                    value: input.welcome_screen
                })].every((flag: boolean) => flag);
            const $vo20 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(null | string)",
                    value: input.description
                }), (Array.isArray(input.welcome_channels) || $report(_exceptionable, {
                    path: _path + ".welcome_channels",
                    expected: "Array<APIGuildWelcomeScreenChannel>",
                    value: input.welcome_channels
                })) && input.welcome_channels.map((elem: any, _index15: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".welcome_channels[" + _index15 + "]",
                    expected: "APIGuildWelcomeScreenChannel",
                    value: elem
                })) && $vo21(elem, _path + ".welcome_channels[" + _index15 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".welcome_channels[" + _index15 + "]",
                    expected: "APIGuildWelcomeScreenChannel",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".welcome_channels",
                    expected: "Array<APIGuildWelcomeScreenChannel>",
                    value: input.welcome_channels
                })].every((flag: boolean) => flag);
            const $vo21 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "string",
                    value: input.description
                }), null === input.emoji_id || "string" === typeof input.emoji_id || $report(_exceptionable, {
                    path: _path + ".emoji_id",
                    expected: "(null | string)",
                    value: input.emoji_id
                }), null === input.emoji_name || "string" === typeof input.emoji_name || $report(_exceptionable, {
                    path: _path + ".emoji_name",
                    expected: "(null | string)",
                    value: input.emoji_name
                })].every((flag: boolean) => flag);
            const $vo22 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.message_id || "string" === typeof input.message_id || $report(_exceptionable, {
                    path: _path + ".message_id",
                    expected: "(string | undefined)",
                    value: input.message_id
                }), "string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                })].every((flag: boolean) => flag);
            const $vo23 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(1 | 2 | 3 | 4 | 5)",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                }), undefined === input.member || ("object" === typeof input.member && null !== input.member || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(PartialAPIMessageInteractionGuildMember | undefined)",
                    value: input.member
                })) && $vo24(input.member, _path + ".member", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(PartialAPIMessageInteractionGuildMember | undefined)",
                    value: input.member
                })].every((flag: boolean) => flag);
            const $vo24 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.roles) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                })) && input.roles.map((elem: any, _index16: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".roles[" + _index16 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                }), null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since || $report(_exceptionable, {
                    path: _path + ".premium_since",
                    expected: "(null | string | undefined)",
                    value: input.premium_since
                }), undefined === input.pending || "boolean" === typeof input.pending || $report(_exceptionable, {
                    path: _path + ".pending",
                    expected: "(boolean | undefined)",
                    value: input.pending
                }), null === input.nick || undefined === input.nick || "string" === typeof input.nick || $report(_exceptionable, {
                    path: _path + ".nick",
                    expected: "(null | string | undefined)",
                    value: input.nick
                }), "boolean" === typeof input.mute || $report(_exceptionable, {
                    path: _path + ".mute",
                    expected: "boolean",
                    value: input.mute
                }), "string" === typeof input.joined_at || $report(_exceptionable, {
                    path: _path + ".joined_at",
                    expected: "string",
                    value: input.joined_at
                }), "boolean" === typeof input.deaf || $report(_exceptionable, {
                    path: _path + ".deaf",
                    expected: "boolean",
                    value: input.deaf
                }), null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until || $report(_exceptionable, {
                    path: _path + ".communication_disabled_until",
                    expected: "(null | string | undefined)",
                    value: input.communication_disabled_until
                }), null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar || $report(_exceptionable, {
                    path: _path + ".avatar",
                    expected: "(null | string | undefined)",
                    value: input.avatar
                })].every((flag: boolean) => flag);
            const $vo25 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(null | string)",
                    value: input.name
                }), undefined === input.application_id || "string" === typeof input.application_id || $report(_exceptionable, {
                    path: _path + ".application_id",
                    expected: "(string | undefined)",
                    value: input.application_id
                }), null === input.icon || undefined === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string | undefined)",
                    value: input.icon
                }), undefined === input.owner_id || "string" === typeof input.owner_id || $report(_exceptionable, {
                    path: _path + ".owner_id",
                    expected: "(string | undefined)",
                    value: input.owner_id
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), undefined === input.managed || "boolean" === typeof input.managed || $report(_exceptionable, {
                    path: _path + ".managed",
                    expected: "(boolean | undefined)",
                    value: input.managed
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 3 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "3",
                    value: input.type
                }), undefined === input.recipients || (Array.isArray(input.recipients) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })) && input.recipients.map((elem: any, _index17: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index17 + "]",
                    expected: "APIUser",
                    value: elem
                })) && $vo1(elem, _path + ".recipients[" + _index17 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index17 + "]",
                    expected: "APIUser",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })].every((flag: boolean) => flag);
            const $vo26 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(undefined !== input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "null",
                    value: input.name
                })) && (null === input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "null",
                    value: input.name
                })), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 1 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "1",
                    value: input.type
                }), undefined === input.recipients || (Array.isArray(input.recipients) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })) && input.recipients.map((elem: any, _index18: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index18 + "]",
                    expected: "APIUser",
                    value: elem
                })) && $vo1(elem, _path + ".recipients[" + _index18 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index18 + "]",
                    expected: "APIUser",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })].every((flag: boolean) => flag);
            const $vo27 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".default_auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60 | undefined)",
                    value: input.default_auto_archive_duration
                }), undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".default_thread_rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.default_thread_rate_limit_per_user
                }), null === input.topic || undefined === input.topic || "string" === typeof input.topic || $report(_exceptionable, {
                    path: _path + ".topic",
                    expected: "(null | string | undefined)",
                    value: input.topic
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 0 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "0",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index19: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index19 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index19 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index19 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo28 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), 0 === input.type || 1 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(0 | 1)",
                    value: input.type
                }), "string" === typeof input.allow || $report(_exceptionable, {
                    path: _path + ".allow",
                    expected: "string",
                    value: input.allow
                }), "string" === typeof input.deny || $report(_exceptionable, {
                    path: _path + ".deny",
                    expected: "string",
                    value: input.deny
                })].every((flag: boolean) => flag);
            const $vo29 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".default_auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60 | undefined)",
                    value: input.default_auto_archive_duration
                }), undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".default_thread_rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.default_thread_rate_limit_per_user
                }), null === input.topic || undefined === input.topic || "string" === typeof input.topic || $report(_exceptionable, {
                    path: _path + ".topic",
                    expected: "(null | string | undefined)",
                    value: input.topic
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "5",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index20: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index20 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index20 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index20 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo30 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.bitrate || "number" === typeof input.bitrate || $report(_exceptionable, {
                    path: _path + ".bitrate",
                    expected: "(number | undefined)",
                    value: input.bitrate
                }), undefined === input.user_limit || "number" === typeof input.user_limit || $report(_exceptionable, {
                    path: _path + ".user_limit",
                    expected: "(number | undefined)",
                    value: input.user_limit
                }), null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region || $report(_exceptionable, {
                    path: _path + ".rtc_region",
                    expected: "(null | string | undefined)",
                    value: input.rtc_region
                }), undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode || $report(_exceptionable, {
                    path: _path + ".video_quality_mode",
                    expected: "(1 | 2 | undefined)",
                    value: input.video_quality_mode
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index21: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index21 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index21 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index21 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "2",
                    value: input.type
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                })].every((flag: boolean) => flag);
            const $vo31 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.bitrate || "number" === typeof input.bitrate || $report(_exceptionable, {
                    path: _path + ".bitrate",
                    expected: "(number | undefined)",
                    value: input.bitrate
                }), undefined === input.user_limit || "number" === typeof input.user_limit || $report(_exceptionable, {
                    path: _path + ".user_limit",
                    expected: "(number | undefined)",
                    value: input.user_limit
                }), null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region || $report(_exceptionable, {
                    path: _path + ".rtc_region",
                    expected: "(null | string | undefined)",
                    value: input.rtc_region
                }), undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode || $report(_exceptionable, {
                    path: _path + ".video_quality_mode",
                    expected: "(1 | 2 | undefined)",
                    value: input.video_quality_mode
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index22: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index22 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index22 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index22 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), 13 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "13",
                    value: input.type
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                })].every((flag: boolean) => flag);
            const $vo32 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index23: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index23 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index23 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index23 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), 4 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "4",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo33 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.member || ("object" === typeof input.member && null !== input.member || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIThreadMember | undefined)",
                    value: input.member
                })) && $vo34(input.member, _path + ".member", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIThreadMember | undefined)",
                    value: input.member
                }), undefined === input.thread_metadata || ("object" === typeof input.thread_metadata && null !== input.thread_metadata || $report(_exceptionable, {
                    path: _path + ".thread_metadata",
                    expected: "(APIThreadMetadata | undefined)",
                    value: input.thread_metadata
                })) && $vo36(input.thread_metadata, _path + ".thread_metadata", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".thread_metadata",
                    expected: "(APIThreadMetadata | undefined)",
                    value: input.thread_metadata
                }), undefined === input.message_count || "number" === typeof input.message_count || $report(_exceptionable, {
                    path: _path + ".message_count",
                    expected: "(number | undefined)",
                    value: input.message_count
                }), undefined === input.member_count || "number" === typeof input.member_count || $report(_exceptionable, {
                    path: _path + ".member_count",
                    expected: "(number | undefined)",
                    value: input.member_count
                }), undefined === input.owner_id || "string" === typeof input.owner_id || $report(_exceptionable, {
                    path: _path + ".owner_id",
                    expected: "(string | undefined)",
                    value: input.owner_id
                }), undefined === input.total_message_sent || "number" === typeof input.total_message_sent || $report(_exceptionable, {
                    path: _path + ".total_message_sent",
                    expected: "(number | undefined)",
                    value: input.total_message_sent
                }), (Array.isArray(input.applied_tags) || $report(_exceptionable, {
                    path: _path + ".applied_tags",
                    expected: "Array<string>",
                    value: input.applied_tags
                })) && input.applied_tags.map((elem: any, _index24: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".applied_tags[" + _index24 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".applied_tags",
                    expected: "Array<string>",
                    value: input.applied_tags
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 10 === input.type || 11 === input.type || 12 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(10 | 11 | 12)",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index25: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index25 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index25 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index25 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo34 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string | undefined)",
                    value: input.id
                }), undefined === input.user_id || "string" === typeof input.user_id || $report(_exceptionable, {
                    path: _path + ".user_id",
                    expected: "(string | undefined)",
                    value: input.user_id
                }), "string" === typeof input.join_timestamp || $report(_exceptionable, {
                    path: _path + ".join_timestamp",
                    expected: "string",
                    value: input.join_timestamp
                }), 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 2 | 4 | 8)",
                    value: input.flags
                }), undefined === input.member || ("object" === typeof input.member && null !== input.member || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIGuildMember | undefined)",
                    value: input.member
                })) && $vo35(input.member, _path + ".member", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIGuildMember | undefined)",
                    value: input.member
                })].every((flag: boolean) => flag);
            const $vo35 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.user || ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                }), null === input.nick || undefined === input.nick || "string" === typeof input.nick || $report(_exceptionable, {
                    path: _path + ".nick",
                    expected: "(null | string | undefined)",
                    value: input.nick
                }), null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar || $report(_exceptionable, {
                    path: _path + ".avatar",
                    expected: "(null | string | undefined)",
                    value: input.avatar
                }), (Array.isArray(input.roles) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                })) && input.roles.map((elem: any, _index26: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".roles[" + _index26 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                }), "string" === typeof input.joined_at || $report(_exceptionable, {
                    path: _path + ".joined_at",
                    expected: "string",
                    value: input.joined_at
                }), null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since || $report(_exceptionable, {
                    path: _path + ".premium_since",
                    expected: "(null | string | undefined)",
                    value: input.premium_since
                }), "boolean" === typeof input.deaf || $report(_exceptionable, {
                    path: _path + ".deaf",
                    expected: "boolean",
                    value: input.deaf
                }), "boolean" === typeof input.mute || $report(_exceptionable, {
                    path: _path + ".mute",
                    expected: "boolean",
                    value: input.mute
                }), 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 2 | 256 | 32 | 4 | 64 | 8)",
                    value: input.flags
                }), undefined === input.pending || "boolean" === typeof input.pending || $report(_exceptionable, {
                    path: _path + ".pending",
                    expected: "(boolean | undefined)",
                    value: input.pending
                }), null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until || $report(_exceptionable, {
                    path: _path + ".communication_disabled_until",
                    expected: "(null | string | undefined)",
                    value: input.communication_disabled_until
                })].every((flag: boolean) => flag);
            const $vo36 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["boolean" === typeof input.archived || $report(_exceptionable, {
                    path: _path + ".archived",
                    expected: "boolean",
                    value: input.archived
                }), 60 === input.auto_archive_duration || 1440 === input.auto_archive_duration || 4320 === input.auto_archive_duration || 10080 === input.auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60)",
                    value: input.auto_archive_duration
                }), "string" === typeof input.archive_timestamp || $report(_exceptionable, {
                    path: _path + ".archive_timestamp",
                    expected: "string",
                    value: input.archive_timestamp
                }), undefined === input.locked || "boolean" === typeof input.locked || $report(_exceptionable, {
                    path: _path + ".locked",
                    expected: "(boolean | undefined)",
                    value: input.locked
                }), undefined === input.invitable || "boolean" === typeof input.invitable || $report(_exceptionable, {
                    path: _path + ".invitable",
                    expected: "(boolean | undefined)",
                    value: input.invitable
                }), undefined === input.create_timestamp || "string" === typeof input.create_timestamp || $report(_exceptionable, {
                    path: _path + ".create_timestamp",
                    expected: "(string | undefined)",
                    value: input.create_timestamp
                })].every((flag: boolean) => flag);
            const $vo37 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.available_tags) || $report(_exceptionable, {
                    path: _path + ".available_tags",
                    expected: "Array<APIGuildForumTag>",
                    value: input.available_tags
                })) && input.available_tags.map((elem: any, _index27: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".available_tags[" + _index27 + "]",
                    expected: "APIGuildForumTag",
                    value: elem
                })) && $vo38(elem, _path + ".available_tags[" + _index27 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".available_tags[" + _index27 + "]",
                    expected: "APIGuildForumTag",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".available_tags",
                    expected: "Array<APIGuildForumTag>",
                    value: input.available_tags
                }), null === input.default_reaction_emoji || ("object" === typeof input.default_reaction_emoji && null !== input.default_reaction_emoji || $report(_exceptionable, {
                    path: _path + ".default_reaction_emoji",
                    expected: "(APIGuildForumDefaultReactionEmoji | null)",
                    value: input.default_reaction_emoji
                })) && $vo39(input.default_reaction_emoji, _path + ".default_reaction_emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".default_reaction_emoji",
                    expected: "(APIGuildForumDefaultReactionEmoji | null)",
                    value: input.default_reaction_emoji
                }), null === input.default_sort_order || 0 === input.default_sort_order || 1 === input.default_sort_order || $report(_exceptionable, {
                    path: _path + ".default_sort_order",
                    expected: "(0 | 1 | null)",
                    value: input.default_sort_order
                }), 0 === input.default_forum_layout || 1 === input.default_forum_layout || 2 === input.default_forum_layout || $report(_exceptionable, {
                    path: _path + ".default_forum_layout",
                    expected: "(0 | 1 | 2)",
                    value: input.default_forum_layout
                }), undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".default_auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60 | undefined)",
                    value: input.default_auto_archive_duration
                }), undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".default_thread_rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.default_thread_rate_limit_per_user
                }), null === input.topic || undefined === input.topic || "string" === typeof input.topic || $report(_exceptionable, {
                    path: _path + ".topic",
                    expected: "(null | string | undefined)",
                    value: input.topic
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 15 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "15",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index28: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index28 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index28 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index28 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo38 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "boolean" === typeof input.moderated || $report(_exceptionable, {
                    path: _path + ".moderated",
                    expected: "boolean",
                    value: input.moderated
                }), null === input.emoji_id || "string" === typeof input.emoji_id || $report(_exceptionable, {
                    path: _path + ".emoji_id",
                    expected: "(null | string)",
                    value: input.emoji_id
                }), null === input.emoji_name || "string" === typeof input.emoji_name || $report(_exceptionable, {
                    path: _path + ".emoji_name",
                    expected: "(null | string)",
                    value: input.emoji_name
                })].every((flag: boolean) => flag);
            const $vo39 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.emoji_id || "string" === typeof input.emoji_id || $report(_exceptionable, {
                    path: _path + ".emoji_id",
                    expected: "(null | string)",
                    value: input.emoji_id
                }), null === input.emoji_name || "string" === typeof input.emoji_name || $report(_exceptionable, {
                    path: _path + ".emoji_name",
                    expected: "(null | string)",
                    value: input.emoji_name
                })].every((flag: boolean) => flag);
            const $vo40 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.components) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "Array<APIMessageActionRowComponent>",
                    value: input.components
                })) && input.components.map((elem: any, _index29: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".components[" + _index29 + "]",
                    expected: "(APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIChannelSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIStringSelectComponent | APIUserSelectComponent)",
                    value: elem
                })) && $vu0(elem, _path + ".components[" + _index29 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".components[" + _index29 + "]",
                    expected: "(APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIChannelSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIStringSelectComponent | APIUserSelectComponent)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "Array<APIMessageActionRowComponent>",
                    value: input.components
                }), 1 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "1",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo41 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.label || "string" === typeof input.label || $report(_exceptionable, {
                    path: _path + ".label",
                    expected: "(string | undefined)",
                    value: input.label
                }), 1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style || $report(_exceptionable, {
                    path: _path + ".style",
                    expected: "(1 | 2 | 3 | 4)",
                    value: input.style
                }), undefined === input.emoji || ("object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                })) && $vo42(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "2",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo42 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string | undefined)",
                    value: input.id
                }), undefined === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), undefined === input.animated || "boolean" === typeof input.animated || $report(_exceptionable, {
                    path: _path + ".animated",
                    expected: "(boolean | undefined)",
                    value: input.animated
                })].every((flag: boolean) => flag);
            const $vo43 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), undefined === input.label || "string" === typeof input.label || $report(_exceptionable, {
                    path: _path + ".label",
                    expected: "(string | undefined)",
                    value: input.label
                }), 5 === input.style || $report(_exceptionable, {
                    path: _path + ".style",
                    expected: "5",
                    value: input.style
                }), undefined === input.emoji || ("object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                })) && $vo42(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "2",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo44 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.options) || $report(_exceptionable, {
                    path: _path + ".options",
                    expected: "Array<APISelectMenuOption>",
                    value: input.options
                })) && input.options.map((elem: any, _index30: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".options[" + _index30 + "]",
                    expected: "APISelectMenuOption",
                    value: elem
                })) && $vo45(elem, _path + ".options[" + _index30 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".options[" + _index30 + "]",
                    expected: "APISelectMenuOption",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".options",
                    expected: "Array<APISelectMenuOption>",
                    value: input.options
                }), "string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 3 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "3",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo45 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.label || $report(_exceptionable, {
                    path: _path + ".label",
                    expected: "string",
                    value: input.label
                }), "string" === typeof input.value || $report(_exceptionable, {
                    path: _path + ".value",
                    expected: "string",
                    value: input.value
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.emoji || ("object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                })) && $vo42(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                }), undefined === input["default"] || "boolean" === typeof input["default"] || $report(_exceptionable, {
                    path: _path + "[\"default\"]",
                    expected: "(boolean | undefined)",
                    value: input["default"]
                })].every((flag: boolean) => flag);
            const $vo46 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "5",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo47 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 6 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "6",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo48 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 7 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "7",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo49 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.channel_types || (Array.isArray(input.channel_types) || $report(_exceptionable, {
                    path: _path + ".channel_types",
                    expected: "(Array<ChannelType> | undefined)",
                    value: input.channel_types
                })) && input.channel_types.map((elem: any, _index31: number) => 0 === elem || 1 === elem || 2 === elem || 3 === elem || 4 === elem || 5 === elem || 10 === elem || 11 === elem || 12 === elem || 13 === elem || 14 === elem || 15 === elem || $report(_exceptionable, {
                    path: _path + ".channel_types[" + _index31 + "]",
                    expected: "(0 | 1 | 10 | 11 | 12 | 13 | 14 | 15 | 2 | 3 | 4 | 5)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".channel_types",
                    expected: "(Array<ChannelType> | undefined)",
                    value: input.channel_types
                }), "string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 8 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "8",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo50 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), 1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type || $report(_exceptionable, {
                    path: _path + ".format_type",
                    expected: "(1 | 2 | 3 | 4)",
                    value: input.format_type
                })].every((flag: boolean) => flag);
            const $vo51 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.pack_id || "string" === typeof input.pack_id || $report(_exceptionable, {
                    path: _path + ".pack_id",
                    expected: "(string | undefined)",
                    value: input.pack_id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), null === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(null | string)",
                    value: input.description
                }), "string" === typeof input.tags || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "string",
                    value: input.tags
                }), undefined === input.asset || "" === input.asset || $report(_exceptionable, {
                    path: _path + ".asset",
                    expected: "(\"\" | undefined)",
                    value: input.asset
                }), 1 === input.type || 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(1 | 2)",
                    value: input.type
                }), 1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type || $report(_exceptionable, {
                    path: _path + ".format_type",
                    expected: "(1 | 2 | 3 | 4)",
                    value: input.format_type
                }), undefined === input.available || "boolean" === typeof input.available || $report(_exceptionable, {
                    path: _path + ".available",
                    expected: "(boolean | undefined)",
                    value: input.available
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.user || ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                }), undefined === input.sort_value || "number" === typeof input.sort_value || $report(_exceptionable, {
                    path: _path + ".sort_value",
                    expected: "(number | undefined)",
                    value: input.sort_value
                })].every((flag: boolean) => flag);
            const $vo52 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.role_subscription_listing_id || $report(_exceptionable, {
                    path: _path + ".role_subscription_listing_id",
                    expected: "string",
                    value: input.role_subscription_listing_id
                }), "string" === typeof input.tier_name || $report(_exceptionable, {
                    path: _path + ".tier_name",
                    expected: "string",
                    value: input.tier_name
                }), "number" === typeof input.total_months_subscribed || $report(_exceptionable, {
                    path: _path + ".total_months_subscribed",
                    expected: "number",
                    value: input.total_months_subscribed
                }), "boolean" === typeof input.is_renewal || $report(_exceptionable, {
                    path: _path + ".is_renewal",
                    expected: "boolean",
                    value: input.is_renewal
                })].every((flag: boolean) => flag);
            const $vu0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if (1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style)
                    return $vo41(input, _path, true && _exceptionable);
                if (5 === input.style)
                    return $vo43(input, _path, true && _exceptionable);
                if (3 === input.type)
                    return $vo44(input, _path, true && _exceptionable);
                if (7 === input.type)
                    return $vo48(input, _path, true && _exceptionable);
                if (6 === input.type)
                    return $vo47(input, _path, true && _exceptionable);
                if (5 === input.type)
                    return $vo46(input, _path, true && _exceptionable);
                if (8 === input.type)
                    return $vo49(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIStringSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIUserSelectComponent | APIChannelSelectComponent)",
                    value: input
                });
            })();
            const $vu1 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if (3 === input.type)
                    return $vo25(input, _path, true && _exceptionable);
                if (1 === input.type)
                    return $vo26(input, _path, true && _exceptionable);
                if (5 === input.type)
                    return $vo29(input, _path, true && _exceptionable);
                if (0 === input.type)
                    return $vo27(input, _path, true && _exceptionable);
                if (13 === input.type)
                    return $vo31(input, _path, true && _exceptionable);
                if (2 === input.type)
                    return $vo30(input, _path, true && _exceptionable);
                if (4 === input.type)
                    return $vo32(input, _path, true && _exceptionable);
                if (10 === input.type || 11 === input.type || 12 === input.type)
                    return $vo33(input, _path, true && _exceptionable);
                if (undefined !== input.default_sort_order)
                    return $vo37(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(APIGroupDMChannel | APIDMChannel | APINewsChannel | APITextChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APIGuildCategoryChannel | APIThreadChannel | APIGuildForumChannel)",
                    value: input
                });
            })();
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "APIMessage",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "APIMessage",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
export const validateRESTPostAPIChannelMessageResult = (input: any): typia.IValidation<RESTPostAPIChannelMessageResult> => {
    const errors = [] as any[];
    const __is = (input: any): input is RESTPostAPIChannelMessageResult => {
        const $is_custom = (typia.createValidate as any).is_custom;
        const $io0 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.channel_id && ("object" === typeof input.author && null !== input.author && $io1(input.author)) && "string" === typeof input.content && "string" === typeof input.timestamp && (null === input.edited_timestamp || "string" === typeof input.edited_timestamp) && "boolean" === typeof input.tts && "boolean" === typeof input.mention_everyone && (Array.isArray(input.mentions) && input.mentions.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem))) && (Array.isArray(input.mention_roles) && input.mention_roles.every((elem: any) => "string" === typeof elem)) && (undefined === input.mention_channels || Array.isArray(input.mention_channels) && input.mention_channels.every((elem: any) => "object" === typeof elem && null !== elem && $io2(elem))) && (Array.isArray(input.attachments) && input.attachments.every((elem: any) => "object" === typeof elem && null !== elem && $io3(elem))) && (Array.isArray(input.embeds) && input.embeds.every((elem: any) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io4(elem))) && (undefined === input.reactions || Array.isArray(input.reactions) && input.reactions.every((elem: any) => "object" === typeof elem && null !== elem && $io12(elem))) && (undefined === input.nonce || "string" === typeof input.nonce || "number" === typeof input.nonce) && "boolean" === typeof input.pinned && (undefined === input.webhook_id || "string" === typeof input.webhook_id) && (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 6 === input.type || 7 === input.type || 8 === input.type || 9 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 14 === input.type || 15 === input.type || 16 === input.type || 17 === input.type || 18 === input.type || 19 === input.type || 20 === input.type || 21 === input.type || 22 === input.type || 23 === input.type || 24 === input.type || 25 === input.type || 26 === input.type || 27 === input.type || 28 === input.type || 29 === input.type || 30 === input.type || 31 === input.type || 32 === input.type) && (undefined === input.activity || "object" === typeof input.activity && null !== input.activity && $io14(input.activity)) && (undefined === input.application || "object" === typeof input.application && null !== input.application && false === Array.isArray(input.application) && $io15(input.application)) && (undefined === input.application_id || "string" === typeof input.application_id) && (undefined === input.message_reference || "object" === typeof input.message_reference && null !== input.message_reference && $io22(input.message_reference)) && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 1024 === input.flags || 4096 === input.flags || 8192 === input.flags) && (null === input.referenced_message || undefined === input.referenced_message || "object" === typeof input.referenced_message && null !== input.referenced_message && $io0(input.referenced_message)) && (undefined === input.interaction || "object" === typeof input.interaction && null !== input.interaction && $io23(input.interaction)) && (undefined === input.thread || "object" === typeof input.thread && null !== input.thread && $iu1(input.thread)) && (undefined === input.components || Array.isArray(input.components) && input.components.every((elem: any) => "object" === typeof elem && null !== elem && $io40(elem))) && (undefined === input.sticker_items || Array.isArray(input.sticker_items) && input.sticker_items.every((elem: any) => "object" === typeof elem && null !== elem && $io50(elem))) && (undefined === input.stickers || Array.isArray(input.stickers) && $is_custom("deprecated", "array", "Use `sticker_items` instead", input.stickers) && input.stickers.every((elem: any) => "object" === typeof elem && null !== elem && $io51(elem))) && (undefined === input.position || "number" === typeof input.position) && (undefined === input.role_subscription_data || "object" === typeof input.role_subscription_data && null !== input.role_subscription_data && $io52(input.role_subscription_data));
        const $io1 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.username && "string" === typeof input.discriminator && (null === input.global_name || "string" === typeof input.global_name) && (null === input.avatar || "string" === typeof input.avatar) && (undefined === input.bot || "boolean" === typeof input.bot) && (undefined === input.system || "boolean" === typeof input.system) && (undefined === input.mfa_enabled || "boolean" === typeof input.mfa_enabled) && (null === input.banner || undefined === input.banner || "string" === typeof input.banner) && (null === input.accent_color || undefined === input.accent_color || "number" === typeof input.accent_color) && (undefined === input.locale || "string" === typeof input.locale) && (undefined === input.verified || "boolean" === typeof input.verified) && (null === input.email || undefined === input.email || "string" === typeof input.email) && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || 1024 === input.flags || 8192 === input.flags || 16384 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 2097152 === input.flags || 4194304 === input.flags || 17592186044416 === input.flags || 1125899906842624 === input.flags || 2251799813685248 === input.flags) && (undefined === input.premium_type || 0 === input.premium_type || 1 === input.premium_type || 2 === input.premium_type || 3 === input.premium_type) && (undefined === input.public_flags || 1 === input.public_flags || 2 === input.public_flags || 4 === input.public_flags || 8 === input.public_flags || 16 === input.public_flags || 32 === input.public_flags || 64 === input.public_flags || 128 === input.public_flags || 256 === input.public_flags || 512 === input.public_flags || 1024 === input.public_flags || 8192 === input.public_flags || 16384 === input.public_flags || 65536 === input.public_flags || 131072 === input.public_flags || 262144 === input.public_flags || 524288 === input.public_flags || 1048576 === input.public_flags || 2097152 === input.public_flags || 4194304 === input.public_flags || 17592186044416 === input.public_flags || 1125899906842624 === input.public_flags || 2251799813685248 === input.public_flags) && (null === input.avatar_decoration || undefined === input.avatar_decoration || "string" === typeof input.avatar_decoration);
        const $io2 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.guild_id && (0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 13 === input.type || 14 === input.type || 15 === input.type) && "string" === typeof input.name;
        const $io3 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.filename && (undefined === input.description || "string" === typeof input.description) && (undefined === input.content_type || "string" === typeof input.content_type) && "number" === typeof input.size && "string" === typeof input.url && "string" === typeof input.proxy_url && (null === input.height || undefined === input.height || "number" === typeof input.height) && (null === input.width || undefined === input.width || "number" === typeof input.width) && (undefined === input.ephemeral || "boolean" === typeof input.ephemeral) && (undefined === input.duration_secs || "number" === typeof input.duration_secs) && (undefined === input.waveform || "string" === typeof input.waveform) && (undefined === input.flags || 4 === input.flags);
        const $io4 = (input: any): boolean => (undefined === input.title || "string" === typeof input.title) && (undefined === input.type || "rich" === input.type || "image" === input.type || "video" === input.type || "gifv" === input.type || "article" === input.type || "link" === input.type || "auto_moderation_message" === input.type) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.url || "string" === typeof input.url) && (undefined === input.timestamp || "string" === typeof input.timestamp) && (undefined === input.color || "number" === typeof input.color) && (undefined === input.footer || "object" === typeof input.footer && null !== input.footer && $io5(input.footer)) && (undefined === input.image || "object" === typeof input.image && null !== input.image && $io6(input.image)) && (undefined === input.thumbnail || "object" === typeof input.thumbnail && null !== input.thumbnail && $io7(input.thumbnail)) && (undefined === input.video || "object" === typeof input.video && null !== input.video && false === Array.isArray(input.video) && $io8(input.video)) && (undefined === input.provider || "object" === typeof input.provider && null !== input.provider && false === Array.isArray(input.provider) && $io9(input.provider)) && (undefined === input.author || "object" === typeof input.author && null !== input.author && $io10(input.author)) && (undefined === input.fields || Array.isArray(input.fields) && input.fields.every((elem: any) => "object" === typeof elem && null !== elem && $io11(elem)));
        const $io5 = (input: any): boolean => "string" === typeof input.text && (undefined === input.icon_url || "string" === typeof input.icon_url) && (undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url);
        const $io6 = (input: any): boolean => "string" === typeof input.url && (undefined === input.proxy_url || "string" === typeof input.proxy_url) && (undefined === input.height || "number" === typeof input.height) && (undefined === input.width || "number" === typeof input.width);
        const $io7 = (input: any): boolean => "string" === typeof input.url && (undefined === input.proxy_url || "string" === typeof input.proxy_url) && (undefined === input.height || "number" === typeof input.height) && (undefined === input.width || "number" === typeof input.width);
        const $io8 = (input: any): boolean => (undefined === input.url || "string" === typeof input.url) && (undefined === input.proxy_url || "string" === typeof input.proxy_url) && (undefined === input.height || "number" === typeof input.height) && (undefined === input.width || "number" === typeof input.width);
        const $io9 = (input: any): boolean => (undefined === input.name || "string" === typeof input.name) && (undefined === input.url || "string" === typeof input.url);
        const $io10 = (input: any): boolean => "string" === typeof input.name && (undefined === input.url || "string" === typeof input.url) && (undefined === input.icon_url || "string" === typeof input.icon_url) && (undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url);
        const $io11 = (input: any): boolean => "string" === typeof input.name && "string" === typeof input.value && (undefined === input.inline || "boolean" === typeof input.inline);
        const $io12 = (input: any): boolean => "number" === typeof input.count && "boolean" === typeof input.me && ("object" === typeof input.emoji && null !== input.emoji && $io13(input.emoji));
        const $io13 = (input: any): boolean => (null === input.id || "string" === typeof input.id) && (null === input.name || "string" === typeof input.name) && (undefined === input.animated || "boolean" === typeof input.animated);
        const $io14 = (input: any): boolean => (1 === input.type || 2 === input.type || 3 === input.type || 5 === input.type) && (undefined === input.party_id || "string" === typeof input.party_id);
        const $io15 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && (undefined === input.name || "string" === typeof input.name) && (null === input.icon || undefined === input.icon || "string" === typeof input.icon) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.rpc_origins || Array.isArray(input.rpc_origins) && input.rpc_origins.every((elem: any) => "string" === typeof elem)) && (undefined === input.bot_public || "boolean" === typeof input.bot_public) && (undefined === input.bot_require_code_grant || "boolean" === typeof input.bot_require_code_grant) && (undefined === input.terms_of_service_url || "string" === typeof input.terms_of_service_url) && (undefined === input.privacy_policy_url || "string" === typeof input.privacy_policy_url) && (undefined === input.owner || "object" === typeof input.owner && null !== input.owner && $io1(input.owner)) && (undefined === input.summary || "string" === typeof input.summary && $is_custom("deprecated", "string", "This field will be removed in v11", input.summary)) && (undefined === input.verify_key || "string" === typeof input.verify_key) && (null === input.team || undefined === input.team || "object" === typeof input.team && null !== input.team && $io16(input.team)) && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.primary_sku_id || "string" === typeof input.primary_sku_id) && (undefined === input.slug || "string" === typeof input.slug) && (undefined === input.cover_image || "string" === typeof input.cover_image) && (undefined === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 64 === input.flags || 2048 === input.flags || 4096 === input.flags || 8192 === input.flags || 16384 === input.flags || 32768 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 8388608 === input.flags) && (undefined === input.tags || Array.isArray(input.tags) && (1 <= input.tags.length && 5 >= input.tags.length && "string" === typeof input.tags[0] && (undefined === input.tags[1] || "string" === typeof input.tags[1]) && (undefined === input.tags[2] || "string" === typeof input.tags[2]) && (undefined === input.tags[3] || "string" === typeof input.tags[3]) && (undefined === input.tags[4] || "string" === typeof input.tags[4]))) && (undefined === input.install_params || "object" === typeof input.install_params && null !== input.install_params && $io18(input.install_params)) && (undefined === input.custom_install_url || "string" === typeof input.custom_install_url) && (undefined === input.role_connections_verification_url || "string" === typeof input.role_connections_verification_url) && (undefined === input.approximate_guild_count || "number" === typeof input.approximate_guild_count) && (undefined === input.guild || "object" === typeof input.guild && null !== input.guild && $io19(input.guild));
        const $io16 = (input: any): boolean => (null === input.icon || "string" === typeof input.icon) && "string" === typeof input.id && (Array.isArray(input.members) && input.members.every((elem: any) => "object" === typeof elem && null !== elem && $io17(elem))) && "string" === typeof input.name && "string" === typeof input.owner_user_id;
        const $io17 = (input: any): boolean => (1 === input.membership_state || 2 === input.membership_state) && (Array.isArray(input.permissions) && (input.permissions.length === 1 && "*" === input.permissions[0])) && "string" === typeof input.team_id && ("object" === typeof input.user && null !== input.user && $io1(input.user));
        const $io18 = (input: any): boolean => Array.isArray(input.scopes) && input.scopes.every((elem: any) => "bot" === elem || "connections" === elem || "dm_channels.read" === elem || "email" === elem || "identify" === elem || "guilds" === elem || "guilds.join" === elem || "guilds.members.read" === elem || "gdm.join" === elem || "messages.read" === elem || "role_connections.write" === elem || "rpc" === elem || "rpc.notifications.read" === elem || "webhook.incoming" === elem || "voice" === elem || "applications.builds.upload" === elem || "applications.builds.read" === elem || "applications.store.update" === elem || "applications.entitlements" === elem || "relationships.read" === elem || "activities.read" === elem || "activities.write" === elem || "applications.commands" === elem || "applications.commands.update" === elem || "applications.commands.permissions.update" === elem) && "string" === typeof input.permissions;
        const $io19 = (input: any): boolean => "string" === typeof input.name && (null === input.icon || "string" === typeof input.icon) && (null === input.splash || "string" === typeof input.splash) && (null === input.banner || undefined === input.banner || "string" === typeof input.banner) && (null === input.description || undefined === input.description || "string" === typeof input.description) && (undefined === input.features || Array.isArray(input.features) && input.features.every((elem: any) => "ANIMATED_BANNER" === elem || "ANIMATED_ICON" === elem || "APPLICATION_COMMAND_PERMISSIONS_V2" === elem || "AUTO_MODERATION" === elem || "BANNER" === elem || "COMMUNITY" === elem || "CREATOR_MONETIZABLE_PROVISIONAL" === elem || "CREATOR_STORE_PAGE" === elem || "DEVELOPER_SUPPORT_SERVER" === elem || "DISCOVERABLE" === elem || "FEATURABLE" === elem || "HAS_DIRECTORY_ENTRY" === elem || "HUB" === elem || "INVITES_DISABLED" === elem || "INVITE_SPLASH" === elem || "LINKED_TO_HUB" === elem || "MEMBER_VERIFICATION_GATE_ENABLED" === elem || "MONETIZATION_ENABLED" === elem || "MORE_STICKERS" === elem || "NEWS" === elem || "PARTNERED" === elem || "PREVIEW_ENABLED" === elem || "PRIVATE_THREADS" === elem || "RAID_ALERTS_DISABLED" === elem || "RELAY_ENABLED" === elem || "ROLE_ICONS" === elem || "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE" === elem || "ROLE_SUBSCRIPTIONS_ENABLED" === elem || "TICKETED_EVENTS_ENABLED" === elem || "VANITY_URL" === elem || "VERIFIED" === elem || "VIP_REGIONS" === elem || "WELCOME_SCREEN_ENABLED" === elem)) && (undefined === input.verification_level || 0 === input.verification_level || 1 === input.verification_level || 2 === input.verification_level || 3 === input.verification_level || 4 === input.verification_level) && (null === input.vanity_url_code || undefined === input.vanity_url_code || "string" === typeof input.vanity_url_code) && "string" === typeof input.id && (undefined === input.welcome_screen || "object" === typeof input.welcome_screen && null !== input.welcome_screen && $io20(input.welcome_screen));
        const $io20 = (input: any): boolean => (null === input.description || "string" === typeof input.description) && (Array.isArray(input.welcome_channels) && input.welcome_channels.every((elem: any) => "object" === typeof elem && null !== elem && $io21(elem)));
        const $io21 = (input: any): boolean => "string" === typeof input.channel_id && "string" === typeof input.description && (null === input.emoji_id || "string" === typeof input.emoji_id) && (null === input.emoji_name || "string" === typeof input.emoji_name);
        const $io22 = (input: any): boolean => (undefined === input.message_id || "string" === typeof input.message_id) && "string" === typeof input.channel_id && (undefined === input.guild_id || "string" === typeof input.guild_id);
        const $io23 = (input: any): boolean => "string" === typeof input.id && (1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type) && "string" === typeof input.name && ("object" === typeof input.user && null !== input.user && $io1(input.user)) && (undefined === input.member || "object" === typeof input.member && null !== input.member && $io24(input.member));
        const $io24 = (input: any): boolean => Array.isArray(input.roles) && input.roles.every((elem: any) => "string" === typeof elem) && (null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since) && (undefined === input.pending || "boolean" === typeof input.pending) && (null === input.nick || undefined === input.nick || "string" === typeof input.nick) && "boolean" === typeof input.mute && "string" === typeof input.joined_at && "boolean" === typeof input.deaf && (null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until) && (null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar);
        const $io25 = (input: any): boolean => (null === input.name || "string" === typeof input.name) && (undefined === input.application_id || "string" === typeof input.application_id) && (null === input.icon || undefined === input.icon || "string" === typeof input.icon) && (undefined === input.owner_id || "string" === typeof input.owner_id) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (undefined === input.managed || "boolean" === typeof input.managed) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 3 === input.type && (undefined === input.recipients || Array.isArray(input.recipients) && input.recipients.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem)));
        const $io26 = (input: any): boolean => undefined !== input.name && null === input.name && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 1 === input.type && (undefined === input.recipients || Array.isArray(input.recipients) && input.recipients.every((elem: any) => "object" === typeof elem && null !== elem && $io1(elem)));
        const $io27 = (input: any): boolean => (undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration) && (undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user) && (null === input.topic || undefined === input.topic || "string" === typeof input.topic) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 0 === input.type && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io28 = (input: any): boolean => "string" === typeof input.id && (0 === input.type || 1 === input.type) && "string" === typeof input.allow && "string" === typeof input.deny;
        const $io29 = (input: any): boolean => (undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration) && (undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user) && (null === input.topic || undefined === input.topic || "string" === typeof input.topic) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 5 === input.type && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io30 = (input: any): boolean => (undefined === input.bitrate || "number" === typeof input.bitrate) && (undefined === input.user_limit || "number" === typeof input.user_limit) && (null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region) && (undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode) && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && 2 === input.type && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id);
        const $io31 = (input: any): boolean => (undefined === input.bitrate || "number" === typeof input.bitrate) && (undefined === input.user_limit || "number" === typeof input.user_limit) && (null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region) && (undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode) && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && 13 === input.type && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id);
        const $io32 = (input: any): boolean => "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && 4 === input.type;
        const $io33 = (input: any): boolean => (undefined === input.member || "object" === typeof input.member && null !== input.member && $io34(input.member)) && (undefined === input.thread_metadata || "object" === typeof input.thread_metadata && null !== input.thread_metadata && $io36(input.thread_metadata)) && (undefined === input.message_count || "number" === typeof input.message_count) && (undefined === input.member_count || "number" === typeof input.member_count) && (undefined === input.owner_id || "string" === typeof input.owner_id) && (undefined === input.total_message_sent || "number" === typeof input.total_message_sent) && (Array.isArray(input.applied_tags) && input.applied_tags.every((elem: any) => "string" === typeof elem)) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && (10 === input.type || 11 === input.type || 12 === input.type) && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io34 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && (undefined === input.user_id || "string" === typeof input.user_id) && "string" === typeof input.join_timestamp && (1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags) && (undefined === input.member || "object" === typeof input.member && null !== input.member && $io35(input.member));
        const $io35 = (input: any): boolean => (undefined === input.user || "object" === typeof input.user && null !== input.user && $io1(input.user)) && (null === input.nick || undefined === input.nick || "string" === typeof input.nick) && (null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar) && (Array.isArray(input.roles) && input.roles.every((elem: any) => "string" === typeof elem)) && "string" === typeof input.joined_at && (null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since) && "boolean" === typeof input.deaf && "boolean" === typeof input.mute && (1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags) && (undefined === input.pending || "boolean" === typeof input.pending) && (null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until);
        const $io36 = (input: any): boolean => "boolean" === typeof input.archived && (60 === input.auto_archive_duration || 1440 === input.auto_archive_duration || 4320 === input.auto_archive_duration || 10080 === input.auto_archive_duration) && "string" === typeof input.archive_timestamp && (undefined === input.locked || "boolean" === typeof input.locked) && (undefined === input.invitable || "boolean" === typeof input.invitable) && (undefined === input.create_timestamp || "string" === typeof input.create_timestamp);
        const $io37 = (input: any): boolean => Array.isArray(input.available_tags) && input.available_tags.every((elem: any) => "object" === typeof elem && null !== elem && $io38(elem)) && (null === input.default_reaction_emoji || "object" === typeof input.default_reaction_emoji && null !== input.default_reaction_emoji && $io39(input.default_reaction_emoji)) && (null === input.default_sort_order || 0 === input.default_sort_order || 1 === input.default_sort_order) && (0 === input.default_forum_layout || 1 === input.default_forum_layout || 2 === input.default_forum_layout) && (undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration) && (undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user) && (null === input.topic || undefined === input.topic || "string" === typeof input.topic) && "string" === typeof input.id && (undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags) && (undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user) && (null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id) && (null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp) && 15 === input.type && "string" === typeof input.name && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.permission_overwrites || Array.isArray(input.permission_overwrites) && input.permission_overwrites.every((elem: any) => "object" === typeof elem && null !== elem && $io28(elem))) && "number" === typeof input.position && (null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id) && (undefined === input.nsfw || "boolean" === typeof input.nsfw);
        const $io38 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && "boolean" === typeof input.moderated && (null === input.emoji_id || "string" === typeof input.emoji_id) && (null === input.emoji_name || "string" === typeof input.emoji_name);
        const $io39 = (input: any): boolean => (null === input.emoji_id || "string" === typeof input.emoji_id) && (null === input.emoji_name || "string" === typeof input.emoji_name);
        const $io40 = (input: any): boolean => Array.isArray(input.components) && input.components.every((elem: any) => "object" === typeof elem && null !== elem && $iu0(elem)) && 1 === input.type;
        const $io41 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.label || "string" === typeof input.label) && (1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style) && (undefined === input.emoji || "object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) && $io42(input.emoji)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 2 === input.type;
        const $io42 = (input: any): boolean => (undefined === input.id || "string" === typeof input.id) && (undefined === input.name || "string" === typeof input.name) && (undefined === input.animated || "boolean" === typeof input.animated);
        const $io43 = (input: any): boolean => "string" === typeof input.url && (undefined === input.label || "string" === typeof input.label) && 5 === input.style && (undefined === input.emoji || "object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) && $io42(input.emoji)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 2 === input.type;
        const $io44 = (input: any): boolean => Array.isArray(input.options) && input.options.every((elem: any) => "object" === typeof elem && null !== elem && $io45(elem)) && "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 3 === input.type;
        const $io45 = (input: any): boolean => "string" === typeof input.label && "string" === typeof input.value && (undefined === input.description || "string" === typeof input.description) && (undefined === input.emoji || "object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) && $io42(input.emoji)) && (undefined === input["default"] || "boolean" === typeof input["default"]);
        const $io46 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 5 === input.type;
        const $io47 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 6 === input.type;
        const $io48 = (input: any): boolean => "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 7 === input.type;
        const $io49 = (input: any): boolean => (undefined === input.channel_types || Array.isArray(input.channel_types) && input.channel_types.every((elem: any) => 0 === elem || 1 === elem || 2 === elem || 3 === elem || 4 === elem || 5 === elem || 10 === elem || 11 === elem || 12 === elem || 13 === elem || 14 === elem || 15 === elem)) && "string" === typeof input.custom_id && (undefined === input.placeholder || "string" === typeof input.placeholder) && (undefined === input.min_values || "number" === typeof input.min_values && $is_custom("default", "number", "1", input.min_values)) && (undefined === input.max_values || "number" === typeof input.max_values && $is_custom("default", "number", "1", input.max_values)) && (undefined === input.disabled || "boolean" === typeof input.disabled) && 8 === input.type;
        const $io50 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.name && (1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type);
        const $io51 = (input: any): boolean => "string" === typeof input.id && (undefined === input.pack_id || "string" === typeof input.pack_id) && "string" === typeof input.name && (null === input.description || "string" === typeof input.description) && "string" === typeof input.tags && (undefined === input.asset || "" === input.asset) && (1 === input.type || 2 === input.type) && (1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type) && (undefined === input.available || "boolean" === typeof input.available) && (undefined === input.guild_id || "string" === typeof input.guild_id) && (undefined === input.user || "object" === typeof input.user && null !== input.user && $io1(input.user)) && (undefined === input.sort_value || "number" === typeof input.sort_value);
        const $io52 = (input: any): boolean => "string" === typeof input.role_subscription_listing_id && "string" === typeof input.tier_name && "number" === typeof input.total_months_subscribed && "boolean" === typeof input.is_renewal;
        const $iu0 = (input: any): any => (() => {
            if (1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style)
                return $io41(input);
            if (5 === input.style)
                return $io43(input);
            if (3 === input.type)
                return $io44(input);
            if (7 === input.type)
                return $io48(input);
            if (6 === input.type)
                return $io47(input);
            if (5 === input.type)
                return $io46(input);
            if (8 === input.type)
                return $io49(input);
            return false;
        })();
        const $iu1 = (input: any): any => (() => {
            if (3 === input.type)
                return $io25(input);
            if (1 === input.type)
                return $io26(input);
            if (5 === input.type)
                return $io29(input);
            if (0 === input.type)
                return $io27(input);
            if (13 === input.type)
                return $io31(input);
            if (2 === input.type)
                return $io30(input);
            if (4 === input.type)
                return $io32(input);
            if (10 === input.type || 11 === input.type || 12 === input.type)
                return $io33(input);
            if (undefined !== input.default_sort_order)
                return $io37(input);
            return false;
        })();
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is RESTPostAPIChannelMessageResult => {
            const $is_custom = (typia.createValidate as any).is_custom;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), ("object" === typeof input.author && null !== input.author || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "APIUser",
                    value: input.author
                })) && $vo1(input.author, _path + ".author", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "APIUser",
                    value: input.author
                }), "string" === typeof input.content || $report(_exceptionable, {
                    path: _path + ".content",
                    expected: "string",
                    value: input.content
                }), "string" === typeof input.timestamp || $report(_exceptionable, {
                    path: _path + ".timestamp",
                    expected: "string",
                    value: input.timestamp
                }), null === input.edited_timestamp || "string" === typeof input.edited_timestamp || $report(_exceptionable, {
                    path: _path + ".edited_timestamp",
                    expected: "(null | string)",
                    value: input.edited_timestamp
                }), "boolean" === typeof input.tts || $report(_exceptionable, {
                    path: _path + ".tts",
                    expected: "boolean",
                    value: input.tts
                }), "boolean" === typeof input.mention_everyone || $report(_exceptionable, {
                    path: _path + ".mention_everyone",
                    expected: "boolean",
                    value: input.mention_everyone
                }), (Array.isArray(input.mentions) || $report(_exceptionable, {
                    path: _path + ".mentions",
                    expected: "Array<APIUser>",
                    value: input.mentions
                })) && input.mentions.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".mentions[" + _index1 + "]",
                    expected: "APIUser",
                    value: elem
                })) && $vo1(elem, _path + ".mentions[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".mentions[" + _index1 + "]",
                    expected: "APIUser",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".mentions",
                    expected: "Array<APIUser>",
                    value: input.mentions
                }), (Array.isArray(input.mention_roles) || $report(_exceptionable, {
                    path: _path + ".mention_roles",
                    expected: "Array<string>",
                    value: input.mention_roles
                })) && input.mention_roles.map((elem: any, _index2: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".mention_roles[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".mention_roles",
                    expected: "Array<string>",
                    value: input.mention_roles
                }), undefined === input.mention_channels || (Array.isArray(input.mention_channels) || $report(_exceptionable, {
                    path: _path + ".mention_channels",
                    expected: "(Array<APIChannelMention> | undefined)",
                    value: input.mention_channels
                })) && input.mention_channels.map((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".mention_channels[" + _index3 + "]",
                    expected: "APIChannelMention",
                    value: elem
                })) && $vo2(elem, _path + ".mention_channels[" + _index3 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".mention_channels[" + _index3 + "]",
                    expected: "APIChannelMention",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".mention_channels",
                    expected: "(Array<APIChannelMention> | undefined)",
                    value: input.mention_channels
                }), (Array.isArray(input.attachments) || $report(_exceptionable, {
                    path: _path + ".attachments",
                    expected: "Array<APIAttachment>",
                    value: input.attachments
                })) && input.attachments.map((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".attachments[" + _index4 + "]",
                    expected: "APIAttachment",
                    value: elem
                })) && $vo3(elem, _path + ".attachments[" + _index4 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".attachments[" + _index4 + "]",
                    expected: "APIAttachment",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".attachments",
                    expected: "Array<APIAttachment>",
                    value: input.attachments
                }), (Array.isArray(input.embeds) || $report(_exceptionable, {
                    path: _path + ".embeds",
                    expected: "Array<APIEmbed>",
                    value: input.embeds
                })) && input.embeds.map((elem: any, _index5: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $report(_exceptionable, {
                    path: _path + ".embeds[" + _index5 + "]",
                    expected: "APIEmbed",
                    value: elem
                })) && $vo4(elem, _path + ".embeds[" + _index5 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".embeds[" + _index5 + "]",
                    expected: "APIEmbed",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".embeds",
                    expected: "Array<APIEmbed>",
                    value: input.embeds
                }), undefined === input.reactions || (Array.isArray(input.reactions) || $report(_exceptionable, {
                    path: _path + ".reactions",
                    expected: "(Array<APIReaction> | undefined)",
                    value: input.reactions
                })) && input.reactions.map((elem: any, _index6: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".reactions[" + _index6 + "]",
                    expected: "APIReaction",
                    value: elem
                })) && $vo12(elem, _path + ".reactions[" + _index6 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".reactions[" + _index6 + "]",
                    expected: "APIReaction",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".reactions",
                    expected: "(Array<APIReaction> | undefined)",
                    value: input.reactions
                }), undefined === input.nonce || "string" === typeof input.nonce || "number" === typeof input.nonce || $report(_exceptionable, {
                    path: _path + ".nonce",
                    expected: "(number | string | undefined)",
                    value: input.nonce
                }), "boolean" === typeof input.pinned || $report(_exceptionable, {
                    path: _path + ".pinned",
                    expected: "boolean",
                    value: input.pinned
                }), undefined === input.webhook_id || "string" === typeof input.webhook_id || $report(_exceptionable, {
                    path: _path + ".webhook_id",
                    expected: "(string | undefined)",
                    value: input.webhook_id
                }), 0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 6 === input.type || 7 === input.type || 8 === input.type || 9 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 14 === input.type || 15 === input.type || 16 === input.type || 17 === input.type || 18 === input.type || 19 === input.type || 20 === input.type || 21 === input.type || 22 === input.type || 23 === input.type || 24 === input.type || 25 === input.type || 26 === input.type || 27 === input.type || 28 === input.type || 29 === input.type || 30 === input.type || 31 === input.type || 32 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(0 | 1 | 10 | 11 | 12 | 14 | 15 | 16 | 17 | 18 | 19 | 2 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 3 | 30 | 31 | 32 | 4 | 5 | 6 | 7 | 8 | 9)",
                    value: input.type
                }), undefined === input.activity || ("object" === typeof input.activity && null !== input.activity || $report(_exceptionable, {
                    path: _path + ".activity",
                    expected: "(APIMessageActivity | undefined)",
                    value: input.activity
                })) && $vo14(input.activity, _path + ".activity", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".activity",
                    expected: "(APIMessageActivity | undefined)",
                    value: input.activity
                }), undefined === input.application || ("object" === typeof input.application && null !== input.application && false === Array.isArray(input.application) || $report(_exceptionable, {
                    path: _path + ".application",
                    expected: "(Partial<APIApplication> | undefined)",
                    value: input.application
                })) && $vo15(input.application, _path + ".application", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".application",
                    expected: "(Partial<APIApplication> | undefined)",
                    value: input.application
                }), undefined === input.application_id || "string" === typeof input.application_id || $report(_exceptionable, {
                    path: _path + ".application_id",
                    expected: "(string | undefined)",
                    value: input.application_id
                }), undefined === input.message_reference || ("object" === typeof input.message_reference && null !== input.message_reference || $report(_exceptionable, {
                    path: _path + ".message_reference",
                    expected: "(APIMessageReference | undefined)",
                    value: input.message_reference
                })) && $vo22(input.message_reference, _path + ".message_reference", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".message_reference",
                    expected: "(APIMessageReference | undefined)",
                    value: input.message_reference
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 1024 === input.flags || 4096 === input.flags || 8192 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 1024 | 128 | 16 | 2 | 256 | 32 | 4 | 4096 | 64 | 8 | 8192 | undefined)",
                    value: input.flags
                }), null === input.referenced_message || undefined === input.referenced_message || ("object" === typeof input.referenced_message && null !== input.referenced_message || $report(_exceptionable, {
                    path: _path + ".referenced_message",
                    expected: "(APIMessage | null | undefined)",
                    value: input.referenced_message
                })) && $vo0(input.referenced_message, _path + ".referenced_message", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".referenced_message",
                    expected: "(APIMessage | null | undefined)",
                    value: input.referenced_message
                }), undefined === input.interaction || ("object" === typeof input.interaction && null !== input.interaction || $report(_exceptionable, {
                    path: _path + ".interaction",
                    expected: "(APIMessageInteraction | undefined)",
                    value: input.interaction
                })) && $vo23(input.interaction, _path + ".interaction", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".interaction",
                    expected: "(APIMessageInteraction | undefined)",
                    value: input.interaction
                }), undefined === input.thread || ("object" === typeof input.thread && null !== input.thread || $report(_exceptionable, {
                    path: _path + ".thread",
                    expected: "(APIDMChannel | APIGroupDMChannel | APIGuildCategoryChannel | APIGuildForumChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APINewsChannel | APITextChannel | APIThreadChannel | undefined)",
                    value: input.thread
                })) && $vu1(input.thread, _path + ".thread", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".thread",
                    expected: "(APIDMChannel | APIGroupDMChannel | APIGuildCategoryChannel | APIGuildForumChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APINewsChannel | APITextChannel | APIThreadChannel | undefined)",
                    value: input.thread
                }), undefined === input.components || (Array.isArray(input.components) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "(Array<APIActionRowComponent<APIMessageActionRowComponent>> | undefined)",
                    value: input.components
                })) && input.components.map((elem: any, _index7: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".components[" + _index7 + "]",
                    expected: "APIActionRowComponent<APIMessageActionRowComponent>",
                    value: elem
                })) && $vo40(elem, _path + ".components[" + _index7 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".components[" + _index7 + "]",
                    expected: "APIActionRowComponent<APIMessageActionRowComponent>",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "(Array<APIActionRowComponent<APIMessageActionRowComponent>> | undefined)",
                    value: input.components
                }), undefined === input.sticker_items || (Array.isArray(input.sticker_items) || $report(_exceptionable, {
                    path: _path + ".sticker_items",
                    expected: "(Array<APIStickerItem> | undefined)",
                    value: input.sticker_items
                })) && input.sticker_items.map((elem: any, _index8: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".sticker_items[" + _index8 + "]",
                    expected: "APIStickerItem",
                    value: elem
                })) && $vo50(elem, _path + ".sticker_items[" + _index8 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".sticker_items[" + _index8 + "]",
                    expected: "APIStickerItem",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".sticker_items",
                    expected: "(Array<APIStickerItem> | undefined)",
                    value: input.sticker_items
                }), undefined === input.stickers || (Array.isArray(input.stickers) && ($is_custom("deprecated", "array", "Use `sticker_items` instead", input.stickers) || $report(_exceptionable, {
                    path: _path + ".stickers",
                    expected: "Array (@deprecated Use `sticker_items` instead)",
                    value: input.stickers
                })) || $report(_exceptionable, {
                    path: _path + ".stickers",
                    expected: "(Array<APISticker> | undefined)",
                    value: input.stickers
                })) && input.stickers.map((elem: any, _index9: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".stickers[" + _index9 + "]",
                    expected: "APISticker",
                    value: elem
                })) && $vo51(elem, _path + ".stickers[" + _index9 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".stickers[" + _index9 + "]",
                    expected: "APISticker",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".stickers",
                    expected: "(Array<APISticker> | undefined)",
                    value: input.stickers
                }), undefined === input.position || "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "(number | undefined)",
                    value: input.position
                }), undefined === input.role_subscription_data || ("object" === typeof input.role_subscription_data && null !== input.role_subscription_data || $report(_exceptionable, {
                    path: _path + ".role_subscription_data",
                    expected: "(APIMessageRoleSubscriptionData | undefined)",
                    value: input.role_subscription_data
                })) && $vo52(input.role_subscription_data, _path + ".role_subscription_data", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".role_subscription_data",
                    expected: "(APIMessageRoleSubscriptionData | undefined)",
                    value: input.role_subscription_data
                })].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.username || $report(_exceptionable, {
                    path: _path + ".username",
                    expected: "string",
                    value: input.username
                }), "string" === typeof input.discriminator || $report(_exceptionable, {
                    path: _path + ".discriminator",
                    expected: "string",
                    value: input.discriminator
                }), null === input.global_name || "string" === typeof input.global_name || $report(_exceptionable, {
                    path: _path + ".global_name",
                    expected: "(null | string)",
                    value: input.global_name
                }), null === input.avatar || "string" === typeof input.avatar || $report(_exceptionable, {
                    path: _path + ".avatar",
                    expected: "(null | string)",
                    value: input.avatar
                }), undefined === input.bot || "boolean" === typeof input.bot || $report(_exceptionable, {
                    path: _path + ".bot",
                    expected: "(boolean | undefined)",
                    value: input.bot
                }), undefined === input.system || "boolean" === typeof input.system || $report(_exceptionable, {
                    path: _path + ".system",
                    expected: "(boolean | undefined)",
                    value: input.system
                }), undefined === input.mfa_enabled || "boolean" === typeof input.mfa_enabled || $report(_exceptionable, {
                    path: _path + ".mfa_enabled",
                    expected: "(boolean | undefined)",
                    value: input.mfa_enabled
                }), null === input.banner || undefined === input.banner || "string" === typeof input.banner || $report(_exceptionable, {
                    path: _path + ".banner",
                    expected: "(null | string | undefined)",
                    value: input.banner
                }), null === input.accent_color || undefined === input.accent_color || "number" === typeof input.accent_color || $report(_exceptionable, {
                    path: _path + ".accent_color",
                    expected: "(null | number | undefined)",
                    value: input.accent_color
                }), undefined === input.locale || "string" === typeof input.locale || $report(_exceptionable, {
                    path: _path + ".locale",
                    expected: "(string | undefined)",
                    value: input.locale
                }), undefined === input.verified || "boolean" === typeof input.verified || $report(_exceptionable, {
                    path: _path + ".verified",
                    expected: "(boolean | undefined)",
                    value: input.verified
                }), null === input.email || undefined === input.email || "string" === typeof input.email || $report(_exceptionable, {
                    path: _path + ".email",
                    expected: "(null | string | undefined)",
                    value: input.email
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || 1024 === input.flags || 8192 === input.flags || 16384 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 2097152 === input.flags || 4194304 === input.flags || 17592186044416 === input.flags || 1125899906842624 === input.flags || 2251799813685248 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 1024 | 1048576 | 1125899906842624 | 128 | 131072 | 16 | 16384 | 17592186044416 | 2 | 2097152 | 2251799813685248 | 256 | 262144 | 32 | 4 | 4194304 | 512 | 524288 | 64 | 65536 | 8 | 8192 | undefined)",
                    value: input.flags
                }), undefined === input.premium_type || 0 === input.premium_type || 1 === input.premium_type || 2 === input.premium_type || 3 === input.premium_type || $report(_exceptionable, {
                    path: _path + ".premium_type",
                    expected: "(0 | 1 | 2 | 3 | undefined)",
                    value: input.premium_type
                }), undefined === input.public_flags || 1 === input.public_flags || 2 === input.public_flags || 4 === input.public_flags || 8 === input.public_flags || 16 === input.public_flags || 32 === input.public_flags || 64 === input.public_flags || 128 === input.public_flags || 256 === input.public_flags || 512 === input.public_flags || 1024 === input.public_flags || 8192 === input.public_flags || 16384 === input.public_flags || 65536 === input.public_flags || 131072 === input.public_flags || 262144 === input.public_flags || 524288 === input.public_flags || 1048576 === input.public_flags || 2097152 === input.public_flags || 4194304 === input.public_flags || 17592186044416 === input.public_flags || 1125899906842624 === input.public_flags || 2251799813685248 === input.public_flags || $report(_exceptionable, {
                    path: _path + ".public_flags",
                    expected: "(1 | 1024 | 1048576 | 1125899906842624 | 128 | 131072 | 16 | 16384 | 17592186044416 | 2 | 2097152 | 2251799813685248 | 256 | 262144 | 32 | 4 | 4194304 | 512 | 524288 | 64 | 65536 | 8 | 8192 | undefined)",
                    value: input.public_flags
                }), null === input.avatar_decoration || undefined === input.avatar_decoration || "string" === typeof input.avatar_decoration || $report(_exceptionable, {
                    path: _path + ".avatar_decoration",
                    expected: "(null | string | undefined)",
                    value: input.avatar_decoration
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "string",
                    value: input.guild_id
                }), 0 === input.type || 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || 10 === input.type || 11 === input.type || 12 === input.type || 13 === input.type || 14 === input.type || 15 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(0 | 1 | 10 | 11 | 12 | 13 | 14 | 15 | 2 | 3 | 4 | 5)",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                })].every((flag: boolean) => flag);
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.filename || $report(_exceptionable, {
                    path: _path + ".filename",
                    expected: "string",
                    value: input.filename
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.content_type || "string" === typeof input.content_type || $report(_exceptionable, {
                    path: _path + ".content_type",
                    expected: "(string | undefined)",
                    value: input.content_type
                }), "number" === typeof input.size || $report(_exceptionable, {
                    path: _path + ".size",
                    expected: "number",
                    value: input.size
                }), "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "string",
                    value: input.proxy_url
                }), null === input.height || undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(null | number | undefined)",
                    value: input.height
                }), null === input.width || undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(null | number | undefined)",
                    value: input.width
                }), undefined === input.ephemeral || "boolean" === typeof input.ephemeral || $report(_exceptionable, {
                    path: _path + ".ephemeral",
                    expected: "(boolean | undefined)",
                    value: input.ephemeral
                }), undefined === input.duration_secs || "number" === typeof input.duration_secs || $report(_exceptionable, {
                    path: _path + ".duration_secs",
                    expected: "(number | undefined)",
                    value: input.duration_secs
                }), undefined === input.waveform || "string" === typeof input.waveform || $report(_exceptionable, {
                    path: _path + ".waveform",
                    expected: "(string | undefined)",
                    value: input.waveform
                }), undefined === input.flags || 4 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(4 | undefined)",
                    value: input.flags
                })].every((flag: boolean) => flag);
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.title || "string" === typeof input.title || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "(string | undefined)",
                    value: input.title
                }), undefined === input.type || "rich" === input.type || "image" === input.type || "video" === input.type || "gifv" === input.type || "article" === input.type || "link" === input.type || "auto_moderation_message" === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(\"article\" | \"auto_moderation_message\" | \"gifv\" | \"image\" | \"link\" | \"rich\" | \"video\" | undefined)",
                    value: input.type
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                }), undefined === input.timestamp || "string" === typeof input.timestamp || $report(_exceptionable, {
                    path: _path + ".timestamp",
                    expected: "(string | undefined)",
                    value: input.timestamp
                }), undefined === input.color || "number" === typeof input.color || $report(_exceptionable, {
                    path: _path + ".color",
                    expected: "(number | undefined)",
                    value: input.color
                }), undefined === input.footer || ("object" === typeof input.footer && null !== input.footer || $report(_exceptionable, {
                    path: _path + ".footer",
                    expected: "(APIEmbedFooter | undefined)",
                    value: input.footer
                })) && $vo5(input.footer, _path + ".footer", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".footer",
                    expected: "(APIEmbedFooter | undefined)",
                    value: input.footer
                }), undefined === input.image || ("object" === typeof input.image && null !== input.image || $report(_exceptionable, {
                    path: _path + ".image",
                    expected: "(APIEmbedImage | undefined)",
                    value: input.image
                })) && $vo6(input.image, _path + ".image", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".image",
                    expected: "(APIEmbedImage | undefined)",
                    value: input.image
                }), undefined === input.thumbnail || ("object" === typeof input.thumbnail && null !== input.thumbnail || $report(_exceptionable, {
                    path: _path + ".thumbnail",
                    expected: "(APIEmbedThumbnail | undefined)",
                    value: input.thumbnail
                })) && $vo7(input.thumbnail, _path + ".thumbnail", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".thumbnail",
                    expected: "(APIEmbedThumbnail | undefined)",
                    value: input.thumbnail
                }), undefined === input.video || ("object" === typeof input.video && null !== input.video && false === Array.isArray(input.video) || $report(_exceptionable, {
                    path: _path + ".video",
                    expected: "(APIEmbedVideo | undefined)",
                    value: input.video
                })) && $vo8(input.video, _path + ".video", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".video",
                    expected: "(APIEmbedVideo | undefined)",
                    value: input.video
                }), undefined === input.provider || ("object" === typeof input.provider && null !== input.provider && false === Array.isArray(input.provider) || $report(_exceptionable, {
                    path: _path + ".provider",
                    expected: "(APIEmbedProvider | undefined)",
                    value: input.provider
                })) && $vo9(input.provider, _path + ".provider", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".provider",
                    expected: "(APIEmbedProvider | undefined)",
                    value: input.provider
                }), undefined === input.author || ("object" === typeof input.author && null !== input.author || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "(APIEmbedAuthor | undefined)",
                    value: input.author
                })) && $vo10(input.author, _path + ".author", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "(APIEmbedAuthor | undefined)",
                    value: input.author
                }), undefined === input.fields || (Array.isArray(input.fields) || $report(_exceptionable, {
                    path: _path + ".fields",
                    expected: "(Array<APIEmbedField> | undefined)",
                    value: input.fields
                })) && input.fields.map((elem: any, _index10: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".fields[" + _index10 + "]",
                    expected: "APIEmbedField",
                    value: elem
                })) && $vo11(elem, _path + ".fields[" + _index10 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".fields[" + _index10 + "]",
                    expected: "APIEmbedField",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".fields",
                    expected: "(Array<APIEmbedField> | undefined)",
                    value: input.fields
                })].every((flag: boolean) => flag);
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.text || $report(_exceptionable, {
                    path: _path + ".text",
                    expected: "string",
                    value: input.text
                }), undefined === input.icon_url || "string" === typeof input.icon_url || $report(_exceptionable, {
                    path: _path + ".icon_url",
                    expected: "(string | undefined)",
                    value: input.icon_url
                }), undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url || $report(_exceptionable, {
                    path: _path + ".proxy_icon_url",
                    expected: "(string | undefined)",
                    value: input.proxy_icon_url
                })].every((flag: boolean) => flag);
            const $vo6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), undefined === input.proxy_url || "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "(string | undefined)",
                    value: input.proxy_url
                }), undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(number | undefined)",
                    value: input.height
                }), undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(number | undefined)",
                    value: input.width
                })].every((flag: boolean) => flag);
            const $vo7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), undefined === input.proxy_url || "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "(string | undefined)",
                    value: input.proxy_url
                }), undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(number | undefined)",
                    value: input.height
                }), undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(number | undefined)",
                    value: input.width
                })].every((flag: boolean) => flag);
            const $vo8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                }), undefined === input.proxy_url || "string" === typeof input.proxy_url || $report(_exceptionable, {
                    path: _path + ".proxy_url",
                    expected: "(string | undefined)",
                    value: input.proxy_url
                }), undefined === input.height || "number" === typeof input.height || $report(_exceptionable, {
                    path: _path + ".height",
                    expected: "(number | undefined)",
                    value: input.height
                }), undefined === input.width || "number" === typeof input.width || $report(_exceptionable, {
                    path: _path + ".width",
                    expected: "(number | undefined)",
                    value: input.width
                })].every((flag: boolean) => flag);
            const $vo9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                })].every((flag: boolean) => flag);
            const $vo10 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.url || "string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "(string | undefined)",
                    value: input.url
                }), undefined === input.icon_url || "string" === typeof input.icon_url || $report(_exceptionable, {
                    path: _path + ".icon_url",
                    expected: "(string | undefined)",
                    value: input.icon_url
                }), undefined === input.proxy_icon_url || "string" === typeof input.proxy_icon_url || $report(_exceptionable, {
                    path: _path + ".proxy_icon_url",
                    expected: "(string | undefined)",
                    value: input.proxy_icon_url
                })].every((flag: boolean) => flag);
            const $vo11 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "string" === typeof input.value || $report(_exceptionable, {
                    path: _path + ".value",
                    expected: "string",
                    value: input.value
                }), undefined === input.inline || "boolean" === typeof input.inline || $report(_exceptionable, {
                    path: _path + ".inline",
                    expected: "(boolean | undefined)",
                    value: input.inline
                })].every((flag: boolean) => flag);
            const $vo12 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.count || $report(_exceptionable, {
                    path: _path + ".count",
                    expected: "number",
                    value: input.count
                }), "boolean" === typeof input.me || $report(_exceptionable, {
                    path: _path + ".me",
                    expected: "boolean",
                    value: input.me
                }), ("object" === typeof input.emoji && null !== input.emoji || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "APIPartialEmoji",
                    value: input.emoji
                })) && $vo13(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "APIPartialEmoji",
                    value: input.emoji
                })].every((flag: boolean) => flag);
            const $vo13 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(null | string)",
                    value: input.id
                }), null === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(null | string)",
                    value: input.name
                }), undefined === input.animated || "boolean" === typeof input.animated || $report(_exceptionable, {
                    path: _path + ".animated",
                    expected: "(boolean | undefined)",
                    value: input.animated
                })].every((flag: boolean) => flag);
            const $vo14 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [1 === input.type || 2 === input.type || 3 === input.type || 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(1 | 2 | 3 | 5)",
                    value: input.type
                }), undefined === input.party_id || "string" === typeof input.party_id || $report(_exceptionable, {
                    path: _path + ".party_id",
                    expected: "(string | undefined)",
                    value: input.party_id
                })].every((flag: boolean) => flag);
            const $vo15 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string | undefined)",
                    value: input.id
                }), undefined === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), null === input.icon || undefined === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string | undefined)",
                    value: input.icon
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.rpc_origins || (Array.isArray(input.rpc_origins) || $report(_exceptionable, {
                    path: _path + ".rpc_origins",
                    expected: "(Array<string> | undefined)",
                    value: input.rpc_origins
                })) && input.rpc_origins.map((elem: any, _index11: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".rpc_origins[" + _index11 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".rpc_origins",
                    expected: "(Array<string> | undefined)",
                    value: input.rpc_origins
                }), undefined === input.bot_public || "boolean" === typeof input.bot_public || $report(_exceptionable, {
                    path: _path + ".bot_public",
                    expected: "(boolean | undefined)",
                    value: input.bot_public
                }), undefined === input.bot_require_code_grant || "boolean" === typeof input.bot_require_code_grant || $report(_exceptionable, {
                    path: _path + ".bot_require_code_grant",
                    expected: "(boolean | undefined)",
                    value: input.bot_require_code_grant
                }), undefined === input.terms_of_service_url || "string" === typeof input.terms_of_service_url || $report(_exceptionable, {
                    path: _path + ".terms_of_service_url",
                    expected: "(string | undefined)",
                    value: input.terms_of_service_url
                }), undefined === input.privacy_policy_url || "string" === typeof input.privacy_policy_url || $report(_exceptionable, {
                    path: _path + ".privacy_policy_url",
                    expected: "(string | undefined)",
                    value: input.privacy_policy_url
                }), undefined === input.owner || ("object" === typeof input.owner && null !== input.owner || $report(_exceptionable, {
                    path: _path + ".owner",
                    expected: "(APIUser | undefined)",
                    value: input.owner
                })) && $vo1(input.owner, _path + ".owner", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".owner",
                    expected: "(APIUser | undefined)",
                    value: input.owner
                }), undefined === input.summary || "string" === typeof input.summary && ($is_custom("deprecated", "string", "This field will be removed in v11", input.summary) || $report(_exceptionable, {
                    path: _path + ".summary",
                    expected: "string (@deprecated This field will be removed in v11)",
                    value: input.summary
                })) || $report(_exceptionable, {
                    path: _path + ".summary",
                    expected: "(string | undefined)",
                    value: input.summary
                }), undefined === input.verify_key || "string" === typeof input.verify_key || $report(_exceptionable, {
                    path: _path + ".verify_key",
                    expected: "(string | undefined)",
                    value: input.verify_key
                }), null === input.team || undefined === input.team || ("object" === typeof input.team && null !== input.team || $report(_exceptionable, {
                    path: _path + ".team",
                    expected: "(APITeam | null | undefined)",
                    value: input.team
                })) && $vo16(input.team, _path + ".team", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".team",
                    expected: "(APITeam | null | undefined)",
                    value: input.team
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.primary_sku_id || "string" === typeof input.primary_sku_id || $report(_exceptionable, {
                    path: _path + ".primary_sku_id",
                    expected: "(string | undefined)",
                    value: input.primary_sku_id
                }), undefined === input.slug || "string" === typeof input.slug || $report(_exceptionable, {
                    path: _path + ".slug",
                    expected: "(string | undefined)",
                    value: input.slug
                }), undefined === input.cover_image || "string" === typeof input.cover_image || $report(_exceptionable, {
                    path: _path + ".cover_image",
                    expected: "(string | undefined)",
                    value: input.cover_image
                }), undefined === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 16 === input.flags || 64 === input.flags || 2048 === input.flags || 4096 === input.flags || 8192 === input.flags || 16384 === input.flags || 32768 === input.flags || 65536 === input.flags || 131072 === input.flags || 262144 === input.flags || 524288 === input.flags || 1048576 === input.flags || 8388608 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1048576 | 131072 | 16 | 16384 | 2 | 2048 | 262144 | 32768 | 4 | 4096 | 524288 | 64 | 65536 | 8 | 8192 | 8388608 | undefined)",
                    value: input.flags
                }), undefined === input.tags || (Array.isArray(input.tags) || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "([string, (string | undefined)?, (string | undefined)?, (string | undefined)?, (string | undefined)?] | undefined)",
                    value: input.tags
                })) && ((1 <= input.tags.length && 5 >= input.tags.length || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "[string, (string | undefined), (string | undefined), (string | undefined), (string | undefined)]",
                    value: input.tags
                })) && [
                    "string" === typeof input.tags[0] || $report(_exceptionable, {
                        path: _path + ".tags[0]",
                        expected: "string",
                        value: input.tags[0]
                    }),
                    undefined === input.tags[1] || "string" === typeof input.tags[1] || $report(_exceptionable, {
                        path: _path + ".tags[1]",
                        expected: "(string | undefined)",
                        value: input.tags[1]
                    }),
                    undefined === input.tags[2] || "string" === typeof input.tags[2] || $report(_exceptionable, {
                        path: _path + ".tags[2]",
                        expected: "(string | undefined)",
                        value: input.tags[2]
                    }),
                    undefined === input.tags[3] || "string" === typeof input.tags[3] || $report(_exceptionable, {
                        path: _path + ".tags[3]",
                        expected: "(string | undefined)",
                        value: input.tags[3]
                    }),
                    undefined === input.tags[4] || "string" === typeof input.tags[4] || $report(_exceptionable, {
                        path: _path + ".tags[4]",
                        expected: "(string | undefined)",
                        value: input.tags[4]
                    })
                ].every((flag: boolean) => flag)) || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "([string, (string | undefined)?, (string | undefined)?, (string | undefined)?, (string | undefined)?] | undefined)",
                    value: input.tags
                }), undefined === input.install_params || ("object" === typeof input.install_params && null !== input.install_params || $report(_exceptionable, {
                    path: _path + ".install_params",
                    expected: "(APIApplicationInstallParams | undefined)",
                    value: input.install_params
                })) && $vo18(input.install_params, _path + ".install_params", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".install_params",
                    expected: "(APIApplicationInstallParams | undefined)",
                    value: input.install_params
                }), undefined === input.custom_install_url || "string" === typeof input.custom_install_url || $report(_exceptionable, {
                    path: _path + ".custom_install_url",
                    expected: "(string | undefined)",
                    value: input.custom_install_url
                }), undefined === input.role_connections_verification_url || "string" === typeof input.role_connections_verification_url || $report(_exceptionable, {
                    path: _path + ".role_connections_verification_url",
                    expected: "(string | undefined)",
                    value: input.role_connections_verification_url
                }), undefined === input.approximate_guild_count || "number" === typeof input.approximate_guild_count || $report(_exceptionable, {
                    path: _path + ".approximate_guild_count",
                    expected: "(number | undefined)",
                    value: input.approximate_guild_count
                }), undefined === input.guild || ("object" === typeof input.guild && null !== input.guild || $report(_exceptionable, {
                    path: _path + ".guild",
                    expected: "(APIPartialGuild | undefined)",
                    value: input.guild
                })) && $vo19(input.guild, _path + ".guild", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".guild",
                    expected: "(APIPartialGuild | undefined)",
                    value: input.guild
                })].every((flag: boolean) => flag);
            const $vo16 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string)",
                    value: input.icon
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), (Array.isArray(input.members) || $report(_exceptionable, {
                    path: _path + ".members",
                    expected: "Array<APITeamMember>",
                    value: input.members
                })) && input.members.map((elem: any, _index12: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".members[" + _index12 + "]",
                    expected: "APITeamMember",
                    value: elem
                })) && $vo17(elem, _path + ".members[" + _index12 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".members[" + _index12 + "]",
                    expected: "APITeamMember",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".members",
                    expected: "Array<APITeamMember>",
                    value: input.members
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "string" === typeof input.owner_user_id || $report(_exceptionable, {
                    path: _path + ".owner_user_id",
                    expected: "string",
                    value: input.owner_user_id
                })].every((flag: boolean) => flag);
            const $vo17 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [1 === input.membership_state || 2 === input.membership_state || $report(_exceptionable, {
                    path: _path + ".membership_state",
                    expected: "(1 | 2)",
                    value: input.membership_state
                }), (Array.isArray(input.permissions) || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "[\"*\"]",
                    value: input.permissions
                })) && ((input.permissions.length === 1 || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "[\"*\"]",
                    value: input.permissions
                })) && [
                    "*" === input.permissions[0] || $report(_exceptionable, {
                        path: _path + ".permissions[0]",
                        expected: "\"*\"",
                        value: input.permissions[0]
                    })
                ].every((flag: boolean) => flag)) || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "[\"*\"]",
                    value: input.permissions
                }), "string" === typeof input.team_id || $report(_exceptionable, {
                    path: _path + ".team_id",
                    expected: "string",
                    value: input.team_id
                }), ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                })].every((flag: boolean) => flag);
            const $vo18 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.scopes) || $report(_exceptionable, {
                    path: _path + ".scopes",
                    expected: "Array<OAuth2Scopes>",
                    value: input.scopes
                })) && input.scopes.map((elem: any, _index13: number) => "bot" === elem || "connections" === elem || "dm_channels.read" === elem || "email" === elem || "identify" === elem || "guilds" === elem || "guilds.join" === elem || "guilds.members.read" === elem || "gdm.join" === elem || "messages.read" === elem || "role_connections.write" === elem || "rpc" === elem || "rpc.notifications.read" === elem || "webhook.incoming" === elem || "voice" === elem || "applications.builds.upload" === elem || "applications.builds.read" === elem || "applications.store.update" === elem || "applications.entitlements" === elem || "relationships.read" === elem || "activities.read" === elem || "activities.write" === elem || "applications.commands" === elem || "applications.commands.update" === elem || "applications.commands.permissions.update" === elem || $report(_exceptionable, {
                    path: _path + ".scopes[" + _index13 + "]",
                    expected: "(\"activities.read\" | \"activities.write\" | \"applications.builds.read\" | \"applications.builds.upload\" | \"applications.commands\" | \"applications.commands.permissions.update\" | \"applications.commands.update\" | \"applications.entitlements\" | \"applications.store.update\" | \"bot\" | \"connections\" | \"dm_channels.read\" | \"email\" | \"gdm.join\" | \"guilds\" | \"guilds.join\" | \"guilds.members.read\" | \"identify\" | \"messages.read\" | \"relationships.read\" | \"role_connections.write\" | \"rpc\" | \"rpc.notifications.read\" | \"voice\" | \"webhook.incoming\")",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".scopes",
                    expected: "Array<OAuth2Scopes>",
                    value: input.scopes
                }), "string" === typeof input.permissions || $report(_exceptionable, {
                    path: _path + ".permissions",
                    expected: "string",
                    value: input.permissions
                })].every((flag: boolean) => flag);
            const $vo19 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), null === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string)",
                    value: input.icon
                }), null === input.splash || "string" === typeof input.splash || $report(_exceptionable, {
                    path: _path + ".splash",
                    expected: "(null | string)",
                    value: input.splash
                }), null === input.banner || undefined === input.banner || "string" === typeof input.banner || $report(_exceptionable, {
                    path: _path + ".banner",
                    expected: "(null | string | undefined)",
                    value: input.banner
                }), null === input.description || undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(null | string | undefined)",
                    value: input.description
                }), undefined === input.features || (Array.isArray(input.features) || $report(_exceptionable, {
                    path: _path + ".features",
                    expected: "(Array<GuildFeature> | undefined)",
                    value: input.features
                })) && input.features.map((elem: any, _index14: number) => "ANIMATED_BANNER" === elem || "ANIMATED_ICON" === elem || "APPLICATION_COMMAND_PERMISSIONS_V2" === elem || "AUTO_MODERATION" === elem || "BANNER" === elem || "COMMUNITY" === elem || "CREATOR_MONETIZABLE_PROVISIONAL" === elem || "CREATOR_STORE_PAGE" === elem || "DEVELOPER_SUPPORT_SERVER" === elem || "DISCOVERABLE" === elem || "FEATURABLE" === elem || "HAS_DIRECTORY_ENTRY" === elem || "HUB" === elem || "INVITES_DISABLED" === elem || "INVITE_SPLASH" === elem || "LINKED_TO_HUB" === elem || "MEMBER_VERIFICATION_GATE_ENABLED" === elem || "MONETIZATION_ENABLED" === elem || "MORE_STICKERS" === elem || "NEWS" === elem || "PARTNERED" === elem || "PREVIEW_ENABLED" === elem || "PRIVATE_THREADS" === elem || "RAID_ALERTS_DISABLED" === elem || "RELAY_ENABLED" === elem || "ROLE_ICONS" === elem || "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE" === elem || "ROLE_SUBSCRIPTIONS_ENABLED" === elem || "TICKETED_EVENTS_ENABLED" === elem || "VANITY_URL" === elem || "VERIFIED" === elem || "VIP_REGIONS" === elem || "WELCOME_SCREEN_ENABLED" === elem || $report(_exceptionable, {
                    path: _path + ".features[" + _index14 + "]",
                    expected: "(\"ANIMATED_BANNER\" | \"ANIMATED_ICON\" | \"APPLICATION_COMMAND_PERMISSIONS_V2\" | \"AUTO_MODERATION\" | \"BANNER\" | \"COMMUNITY\" | \"CREATOR_MONETIZABLE_PROVISIONAL\" | \"CREATOR_STORE_PAGE\" | \"DEVELOPER_SUPPORT_SERVER\" | \"DISCOVERABLE\" | \"FEATURABLE\" | \"HAS_DIRECTORY_ENTRY\" | \"HUB\" | \"INVITES_DISABLED\" | \"INVITE_SPLASH\" | \"LINKED_TO_HUB\" | \"MEMBER_VERIFICATION_GATE_ENABLED\" | \"MONETIZATION_ENABLED\" | \"MORE_STICKERS\" | \"NEWS\" | \"PARTNERED\" | \"PREVIEW_ENABLED\" | \"PRIVATE_THREADS\" | \"RAID_ALERTS_DISABLED\" | \"RELAY_ENABLED\" | \"ROLE_ICONS\" | \"ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE\" | \"ROLE_SUBSCRIPTIONS_ENABLED\" | \"TICKETED_EVENTS_ENABLED\" | \"VANITY_URL\" | \"VERIFIED\" | \"VIP_REGIONS\" | \"WELCOME_SCREEN_ENABLED\")",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".features",
                    expected: "(Array<GuildFeature> | undefined)",
                    value: input.features
                }), undefined === input.verification_level || 0 === input.verification_level || 1 === input.verification_level || 2 === input.verification_level || 3 === input.verification_level || 4 === input.verification_level || $report(_exceptionable, {
                    path: _path + ".verification_level",
                    expected: "(0 | 1 | 2 | 3 | 4 | undefined)",
                    value: input.verification_level
                }), null === input.vanity_url_code || undefined === input.vanity_url_code || "string" === typeof input.vanity_url_code || $report(_exceptionable, {
                    path: _path + ".vanity_url_code",
                    expected: "(null | string | undefined)",
                    value: input.vanity_url_code
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.welcome_screen || ("object" === typeof input.welcome_screen && null !== input.welcome_screen || $report(_exceptionable, {
                    path: _path + ".welcome_screen",
                    expected: "(APIGuildWelcomeScreen | undefined)",
                    value: input.welcome_screen
                })) && $vo20(input.welcome_screen, _path + ".welcome_screen", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".welcome_screen",
                    expected: "(APIGuildWelcomeScreen | undefined)",
                    value: input.welcome_screen
                })].every((flag: boolean) => flag);
            const $vo20 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(null | string)",
                    value: input.description
                }), (Array.isArray(input.welcome_channels) || $report(_exceptionable, {
                    path: _path + ".welcome_channels",
                    expected: "Array<APIGuildWelcomeScreenChannel>",
                    value: input.welcome_channels
                })) && input.welcome_channels.map((elem: any, _index15: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".welcome_channels[" + _index15 + "]",
                    expected: "APIGuildWelcomeScreenChannel",
                    value: elem
                })) && $vo21(elem, _path + ".welcome_channels[" + _index15 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".welcome_channels[" + _index15 + "]",
                    expected: "APIGuildWelcomeScreenChannel",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".welcome_channels",
                    expected: "Array<APIGuildWelcomeScreenChannel>",
                    value: input.welcome_channels
                })].every((flag: boolean) => flag);
            const $vo21 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "string",
                    value: input.description
                }), null === input.emoji_id || "string" === typeof input.emoji_id || $report(_exceptionable, {
                    path: _path + ".emoji_id",
                    expected: "(null | string)",
                    value: input.emoji_id
                }), null === input.emoji_name || "string" === typeof input.emoji_name || $report(_exceptionable, {
                    path: _path + ".emoji_name",
                    expected: "(null | string)",
                    value: input.emoji_name
                })].every((flag: boolean) => flag);
            const $vo22 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.message_id || "string" === typeof input.message_id || $report(_exceptionable, {
                    path: _path + ".message_id",
                    expected: "(string | undefined)",
                    value: input.message_id
                }), "string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                })].every((flag: boolean) => flag);
            const $vo23 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), 1 === input.type || 2 === input.type || 3 === input.type || 4 === input.type || 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(1 | 2 | 3 | 4 | 5)",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "APIUser",
                    value: input.user
                }), undefined === input.member || ("object" === typeof input.member && null !== input.member || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(PartialAPIMessageInteractionGuildMember | undefined)",
                    value: input.member
                })) && $vo24(input.member, _path + ".member", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(PartialAPIMessageInteractionGuildMember | undefined)",
                    value: input.member
                })].every((flag: boolean) => flag);
            const $vo24 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.roles) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                })) && input.roles.map((elem: any, _index16: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".roles[" + _index16 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                }), null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since || $report(_exceptionable, {
                    path: _path + ".premium_since",
                    expected: "(null | string | undefined)",
                    value: input.premium_since
                }), undefined === input.pending || "boolean" === typeof input.pending || $report(_exceptionable, {
                    path: _path + ".pending",
                    expected: "(boolean | undefined)",
                    value: input.pending
                }), null === input.nick || undefined === input.nick || "string" === typeof input.nick || $report(_exceptionable, {
                    path: _path + ".nick",
                    expected: "(null | string | undefined)",
                    value: input.nick
                }), "boolean" === typeof input.mute || $report(_exceptionable, {
                    path: _path + ".mute",
                    expected: "boolean",
                    value: input.mute
                }), "string" === typeof input.joined_at || $report(_exceptionable, {
                    path: _path + ".joined_at",
                    expected: "string",
                    value: input.joined_at
                }), "boolean" === typeof input.deaf || $report(_exceptionable, {
                    path: _path + ".deaf",
                    expected: "boolean",
                    value: input.deaf
                }), null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until || $report(_exceptionable, {
                    path: _path + ".communication_disabled_until",
                    expected: "(null | string | undefined)",
                    value: input.communication_disabled_until
                }), null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar || $report(_exceptionable, {
                    path: _path + ".avatar",
                    expected: "(null | string | undefined)",
                    value: input.avatar
                })].every((flag: boolean) => flag);
            const $vo25 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(null | string)",
                    value: input.name
                }), undefined === input.application_id || "string" === typeof input.application_id || $report(_exceptionable, {
                    path: _path + ".application_id",
                    expected: "(string | undefined)",
                    value: input.application_id
                }), null === input.icon || undefined === input.icon || "string" === typeof input.icon || $report(_exceptionable, {
                    path: _path + ".icon",
                    expected: "(null | string | undefined)",
                    value: input.icon
                }), undefined === input.owner_id || "string" === typeof input.owner_id || $report(_exceptionable, {
                    path: _path + ".owner_id",
                    expected: "(string | undefined)",
                    value: input.owner_id
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), undefined === input.managed || "boolean" === typeof input.managed || $report(_exceptionable, {
                    path: _path + ".managed",
                    expected: "(boolean | undefined)",
                    value: input.managed
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 3 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "3",
                    value: input.type
                }), undefined === input.recipients || (Array.isArray(input.recipients) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })) && input.recipients.map((elem: any, _index17: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index17 + "]",
                    expected: "APIUser",
                    value: elem
                })) && $vo1(elem, _path + ".recipients[" + _index17 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index17 + "]",
                    expected: "APIUser",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })].every((flag: boolean) => flag);
            const $vo26 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(undefined !== input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "null",
                    value: input.name
                })) && (null === input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "null",
                    value: input.name
                })), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 1 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "1",
                    value: input.type
                }), undefined === input.recipients || (Array.isArray(input.recipients) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })) && input.recipients.map((elem: any, _index18: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index18 + "]",
                    expected: "APIUser",
                    value: elem
                })) && $vo1(elem, _path + ".recipients[" + _index18 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".recipients[" + _index18 + "]",
                    expected: "APIUser",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".recipients",
                    expected: "(Array<APIUser> | undefined)",
                    value: input.recipients
                })].every((flag: boolean) => flag);
            const $vo27 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".default_auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60 | undefined)",
                    value: input.default_auto_archive_duration
                }), undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".default_thread_rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.default_thread_rate_limit_per_user
                }), null === input.topic || undefined === input.topic || "string" === typeof input.topic || $report(_exceptionable, {
                    path: _path + ".topic",
                    expected: "(null | string | undefined)",
                    value: input.topic
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 0 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "0",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index19: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index19 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index19 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index19 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo28 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), 0 === input.type || 1 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(0 | 1)",
                    value: input.type
                }), "string" === typeof input.allow || $report(_exceptionable, {
                    path: _path + ".allow",
                    expected: "string",
                    value: input.allow
                }), "string" === typeof input.deny || $report(_exceptionable, {
                    path: _path + ".deny",
                    expected: "string",
                    value: input.deny
                })].every((flag: boolean) => flag);
            const $vo29 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".default_auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60 | undefined)",
                    value: input.default_auto_archive_duration
                }), undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".default_thread_rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.default_thread_rate_limit_per_user
                }), null === input.topic || undefined === input.topic || "string" === typeof input.topic || $report(_exceptionable, {
                    path: _path + ".topic",
                    expected: "(null | string | undefined)",
                    value: input.topic
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "5",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index20: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index20 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index20 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index20 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo30 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.bitrate || "number" === typeof input.bitrate || $report(_exceptionable, {
                    path: _path + ".bitrate",
                    expected: "(number | undefined)",
                    value: input.bitrate
                }), undefined === input.user_limit || "number" === typeof input.user_limit || $report(_exceptionable, {
                    path: _path + ".user_limit",
                    expected: "(number | undefined)",
                    value: input.user_limit
                }), null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region || $report(_exceptionable, {
                    path: _path + ".rtc_region",
                    expected: "(null | string | undefined)",
                    value: input.rtc_region
                }), undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode || $report(_exceptionable, {
                    path: _path + ".video_quality_mode",
                    expected: "(1 | 2 | undefined)",
                    value: input.video_quality_mode
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index21: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index21 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index21 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index21 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "2",
                    value: input.type
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                })].every((flag: boolean) => flag);
            const $vo31 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.bitrate || "number" === typeof input.bitrate || $report(_exceptionable, {
                    path: _path + ".bitrate",
                    expected: "(number | undefined)",
                    value: input.bitrate
                }), undefined === input.user_limit || "number" === typeof input.user_limit || $report(_exceptionable, {
                    path: _path + ".user_limit",
                    expected: "(number | undefined)",
                    value: input.user_limit
                }), null === input.rtc_region || undefined === input.rtc_region || "string" === typeof input.rtc_region || $report(_exceptionable, {
                    path: _path + ".rtc_region",
                    expected: "(null | string | undefined)",
                    value: input.rtc_region
                }), undefined === input.video_quality_mode || 1 === input.video_quality_mode || 2 === input.video_quality_mode || $report(_exceptionable, {
                    path: _path + ".video_quality_mode",
                    expected: "(1 | 2 | undefined)",
                    value: input.video_quality_mode
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index22: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index22 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index22 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index22 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), 13 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "13",
                    value: input.type
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                })].every((flag: boolean) => flag);
            const $vo32 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index23: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index23 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index23 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index23 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), 4 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "4",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo33 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.member || ("object" === typeof input.member && null !== input.member || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIThreadMember | undefined)",
                    value: input.member
                })) && $vo34(input.member, _path + ".member", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIThreadMember | undefined)",
                    value: input.member
                }), undefined === input.thread_metadata || ("object" === typeof input.thread_metadata && null !== input.thread_metadata || $report(_exceptionable, {
                    path: _path + ".thread_metadata",
                    expected: "(APIThreadMetadata | undefined)",
                    value: input.thread_metadata
                })) && $vo36(input.thread_metadata, _path + ".thread_metadata", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".thread_metadata",
                    expected: "(APIThreadMetadata | undefined)",
                    value: input.thread_metadata
                }), undefined === input.message_count || "number" === typeof input.message_count || $report(_exceptionable, {
                    path: _path + ".message_count",
                    expected: "(number | undefined)",
                    value: input.message_count
                }), undefined === input.member_count || "number" === typeof input.member_count || $report(_exceptionable, {
                    path: _path + ".member_count",
                    expected: "(number | undefined)",
                    value: input.member_count
                }), undefined === input.owner_id || "string" === typeof input.owner_id || $report(_exceptionable, {
                    path: _path + ".owner_id",
                    expected: "(string | undefined)",
                    value: input.owner_id
                }), undefined === input.total_message_sent || "number" === typeof input.total_message_sent || $report(_exceptionable, {
                    path: _path + ".total_message_sent",
                    expected: "(number | undefined)",
                    value: input.total_message_sent
                }), (Array.isArray(input.applied_tags) || $report(_exceptionable, {
                    path: _path + ".applied_tags",
                    expected: "Array<string>",
                    value: input.applied_tags
                })) && input.applied_tags.map((elem: any, _index24: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".applied_tags[" + _index24 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".applied_tags",
                    expected: "Array<string>",
                    value: input.applied_tags
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 10 === input.type || 11 === input.type || 12 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(10 | 11 | 12)",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index25: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index25 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index25 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index25 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo34 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string | undefined)",
                    value: input.id
                }), undefined === input.user_id || "string" === typeof input.user_id || $report(_exceptionable, {
                    path: _path + ".user_id",
                    expected: "(string | undefined)",
                    value: input.user_id
                }), "string" === typeof input.join_timestamp || $report(_exceptionable, {
                    path: _path + ".join_timestamp",
                    expected: "string",
                    value: input.join_timestamp
                }), 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 2 | 4 | 8)",
                    value: input.flags
                }), undefined === input.member || ("object" === typeof input.member && null !== input.member || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIGuildMember | undefined)",
                    value: input.member
                })) && $vo35(input.member, _path + ".member", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".member",
                    expected: "(APIGuildMember | undefined)",
                    value: input.member
                })].every((flag: boolean) => flag);
            const $vo35 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.user || ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                }), null === input.nick || undefined === input.nick || "string" === typeof input.nick || $report(_exceptionable, {
                    path: _path + ".nick",
                    expected: "(null | string | undefined)",
                    value: input.nick
                }), null === input.avatar || undefined === input.avatar || "string" === typeof input.avatar || $report(_exceptionable, {
                    path: _path + ".avatar",
                    expected: "(null | string | undefined)",
                    value: input.avatar
                }), (Array.isArray(input.roles) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                })) && input.roles.map((elem: any, _index26: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".roles[" + _index26 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".roles",
                    expected: "Array<string>",
                    value: input.roles
                }), "string" === typeof input.joined_at || $report(_exceptionable, {
                    path: _path + ".joined_at",
                    expected: "string",
                    value: input.joined_at
                }), null === input.premium_since || undefined === input.premium_since || "string" === typeof input.premium_since || $report(_exceptionable, {
                    path: _path + ".premium_since",
                    expected: "(null | string | undefined)",
                    value: input.premium_since
                }), "boolean" === typeof input.deaf || $report(_exceptionable, {
                    path: _path + ".deaf",
                    expected: "boolean",
                    value: input.deaf
                }), "boolean" === typeof input.mute || $report(_exceptionable, {
                    path: _path + ".mute",
                    expected: "boolean",
                    value: input.mute
                }), 1 === input.flags || 2 === input.flags || 4 === input.flags || 8 === input.flags || 32 === input.flags || 64 === input.flags || 128 === input.flags || 256 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 2 | 256 | 32 | 4 | 64 | 8)",
                    value: input.flags
                }), undefined === input.pending || "boolean" === typeof input.pending || $report(_exceptionable, {
                    path: _path + ".pending",
                    expected: "(boolean | undefined)",
                    value: input.pending
                }), null === input.communication_disabled_until || undefined === input.communication_disabled_until || "string" === typeof input.communication_disabled_until || $report(_exceptionable, {
                    path: _path + ".communication_disabled_until",
                    expected: "(null | string | undefined)",
                    value: input.communication_disabled_until
                })].every((flag: boolean) => flag);
            const $vo36 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["boolean" === typeof input.archived || $report(_exceptionable, {
                    path: _path + ".archived",
                    expected: "boolean",
                    value: input.archived
                }), 60 === input.auto_archive_duration || 1440 === input.auto_archive_duration || 4320 === input.auto_archive_duration || 10080 === input.auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60)",
                    value: input.auto_archive_duration
                }), "string" === typeof input.archive_timestamp || $report(_exceptionable, {
                    path: _path + ".archive_timestamp",
                    expected: "string",
                    value: input.archive_timestamp
                }), undefined === input.locked || "boolean" === typeof input.locked || $report(_exceptionable, {
                    path: _path + ".locked",
                    expected: "(boolean | undefined)",
                    value: input.locked
                }), undefined === input.invitable || "boolean" === typeof input.invitable || $report(_exceptionable, {
                    path: _path + ".invitable",
                    expected: "(boolean | undefined)",
                    value: input.invitable
                }), undefined === input.create_timestamp || "string" === typeof input.create_timestamp || $report(_exceptionable, {
                    path: _path + ".create_timestamp",
                    expected: "(string | undefined)",
                    value: input.create_timestamp
                })].every((flag: boolean) => flag);
            const $vo37 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.available_tags) || $report(_exceptionable, {
                    path: _path + ".available_tags",
                    expected: "Array<APIGuildForumTag>",
                    value: input.available_tags
                })) && input.available_tags.map((elem: any, _index27: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".available_tags[" + _index27 + "]",
                    expected: "APIGuildForumTag",
                    value: elem
                })) && $vo38(elem, _path + ".available_tags[" + _index27 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".available_tags[" + _index27 + "]",
                    expected: "APIGuildForumTag",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".available_tags",
                    expected: "Array<APIGuildForumTag>",
                    value: input.available_tags
                }), null === input.default_reaction_emoji || ("object" === typeof input.default_reaction_emoji && null !== input.default_reaction_emoji || $report(_exceptionable, {
                    path: _path + ".default_reaction_emoji",
                    expected: "(APIGuildForumDefaultReactionEmoji | null)",
                    value: input.default_reaction_emoji
                })) && $vo39(input.default_reaction_emoji, _path + ".default_reaction_emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".default_reaction_emoji",
                    expected: "(APIGuildForumDefaultReactionEmoji | null)",
                    value: input.default_reaction_emoji
                }), null === input.default_sort_order || 0 === input.default_sort_order || 1 === input.default_sort_order || $report(_exceptionable, {
                    path: _path + ".default_sort_order",
                    expected: "(0 | 1 | null)",
                    value: input.default_sort_order
                }), 0 === input.default_forum_layout || 1 === input.default_forum_layout || 2 === input.default_forum_layout || $report(_exceptionable, {
                    path: _path + ".default_forum_layout",
                    expected: "(0 | 1 | 2)",
                    value: input.default_forum_layout
                }), undefined === input.default_auto_archive_duration || 60 === input.default_auto_archive_duration || 1440 === input.default_auto_archive_duration || 4320 === input.default_auto_archive_duration || 10080 === input.default_auto_archive_duration || $report(_exceptionable, {
                    path: _path + ".default_auto_archive_duration",
                    expected: "(10080 | 1440 | 4320 | 60 | undefined)",
                    value: input.default_auto_archive_duration
                }), undefined === input.default_thread_rate_limit_per_user || "number" === typeof input.default_thread_rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".default_thread_rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.default_thread_rate_limit_per_user
                }), null === input.topic || undefined === input.topic || "string" === typeof input.topic || $report(_exceptionable, {
                    path: _path + ".topic",
                    expected: "(null | string | undefined)",
                    value: input.topic
                }), "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.flags || 1 === input.flags || 2 === input.flags || 4 === input.flags || 16 === input.flags || 32 === input.flags || 128 === input.flags || 256 === input.flags || 512 === input.flags || $report(_exceptionable, {
                    path: _path + ".flags",
                    expected: "(1 | 128 | 16 | 2 | 256 | 32 | 4 | 512 | undefined)",
                    value: input.flags
                }), undefined === input.rate_limit_per_user || "number" === typeof input.rate_limit_per_user || $report(_exceptionable, {
                    path: _path + ".rate_limit_per_user",
                    expected: "(number | undefined)",
                    value: input.rate_limit_per_user
                }), null === input.last_message_id || undefined === input.last_message_id || "string" === typeof input.last_message_id || $report(_exceptionable, {
                    path: _path + ".last_message_id",
                    expected: "(null | string | undefined)",
                    value: input.last_message_id
                }), null === input.last_pin_timestamp || undefined === input.last_pin_timestamp || "string" === typeof input.last_pin_timestamp || $report(_exceptionable, {
                    path: _path + ".last_pin_timestamp",
                    expected: "(null | string | undefined)",
                    value: input.last_pin_timestamp
                }), 15 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "15",
                    value: input.type
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.permission_overwrites || (Array.isArray(input.permission_overwrites) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                })) && input.permission_overwrites.map((elem: any, _index28: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index28 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })) && $vo28(elem, _path + ".permission_overwrites[" + _index28 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites[" + _index28 + "]",
                    expected: "APIOverwrite",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".permission_overwrites",
                    expected: "(Array<APIOverwrite> | undefined)",
                    value: input.permission_overwrites
                }), "number" === typeof input.position || $report(_exceptionable, {
                    path: _path + ".position",
                    expected: "number",
                    value: input.position
                }), null === input.parent_id || undefined === input.parent_id || "string" === typeof input.parent_id || $report(_exceptionable, {
                    path: _path + ".parent_id",
                    expected: "(null | string | undefined)",
                    value: input.parent_id
                }), undefined === input.nsfw || "boolean" === typeof input.nsfw || $report(_exceptionable, {
                    path: _path + ".nsfw",
                    expected: "(boolean | undefined)",
                    value: input.nsfw
                })].every((flag: boolean) => flag);
            const $vo38 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "boolean" === typeof input.moderated || $report(_exceptionable, {
                    path: _path + ".moderated",
                    expected: "boolean",
                    value: input.moderated
                }), null === input.emoji_id || "string" === typeof input.emoji_id || $report(_exceptionable, {
                    path: _path + ".emoji_id",
                    expected: "(null | string)",
                    value: input.emoji_id
                }), null === input.emoji_name || "string" === typeof input.emoji_name || $report(_exceptionable, {
                    path: _path + ".emoji_name",
                    expected: "(null | string)",
                    value: input.emoji_name
                })].every((flag: boolean) => flag);
            const $vo39 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [null === input.emoji_id || "string" === typeof input.emoji_id || $report(_exceptionable, {
                    path: _path + ".emoji_id",
                    expected: "(null | string)",
                    value: input.emoji_id
                }), null === input.emoji_name || "string" === typeof input.emoji_name || $report(_exceptionable, {
                    path: _path + ".emoji_name",
                    expected: "(null | string)",
                    value: input.emoji_name
                })].every((flag: boolean) => flag);
            const $vo40 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.components) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "Array<APIMessageActionRowComponent>",
                    value: input.components
                })) && input.components.map((elem: any, _index29: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".components[" + _index29 + "]",
                    expected: "(APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIChannelSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIStringSelectComponent | APIUserSelectComponent)",
                    value: elem
                })) && $vu0(elem, _path + ".components[" + _index29 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".components[" + _index29 + "]",
                    expected: "(APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIChannelSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIStringSelectComponent | APIUserSelectComponent)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".components",
                    expected: "Array<APIMessageActionRowComponent>",
                    value: input.components
                }), 1 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "1",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo41 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.label || "string" === typeof input.label || $report(_exceptionable, {
                    path: _path + ".label",
                    expected: "(string | undefined)",
                    value: input.label
                }), 1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style || $report(_exceptionable, {
                    path: _path + ".style",
                    expected: "(1 | 2 | 3 | 4)",
                    value: input.style
                }), undefined === input.emoji || ("object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                })) && $vo42(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "2",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo42 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.id || "string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "(string | undefined)",
                    value: input.id
                }), undefined === input.name || "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), undefined === input.animated || "boolean" === typeof input.animated || $report(_exceptionable, {
                    path: _path + ".animated",
                    expected: "(boolean | undefined)",
                    value: input.animated
                })].every((flag: boolean) => flag);
            const $vo43 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.url || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), undefined === input.label || "string" === typeof input.label || $report(_exceptionable, {
                    path: _path + ".label",
                    expected: "(string | undefined)",
                    value: input.label
                }), 5 === input.style || $report(_exceptionable, {
                    path: _path + ".style",
                    expected: "5",
                    value: input.style
                }), undefined === input.emoji || ("object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                })) && $vo42(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "2",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo44 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [(Array.isArray(input.options) || $report(_exceptionable, {
                    path: _path + ".options",
                    expected: "Array<APISelectMenuOption>",
                    value: input.options
                })) && input.options.map((elem: any, _index30: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".options[" + _index30 + "]",
                    expected: "APISelectMenuOption",
                    value: elem
                })) && $vo45(elem, _path + ".options[" + _index30 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".options[" + _index30 + "]",
                    expected: "APISelectMenuOption",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".options",
                    expected: "Array<APISelectMenuOption>",
                    value: input.options
                }), "string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 3 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "3",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo45 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.label || $report(_exceptionable, {
                    path: _path + ".label",
                    expected: "string",
                    value: input.label
                }), "string" === typeof input.value || $report(_exceptionable, {
                    path: _path + ".value",
                    expected: "string",
                    value: input.value
                }), undefined === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(string | undefined)",
                    value: input.description
                }), undefined === input.emoji || ("object" === typeof input.emoji && null !== input.emoji && false === Array.isArray(input.emoji) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                })) && $vo42(input.emoji, _path + ".emoji", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".emoji",
                    expected: "(APIMessageComponentEmoji | undefined)",
                    value: input.emoji
                }), undefined === input["default"] || "boolean" === typeof input["default"] || $report(_exceptionable, {
                    path: _path + "[\"default\"]",
                    expected: "(boolean | undefined)",
                    value: input["default"]
                })].every((flag: boolean) => flag);
            const $vo46 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 5 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "5",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo47 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 6 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "6",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo48 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 7 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "7",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo49 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.channel_types || (Array.isArray(input.channel_types) || $report(_exceptionable, {
                    path: _path + ".channel_types",
                    expected: "(Array<ChannelType> | undefined)",
                    value: input.channel_types
                })) && input.channel_types.map((elem: any, _index31: number) => 0 === elem || 1 === elem || 2 === elem || 3 === elem || 4 === elem || 5 === elem || 10 === elem || 11 === elem || 12 === elem || 13 === elem || 14 === elem || 15 === elem || $report(_exceptionable, {
                    path: _path + ".channel_types[" + _index31 + "]",
                    expected: "(0 | 1 | 10 | 11 | 12 | 13 | 14 | 15 | 2 | 3 | 4 | 5)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".channel_types",
                    expected: "(Array<ChannelType> | undefined)",
                    value: input.channel_types
                }), "string" === typeof input.custom_id || $report(_exceptionable, {
                    path: _path + ".custom_id",
                    expected: "string",
                    value: input.custom_id
                }), undefined === input.placeholder || "string" === typeof input.placeholder || $report(_exceptionable, {
                    path: _path + ".placeholder",
                    expected: "(string | undefined)",
                    value: input.placeholder
                }), undefined === input.min_values || "number" === typeof input.min_values && ($is_custom("default", "number", "1", input.min_values) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "number (@default 1)",
                    value: input.min_values
                })) || $report(_exceptionable, {
                    path: _path + ".min_values",
                    expected: "(number | undefined)",
                    value: input.min_values
                }), undefined === input.max_values || "number" === typeof input.max_values && ($is_custom("default", "number", "1", input.max_values) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "number (@default 1)",
                    value: input.max_values
                })) || $report(_exceptionable, {
                    path: _path + ".max_values",
                    expected: "(number | undefined)",
                    value: input.max_values
                }), undefined === input.disabled || "boolean" === typeof input.disabled || $report(_exceptionable, {
                    path: _path + ".disabled",
                    expected: "(boolean | undefined)",
                    value: input.disabled
                }), 8 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "8",
                    value: input.type
                })].every((flag: boolean) => flag);
            const $vo50 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), 1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type || $report(_exceptionable, {
                    path: _path + ".format_type",
                    expected: "(1 | 2 | 3 | 4)",
                    value: input.format_type
                })].every((flag: boolean) => flag);
            const $vo51 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), undefined === input.pack_id || "string" === typeof input.pack_id || $report(_exceptionable, {
                    path: _path + ".pack_id",
                    expected: "(string | undefined)",
                    value: input.pack_id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), null === input.description || "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "(null | string)",
                    value: input.description
                }), "string" === typeof input.tags || $report(_exceptionable, {
                    path: _path + ".tags",
                    expected: "string",
                    value: input.tags
                }), undefined === input.asset || "" === input.asset || $report(_exceptionable, {
                    path: _path + ".asset",
                    expected: "(\"\" | undefined)",
                    value: input.asset
                }), 1 === input.type || 2 === input.type || $report(_exceptionable, {
                    path: _path + ".type",
                    expected: "(1 | 2)",
                    value: input.type
                }), 1 === input.format_type || 2 === input.format_type || 3 === input.format_type || 4 === input.format_type || $report(_exceptionable, {
                    path: _path + ".format_type",
                    expected: "(1 | 2 | 3 | 4)",
                    value: input.format_type
                }), undefined === input.available || "boolean" === typeof input.available || $report(_exceptionable, {
                    path: _path + ".available",
                    expected: "(boolean | undefined)",
                    value: input.available
                }), undefined === input.guild_id || "string" === typeof input.guild_id || $report(_exceptionable, {
                    path: _path + ".guild_id",
                    expected: "(string | undefined)",
                    value: input.guild_id
                }), undefined === input.user || ("object" === typeof input.user && null !== input.user || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                })) && $vo1(input.user, _path + ".user", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".user",
                    expected: "(APIUser | undefined)",
                    value: input.user
                }), undefined === input.sort_value || "number" === typeof input.sort_value || $report(_exceptionable, {
                    path: _path + ".sort_value",
                    expected: "(number | undefined)",
                    value: input.sort_value
                })].every((flag: boolean) => flag);
            const $vo52 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.role_subscription_listing_id || $report(_exceptionable, {
                    path: _path + ".role_subscription_listing_id",
                    expected: "string",
                    value: input.role_subscription_listing_id
                }), "string" === typeof input.tier_name || $report(_exceptionable, {
                    path: _path + ".tier_name",
                    expected: "string",
                    value: input.tier_name
                }), "number" === typeof input.total_months_subscribed || $report(_exceptionable, {
                    path: _path + ".total_months_subscribed",
                    expected: "number",
                    value: input.total_months_subscribed
                }), "boolean" === typeof input.is_renewal || $report(_exceptionable, {
                    path: _path + ".is_renewal",
                    expected: "boolean",
                    value: input.is_renewal
                })].every((flag: boolean) => flag);
            const $vu0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if (1 === input.style || 2 === input.style || 3 === input.style || 4 === input.style)
                    return $vo41(input, _path, true && _exceptionable);
                if (5 === input.style)
                    return $vo43(input, _path, true && _exceptionable);
                if (3 === input.type)
                    return $vo44(input, _path, true && _exceptionable);
                if (7 === input.type)
                    return $vo48(input, _path, true && _exceptionable);
                if (6 === input.type)
                    return $vo47(input, _path, true && _exceptionable);
                if (5 === input.type)
                    return $vo46(input, _path, true && _exceptionable);
                if (8 === input.type)
                    return $vo49(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(APIButtonComponentWithCustomId | APIButtonComponentWithURL | APIStringSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIUserSelectComponent | APIChannelSelectComponent)",
                    value: input
                });
            })();
            const $vu1 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if (3 === input.type)
                    return $vo25(input, _path, true && _exceptionable);
                if (1 === input.type)
                    return $vo26(input, _path, true && _exceptionable);
                if (5 === input.type)
                    return $vo29(input, _path, true && _exceptionable);
                if (0 === input.type)
                    return $vo27(input, _path, true && _exceptionable);
                if (13 === input.type)
                    return $vo31(input, _path, true && _exceptionable);
                if (2 === input.type)
                    return $vo30(input, _path, true && _exceptionable);
                if (4 === input.type)
                    return $vo32(input, _path, true && _exceptionable);
                if (10 === input.type || 11 === input.type || 12 === input.type)
                    return $vo33(input, _path, true && _exceptionable);
                if (undefined !== input.default_sort_order)
                    return $vo37(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(APIGroupDMChannel | APIDMChannel | APINewsChannel | APITextChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APIGuildCategoryChannel | APIThreadChannel | APIGuildForumChannel)",
                    value: input
                });
            })();
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "APIMessage",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "APIMessage",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
export const validateMessageAPI = (input: any): typia.IValidation<APIError | APIMessageResponse> => {
    const errors = [] as any[];
    const __is = (input: any): input is APIError | APIMessageResponse => {
        const $io0 = (input: any): boolean => "number" === typeof input.code && "string" === typeof input.message;
        const $io1 = (input: any): boolean => "string" === typeof input.id && "string" === typeof input.channel_id && "string" === typeof input.content && ("object" === typeof input.author && null !== input.author && "string" === typeof (input.author as any).id) && "string" === typeof input.timestamp;
        const $iu0 = (input: any): any => (() => {
            if (undefined !== input.code)
                return $io0(input);
            if (undefined !== input.id)
                return $io1(input);
            return false;
        })();
        return "object" === typeof input && null !== input && $iu0(input);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidate as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is APIError | APIMessageResponse => {
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.code || $report(_exceptionable, {
                    path: _path + ".code",
                    expected: "number",
                    value: input.code
                }), "string" === typeof input.message || $report(_exceptionable, {
                    path: _path + ".message",
                    expected: "string",
                    value: input.message
                })].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.channel_id || $report(_exceptionable, {
                    path: _path + ".channel_id",
                    expected: "string",
                    value: input.channel_id
                }), "string" === typeof input.content || $report(_exceptionable, {
                    path: _path + ".content",
                    expected: "string",
                    value: input.content
                }), ("object" === typeof input.author && null !== input.author || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "__type",
                    value: input.author
                })) && $vo2(input.author, _path + ".author", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".author",
                    expected: "__type",
                    value: input.author
                }), "string" === typeof input.timestamp || $report(_exceptionable, {
                    path: _path + ".timestamp",
                    expected: "string",
                    value: input.timestamp
                })].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                })].every((flag: boolean) => flag);
            const $vu0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if (undefined !== input.code)
                    return $vo0(input, _path, true && _exceptionable);
                if (undefined !== input.id)
                    return $vo1(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(APIError | APIMessageResponse)",
                    value: input
                });
            })();
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "(APIError | APIMessageResponse)",
                value: input
            })) && $vu0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "(APIError | APIMessageResponse)",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
