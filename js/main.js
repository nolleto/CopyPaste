var app = angular.module('CopyPaste', ['ngAnimate']),
	port = chrome.extension.connect({ name: 'CopyPaste' });
	
app.directive('phraseLayout', function() {
	return {
		restrict: 'E',
		templateUrl: '/html/phrase-layout.html'
	};
});
app.factory('MyLocalStored', function() {
	return new DBHelper();
});

//---------------------------------------------------
function copyToClipboard(value) {
	var copyTextarea = document.createElement('textarea');
    copyTextarea.contentEditable = true;
    document.body.appendChild(copyTextarea);
    copyTextarea.innerHTML = value;
    copyTextarea.unselectable = "off";
    copyTextarea.focus();
    document.execCommand('SelectAll');
    console.log(document.execCommand("Copy", false, null));
    document.body.removeChild(copyTextarea);
}