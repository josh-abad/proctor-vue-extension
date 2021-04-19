import { Activity } from '@/types'

const activities: Activity[] = []

const addActivity = (activity: Activity) => {
  activities.push(activity)
  console.log(`Visited ${activity.url} at ${activity.time}`)
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    chrome.tabs.get(tabId, ({ url }) => {
      chrome.storage.sync.get(['tracking'], items => {
        if (items.tracking) {
          addActivity({
            time: new Date().toLocaleTimeString(),
            url: url?.split('/')[2] || 'new tab'
          })
        }
      })
    })
  })
})
