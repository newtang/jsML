var data = [
    {rooms: 1, area: 350, type: 'apartment'},
    {rooms: 2, area: 300, type: 'apartment'},
    {rooms: 3, area: 300, type: 'apartment'},
    {rooms: 4, area: 250, type: 'apartment'},
    {rooms: 4, area: 500, type: 'apartment'},
    {rooms: 4, area: 400, type: 'apartment'},
    {rooms: 5, area: 450, type: 'apartment'},

    {rooms: 7,  area: 850,  type: 'house'},
    {rooms: 7,  area: 900,  type: 'house'},
    {rooms: 7,  area: 1200, type: 'house'},
    {rooms: 8,  area: 1500, type: 'house'},
    {rooms: 9,  area: 1300, type: 'house'},
    {rooms: 8,  area: 1240, type: 'house'},
    {rooms: 10, area: 1700, type: 'house'},
    {rooms: 9,  area: 1000, type: 'house'},

    {rooms: 1, area: 800,  type: 'flat'},
    {rooms: 3, area: 900,  type: 'flat'},
    {rooms: 2, area: 700,  type: 'flat'},
    {rooms: 1, area: 900,  type: 'flat'},
    {rooms: 2, area: 1150, type: 'flat'},
    {rooms: 1, area: 1000, type: 'flat'},
    {rooms: 2, area: 1200, type: 'flat'},
    {rooms: 1, area: 1300, type: 'flat'},
];

var run = function() {

    var k = 3,
        nodes = [];

    for (var obj of data){
        nodes.push( Object.assign(obj) );
    }

    var random_rooms = Math.round( Math.random() * 10 );
    var random_area = Math.round( Math.random() * 2000 );
    var unknown = {rooms: 5, area: 750, type: false};

    var featureRanges = ranges(nodes);
    var distanceObjs = distances(nodes, featureRanges, unknown);
    distanceObjs.sort(function(a,b){
        return a.distance - b.distance;
    });


    var topK = distanceObjs.slice(0,k);

    
    var guess = guessType(topK);
    draw("canvas", nodes, featureRanges, unknown, guess, topK);
};


function ranges(nodes){
    var minMax = {};
    for(var n of nodes){
        for(var prop in n){
            if(typeof n[prop] !== "number"){
                continue;
            }

            if(!minMax[prop]){
                minMax[prop] = {min:Number.MAX_VALUE, max:Number.MIN_VALUE};
            }

            if (n[prop] > minMax[prop].max){
                minMax[prop].max = n[prop];
            }
            else if(n[prop] < minMax[prop].min){
                minMax[prop].min = n[prop];
            }
        }
    }

    return minMax;
}

function guessType(topK){
    var types = {};

    for(var distanceObj of topK){
        var type = distanceObj.node.type;
        if(!types[type]){
            types[type] = 0;
        }
        ++types[type] ;
    }

    var maxNum = Number.MIN_VALUE,
        maxType;

    for(var prop in types){
        if(types[prop] > maxNum){
            maxNum = types[prop];
            maxType = prop;
        }
    }

    return maxType;

}

function distances(nodes, minMax, unknown){
    var ranges = {},
        distances = [];
    for(var prop in minMax){
        ranges[prop] = minMax[prop].max - minMax[prop].min;
    }

    for(var n of nodes){
        var sum = 0;
        for(var prop in ranges){


             sum += Math.pow(( (unknown[prop] - n[prop]) / ranges[prop]), 2);

        }
        distances.push({node: n, distance: Math.sqrt(sum)});
    }

    return distances;

}

function drawNode(ctx, width, height, node, featureRanges, rooms_range, areas_range, padding){
    ctx.save();

    switch (node.type)
    {
        case 'apartment':
            ctx.fillStyle = 'red';
            break;
        case 'house':
            ctx.fillStyle = 'green';
            break;
        case 'flat':
            ctx.fillStyle = 'blue';
            break;
        default:
            ctx.fillStyle = '#666666';
    }

    var x_shift_pct = (width  - padding) / width;
    var y_shift_pct = (height - padding) / height;

    var x = (node.rooms - featureRanges.rooms.min) * (width  / rooms_range) * x_shift_pct + (padding / 2);
    var y = (node.area  - featureRanges.area.min) * (height / areas_range) * y_shift_pct + (padding / 2);
    y = Math.abs(y - height);


    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    
    if ( ! node.type ){
            switch (node.guess.type)
            {
                case 'apartment':
                    ctx.strokeStyle = 'red';
                    break;
                case 'house':
                    ctx.strokeStyle = 'green';
                    break;
                case 'flat':
                    ctx.strokeStyle = 'blue';
                    break;
                default:
                    ctx.strokeStyle = '#666666';
            }

            var radius = node.neighbors[node.neighbors.length - 1].distance * width;
            radius *= x_shift_pct;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.closePath();

        }

        ctx.restore();

    
    

    
}

function draw(canvas_id, nodes, featureRanges, unknown, guess, topKDistances) {
    var rooms_range = featureRanges.rooms.max - featureRanges.rooms.min;
    var areas_range = featureRanges.area.max - featureRanges.area.min;

    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");
    var width = 400;
    var height = 400;
    var padding = 40;
    ctx.clearRect(0,0,width, height);


    for (var n of nodes)
    {
        drawNode(ctx, width, height, n, featureRanges, rooms_range, areas_range, padding);
    }

    unknown.guess = {type: guess};
    unknown.neighbors = topKDistances;
    drawNode(ctx, width, height, unknown, featureRanges, rooms_range, areas_range, padding);

    

};

//setInterval(run, 5000);
run();
