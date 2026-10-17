export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, { type: "toggle-grid" });
    }
  });
});
