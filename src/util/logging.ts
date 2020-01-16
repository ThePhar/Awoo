const prefix = "\x1b[32m[Awoo] ";

export function log(message: string, indentationLevel = 0, newline = false): void {
    let indents = "";
    for (let i = 0; i < indentationLevel; i++) {
        indents += "\t";
    }

    // Only show prefix if no indentation. Also add a newline character if newline is true.
    console.log((indents || prefix) + "\x1b[0m" + message + (newline ? "\n" : "") + "\x1b[0m");
}
