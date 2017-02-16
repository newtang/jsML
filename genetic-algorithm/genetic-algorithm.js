(function(){
	function Chromosome(str){
		this.code = str;
		this.cost = 0;
	}

	Chromosome.prototype.mutate = function(chance){
		if(Math.random() > chance) return;

		let charIndex = Math.floor(Math.random() * this.code.length),
			charArray = this.code.split(''),
			increase = (Math.random() > .5);

		if(increase){
			charArray[charIndex] = String.fromCharCode(this.code.charCodeAt(charIndex)+1);
		}
		else{
			charArray[charIndex] = String.fromCharCode(this.code.charCodeAt(charIndex)-1);	
		}

		this.code = charArray.join("");
	}

	Chromosome.prototype.calcCost = function(goal){
		let total = 0;
		for(let i=0; i<goal.length; ++i){
			total += Math.pow(this.code.charCodeAt(i) - goal.charCodeAt(i), 2);
		}
		this.cost = total;
	}




	function mate(){
		let offspring = [];
		let pivot = Math.round(arguments[0][0].code.length / 2) + 1;
		for(pair of arguments){
			offspring.push(new Chromosome(pair[0].code.substr(0, pivot) + pair[1].code.substr(pivot)));
			offspring.push(new Chromosome(pair[1].code.substr(0, pivot) + pair[0].code.substr(pivot)));
		}

		return offspring;
	}



	function genChromosome(len){
		let code = [];
		while(len--){
			code.push(String.fromCharCode( Math.floor(Math.random() * 255)));
		}
		return new Chromosome(code.join(""));
	}


	function Population(goal, size){
		this.chromosomes = [];
		this.goal = goal;
		this.generationNumber = 0;
		while(size--){
			this.chromosomes.push(genChromosome(goal.length));
		}
	}

	Population.prototype.sort = function(){
		this.chromosomes.sort(function(a,b){
			return a.cost - b.cost;
		});
	};

	Population.prototype.generate = function(){
		for(let chr of this.chromosomes){
			chr.calcCost(this.goal);
			if(chr.code === this.goal){
				this.sort();
				return true;
			}
		}

		this.sort();
		

		let offspring = mate(
			[this.chromosomes[0], this.chromosomes[1]]
			//,[this.chromosomes[10], this.chromosomes[11]]
		);
		let g = this.goal;

		offspring.forEach(function(kid){
			kid.calcCost(g);
		});

		this.chromosomes.splice(this.chromosomes.length - offspring.length, offspring.length);
		this.chromosomes.push.apply(this.chromosomes, offspring);

		for(let chr of this.chromosomes){
			chr.mutate(0.5);
		}

		++this.generationNumber;
		return false;

	};

	function go(pop){
		let result = pop.generate();
		display(pop);

		if(!result){
			setTimeout(go.bind(this, pop), 20);
		}


	}

	function display(pop){
	    document.body.innerHTML = '';
	    document.body.innerHTML += ("<h2>Generation: " + pop.generationNumber + "</h2>");
	    document.body.innerHTML += ("<ul>");
	    for (var i = 0; i < pop.chromosomes.length; i++) {
	        document.body.innerHTML += ("<li>" + pop.chromosomes[i].code + " (" + pop.chromosomes[i].cost + ")");
	    }
	    document.body.innerHTML += ("</ul>");

	}


	go(new Population("hello world", 20));
})();