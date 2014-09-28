var e,
    port = chrome.extension.connect({ name: 'CopyPaste' });

document.addEventListener("mousedown", function(event){
    //right click    console.log(event.button)
    if(event.button == 2) { 
        e = event.target;
        port.postMessage({ 
            updateCopySave: {
                bool: (e.selectionStart < e.selectionEnd),
                value: getSelection()
            }
         });
    }
}, true);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (e.nodeName === "DIV") {        
        e.innerHTML = getText(e.innerHTML, request.value, request.replaceAll);
    } else {        
        e.value = getText(e.value, request.value, request.replaceAll);
    }

    e.blur();
    e.focus();
    sendResponse({ success: true });
  });

function getText(original, value, replace) {    
    if (!replace) {
        var ss = e.selectionStart,
            se = e.selectionEnd;
        return original.substr(0, ss) + value + original.substr(se, (original.length - 1));
    } 
    return value;
}

function getSelection() {
    var value;
    if (e.nodeName === "DIV") {        
        value = e.innerHTML;
    } else {        
        value = e.value;
    }
    return value.substr(e.selectionStart, e.selectionEnd);
}