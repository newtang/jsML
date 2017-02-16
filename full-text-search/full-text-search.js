


// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
// paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
//  no. 3, pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

// Release 1 be 'andargor', Jul 2004
// Release 2 (substantially revised) by Christopher McKenzie, Aug 2009

var stemmer = (function(){
	var step2list = {
			"ational" : "ate",
			"tional" : "tion",
			"enci" : "ence",
			"anci" : "ance",
			"izer" : "ize",
			"bli" : "ble",
			"alli" : "al",
			"entli" : "ent",
			"eli" : "e",
			"ousli" : "ous",
			"ization" : "ize",
			"ation" : "ate",
			"ator" : "ate",
			"alism" : "al",
			"iveness" : "ive",
			"fulness" : "ful",
			"ousness" : "ous",
			"aliti" : "al",
			"iviti" : "ive",
			"biliti" : "ble",
			"logi" : "log"
		},

		step3list = {
			"icate" : "ic",
			"ative" : "",
			"alize" : "al",
			"iciti" : "ic",
			"ical" : "ic",
			"ful" : "",
			"ness" : ""
		},

		c = "[^aeiou]",          // consonant
		v = "[aeiouy]",          // vowel
		C = c + "[^aeiouy]*",    // consonant sequence
		V = v + "[aeiou]*",      // vowel sequence

		mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
		meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
		mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
		s_v = "^(" + C + ")?" + v;                   // vowel in stem

	return function (w) {
		var 	stem,
			suffix,
			firstch,
			re,
			re2,
			re3,
			re4,
			origword = w;

		if (w.length < 3) { return w; }

		firstch = w.substr(0,1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) { w = w.replace(re,"$1$2"); }
		else if (re2.test(w)) {	w = w.replace(re2,"$1$2"); }

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re,"");
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
				if (re2.test(w)) {	w = w + "e"; }
				else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
				else if (re4.test(w)) { w = w + "e"; }
			}
		}

		// Step 1c
		re = /^(.+?)y$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(s_v);
			if (re.test(stem)) { w = stem + "i"; }
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step2list[suffix];
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step3list[suffix];
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			if (re.test(stem)) {
				w = stem;
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(mgr1);
			if (re2.test(stem)) {
				w = stem;
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			re2 = new RegExp(meq1);
			re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
			}
		}

		re = /ll$/;
		re2 = new RegExp(mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re,"");
		}

		// and turn initial Y back to y

		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}

		return w;
	}
})();







let BM25 = (function(){
	let stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];
	let stopWordsObj = {},
		totalDocuments = 0,
		totalNumOfTerms = 0,
		averageDocumentLength = 0,
		documents = {},
		corpusTerms = {},
		k1 = 1.3,
		b = 0.75;

	for(let word of stopwords){
		stopWordsObj[word] = true;
	}

	function filterStopWords(word){
		return !stopWordsObj[word];
	}

	function tokenize(str){
		return str.toLowerCase().split(/\W+/)
			.filter(filterStopWords)
			.map(stemmer);
	}

	return {
		
		updateIdf:function(){
			for(let term in corpusTerms){
				let termInfo = corpusTerms[term];
				let num = (totalDocuments - termInfo.n + 0.5);
		        let denom = (termInfo.n + 0.5);
		        termInfo.idf = Math.max(Math.log10(num / denom), 0.01);
			}
		},
		addDocument: function(doc){
			if(!doc || !doc.body || !doc.id){
				throw "Invalid doc";
			}

			let tokens = tokenize(doc.body);
			let docObj = {
				id: doc.id, 
				tokens: tokens, 
				body: doc.body,
				termCount: tokens.length
			};

			++totalDocuments;
			totalNumOfTerms += docObj.termCount;

			averageDocumentLength = totalNumOfTerms / totalDocuments;
			let termInfo = {};

			for(var t of tokens){
				if(!termInfo[t]){
					termInfo[t] = {
						count: 0,
						freq: 0
					};
				}

				let info = termInfo[t];

				info.count++;
				info.freq = info.count / docObj.termCount;

				if(!corpusTerms[t]){
					corpusTerms[t] = {
						n:0,
						idf:0
					};
					corpusTerms[t].n++;
				}
			}

			docObj.terms = termInfo;
			documents[docObj.id] = docObj;

			// Calculate inverse document frequencies
		    // This is SLOWish so if you want to index a big batch of documents,
		    // comment this out and run it once at the end of your addDocuments run
		    // If you're only indexing a document or two at a time you can leave this in.
		    // updateIdf();
		},
		search: function(query){
			let queryTerms = tokenize(query),
				results = [];

			for(var docId in documents){
				let doc = documents[docId],
					score = 0; 

				for(qTerm of queryTerms){
					if(!corpusTerms[qTerm] || !doc.terms[qTerm]){
						continue;
					}

					 // IDF is pre-calculated for the whole docset.
		            var idf = corpusTerms[qTerm].idf;
		            // Numerator of the TF portion.
		            var num = doc.terms[qTerm].count * (k1 + 1);
		            // Denomerator of the TF portion.
		            var denom = doc.terms[qTerm].count 
		                + (k1 * (1 - b + (b * doc.termCount / averageDocumentLength)));

		            // Add this query term to the score
		            score += idf * num / denom;
				}

				if(score){
					results.push({
						score: score,
						doc: doc
					});	
				}
			}

			results.sort(function(a, b) { return b.score - a.score; });
    		return results.slice(0, 10);
		}
	}
}());

onmessage = function(e) {
	var payload = e.data;
	switch (payload.type) {

		case 'index-batch':
			//payload.data = payload.data.slice(0, 1000);
			var len = payload.data.length;
			for (var i in payload.data) {
				BM25.addDocument({id: i, body: payload.data[i]});
				if (i % 100 === 0) {
					postMessage({type:"index-update", data: i/len});
				}
			}
			BM25.updateIdf();
			postMessage({type:"index-update", data: 1});
			break;

		case 'search':
			postMessage({type: "search-results", data: BM25.search(payload.data)});
			break;

	}
};