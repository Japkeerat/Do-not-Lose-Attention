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
  
    chrome.storage.sync.get(['blockedWebsites', 'unblockedWebsites'], (data) => {
      const blockedWebsites = data.blockedWebsites || [];
      const unblockedWebsites = data.unblockedWebsites || {};
  
      // Check if the domain was unblocked within the last 24 hours
      const lastUnblockedTime = unblockedWebsites[domain] || 0;
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastUnblockedTime;
  
      if (timeDifference < 86400000) { // 24 hours in milliseconds
        alert('You can only unblock this website once every 24 hours.');
        return;
      }
  
      const updatedBlockedWebsites = blockedWebsites.filter(
        (blocked) => blocked !== domainWithoutWWW && blocked !== domainWithWWW
      );
  
      chrome.storage.sync.set({ blockedWebsites: updatedBlockedWebsites }, () => {
        // Send a message to the background page
        chrome.runtime.sendMessage({ action: 'reblockWebsite', domain: domain, unblockedWebsites });
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