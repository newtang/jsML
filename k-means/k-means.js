var data = [  
    [1, 2],
    [2, 1],
    [2, 4], 
    [1, 3],
    [2, 2],
    [3, 1],
    [1, 1],

    [7, 3],
    [8, 2],
    [6, 4],
    [7, 4],
    [8, 1],
    [9, 2],

    [10, 8],
    [9, 10],
    [7, 8],
    [7, 9],
    [8, 11],
    [9, 9],
];

function start(){
    const k = 3;
    let extremes = calcExtremes(data);
    let ranges = calcRanges(extremes);

    let means = initMeans(k, ranges, extremes);
    let assignments = calcAssignments(data, means);
}

function calcAssignments(data, means){
    let assignments = [];
    for (let i=0; i<data.length; ++i){
        let d = data[i];
        let distances = [];
        for(let m of means){
            distances.push(calcDistance(d, m));
        }
        assignments[i] = getMinIndex(distances);
    }
}

function getMinIndex(arr){
    let min = Number.MAX_VALUE;
    let index = -1;
    for(let i=0; i<arr.length; ++i){
        let num = arr[i];
        if(num < min){
            min = num;
            index = i;
        }
    }
    return index;
}


function calcDistance(p1, p2){
    let sum = 0;
    for(let i=0; i<p1.length; ++i){
        sum += Math.pow(p1[i] - p2[i], 2);
    }
    return Math.sqrt(sum);
}




function initMeans(k, ranges, extremes){
    let means = [];
    while(k>0){
        let mean = [];
        for(let i=0; i<ranges.length; ++i){
            mean[i] = Math.random() * ranges[i] + extremes[i].min;
        
        }
        means.push(mean);
        --k;
    }
    return means;
}

function calcRanges(extremes){
    let ranges = [];
    for(let i=0; i<extremes.length; ++i){
        let extreme = extremes[i];
        ranges[i] = extreme.max - extreme.min;
    }
    return ranges;
}

function calcExtremes(data){
    let extremes = [];
    for(let d of data){
        for(let i=0; i<d.length; ++i){
            if(!extremes[i]){
                extremes[i] = {min: Number.MAX_VALUE, max: Number.MIN_VALUE};
            }

            if(d[i] < extremes[i].min){
                extremes[i].min = d[i];
            }
            else if(d[i] > extremes[i].max){
                extremes[i].max = d[i];
            }


        }
    }
    return extremes;
}