import * as vscode from 'vscode';
import {testGetParamsValid, testGetParamsInvalid} from './getParams';
import {testGetRepoNameValid, testGetRepoNameInvalid} from './getRepoName';

import {testCloneIntoFolderValid} from './cloneFolder';

suite('Extension Test Suite', function () {
	vscode.window.showInformationMessage('Start all tests.');

	test('URI Get Params - Valid', testGetParamsValid);
	test('URI Get Params - Invalid', testGetParamsInvalid);

	test('URI Get Repo Name - Valid', testGetRepoNameValid);
	test('URI Get Repo Name - Invalid', testGetRepoNameInvalid);

	test('Clone Folder - Valid', function () {
		this.timeout(10000); // 10 sec timeout for git clones
		testCloneIntoFolderValid();
	});
});
