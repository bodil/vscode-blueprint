import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import * as vscode from "vscode"
let client: LanguageClient;

function evalVars(str: string) {
    const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.path
    return str.replace("${workspaceFolder}", workspaceFolder)
}

export function activate(): void {
    const config = vscode.workspace.getConfiguration("blueprint-gtk");
    let command: string = config.get("command") ?? "blueprint-compiler";
    let args: string[] = config.get("arguments") ?? [];
    command = evalVars(command);
    args = args.map(evalVars);
    const serverOptions: ServerOptions = { command: command, args: [...args, "lsp"] };
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "blueprint-gtk" }],
    };
    client = new LanguageClient("blueprint-gtk", serverOptions, clientOptions);
    client.start();
}

export function deactivate(): Thenable<void> | void {
    return client?.stop();
}
