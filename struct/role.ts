import * as Discord from "discord.js"
import * as Color from "../enum/color"
import Appearance from "../enum/appearance"
import GameManager from "./gameManager"
import Player from "../struct/player"
import Prompt from "../struct/prompt"
import Team from "../enum/team"

export default abstract class Role {
    public abstract readonly name: string
    public readonly player: Player
    public prompt?: Prompt
    public isWerewolf = false
    public targets: Player[] = []
    protected _appearance?: Appearance
    protected _team?: Team
    public static readonly appearance: Appearance
    public static readonly team: Team
    public static readonly description: string
    public static readonly thumbnail: string

    public constructor(player: Player) {
        this.player = player
    }

    public abstract roleEmbed: () => Discord.MessageEmbed
    public actionEmbed?: () => Discord.MessageEmbed
    public resetActionState = (): void => { /**/ }
    public startRole = async (): Promise<void> => { await this.player.member.send(this.roleEmbed()) }
    public startAction = async (): Promise<void> => { /**/ }
    public static roleSummary = ({ ...args }: typeof Role): Discord.MessageEmbed => {
        // Uppercase the first character of the appearance string.
        const lowercaseAppearance = args.appearance
        const uppercaseAppearance = lowercaseAppearance[0].toUpperCase() + lowercaseAppearance.slice(1)

        return new Discord.MessageEmbed()
            .setThumbnail(args.thumbnail)
            .setDescription(args.description)
            .setColor(Color.colorFromTeam(args.team))
            .addField("Team", args.team, true)
            .addField("Appears As", uppercaseAppearance, true)
    }

    public abstract get appearance(): Appearance
    public abstract get team(): Team
    public get game(): GameManager { return this.player.game }
}
