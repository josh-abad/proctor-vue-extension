const trackingSwitch = document.getElementById('toggle') as HTMLInputElement

if (trackingSwitch) {
  trackingSwitch.addEventListener('change', () => {
    chrome.storage.sync.get(['tracking'], ({ tracking }) => {
      trackingSwitch.checked = !tracking
      chrome.storage.sync.set({ tracking: !tracking })
    })
  })

  chrome.storage.sync.get(['tracking'], ({ tracking }) => {
    trackingSwitch.checked = tracking
  })
}
