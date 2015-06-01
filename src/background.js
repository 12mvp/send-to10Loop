var currentSite = null;
var currentTabUrl = null;

function getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    if (url.indexOf('?') > -1){
      var search = '?' + url.split('?')[1];
    }
    else {
      var search = '';
    }
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function convertYoutubeStartTimeToSeconds(value){
  var ret = 0;
  var match = false;

  if (value.indexOf('d') > -1){
      tab = value.split('d');
      days = tab[0];
      value = tab[1];
      ret += 86400 * parseInt(days);  // 60 seconds * 60 minutes * 24 hours
      match = true;
  }
  if (value.indexOf('h') > -1){
      tab = value.split('h')
      hours = tab[0]
      value = tab[1]
      ret += 3600 * parseInt(hours)  // 60 seconds * 60 minutes
      match = true;
  }
  if (value.indexOf('m') > -1){
      tab = value.split('m');
      minutes = tab[0];
      value = tab[1];
      ret += 60 * parseInt(minutes)  // 60 seconds
      match = true;
  }
  if (value.indexOf('s') > -1){
      tab = value.split('s');
      seconds = tab[0];
      value = tab[1];
      ret += parseInt(seconds)
      match = true;
  }
  if (match === false)
    return value
  return ret
}

// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  currentTabUrl = tab.url;
  var domain = tab.url.toLowerCase().split('//')[1].split('/')[0];
    if (domain === "gifsound.com" && getParameterByName(currentTabUrl, 'v') !== ''){
        chrome.pageAction.show(tab.id);
        currentSite = "gifsound";
    }
    else if (domain === "www.youtube.com"){
        chrome.pageAction.show(tab.id);
        currentSite = "youtube"
    }
    
});

// listener for click on extension icon
chrome.pageAction.onClicked.addListener(function(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // on click, request urls to contentscript
      if (currentSite == "youtube"){
        var url =  "https://10loop.com/post/create?v=" + currentTabUrl,
            start_time = getParameterByName(currentTabUrl, 't');
        if (start_time !== "")
          url = url.replace("&t=" + start_time, "") + "&t=" + convertYoutubeStartTimeToSeconds(start_time);
        window.open(url);
      }
      else if (currentSite == "gifsound"){
        chrome.tabs.sendMessage(tabs[0].id, {'requestURLS': true}, function(response) {
          // on response, open new tab
          window.open("https://10loop.com/post/create?v=" + response.video + "&s=" + response.sound + "&start=" + response.start);
        });
      }
  });
});