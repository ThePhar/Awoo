import { EmojiList } from "../prompts";
import { Player } from "../structs";

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
