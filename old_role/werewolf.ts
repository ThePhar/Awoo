import * as D from "discord.js";
import * as Embed from "../template/role";
import Appearance from "../enum/appearance";
import Player from "../struct/player";
import Prompt from "../struct/prompt";
import Role from "../interface/role";
import Team from "../enum/team";

export class Werewolf extends Role {
    public override name = "Werewolf";
    public override pluralName = "Werewolves";
    public override appearance = Appearance.Werewolf;
    public override team = Team.Werewolves;

    /* Werewolf Specific Fields */
    availableToTarget: Player[] = [];
    targetIndex = 0;
    target?: Player;

    public override async startAction(): Promise<void> {
        this.resetActionState();

        // Ignore werewolf actions on the first night.
        if (this.game.day === 1) {
            return;
        }

        // Get all players we can target.
        this.availableToTarget = this.game.players.alive.filter((player) => {
            // Do not target werewolves.
            return !(player.role instanceof Werewolf);
        });

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
        this.availableToTarget = [];
        this.targetIndex = 0;
        this.target = undefined;

        if (this.prompt) {
            this.prompt.destroy();
        }
    }

    protected override roleDescriptionEmbed(): D.MessageEmbed {
        return Embed.RoleWerewolf(this);
    }
    protected override actionEmbed(): D.MessageEmbed {
        return Embed.ActionWerewolf(this);
    }

    private async reactionHandler(react: D.MessageReaction, _: D.User): Promise<void> {
        const emoji = react.emoji.name;
        const max = this.availableToTarget.length - 1;

        // If our prompt suddenly disappeared, do not proceed.
        if (!this.prompt) return;

        switch (emoji) {
            // Previous selection.
            case "⬆️":
                this.targetIndex -= 1;
                if (this.targetIndex < 0) {
                    this.targetIndex = max;
                }
                break;

            // Next selection.
            case "⬇️":
                this.targetIndex += 1;
                if (this.targetIndex > max) {
                    this.targetIndex = 0;
                }
                break;

            // Confirm selection.
            case "✅":
                this.target = this.availableToTarget[this.targetIndex];
                // Send a message to all werewolves saying their target changed.
                this.game.players.alive.forEach((player) => {
                    if (player.role instanceof Werewolf) {
                        player.send(`${this.player} has targeted ${this.target}.`);
                    }
                });
                break;

            // Invalid reaction.
            default:
                return;
        }

        // Update the prompt message for all living werewolves.
        this.game.players.alive.forEach((player) => {
            if (player.role instanceof Werewolf && player.role.prompt) {
                player.role.prompt.message.edit(this.actionEmbed());
            }
        });
    }
}
