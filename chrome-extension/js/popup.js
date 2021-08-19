let queryOptions = { active: true, currentWindow: true };
chrome.tabs.query(queryOptions, tabs => {
  let tab = tabs[0]

  let split = tab.url.split('/')
  if (split[2] === 'github.com') {
    let url = split.slice(3, 5).join('/')
    console.log(url)
    chrome.tabs.update({ url: `vscode://ConfirmedVellas.oneclickgitclone?remoteType=https&remoteURL=${url}` })
  }
})
