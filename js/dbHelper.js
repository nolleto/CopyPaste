var DBHelper = (function() {
	function getPhrases() {
		var v = localStorage.getItem("phrases");
		if (!v) {
			return [];
		}
		return JSON.parse(v);
	}

	function createObj(phrase) {
		return {
			guid: _generateGuid(),
			phrase: phrase,
			position: 0
		};
	}

	function _generateGuid() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	} 
	
	return {
		getPhrase: function(guid) {
			var phrases = getPhrases(),
				phraseInfo;
			for (var i = 0; i < phrases.length; i++) {
				phraseInfo = phrases[i];
				if (phraseInfo.guid == guid) {
					return phraseInfo.phrase;
				}
			}
			return "";			
		},
		addPhrase: function(phrase) {
			var phrases = getPhrases(),
				obj = createObj(phrase);
			phrases.push(obj);
			localStorage.setItem("phrases", JSON.stringify(phrases));
			return obj
		},
		removePhrase: function(guid) {
			var phrases = getPhrases(),
				found = false,
				phraseInfo,
				i;
			for (i = 0; i < phrases.length; i++) {
				phraseInfo = phrases[i];
				if (phraseInfo.guid == guid) {
					found = true
					break;
				}
			}
			if (found) {
				phrases.splice(i, 1);
				localStorage.setItem("phrases", JSON.stringify(phrases));
			}
			return found;
		},
		getReplaceAll: function() {
			var v = localStorage.getItem("replace");
			if (!v) {
				return false
			}
			return v == 'true';
		},
		setReplaceAll: function(v) {
			localStorage.setItem("replace", v);	
		},
		getPhrases: getPhrases
	}
});