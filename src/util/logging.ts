/* eslint-disable no-console */
import chalk from 'chalk';
import moment from 'moment';

const prefix = `${chalk.bgWhiteBright(' A ')} `;
const errorSym = `${chalk.bgRedBright(' ERR ')} `;
const warnSym = `${chalk.bgYellow(' WRN ')} `;
const logSym = `${chalk.bgWhiteBright(' INF ')} `;

const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSSSS';

/**
 * Print a formatted log message to the console prefixed by the `INF` symbol.
 * @param message The message to print to the screen.
 */
export function log(message: string): void {
  console.log(`${prefix + logSym}[${moment().format(dateFormat)}]: ${chalk.whiteBright(message)}`);
}

/**
 * Print a formatted error message to the console prefixed by the `ERR` symbol.
 * @param message The message to print to the screen.
 */
export function error(message: string): void {
  console.error(`${prefix + errorSym}[${moment().format(dateFormat)}]: ${chalk.redBright(message)}`);
}

/**
 * Print a formatted warning message to the console prefixed by the `WRN` symbol.
 * @param message The message to print to the screen.
 */
export function warn(message: string): void {
  console.warn(`${prefix + warnSym}[${moment().format(dateFormat)}]: ${chalk.yellow(message)}`);
}
