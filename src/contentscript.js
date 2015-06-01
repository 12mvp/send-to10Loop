chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request)
    if (request.requestURLS == true)
      sendResponse({
          "video": document.getElementById("gif").currentSrc,
          "sound": document.querySelectorAll("input[name=sound]")[0].value,
          "start": document.querySelectorAll("input[name=s]")[0].value
      });
  });
