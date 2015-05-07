chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.requestURLS == true)
      sendResponse({"video": document.querySelectorAll("input[name=gif]")[0].value, "sound": document.querySelectorAll("input[name=sound]")[0].value});
  });
