function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }
  
  function updateBlockedMessage() {
    const domain = getQueryParam('domain');
    const messageElement = document.getElementById('blocked-message');
  
    if (domain) {
      messageElement.textContent = `${domain} is blocked by the Website Blocker Extension`;
    } else {
      messageElement.textContent = 'This website is blocked by the Website Blocker Extension';
    }
  }
  
  updateBlockedMessage();

function unblockDomain(domain) {
  const domainWithoutWWW = domain.replace(/^www\./, '');
  const domainWithWWW = 'www.' + domainWithoutWWW;

  chrome.storage.sync.get('blockedWebsites', (data) => {
    const blockedWebsites = data.blockedWebsites || [];
    const updatedBlockedWebsites = blockedWebsites.filter(
      (blocked) => blocked !== domainWithoutWWW && blocked !== domainWithWWW
    );

    chrome.storage.sync.set({ blockedWebsites: updatedBlockedWebsites }, () => {
      window.location.href = `https://${domain}`;
    });
  });
}

function unblockButtonClickHandler() {
    const domain = getQueryParam('domain');
    if (domain) {
      unblockDomain(domain);
    }
  }
  
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('unblock-button').addEventListener('click', unblockButtonClickHandler);
});