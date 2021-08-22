import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../../extension';
import * as fs from 'fs';
import * as os from 'os';
import path = require('path');

export const testCloneIntoFolderValid = async () => {

    let folderName = path.join(os.tmpdir(), "cloneTest");
    try {
        fs.mkdirSync(folderName);
    } catch (error) {
        if (error.code == "EEXIST") {
            fs.rmdirSync(folderName, {recursive: true});
            fs.mkdirSync(folderName);
        } else {
            throw error;
        }
    }
    
    // TODO: Add SSH and github CLI checks here as well
    let cloneCommands = [
        ["git clone https://github.com/kartikay-bagla/test.git", "test"],
        ["git clone https://github.com/kartikay-bagla/utils.git", "utils"],
    ];

    let checkFunctions = [
        async (cloneDir: string) => {
            let doc = await vscode.workspace.openTextDocument(vscode.Uri.file(path.resolve(cloneDir, "README.md")));
            let docText = doc.getText().trim();
            let actText = "Empty test repository";
            return docText === actText;
        },
        async (cloneDir: string) => {
            let doc = await vscode.workspace.openTextDocument(vscode.Uri.file(path.resolve(cloneDir, "README.md")));
            let docText = doc.getText().trim();
            let actText = "# utils";
            return docText === actText;
        }
    ];



    for (let i = 0; i < cloneCommands.length; i++) {
        let command = cloneCommands[i][0];
        let repoName = cloneCommands[i][1];
        myExtension.cloneIntoFolder(command, folderName, repoName, false, true);

        let answer = await checkFunctions[i](path.resolve(folderName, repoName));
        assert.strictEqual(true, answer);
    }
}