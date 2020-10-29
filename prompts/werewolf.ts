import { MessageEmbed, MessageReaction } from "discord.js";
import Player from "../structs/player";
import Prompt from "./base";
import { safeStringArray } from "../util/embed";
import { werewolfTarget } from "../actions/roles/werewolf";

interface WerewolfTargetMetaProperties {
  availableTargets: Player[];
  index: number;
}

export default class WerewolfTargetPrompt extends Prompt {
  public meta: WerewolfTargetMetaProperties = { availableTargets: [], index: 0 }
  public readonly emojis = {
    prev: { emoji: "⬆️", description: "Previous Player" },
    next: { emoji: "⬇️", description: "Next Player" },
    confirm: { emoji: "✅", description: "Target Selected Player" }
  }

  public async onCreation(): Promise<void> {
    await super.onCreation();

    // Get all available targets.
    for (const [, player] of this.state.players) {
      if (!player.role.werewolf && player.flags.alive) {
        this.meta.availableTargets.push(player);
      }
    }

    // No targets available.
    if (this.meta.availableTargets.length === 0) {
      await this.message.edit(this.noTargetsEmbed());
      await this.message.reactions.removeAll();
      this.finalize();
    }

    await this.message.edit(this.chooseTargetEmbed());
  }

  public onReaction = async (reaction: MessageReaction): Promise<void> => {
    const emoji = reaction.emoji.name;
    const max = this.meta.availableTargets.length - 1;

    switch (emoji) {
      // Previous selection.
      case this.emojis.prev.emoji:
        this.meta.index -= 1;
        if (this.meta.index < 0)
          this.meta.index = max;
        return;

      // Next selection.
      case this.emojis.next.emoji:
        this.meta.index += 1;
        if (this.meta.index > max)
          this.meta.index = 0;
        return;

      case this.emojis.confirm.emoji:
        this.store.dispatch(
          werewolfTarget(this.player, this.meta.availableTargets[this.meta.index].id));

        await this.message.edit(
          this.targetChosenEmbed(this.meta.availableTargets[this.meta.index]));

        // Update all other werewolves that the target has been changed.
        for (const [id, player] of this.state.players) {
          if (player.role.werewolf && id !== this.player) {
            const werewolf = await this.manager.users.fetch(id);

            await werewolf.send(`${player.name} has targeted ${this.meta.availableTargets[this.meta.index].name}.`);
          }
        }

        this.finalize();
    }
  }

  public static defaultEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setTitle("Time to Feast")
      .setDescription("Loading players to target...");
  }

  private noTargetsEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setTitle("No One To Feast On")
      .setDescription("You have no available targets to feast on. Not sure how this is possible, but here we are.");
  }

  private targetChosenEmbed(target: Player): MessageEmbed {
    return new MessageEmbed()
      .setTitle("Target Locked")
      .setDescription(`You have targeted ${target.name}.`);
  }

  private chooseTargetEmbed(): MessageEmbed {
    const availableTargets = this.meta.availableTargets;
    const index = this.meta.index;

    const targets = availableTargets.map((player, i) => {
      const selection = i === index ? "🟦" : "⬜";

      return `${selection} ${player.name}`;
    });

    const prompts = [
      `${this.emojis.prev.emoji}: ${this.emojis.prev.description}`,
      `${this.emojis.next.emoji}: ${this.emojis.next.description}`,
      `${this.emojis.confirm.emoji}: ${this.emojis.confirm.description}`
    ];

    return new MessageEmbed()
      .setTitle("Time to Feast")
      .setDescription("")
      .addFields([
        { name: "Available Targets", value: safeStringArray(targets), inline: true },
        { name: "Prompts", value: prompts, inline: true }
      ]);
  }
}
