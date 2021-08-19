import * as vscode from 'vscode';
const path = require('path');
import { exec } from 'child_process';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.window.registerUriHandler({
		handleUri: (uri: vscode.Uri) => {

			let remoteType = "";
			let remoteName = "";
			let repoName = "";

			try {
				// TODO: Works for only a specific endpoint instead of all of em
				let query = uri.query;
				let params = query.split('&');

				// TODO: Use object destructuring instead of array of params
				remoteType = params[0].split('=')[1];

				// TODO: Sanitize remoteName before passing it down
				remoteName = params[1].split('=')[1];
				remoteName = decodeURIComponent(remoteName);

				repoName = remoteName.split('/')[1];
			} catch (e) {
				vscode.window.showErrorMessage('Invalid URL');
				return;
			}

			let cloneCommand = "";

			switch (remoteType) {
				case "https":
					cloneCommand = "git clone https://github.com/" + remoteName + ".git";
					break;
				case "ssh":
					cloneCommand = "git clone git@github.com:" + remoteName + ".git";
					break;
				case "git":
					cloneCommand = "gh repo clone " + remoteName;
					break;
				default:
					vscode.window.showErrorMessage('Invalid Remote Type');
					return;
			}

			try {
				vscode.window.showOpenDialog({
					canSelectFiles: false,
					canSelectFolders: true,
					canSelectMany: false,
					openLabel: 'Select a folder',
					title: 'Select folder to clone repository into'
				}).then(folder => {
					if (folder && folder.length > 0) {
						let folderPath = folder[0].fsPath;
						vscode.window.showInformationMessage(`Running ${cloneCommand} inside ${folderPath}`);
						exec(cloneCommand, {
							cwd: path.resolve(folderPath, ''),
						}, (err, stdout, stderr) => {
							if (err) {
								vscode.window.showErrorMessage(`Something Went Wrong: ${err}`);
								return;
							}

							vscode.window.showInformationMessage(
								'Successfully cloned the repository.' + "\n" +
								'Do you want to open the repository in vscode?',
								"Yes", "No"
							).then(answer => {
								if (answer === "Yes") {
									let uri = vscode.Uri.file(path.resolve(folderPath, repoName));
									vscode.commands.executeCommand('vscode.openFolder', uri);
								}
							});
						});
					} else {
						vscode.window.showInformationMessage('Operation cancelled.');
					}
				});
			} catch (e) {
				vscode.window.showErrorMessage(`Something Went Wrong: ${e}`);
			}
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
