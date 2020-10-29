import { EmojiList, Prompt } from "../../prompt";
import { Game, Manager, Player } from "../../../structs";
import { MessageEmbed, MessageReaction, TextChannel } from "discord.js";
import { formatPrompts, formatTargets, safeFormat, version } from "../../../util";
import { Color } from "../../../types";
import { Store } from "redux";
import dedent from "dedent";
import { werewolfTarget } from "../../../actions/";

interface WerewolfTargetMetaProperties {
  availableTargets: Player[];
  index: number;
}

interface DefaultEmbedProperties extends WerewolfTargetMetaProperties {
  gameChannel: TextChannel;
}

export class WerewolfTargetPrompt extends Prompt {
  protected static readonly supportedReactions: EmojiList = {
    previous: { emoji: "⬆️", description: "Previous Player" },
    next: { emoji: "⬇️", description: "Next Player" },
    confirm: { emoji: "✅", description: "Target Selected Player" }
  };

  private readonly meta: WerewolfTargetMetaProperties = { availableTargets: [], index: 0 };

  public static async create(manager: Manager, store: Store<Game>, player: string): Promise<WerewolfTargetPrompt> {
    const availableTargets = WerewolfTargetPrompt.getAvailableTargets(store);
    const gameChannel = await manager.channels.fetch(store.getState().id) as TextChannel;
    const user = await manager.users.fetch(player);

    // Create the embed for this object.
    const embed = this.defaultEmbed({ availableTargets, gameChannel, index: 0 });
    const message = await user.send(embed);

    // Create the prompt for this.
    const prompt = new WerewolfTargetPrompt({ gameChannel, manager, message, playerId: player, store });

    // Add reactions.
    for (const emoji in this.supportedReactions) {
      await message.react(this.supportedReactions[emoji].emoji);
    }

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

        this.removePrompt();
        return;
    }

    // Update message if we didn't close this out!
    await this.message.edit(WerewolfTargetPrompt.defaultEmbed({
      gameChannel: this.gameChannel,
      availableTargets: this.meta.availableTargets,
      index: this.meta.index
    }));
  }

  protected static defaultEmbed({ availableTargets, gameChannel, index }: DefaultEmbedProperties): MessageEmbed {
    // Format these nicely.
    const targets = formatTargets(availableTargets, index);
    const prompts = formatPrompts(this.supportedReactions);

    // Get our fancy embed.
    return new MessageEmbed()
      .setTitle("Feasting Time")
      .setColor(Color.Red)
      .setTitle(`${gameChannel.guild.name} - #${gameChannel.name}`)
      .setFooter(version)
      .setDescription(dedent(`
        It's a werewolf's favorite time of day, feasting time. Choose a player to eliminate when the night ends. You and your werewolf companions must unambiguously choose a single player to eliminate. If the moderator cannot figure out a single player to eliminate, no one will be eliminated and you will have wasted a day. Once you choose a player, you cannot change your target. You will be notified of the targets of your fellow werewolf companions.
      `))
      .addField("Available Targets", safeFormat(targets), true)
      .addField("Prompts", safeFormat(prompts), true);
  }

  private async targetEmbed(): Promise<MessageEmbed> {
    const target = this.meta.availableTargets[this.meta.index];
    let targetAvatar: string;

    // Attempt to get the URL to the avatar of this player.
    try {
      const targetUser = await this.manager.users.fetch(target.id);
      targetAvatar = targetUser.displayAvatarURL();
    } catch {
      targetAvatar = "";
    }

    return new MessageEmbed()
      .setTitle("Feasting Time")
      .setColor(Color.Red)
      .setTitle(`${this.gameChannel.guild.name} - #${this.gameChannel.name}`)
      .setThumbnail(targetAvatar)
      .setFooter(version)
      .setDescription(dedent(`
        You have chosen to eliminate **${target.name}**.
      `));
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
