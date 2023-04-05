let blockedWebsites = [];
let blockSubdomains = false;

function updateBlockedWebsites() {
  chrome.storage.sync.get(['blockedWebsites', 'blockSubdomains'], (data) => {
    if (data.blockedWebsites) {
      blockedWebsites = data.blockedWebsites;
    }
    blockSubdomains = data.blockSubdomains || false;
  });
}

updateBlockedWebsites();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && (changes.blockedWebsites || changes.blockSubdomains)) {
    updateBlockedWebsites();
  }
});

function isBlocked(hostname) {
  const domain = hostname.replace(/^www\./, '');
  return blockedWebsites.some((blocked) => {
    const blockedDomain = blocked.replace(/^www\./, '');
    if (blockSubdomains) {
      return domain.endsWith(blockedDomain);
    }
    return domain === blockedDomain;
  });
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const url = new URL(details.url);
      if (isBlocked(url.hostname)) {
        return { redirectUrl: chrome.runtime.getURL(`blocked.html?domain=${url.hostname}`) };
      }
    },
    { urls: ['<all_urls>'] },
    ['blocking']
  );
  