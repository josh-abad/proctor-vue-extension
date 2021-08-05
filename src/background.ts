import { Activity } from '@/types'

const activities: Activity[] = []

const addActivity = (url: string) => {
  const time = new Date().toLocaleTimeString()
  activities.push({ url, time })
  console.log(`Visited ${url} at ${time}`)
}

const updateIcon = (on: boolean) => {
  chrome.browserAction.setIcon({
    path: `./images/icon${on ? '16' : '_alt'}.png`
  })
}

// Set badge to Proctor Vue green
chrome.runtime.onInstalled.addListener(() => {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#10B981' })
})

// Set icon depending on if user is logged in and has tracking on
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['tracking'], items => {
    updateIcon(items.tracking)
  })
})

chrome.runtime.onConnectExternal.addListener(port => {
  port.onDisconnect.addListener(() => {
    chrome.storage.sync.set({ tracking: false })
  })

  if (port.name === 'Squid') {
    port.onMessage.addListener(response => {
      if (response === 'installed?') {
        chrome.storage.sync.get(['tracking'], items => {
          port.postMessage({ tracking: items.tracking, sitesVisited: activities })
        })
      } else if (response === 'on') {
        chrome.storage.sync.set({ tracking: true })
        port.postMessage({ tracking: true, sitesVisited: activities })
      } else if (response === 'off') {
        chrome.storage.sync.set({ tracking: false })
        port.postMessage({ tracking: false, sitesVisited: activities })
      }
    })

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.tracking) {
        const { newValue } = changes.tracking

        port.postMessage({ tracking: newValue, sitesVisited: activities })

        updateIcon(newValue)
      }
    })

    chrome.tabs.onCreated.addListener(() => {
      chrome.storage.sync.get(['tracking'], items => {
        if (items.tracking) {
          addActivity('new tab')
          port.postMessage({
            tracking: items.tracking,
            sitesVisited: activities
          })
        }
      })
    })

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      chrome.storage.sync.get(['tracking'], items => {
        if (items.tracking) {
          if (changeInfo.url) {
            addActivity(changeInfo.url.split('/')[2])
            port.postMessage({
              tracking: items.tracking,
              sitesVisited: activities
            })
          }
        }
      })
    })

    chrome.tabs.onActivated.addListener(({ tabId }) => {
      // Setting time out because chrome thinks the tab is moving, so wait a bit to make sure it isn't
      setTimeout(() => {
        chrome.tabs.get(tabId, tab => {
          chrome.storage.sync.get(['tracking'], items => {
            if (items.tracking) {
              addActivity(tab.url?.split('/')[2] || 'new tab')
              port.postMessage({
                tracking: items.tracking,
                sitesVisited: activities
              })
            }
          })
        })
      }, 200)
    })

  }
})
