import { Activity } from '@/types'

const activities: Activity[] = []

const addActivity = (activity: Activity) => {
  activities.push(activity)
  console.log(`Visited ${activity.url} at ${activity.time}`)
}

const updateIcon = (on: boolean) => {
  chrome.browserAction.setIcon({
    path: `./images/icon${on ? '16' : '_alt'}.png`
  })
}

// Change icon when tracking has changed
chrome.storage.onChanged.addListener((changes) => {
  if (changes.user) {
    const { oldValue, newValue } = changes.user

    /**
     * User logged in (!oldValue) or user logged out (!newValue).
     * Either way, icon should be set to 'off' variant.
     */
    if (!oldValue || !newValue) {
      updateIcon(false)
    } else {
      updateIcon(newValue.tracking)
    }
  }
})

// Set badge to Proctor Vue green
chrome.runtime.onInstalled.addListener(() => {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#10B981' })
})

// Set icon depending on if user is logged in and has tracking on
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['user'], items => {
    updateIcon(items.user?.tracking)
  })
})

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, ({ url }) => {
    chrome.storage.sync.get(['user'], items => {
      if (items.user?.tracking) {
        addActivity({
          time: new Date().toLocaleTimeString(),
          url: url?.split('/')[2] || 'new tab'
        })
      }
    })
  })
})
