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
  