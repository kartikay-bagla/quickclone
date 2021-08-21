import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../../extension';

export const testGetParamsValid = () => {
    let uris = [
        "vscode://abcd.efgh?remoteUrl=ijkl/lmno&remoteType=HTTPS",
        "vscode://abcd.efgh?remoteType=HTTPS&remoteUrl=ijkl/lmno",
        "vscode://abcd.efgh?remoteType=SSH&remoteUrl=kartikay-ijkl/lmno&alwaysOpen=true"
    ];

    let answers = [
        {
            "remoteUrl": "ijkl/lmno",
            "remoteType": "HTTPS"
        },
        {
            "remoteType": "HTTPS",
            "remoteUrl": "ijkl/lmno"
        },
        {
            "remoteType": "SSH",
            "remoteUrl": "ijkl/lmno",
            "alwaysOpen": "true"
        }
    ];

    for (let i = 0; i < uris.length; i++) {
        let vscodeUri = vscode.Uri.parse(uris[i]);
        let answer = myExtension.getParams(vscodeUri);
        assert.deepStrictEqual(answer, answers[i]);
    }
}

export const testGetParamsInvalid = () => {
    let uris = [
        "vscode://abcd.efgh?remoteType",
        "vscode://abcd.efgh?remoteType=SSH&remoteUrl",
        "vscode://abcd.efgh?remoteType=SSH&",
        "vscode://abcd.efgh?",
        "vscode://abcd.efgh",
    ]

    uris.forEach(uri => {
        let vscodeUri = vscode.Uri.parse(uri);
        assert.throws(() => {
            myExtension.getParams(vscodeUri);
        });
    });
}