import * as vscode from 'vscode';
import {testGetParamsValid, testGetParamsInvalid} from './getParams';
import {testGetRepoNameValid, testGetRepoNameInvalid} from './getRepoName';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('URI Get Params - Valid', testGetParamsValid);
	test('URI Get Params - Invalid', testGetParamsInvalid);

	test('URI Get Repo Name - Valid', testGetRepoNameValid);
	test('URI Get Repo Name - Invalid', testGetRepoNameInvalid);
});
