import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Player from "../struct/player";
import Prompt from "../struct/prompt";
import Role from "../interface/role";
import Team from "../enum/team";

export class Sorceress extends Role {
    public override name = "Sorceress";
    public override pluralName = "Sorceresses";
    public override appearance = Appearance.Villager;
    public override team = Team.Werewolves;

    /* Sorceress Specific Fields */
    public availableToInspect: Player[] = [];
    public inspected = new Map<string, Player>();
    public inspectIndex = 0;
    public target?: Player;

    public override async startAction(): Promise<void> {
        this.resetActionState();

        // Get all players we can inspect.
        this.availableToInspect = this.game.players.alive.filter((player) => {
            // Do not target ourselves.
            if (player.id === this.player.id) return false;

            // Do not target players that we've already inspected.
            return !this.inspected.has(player.id);
        });

        // If we have no more targets to inspect, just short circuit us out.
        if (this.availableToInspect.length === 0) {
            await this.player.send(this.actionEmbed());
            return;
        }

        // Send the action prompt and start listening for reaction events.
        const message = await this.player.send(this.actionEmbed());

        // Set the reaction images.
        await message.react("⬆️");
        await message.react("⬇️");
        await message.react("✅");

        // Create our prompt.
        this.prompt = new Prompt(message, this, this.reactionHandler.bind(this));
    }

    public override resetActionState(): void {
        this.availableToInspect = [];
        this.inspectIndex = 0;
        this.target = undefined;

        if (this.prompt) {
            this.prompt.destroy();
        }
    }

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleSorceress(this);
    }
    protected override actionEmbed(): D.MessageEmbed {
        return Embed.ActionSorceress(this);
    }

    private async reactionHandler(react: D.MessageReaction, _: D.User): Promise<void> {
        const emoji = react.emoji.name;
        const max = this.availableToInspect.length - 1;

        // If our prompt suddenly disappeared, do not proceed.
        if (!this.prompt) return;

        // No point in asking for input if there's no one to inspect.
        if (max < 0) {
            this.prompt.destroy();
        }

        switch (emoji) {
            // Previous selection.
            case "⬆️":
                this.inspectIndex -= 1;
                if (this.inspectIndex < 0) {
                    this.inspectIndex = max;
                }
                break;

            // Next selection.
            case "⬇️":
                this.inspectIndex += 1;
                if (this.inspectIndex > max) {
                    this.inspectIndex = 0;
                }
                break;

            // Confirm selection.
            case "✅":
                this.target = this.availableToInspect[this.inspectIndex];
                break;

            // Invalid reaction.
            default:
                return;
        }

        // Update the prompt message.
        await this.prompt.message.edit(this.actionEmbed());
    }
}
