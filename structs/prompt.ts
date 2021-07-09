import * as D from "discord.js";
import Role from "../interface/role";

export default class Prompt {
    public readonly message: D.Message;
    public readonly role: Role;
    public readonly handleEvent: (react: D.MessageReaction, user: D.User) => void;

    public constructor(message: D.Message, role: Role, handleEvent: (react: D.MessageReaction, user: D.User) => void) {
        this.message = message;
        this.role = role;
        this.handleEvent = handleEvent;

        this.role.game.manager.prompts.set(message.id, this);
    }

    /**
     * Remove this prompt from the prompt map.
     */
    destroy(): void {
        if (this.role.prompt) {
            this.role.prompt = undefined;
        }

        this.role.game.manager.prompts.delete(this.message.id);
    }

    get game() {
        return this.role.player.game;
    }
    get player() {
        return this.role.player;
    }
}
