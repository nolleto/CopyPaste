var dbHelper = new DBHelper(),
	phrases = [],
	contextMenus = {},	
	context = "editable",
	parentId = "parentId",
	hasOptions,
	copyPasteTemp;

chrome.extension.onConnect.addListener(function(port) {
	console.assert(port.name == 'CopyPaste');

	port.onMessage.addListener(function(msg) {
		if (msg.refreshAll) {
			installAllContextMenu();
		} else if (msg.addPhrase) {
			addContextMenu(msg.addPhrase);
		} else if (msg.deletePhrase) {
			removeContextMenu(msg.deletePhrase);
		} else if (msg.updateCopySave != undefined) {			
			updateCopySave(msg.updateCopySave);
		}
	});
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {	
	installAllContextMenu();
});

chrome.runtime.onStartup.addListener(function() {	
	installAllContextMenu();
});

function setValue(value) {	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { 
			value : value,
			replaceAll: dbHelper.getReplaceAll()
		}, function(response) {});
	});
}

function onClickHandler(info, tab) {
	 _gaq.push(['_trackEvent', info.menuItemId, 'clicked']);
	if (info.menuItemId == "replace") {
		dbHelper.setReplaceAll(info.checked);
	} else if (info.menuItemId == "copySave") {
		if (copyPasteTemp) {
			addContextMenu(dbHelper.addPhrase(copyPasteTemp));
			phrases = dbHelper.getPhrases();
		}
	} else {
		for (var i = 0; i < phrases.length; i++) {
			if (phrases[i].guid == info.menuItemId) {
				setValue(phrases[i].phrase);
				break;
			}
		}
	}
}

function addContextMenu(phraseInfo) {
	if (contextMenus[phraseInfo.guid]) {	
		console.warn('Adicionada frase já existente => ', JSON.stringify(phraseInfo));
		removeContextMenu(phraseInfo.guid)
	}
	if (!hasOptions) {
		installOptions();
	}
	contextMenus[phraseInfo.guid] = chrome.contextMenus.create({"title": formatText(phraseInfo.phrase), "contexts":[context], "id": phraseInfo.guid, "parentId": parentId});
	phrases = dbHelper.getPhrases();
}

function removeContextMenu(guid) {
	chrome.contextMenus.remove(guid, function() {
		var deleteOptions = true;
		delete contextMenus[guid];

		for (var i in contextMenus) {
			deleteOptions = false;
			break;
		}
		if (deleteOptions) {
			removeOptions();
		}
	});
}


function installAllContextMenu() {
	var phraseInfo;
	phrases = dbHelper.getPhrases();
	contextMenus = {};

	chrome.contextMenus.removeAll(function() {
		chrome.contextMenus.create({"title": "CopyPaste", "contexts":["all"], "id": parentId});	
		chrome.contextMenus.create({"title": "Salvar", "contexts":["all"], "id": "copySave" ,"enabled": false, "parentId": parentId});

		if (phrases.length) {					
			installOptions();

			for (var i = 0; i < phrases.length; i++) {
				phraseInfo = phrases[i];
				contextMenus[phraseInfo.guid] = chrome.contextMenus.create({"title": formatText(phraseInfo.phrase), "contexts":[context], "id": phraseInfo.guid, "parentId": parentId});
			}
		}
	});	
}

function installOptions() {
	hasOptions = true;
	chrome.contextMenus.create({"title": "Subistituir todo conteúdo ao colar", "type": "checkbox", "contexts":[context], "id": "replace", "parentId": parentId, "checked": dbHelper.getReplaceAll()});
	chrome.contextMenus.create({"type":"separator", "parentId": parentId, "id": "separatorId", "contexts":[context]});
}
	
function removeOptions() {
	hasOptions = false;
	chrome.contextMenus.remove("replace");	
	chrome.contextMenus.remove("separatorId");
}

function updateCopySave(obj) {
	copyPasteTemp = obj.value;
	if (obj.bool) {
		chrome.contextMenus.update("copySave", { "enabled": true, "title": "Salvar  " + (copyPasteTemp.length > 20 ? copyPasteTemp.substr(0, 20) + "..." : copyPasteTemp) });
	} else {
		chrome.contextMenus.update("copySave", { "enabled": false, "title": "Salvar" });
	}	
}

function formatText(text) {
	if (text.length > 30) {
		return text.substr(0, 30) + "...";
	}
	return text;
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-54984258-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js1';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();