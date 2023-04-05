document.getElementById('block-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const website = document.getElementById('website').value;
  
    chrome.storage.sync.get('blockedWebsites', (data) => {
      const blockedWebsites = data.blockedWebsites || [];
      if (!blockedWebsites.includes(website)) {
        blockedWebsites.push(website);
        chrome.storage.sync.set({ blockedWebsites }, () => {
          alert(`Blocked ${website}`);
        });
      } else {
        alert(`${website} is already blocked.`);
      }
    });
  
    document.getElementById('website').value = '';
  });
  
  document.getElementById('block-subdomains').addEventListener('change', (event) => {
    const blockSubdomains = event.target.checked;
    chrome.storage.sync.set({ blockSubdomains }, () => {
        const message = blockSubdomains ? 'Subdomain blocking enabled.' : 'Subdomain blocking disabled.';
        alert(message);
      });
    });
    
    chrome.storage.sync.get('blockSubdomains', (data) => {
      document.getElementById('block-subdomains').checked = data.blockSubdomains || false;
    });
    
  