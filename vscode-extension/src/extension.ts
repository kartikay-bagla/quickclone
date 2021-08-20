import * as vscode from 'vscode';
const path = require('path');
import { exec } from 'child_process';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	const getParams = (uri: vscode.Uri): { [string: string]: string } => {
		// TODO: Works for only a specific endpoint instead of all of em

		const params: { [string: string]: string } = {};
		uri.query
			.split('&')
			.forEach(param => {
				const [key, value]: Array<string> = param.split('=');
				params[key] = value;
			});

		return params;
	};


	const getRepoName = (remoteUrl: string): string | null => {
		const split: Array<string> = remoteUrl.split('/');
		if (split.length !== 2) {
			return null;
		}
		return split[1];
	};


	const getCloneCommand = (remoteUrl: string, remoteType: string): string | null => {
		switch (remoteType) {
			case "https":
				return "git clone https://github.com/" + remoteUrl + ".git";
			case "ssh":
				return "git clone git@github.com:" + remoteUrl + ".git";
			case "git":
				return "gh repo clone " + remoteUrl;
			default:
				return null;
		}
	};


	const cloneIntoFolder = (cloneCommand: string, folderPath: string, repoName: string) => {
		exec(cloneCommand, {
			cwd: path.resolve(folderPath, ''),
		}, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage(err.toString());
				return;
			}

			const repoPath = path.resolve(folderPath, repoName);
			openFolderInVscode(repoPath);
		});
	};


	const openFolderInVscode = (folderPath: string) => {
		vscode.window.showInformationMessage(
			'Successfully cloned the repository.' + "\n" +
			'Do you want to open the repository in vscode?',
			"Yes", "No"
		).then(answer => {
			if (answer === "Yes") {
				let uri = vscode.Uri.file(folderPath);
				vscode.commands.executeCommand('vscode.openFolder', uri);
			}
		});
	};



	vscode.window.registerUriHandler({
		handleUri: (uri: vscode.Uri) => {
			// TODO: Sanitize remoteUrl before passing it down
			const { remoteUrl, remoteType } = getParams(uri);
			const repoName = getRepoName(remoteUrl);
			if (!repoName) {
				vscode.window.showErrorMessage('Invalid remote URL');
				return;
			}
			const cloneCommand = getCloneCommand(remoteUrl, remoteType);
			if (!cloneCommand) {
				vscode.window.showErrorMessage('Invalid remote type');
				return;
			}

			const dialogOptions = {
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: 'Select a folder',
				title: 'Select folder to clone repository into'
			};
			vscode.window.showOpenDialog(dialogOptions)
				.then(folders => {
					if (folders && folders.length > 0) {
						vscode.window.showInformationMessage(`Cloning into ${repoName}...`);

						const folderPath = folders[0].fsPath;
						cloneIntoFolder(cloneCommand, folderPath, repoName);
					}
					else {
						vscode.window.showInformationMessage('Operation cancelled.');
					}
				});
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
