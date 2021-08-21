import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../../extension';

export const testGetParamsValid = () => {
    let uris = [
        "vscode://ConfirmedVellas.oneclickgitclone?remoteUrl=abcd/efgh&remoteType=HTTPS",
        "vscode://ConfirmedVellas.oneclickgitclone?remoteType=HTTPS&remoteUrl=abcd/efgh",
        "vscode://ConfirmedVellas.oneclickgitclone?remoteType=SSH&remoteUrl=kartikay-abcd/efgh&alwaysOpen=true"
    ];

    let answers = [
        {
            "remoteUrl": "abcd/efgh",
            "remoteType": "HTTPS"
        },
        {
            "remoteType": "HTTPS",
            "remoteUrl": "abcd/efgh"
        },
        {
            "remoteType": "SSH",
            "remoteUrl": "abcd/efgh",
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
        "vscode://ConfirmedVellas.oneclickgitclone?remoteType",
        "vscode://ConfirmedVellas.oneclickgitclone?remoteType=SSH&remoteUrl",
        "vscode://ConfirmedVellas.oneclickgitclone?remoteType=SSH&",
        "vscode://ConfirmedVellas.oneclickgitclone?",
        "vscode://ConfirmedVellas.oneclickgitclone",
    ]

    uris.forEach(uri => {
        let vscodeUri = vscode.Uri.parse(uri);
        assert.throws(() => {
            myExtension.getParams(vscodeUri);
        });
    });
}