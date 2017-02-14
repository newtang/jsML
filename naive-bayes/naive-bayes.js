var Bayes = (function(){

	let stemCounts = {},
		stemCountsPerLabel = {},
		documentsPerLabel = {},
		totalDocuments = 0;

	function unique(arr){
		let hash = {},
			newArr = [];
		for(let item of arr){
			if(item && !hash[item]){
				newArr.push(item);
				hash[item] = true;
			}
		}
		return newArr;
	}

	function tokenize(str){
		let tokens = str.toLowerCase().split(/\W+/);
		return unique(tokens);
	}

	function incrementStem(stem, label){
		if(!stemCounts[stem]){
			stemCounts[stem] = 0;
		}
		++stemCounts[stem];


		if(!stemCountsPerLabel[stem]){
			stemCountsPerLabel[stem] = {};
		}
		if(!stemCountsPerLabel[stem][label]){
			stemCountsPerLabel[stem][label] = 0;
		}
		++stemCountsPerLabel[stem][label];
	}

	function appearsInOtherLabels(stem, labelToSkip){
		let total = 0;
		for(let label in stemCountsPerLabel[stem]){
			if(label === labelToSkip){
				continue;
			}
			if(stemCountsPerLabel[stem][label]){
				++total;
			}
		}
		return total;
	}

	function extractWinner(scores){
		let topScore = Number.MIN_VALUE,
			topLabel;

		for(var label in scores){
			let score = scores[label];
			if(score > topScore){
				topScore = score;
				topLabel = label;
			}
		}

		return {
			label: topLabel,
			score: topScore
		};

	}

	return {
		/**
			We need to keep track of:
			  - number of documents (totalDocuments)
			  - number of documents for each label (documentsPerLabel)
			  - number of documents a stem has appeared in. (stemCounts)
			  - number of documents a stem has appeared in broken down by label (stemCountsPerLabel)

			  - NOTE: our tokenization process eliminates duplicates.
		**/
		train: function(str, label){
			//labels[label] = true;
			let tokens = tokenize(str);
			for(let t of tokens){
				incrementStem(t, label);
			}

			if(!documentsPerLabel[label]){
				documentsPerLabel[label] = 0;
			}
			++documentsPerLabel[label];
			
			++totalDocuments;
		},
		guess: function(str){
			let tokens = tokenize(str),
				scores = {};

			for(var label in documentsPerLabel){

				let logSum = 0;

				for(var stem of tokens){
					let stemCount = stemCounts[stem];
					if(!stemCount){
						continue;
					}
					
					let wordProbability = (stemCountsPerLabel[stem][label] || 0) / documentsPerLabel[label];
					let wordInverseProbability = appearsInOtherLabels(stem, label) / (totalDocuments - (documentsPerLabel[label] || 0)) ;
                    let wordicity = wordProbability / (wordProbability + wordInverseProbability);

                    //adjustments for rare words
                    wordicity = ( (1 * 0.5) + (stemCount * wordicity) ) / ( 1 + stemCount );
			        if (wordicity === 0){
			            wordicity = 0.01;
			        }
			        else if (wordicity === 1){
			            wordicity = 0.99;
			        }

			        /**
			        The logSum line isn't really a part of the mathematical equations, but is rather a practical consideration. After calculating the wordicity for each word, we need to combine those probabilities somehow. The normal mathematical way to do that would be to multiply each probability together and divide by the multiplication of all the inverses. Unfortunately, floating point math isn't perfect and you can run into "floating point underflow", where the number gets too small for floating point math to deal with. So instead, we take a log of the numerator and denominator (combined probabilities and their inverses), and add up the logs.

					Finally, after we've combined all the individual word probabilities with the logSum line, we undo the log function we just used to get the probability back in the 0 to 1 range. Note that this happens outside of the "look at each word" loop but still inside the "look at each label" loop.
					**/


			        logSum += (Math.log(1 - wordicity) - Math.log(wordicity));

				}

				scores[label] = 1 / ( 1 + Math.exp(logSum) );  
			}
			    console.log(scores);
			return extractWinner(scores);




		}
	};

}());

function go() {
    var text = document.getElementById("test_phrase").value;
    var winner = Bayes.guess(text);
    document.getElementById("test_result").innerHTML = winner.label;
    document.getElementById("test_probability").innerHTML = winner.score;
};



// French Training
Bayes.train("L'Italie a été gouvernée pendant un an par un homme qui n'avait pas été élu par le peuple. Dès la nomination de Mario Monti au poste de président du conseil, fin 2011, j'avais dit :Attention, c'est prendre un risque politique majeur. Par leur vote, les Italiens n'ont pas seulement adressé un message à leurs élites nationales, ils ont voulu dire : Nous, le peuple, nous voulons garder la maîtrise de notre destin. Et ce message pourrait être envoyé par n'importe quel peuple européen, y compris le peuple français.", 'french');
Bayes.train("Il en faut peu, parfois, pour passer du statut d'icône de la cause des femmes à celui de renégate. Lorsqu'elle a été nommée à la tête de Yahoo!, le 26 juillet 2012, Marissa Mayer était vue comme un modèle. Elle montrait qu'il était possible de perforer le fameux plafond de verre, même dans les bastions les mieux gardés du machisme (M du 28 juillet 2012). A 37 ans, cette brillante diplômée de Stanford, formée chez Google, faisait figure d'exemple dans la Silicon Valley californienne, où moins de 5 % des postes de direction sont occupés par des femmes. En quelques mois, le symbole a beaucoup perdu de sa puissance.", 'french');
Bayes.train("Premier intervenant de taille à SXSW 2013, Bre Pettis, PDG de la société Makerbot, spécialisée dans la vente d'imprimantes 3D, a posé une question toute simple, avant de dévoiler un nouveau produit qui l'est un peu moins. Voulez-vous rejoindre notre environnement 3D ?, a-t-il demandé à la foule qui débordait de l'Exhibit Hall 5 du Convention Center.", 'french');
Bayes.train("Des milliers de manifestants ont défilé samedi 9 mars à Tokyo pour exiger l'abandon rapide de l'énergie nucléaire au Japon, près de deux ans jour pour jour après le début de la catastrophe de Fukushima.", 'french');
Bayes.train("Oui, ça en a tout l'air, même si le conflit en Syrie n'était pas confessionnel au départ et ne l'est pas encore vraiment. Il faut saluer là l'extraordinaire résistance de la société civile syrienne à la tentation confessionnelle, mais cela ne durera pas éternellement.", 'french');

// Spanish Training
Bayes.train("El ex presidente sudafricano, Nelson Mandela, ha sido hospitalizado la tarde del sábado, según confirmó un hospital de Pretoria a CNN. Al parecer se trata de un chequeo médico que ya estaba previsto, relacionado con su avanzada edad, según explicó el portavoz de la presidencia Sudafricana Mac Maharaj.", 'spanish');
Bayes.train("Trabajadores del Vaticano escalaron al techo de la Capilla Sixtina este sábado para instalar la chimenea de la que saldrá el humo negro o blanco para anunciar el resultado de las votaciones para elegir al nuevo papa.La chimenea es el primer signo visible al público de las preparaciones que se realizan en el interior de la capilla donde los cardenales católicos se reunirán a partir de este martes para el inicio del cónclave.", 'spanish');
Bayes.train("La Junta Directiva del Consejo Nacional Electoral (CNE) efectuará hoy una sesión extraordinaria para definir la fecha de las elecciones presidenciales, después de que Nicolás Maduro fuera juramentado ayer Viernes presidente de la República por la Asamblea Nacional.", 'spanish');
Bayes.train(" A 27 metros bajo el agua, la luz se vuelve de un azul profundo y nebuloso. Al salir de la oscuridad, tres bailarinas en tutú blanco estiran las piernas en la cubierta de un buque de guerra hundido. No es una aparición fantasmal, aunque lo parezca, es la primera de una serie de fotografías inolvidables que se muestran en la única galería submarina del mundo.", 'spanish');
Bayes.train("Uhuru Kenyatta, hijo del líder fundador de Kenia, ganó por estrecho margen las elecciones presidenciales del país africano a pesar de enfrentar cargos de crímenes contra la humanidad por la violencia electoral de hace cinco años. Según anunció el sábado la comisión electoral, Kenyatta logró el 50,07% de los votos. Su principal rival, el primer ministro Raila Odinga, obtuvo 43,31% de los votos, y dijo que reclamará el resultado en los tribunales. La Constitución exige que el 50% más un voto para una victoria absoluta.", 'spanish');

// English Training
Bayes.train("One morning in late September 2011, a group of American drones took off from an airstrip the C.I.A. had built in the remote southern expanse of Saudi Arabia. The drones crossed the border into Yemen, and were soon hovering over a group of trucks clustered in a desert patch of Jawf Province, a region of the impoverished country once renowned for breeding Arabian horses.", 'english');
Bayes.train("Just months ago, demonstrators here and around Egypt were chanting for the end of military rule. But on Saturday, as a court ruling about a soccer riot set off angry mobs, many in the crowd here declared they now believed that a military coup might be the best hope to restore order. Although such calls are hardly universal and there is no threat of an imminent coup, the growing murmurs that military intervention may be the only solution to the collapse of public security can be heard across the country, especially in circles opposed to the Islamists who have dominated post-Mubarak elections. ", 'english');
Bayes.train(" Syrian rebels released 21 detained United Nations peacekeepers to Jordanian forces on Saturday, ending a standoff that raised new tensions in the region and new questions about the fighters just as the United States and other Western nations were grappling over whether to arm them. The rebels announced the release of the Filipino peacekeepers, and Col. Arnulfo Burgos, a spokesman for the Armed Forces of the Philippines, confirmed it.", 'english');
Bayes.train(" The 83rd International Motor Show, which opened here last week, features the world premieres of 130 vehicles. These include an unprecedented number of models with seven-figure prices, including the $1.3 million LaFerrari supercar, the $1.15 million McLaren P1, the $1.6 million Koenigsegg Hundra and a trust-fund-busting Lamborghini, the $4 million Veneno. The neighborhood has become so rich that the new Rolls-Royce Wraith, expected to sell for more than $300,000, seemed, in comparison, like a car for the masses.", 'english');
Bayes.train("David Hallberg, the statuesque ballet star who is a principal dancer at both the storied Bolshoi Ballet of Moscow and American Ballet Theater in New York, is theoretically the type of front-row coup that warrants a fit of camera flashes. But when Mr. Hallberg, 30, showed up at New York Fashion Week last month, for a presentation by the Belgian designer Tim Coppens, he glided into the front row nearly unnoticed, save for a quick chat with Tumblr’s fashion evangelist, Valentine Uhovski, and a warm embrace from David Farber, the executive style editor at WSJ.", 'english');