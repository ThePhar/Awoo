import { Command, Manager } from "../../structs";
import { AnyAction } from "redux";
import { Command as CommandType } from "../../types";
import { CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { adminCommandBaseSettings } from "../constants";

export default class ActionCommand extends Command {
  public constructor(client: Manager) {
    super(client, {
      ...adminCommandBaseSettings,
      name: CommandType.Action,
      group: "admin",
      ownerOnly: true,
      memberName: CommandType.Action,
      description: "Fire a specific action to the game.",
      args: [
        {
          key: "action",
          prompt: "What action do you want to try and send?",
          type: "string",
          parse: (action: string) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
              const actionObject: any = eval(`(${action})`);

              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (typeof actionObject === "object" && typeof actionObject.type === "string") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return actionObject;
              }

              return undefined;
            } catch {
              return undefined;
            }
          }
        }
      ]
    });
  }

  public run(message: CommandoMessage, args: { action: AnyAction | undefined }): Promise<Message | Message[]> {
    if (args.action === undefined) {
      return message.reply("this action is invalid.");
    }

    const id = message.channel.id;
    const store = this.manager.games.get(id);

    // A game is already initialized for this channel.
    if (!store)
      return message.reply("there is no game to fire an action against.");

    store.dispatch(args.action);

    return message.reply("action fired.");
  }
}
