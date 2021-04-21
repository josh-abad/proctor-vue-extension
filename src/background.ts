import { Activity } from '@/types'

const activities: Activity[] = []

const addActivity = (activity: Activity) => {
  activities.push(activity)
  console.log(`Visited ${activity.url} at ${activity.time}`)
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#10B981' })
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
