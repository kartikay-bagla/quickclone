import * as assert from 'assert';
import * as myExtension from '../../extension';

export const testGetRepoNameValid = () => {

    const repoNames = [
        "abcd/efgh",
        "ab-cd/ef_gh",
    ]

    const answers = [
        "efgh",
        "ef_gh"
    ]

    for (let i = 0; i < repoNames.length; i++) {
        const repoName = myExtension.getRepoName(repoNames[i]);
        assert.strictEqual(repoName, answers[i]);
    }
}

export const testGetRepoNameInvalid = () => {

    const repoNames = [
        "abcd",
        "abcd/efgh/ijkl",
        "abcd/ef!@gh;",
    ]

    for (let i = 0; i < repoNames.length; i++) {
        let answer = myExtension.getRepoName(repoNames[i]);
        assert.strictEqual(null, answer);
    }
}