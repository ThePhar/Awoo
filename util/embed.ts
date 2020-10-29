import { EmojiList } from "../prompts/prompt";
import { Player } from "../structs/player";
import { Werewolf } from "../roles/werewolf";

/**
 * Checks a given array to ensure there is at least one element in it. If not, returns an array with a single
 * element string with the words: None. Useful because MessageEmbed fields throw if they have empty values.
 * @param array - Any array of possibly empty string resolvable elements.
 */
export function safeFormat<T>(array: T[]): T[] | string[] {
  if (array.length === 0) {
    return ["**-- None --**"];
  }

  return array;
}

/**
 * Returns an array of nicely formatted strings that show current selection.
 * @param availableTargets - An array of players that can be targeted.
 * @param index - Current index of the player being selected.
 */
export function formatTargets(availableTargets: Player[], index: number): string[] {
  return availableTargets.map((t, i) => {
    const selectionMarker = i === index ? "🟦" : "⬜";
    return `${selectionMarker} ${t.name}`;
  });
}

export function formatWerewolfTargets(players: ReadonlyMap<string, Player>, self: string): string[] {
  const list: string[] = [];

  for (const [, player] of players) {
    // Ignore non-werewolves and this player.
    if (!player.role.werewolf || player.id === self)
      continue;

    // Treat this role as a werewolf. (For obvious reasons)
    const role = player.role as Werewolf;

    if (role.meta.target) {
      const target = players.get(role.meta.target) as Player;
      list.push(`**${player.name}** wants to eliminate **${target.name}**.`);
    } else {
      list.push(`**${player.name}** has not chosen a target.`);
    }
  }

  // Do not print an empty list if there are no other werewolves.
  if (list.length === 0) {
    list.push("***You are the only living werewolf.***");
    return list;
  }

  // TODO: Show who would be eliminated.

  return list;
}

/**
 * Returns an array of nicely formatted strings that show prompts.
 * @param emojiList - List of emojis and their descriptions.
 */
export function formatPrompts(emojiList: EmojiList): string[] {
  const list: string[] = [];

  for (const emoji in emojiList) {
    list.push(`${emojiList[emoji].emoji}: ${emojiList[emoji].description}`);
  }

  return list;
}
