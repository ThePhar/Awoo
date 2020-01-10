export default class Command {
    readonly type: string;
    readonly args: Array<string>;

    constructor(command: string, args: Array<string>) {
        this.type = command;
        this.args = args;
    }
}
