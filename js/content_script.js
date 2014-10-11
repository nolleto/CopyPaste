var e,
    port = chrome.extension.connect({ name: 'CopyPaste' });

document.addEventListener("mousedown", function(event){
    //right click    console.log(event.button)
    if(event.button == 2) { 
        e = event.target;
        updateContextMenu();
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

function getSuperSelection() {
    var value = getHTMLOfSelection();
    if (!value && e.value) {    
        value = e.value;
        value = value.substr(e.selectionStart, e.selectionEnd);
        return value;
    } else {
        return formatHTMLSelection(value);
    }    
}

function updateContextMenu() {
    var selection = getSuperSelection();
    port.postMessage({ 
        updateCopySave: {
            bool: !!selection,
            value: selection
        }
     });
}

function getHTMLOfSelection() {
    var range;
    if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        return range.htmlText;
    }
    else if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            return div.innerHTML;
        } else {
            return '';
        }
    } else {
        return '';
    }
}

//Remove tags do HTML como: <div>, <p>, <b>...
function formatHTMLSelection(html) {    
    var rgx = new RegExp('(<)/?[a-z]+[0-9]?[a-z="; ]*(>)', 'g');
    return html.replace(rgx, '');
}