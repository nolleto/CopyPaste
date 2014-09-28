app.controller('MainController', ['$scope', '$timeout', 'MyLocalStored', function ($scope, $timeout, MyLocalStored) {
	this.phrases = MyLocalStored.getPhrases();
	this.copied = false;
	this.currentPhrase;	
	var _this = this,
		timeOut;

	this.onKeyup = function(e) {
		if (e.keyCode == 13 && (e.ctrlKey || e.shiftKey)) {
			this.savePhrase();
		}
	};

	this.savePhrase = function() {
		if (this.currentPhrase) {
			var obj = MyLocalStored.addPhrase(this.currentPhrase);
			this.currentPhrase = '';
			port.postMessage({ addPhrase: obj });
			this.refresh();
		}
	};

	this.deletePhrase = function(guid) {
		MyLocalStored.removePhrase(guid);
		port.postMessage({ deletePhrase: guid });
		this.refresh();
	};
	
	this.copyPhrase = function(phrase) {
		copyToClipboard(phrase);
		this.copied = true;

		if (timeOut) {
			$timeout.cancel(timeOut);
			timeOut = undefined;
		}
		timeOut = $timeout(function() {
			_this.copied = false;
		}, 2000);
	};

	this.refresh = function() {
		this.phrases = MyLocalStored.getPhrases();		
	};

}]);