import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Player from "../struct/player";
import Prompt from "../struct/prompt";
import Team from "../enum/team";
import { Villager } from "./villager";

export class Witch extends Villager {
    public override name = "Witch";
    public override pluralName = "Witches";
    public override appearance = Appearance.Villager;
    public override team = Team.Villagers;

    /* Witch Specific Fields */
    public availableToTarget: Player[] = [];
    public targetIndex = 0;
    public target?: Player;
    public doSave = false;
    public usedSavePotion = false;
    public usedKillPotion = false;

    public override async startAction(): Promise<void> {
        this.resetActionState();

        if (this.usedKillPotion && this.usedSavePotion) {
            return;
        }

        if (this.game.day === 1) {
            return;
        }

        // Get all players we can inspect.
        this.availableToTarget = this.game.players.alive.filter((player) => player.id !== this.player.id);

        // Send the action prompt and start listening for reaction events.
        const message = await this.player.send(this.actionEmbed());

        // Set the reaction images.
        if (!this.usedKillPotion) {
            await message.react("⬆️");
            await message.react("⬇️");
            await message.react("☠️");
        }

        if (this.usedSavePotion) {
            await message.react("⚕️");
        }

        // Create our prompt.
        this.prompt = new Prompt(message, this, this.reactionHandler.bind(this));
    }

    public override resetActionState(): void {
        this.availableToTarget = [];
        this.targetIndex = 0;
        this.target = undefined;
        this.doSave = false;

        if (this.prompt) {
            this.prompt.destroy();
        }
    }

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleWitch(this);
    }
    protected override actionEmbed(): D.MessageEmbed {
        return Embed.ActionWitch(this);
    }

    private async reactionHandler(react: D.MessageReaction, _: D.User): Promise<void> {
        const emoji = react.emoji.name;
        const max = this.availableToTarget.length - 1;

        // If our prompt suddenly disappeared, do not proceed.
        if (!this.prompt) return;

        // No point in asking for input if there's no one to inspect.
        if (max < 0) {
            this.prompt.destroy();
        }

        switch (emoji) {
            // Previous selection.
            case "⬆️":
                if (this.usedKillPotion) return;

                this.targetIndex -= 1;
                if (this.targetIndex < 0) {
                    this.targetIndex = max;
                }
                break;

            // Next selection.
            case "⬇️":
                if (this.usedKillPotion) return;

                this.targetIndex += 1;
                if (this.targetIndex > max) {
                    this.targetIndex = 0;
                }
                break;

            // Kill/unkill someone.
            case "☠️":
                if (this.usedKillPotion) return;

                if (this.target && this.target.id === this.availableToTarget[this.targetIndex]?.id) {
                    this.target = undefined;
                } else {
                    this.target = this.availableToTarget[this.targetIndex];
                }
                break;

            // Save People
            case "⚕️":
                if (this.usedSavePotion) return;

                this.doSave = !this.doSave;

                break;

            // Invalid reaction.
            default:
                return;
        }

        // Update the prompt message.
        await this.prompt.message.edit(this.actionEmbed());
    }
}
