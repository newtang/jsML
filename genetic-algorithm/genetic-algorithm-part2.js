var elements = {"Hydrogen":{"weight":389,"value":400},"Helium":{"weight":309,"value":380},"Lithium":{"weight":339,"value":424},"Beryllium":{"weight":405,"value":387},"Boron":{"weight":12,"value":174},"Carbon":{"weight":298,"value":483},"Nitrogen":{"weight":409,"value":303},"Oxygen":{"weight":432,"value":497},"Fluorine":{"weight":414,"value":306},"Neon":{"weight":149,"value":127},"Sodium":{"weight":247,"value":341},"Magnesium":{"weight":327,"value":98},"Aluminium":{"weight":195,"value":343},"Silicon":{"weight":356,"value":122},"Phosphorus":{"weight":49,"value":157},"Sulfur":{"weight":151,"value":438},"Chlorine":{"weight":56,"value":460},"Argon":{"weight":317,"value":395},"Potassium":{"weight":383,"value":221},"Calcium":{"weight":281,"value":395},"Scandium":{"weight":394,"value":79},"Titanium":{"weight":377,"value":303},"Vanadium":{"weight":381,"value":308},"Chromium":{"weight":299,"value":295},"Manganese":{"weight":114,"value":447},"Iron":{"weight":422,"value":360},"Cobalt":{"weight":288,"value":249},"Nickel":{"weight":458,"value":482},"Copper":{"weight":91,"value":314},"Zinc":{"weight":104,"value":140},"Gallium":{"weight":470,"value":254},"Germanium":{"weight":77,"value":25},"Arsenic":{"weight":213,"value":393},"Selenium":{"weight":419,"value":96},"Bromine":{"weight":114,"value":199},"Krypton":{"weight":490,"value":8},"Rubidium":{"weight":278,"value":367},"Strontium":{"weight":310,"value":159},"Yttrium":{"weight":175,"value":109},"Zirconium":{"weight":453,"value":288},"Niobium":{"weight":56,"value":375},"Molybdenum":{"weight":147,"value":343},"Technetium":{"weight":123,"value":105},"Ruthenium":{"weight":325,"value":214},"Rhodium":{"weight":418,"value":428},"Palladium":{"weight":353,"value":387},"Silver":{"weight":182,"value":429},"Cadmium":{"weight":411,"value":394},"Indium":{"weight":322,"value":329},"Tin":{"weight":490,"value":436},"Antimony":{"weight":28,"value":479},"Tellurium":{"weight":443,"value":305},"Iodine":{"weight":345,"value":253},"Xenon":{"weight":463,"value":19},"Caesium":{"weight":361,"value":416},"Barium":{"weight":307,"value":417},"Lanthanum":{"weight":291,"value":453},"Cerium":{"weight":259,"value":414},"Praseodymium":{"weight":58,"value":83},"Neodymium":{"weight":127,"value":475},"Promethium":{"weight":11,"value":480},"Samarium":{"weight":361,"value":192},"Europium":{"weight":409,"value":271},"Gadolinium":{"weight":86,"value":231},"Terbium":{"weight":100,"value":75},"Dysprosium":{"weight":166,"value":128},"Holmium":{"weight":54,"value":109},"Erbium":{"weight":432,"value":399},"Thulium":{"weight":361,"value":395},"Ytterbium":{"weight":417,"value":222},"Lutetium":{"weight":311,"value":224},"Hafnium":{"weight":138,"value":101},"Tantalum":{"weight":177,"value":397},"Tungsten":{"weight":14,"value":234},"Rhenium":{"weight":480,"value":141},"Osmium":{"weight":208,"value":490},"Iridium":{"weight":121,"value":68},"Platinum":{"weight":182,"value":29},"Gold":{"weight":339,"value":267},"Mercury":{"weight":259,"value":438},"Thallium":{"weight":342,"value":425},"Lead":{"weight":65,"value":395},"Bismuth":{"weight":33,"value":497},"Polonium":{"weight":293,"value":394},"Astatine":{"weight":392,"value":210},"Radon":{"weight":116,"value":203},"Francium":{"weight":433,"value":253},"Radium":{"weight":303,"value":109},"Actinium":{"weight":149,"value":317},"Thorium":{"weight":342,"value":129},"Protactinium":{"weight":457,"value":50},"Uranium":{"weight":118,"value":77},"Neptunium":{"weight":117,"value":300},"Plutonium":{"weight":106,"value":455},"Americium":{"weight":66,"value":365},"Curium":{"weight":393,"value":407},"Berkelium":{"weight":289,"value":458},"Californium":{"weight":302,"value":322},"Einsteinium":{"weight":455,"value":94},"Fermium":{"weight":216,"value":347},"Mendelevium":{"weight":304,"value":331},"Nobelium":{"weight":49,"value":236},"Lawrencium":{"weight":84,"value":351},"Rutherfordium":{"weight":345,"value":233},"Dubnium":{"weight":168,"value":187},"Seaborgium":{"weight":361,"value":125},"Bohrium":{"weight":236,"value":479},"Hassium":{"weight":201,"value":353},"Meitnerium":{"weight":278,"value":307},"Darmstadtium":{"weight":308,"value":344},"Roentgenium":{"weight":171,"value":201},"Copernicium":{"weight":251,"value":460},"Ununtrium":{"weight":158,"value":52},"Ununquadium":{"weight":282,"value":113},"Ununpentium":{"weight":145,"value":497},"Ununhexium":{"weight":459,"value":449},"Ununseptium":{"weight":327,"value":7},"Ununoctium":{"weight":184,"value":411}};
var numToElement = [];
var Chromosome = function(members){
	this.members = members;
	for(var prop in this.members){
		if(this.members[prop].active === undefined){
			this.members[prop].active = !!(Math.round(Math.random()));
		}
	}

	this.mutate();
	this.calcScore();
}

Chromosome.prototype.weight = 0;  
Chromosome.prototype.value = 0;  
Chromosome.prototype.members = [];  
Chromosome.prototype.maxWeight = 1000; 
Chromosome.prototype.overWeightPenalty = 50; 
Chromosome.prototype.mutationRate = 0.7;  
Chromosome.prototype.score = 0;

Chromosome.prototype.mutate = function(){
	if (Math.random() > this.mutationRate){
        return false;
    }
    var elem = numToElement[Math.floor(Math.random() * numToElement.length)];
	this.members[elem].active = !this.members[elem].active;
}

Chromosome.prototype.calcScore = function(){
	if(this.score){
		return this.score;
	}

	for(var elem in this.members){
		if(this.members[elem].active){
			this.value += elements[elem].value;
			this.weight += elements[elem].weight;
		}
	}

	this.score = this.value;

	if(this.weight > this.maxWeight){
		this.score -= (this.weight - this.maxWeight) * this.overWeightPenalty;
	}

	return this.score;
}

var Population = function(elements, size) {
    this.elements = elements;
    this.size = size;
    this.chromosomes = [];
    this.fill();
};

Population.prototype.elitism = 0.2;  
Population.prototype.size = 100;  
Population.prototype.elements = false;

Population.prototype.generation = function(log) {  
    this.sort();
    this.kill();
    this.mate();
    this.fill();
    this.sort();
};

Population.prototype.sort = function() {  
    this.chromosomes.sort(function(a, b) { return b.score - a.score; });
};

Population.prototype.kill = function() {  
    var target = Math.floor( this.elitism * this.chromosomes.length );
    while (this.chromosomes.length > target)
    {
        this.chromosomes.pop();
    }
};

Population.prototype.mate = function(){
	let chr1Num = Math.floor(this.chromosomes.length * Math.random());
	let chr2Num;
	do {
		chr2Num = Math.floor(this.chromosomes.length * Math.random());
	}
	while(chr1Num === chr2Num);

	let children = mate(this.chromosomes[chr1Num], this.chromosomes[chr2Num]);
	console.log(children);
	this.chromosomes.push.apply(this.chromosomes, children);
};

Population.prototype.fill = function(){
	while(this.chromosomes.length < this.size){
		if(this.chromosomes.length < this.size/3){
			this.chromosomes.push( new Chromosome( deepElementClone() ) );
		}
		else{
			this.mate();
		}
	}
}

Population.prototype.run = function(threshold, noImprovement, lastScore, i) {
	if(noImprovement < threshold){
		lastScore = this.chromosomes[0].score;
		this.generation();

		if(lastScore >= this.chromosomes[0].score){
			++noImprovement;
		}
		else{
			noImprovement = 0;
		}

		++i;

		if(i%10 === 0){
			display(this, i, noImprovement);
		}

		var scope = this;
        setTimeout(function() { 
        	scope.run(threshold, noImprovement, lastScore, i);
        }, 1);

        return false;

	}

	display(this, i, noImprovement);
}

function display(population, i, noImprovement){
    document.getElementById('gen_no').innerHTML = i;
    document.getElementById('weight').innerHTML = population.chromosomes[0].weight;
    document.getElementById('value').innerHTML = population.chromosomes[0].score;
    document.getElementById('nochange').innerHTML = noImprovement;
}

function reset(){
    document.getElementById('gen_no').innerHTML = 0;
    document.getElementById('weight').innerHTML = 0;
    document.getElementById('value').innerHTML = 0;
    document.getElementById('nochange').innerHTML = 0;
}

function deepElementClone(){
	let newElems = {};
	for(var elem in elements){
		newElems[elem] = Object.assign({}, elements[elem]);
	}
	return newElems;
}

function start(){
	populateNumToElement();
	

	document.getElementById('runbutton').onclick = function() {
	   reset();
	   var p = new Population(deepElementClone(), 20);
	   p.run(document.getElementById('runfor').value, 0, 0, 0);
	};
}

function populateNumToElement(){
	let num = 0;
	for(let elem in elements){
		numToElement[num] = elem;
		++num;
	}
}

function mate(chr1, chr2){
	let pivot = Math.floor(Math.random() * numToElement.length);
	let i = 0;
	let child1Members = {};
	let child2Members = {};

	for(var elem in elements){
		if(i > pivot){
			child1Members[elem] = Object.assign({}, chr1.members[elem]);
			child2Members[elem] = Object.assign({}, chr2.members[elem]);
		}
		else{
			child1Members[elem] = Object.assign({}, chr2.members[elem]);
			child2Members[elem] = Object.assign({}, chr1.members[elem]);
		}

		++i;
	}


	let child1 = new Chromosome( child1Members );
	let child2 = new Chromosome( child2Members );
	return [child1, child2];
}


start();

