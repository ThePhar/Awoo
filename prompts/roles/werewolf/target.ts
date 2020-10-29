import { Color, werewolfEmoji } from "../../../types";
import { EmojiList, Prompt } from "../../prompt";
import { MessageEmbed, MessageReaction, TextChannel, User } from "discord.js";
import { formatPrompts, formatWerewolfTargets, safeFormat, version } from "../../../util";
import { Game } from "../../../structs/game";
import { Manager } from "../../../structs/manager";
import { Player } from "../../../structs/player";
import { Store } from "redux";
import dedent from "dedent";
import { werewolfTarget } from "../../../actions/roles/werewolf/creators";

interface WerewolfTargetMetaProperties {
  availableTargets: Player[];
  index: number;
}

interface DefaultEmbedProperties {
  gameChannel: TextChannel;
  index: number;
  total: number;
  user: User;
  self: string;
  store: Store<Game>;
}

export class WerewolfTargetPrompt extends Prompt {
  protected static readonly supportedReactions: EmojiList = {
    previous: { emoji: "⬅️", description: "Previous Player" },
    next: { emoji: "➡️", description: "Next Player" },
    confirm: { emoji: "✅", description: "Target Selected Player" }
  };

  private meta: WerewolfTargetMetaProperties = { availableTargets: [], index: 0 };

  public static async create(manager: Manager, store: Store<Game>, player: string): Promise<WerewolfTargetPrompt> {
    const availableTargets = WerewolfTargetPrompt.getAvailableTargets(store);
    const gameChannel = await manager.channels.fetch(store.getState().id) as TextChannel;
    const user = await manager.users.fetch(player);
    const initialUser = await manager.users.fetch(availableTargets[0].id);

    // Create the embed for this object.
    const embed = this.defaultEmbed({ total: availableTargets.length, gameChannel, index: 0, user: initialUser, store, self: player });
    const message = await user.send(embed);

    // Create the prompt for this.
    const prompt = new WerewolfTargetPrompt({ gameChannel, manager, message, playerId: player, store });

    // Add reactions.
    for (const emoji in this.supportedReactions) {
      await message.react(this.supportedReactions[emoji].emoji);
    }

    // Set prompt's properties.
    prompt.meta.availableTargets = availableTargets;

    prompt.addPrompt();
    return prompt;
  }

  public async handleReaction(reaction: MessageReaction): Promise<void> {
    const emoji = reaction.emoji.name;
    const max = this.meta.availableTargets.length - 1;

    switch (emoji) {
      // Previous selection.
      case WerewolfTargetPrompt.supportedReactions.previous.emoji:
        this.meta.index -= 1;
        if (this.meta.index < 0)
          this.meta.index = max;
        break;

      // Next selection.
      case WerewolfTargetPrompt.supportedReactions.next.emoji:
        this.meta.index += 1;
        if (this.meta.index > max)
          this.meta.index = 0;
        break;

      case WerewolfTargetPrompt.supportedReactions.confirm.emoji:
        this.store.dispatch(werewolfTarget(this.playerId, this.meta.availableTargets[this.meta.index].id));
        await this.message.edit(await this.targetEmbed());

        // Update all other werewolves that the target has been changed.
        for (const [id, player] of this.state.players) {
          if (player.role.werewolf && id !== this.playerId) {
            const werewolf = await this.manager.users.fetch(id);
            await werewolf.send(
              `${player.name} has targeted ${this.meta.availableTargets[this.meta.index].name}.`
            );
          }
        }

        // Remove this prompt and reactions.
        this.removePrompt();
        return;
    }

    const user = await this.manager.users.fetch(this.meta.availableTargets[this.meta.index].id);

    // Update message if we didn't close this out!
    await this.message.edit(WerewolfTargetPrompt.defaultEmbed({
      gameChannel: this.gameChannel,
      total: this.meta.availableTargets.length,
      index: this.meta.index,
      user,
      store: this.store,
      self: this.playerId
    }));
  }

  protected static defaultEmbed({ gameChannel, index, total, user, store, self }: DefaultEmbedProperties): MessageEmbed {
    // Format these nicely.
    const currentUser = index + 1;
    const prompts = formatPrompts(this.supportedReactions);

    // Get our fancy embed.
    return new MessageEmbed()
      .setTitle(`Feasting Time - Target ${user.username}?`)
      .setColor(Color.Red)
      .setAuthor(`${gameChannel.guild.name} - #${gameChannel.name}`)
      .setThumbnail(user.displayAvatarURL())
      .setFooter(version, werewolfEmoji)
      .setDescription(dedent(`
        It's a werewolf's favorite time of day, feasting time. Choose a player to eliminate when the night ends. You and your werewolf companions must unambiguously choose a single player to eliminate. If the moderator cannot figure out a single player to eliminate, no one will be eliminated and you will have wasted a day. You must target a player before the night ends.
        
        **[${currentUser}/${total}]** Do you want to target **${user.username}**?
        
        *It may take some time for the prompt to update as Discord's API only allows so many updates within a certain amount of time.*
      `))
      .addField("Prompts", safeFormat(prompts), true)
      .addField("Fellow Werewolf Targets", formatWerewolfTargets(store.getState().players, self), true);
  }

  private async targetEmbed(): Promise<MessageEmbed> {
    const target = this.meta.availableTargets[this.meta.index];
    const prompts = formatPrompts(WerewolfTargetPrompt.supportedReactions);
    let targetAvatar: string;

    // Attempt to get the URL to the avatar of this player.
    try {
      const targetUser = await this.manager.users.fetch(target.id);
      targetAvatar = targetUser.displayAvatarURL();
    } catch {
      targetAvatar = "";
    }

    return new MessageEmbed()
      .setTitle(`Feasting Time - Targeting ${target.name} For Elimination`)
      .setColor(Color.Red)
      .setAuthor(`${this.gameChannel.guild.name} - #${this.gameChannel.name}`)
      .setThumbnail(targetAvatar)
      .setFooter(version, werewolfEmoji)
      .setDescription(dedent(`
        You have chosen to eliminate **${target.name}**.
      `))
      .addField("Prompts", safeFormat(prompts), true)
      .addField("Fellow Werewolf Targets", formatWerewolfTargets(this.state.players, this.playerId), true);
  }

  private static getAvailableTargets(store: Store<Game>): Player[] {
    const state = store.getState();

    // Get a list of all available targets.
    const availableTargets: Player[] = [];
    for (const [, player] of state.players) {
      // You cannot target players that are eliminated.
      if (!player.alive) continue;
      // You cannot target fellow werewolves (which includes yourself).
      if (player.role.werewolf) continue;

      availableTargets.push(player);
    }

    return availableTargets;
  }
}
