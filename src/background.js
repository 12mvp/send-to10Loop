// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(id, info, tab){
    if (tab.url.toLowerCase().indexOf("gifsound.com") > -1){
        chrome.pageAction.show(tab.id);
    }
});

// listener for click on extension icon
chrome.pageAction.onClicked.addListener(function(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // on click, request urls to contentscript
      chrome.tabs.sendMessage(tabs[0].id, {'requestURLS': true}, function(response) {
        // on response, open new tab
        window.open("https://10loop.com/post/create?v=" + response.video + "&s=" + response.sound);
      });
  });
});