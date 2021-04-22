import { Activity } from '@/types'

const activities: Activity[] = []

const addActivity = (activity: Activity) => {
  activities.push(activity)
  console.log(`Visited ${activity.url} at ${activity.time}`)
}

chrome.runtime.onInstalled.addListener(() => {

  // Set badge to Proctor Vue green
  chrome.browserAction.setBadgeBackgroundColor({ color: '#10B981' })

  // Set icon depending on if user is logged in and has tracking on
  chrome.storage.sync.get(['user'], items => {
    chrome.browserAction.setIcon({
      path: `./images/icon${items.user?.tracking ? '16' : '_alt'}.png`
    })
  })

  // Change icon when tracking has changed
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.user) {
      const { oldValue, newValue } = changes.user

      /**
       * User logged in (!oldValue) or user logged out (!newValue).
       * Either way, icon should be set to 'off' variant.
       */
      if (!oldValue || !newValue) {
        chrome.browserAction.setIcon({
          path: './images/icon_alt.png'
        })
      } else {
        chrome.browserAction.setIcon({
          path: `./images/icon${newValue.tracking ? '16' : '_alt'}.png`
        })
      }
    }
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
})
