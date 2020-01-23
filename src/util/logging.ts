import chalk from "chalk";
import moment from "moment";

const prefix   = chalk.bgWhiteBright(" A ") + " ";
const errorSym = chalk.bgRedBright(" ERR ") + " ";
const logSym   = chalk.bgWhiteBright(" INF ") + " ";

const dateFormat = "YYYY-MM-DD HH:mm:ss.SSSSS";

export function log(message: string): void {
    console.log(prefix + logSym + "[" + moment().format(dateFormat) + "]: " + chalk.whiteBright(message));
}

export function error(message: string): void {
    console.log(prefix + errorSym + "[" + moment().format(dateFormat) + "]: " + chalk.redBright(message));
}
