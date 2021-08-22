import * as vscode from 'vscode';
const path = require('path');
import { exec } from 'child_process';

const extensionName = "quickclone"

export const getParams = (uri: vscode.Uri): { [string: string]: string } => {
	// TODO: Works for only a specific endpoint instead of all of em

	const params: { [string: string]: string } = {};
	uri.query
		.split('&')
		.forEach(param => {
			const [key, value]: Array<string> = param.split('=');

			if (!value) {
				throw new Error(`Invalid query parameter: ${param}`);
			}

			params[key] = value;
		});

	return params;
};


export const getRepoName = (remoteUrl: string): string | null => {
	const split: Array<string> = remoteUrl.split('/');
	if (split.length !== 2) {
		return null;
	}

	const repoName = split[1]
	if (/^[0-9a-zA-Z-_]+$/.test(repoName)) {
		return repoName;
	} else {
		return null;
	}
};


export const getCloneCommand = (remoteUrl: string, remoteType: string): string | null => {
	switch (remoteType) {
		case "HTTPS":
			return "git clone https://github.com/" + remoteUrl + ".git";
		case "SSH":
			return "git clone git@github.com:" + remoteUrl + ".git";
		case "GitHub CLI":
			return "gh repo clone " + remoteUrl;
		default:
			return null;
	}
};


export const cloneIntoFolder = (cloneCommand: string, folderPath: string, repoName: string, openFolder: boolean) => {
	exec(cloneCommand, {
		cwd: path.resolve(folderPath, ''),
	}, (err, stdout, stderr) => {
		if (err) {
			vscode.window.showErrorMessage(err.toString());
			return;
		}

		const repoPath = path.resolve(folderPath, repoName);
		openFolderInVscode(repoPath, openFolder);
	});
};


export const openFolderInVscode = (folderPath: string, openFolder: boolean) => {
	if (!openFolder) {
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
	} else {
		let uri = vscode.Uri.file(folderPath);
		vscode.commands.executeCommand('vscode.openFolder', uri);
	}
};

export function activate(context: vscode.ExtensionContext) {

	vscode.window.registerUriHandler({
		handleUri: (uri: vscode.Uri) => {

			const vscodeConfig = vscode.workspace.getConfiguration(extensionName);

			// TODO: Sanitize remoteUrl before passing it down
			const { remoteUrl, remoteType } = getParams(uri);
			if (!remoteUrl) {
				vscode.window.showErrorMessage('Remote URL was not specified');
				return;
			}
			if (!remoteType) {
				vscode.window.showErrorMessage('Remote type was not specified');
				return;
			}

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

			const defaultFolder: string | undefined = vscodeConfig.get("defaultFolder");
			const defaultUri = defaultFolder !== undefined && defaultFolder !== ""
				? vscode.Uri.file(defaultFolder) : undefined;

			const dialogOptions = {
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: 'Select a folder',
				title: 'Select folder to clone repository into',
				defaultUri: defaultUri
			};
			vscode.window.showOpenDialog(dialogOptions)
				.then(folders => {
					if (folders && folders.length > 0) {
						vscode.window.showInformationMessage(`Cloning into ${repoName}...`);

						const folderPath = folders[0].fsPath;
						const openFolder: boolean = vscodeConfig.get("alwaysOpen") ?? false;
						cloneIntoFolder(cloneCommand, folderPath, repoName, openFolder);
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
