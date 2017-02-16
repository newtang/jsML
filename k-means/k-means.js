(function(){
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

        //these are the random points added
        let means = initMeans(k, ranges, extremes);

        //these are the closest points to each random point
        let assignments = calcAssignments(data, means);
        
        draw(means, data, assignments, extremes, ranges);


        setTimeout(run.bind(null, data, means, extremes, ranges), 1000);
    }

    function run(data, means, extremes, ranges){
        let origMeans = means;
        let assignments = calcAssignments(data, means);
        means = moveMeans(data, means, assignments);
        if(origMeans.join(",") !== means.join(",")){
            draw(means, data, assignments, extremes, ranges);
            setTimeout(run.bind(null, data, means, extremes, ranges), 1000);
        }
    }

    function moveMeans(data, means, assignments){
        let sumPerAssignment = [];
        let countPerAssignment = [];

        for(let i=0; i<assignments.length; ++i){
            let assignMeanNum = assignments[i];
            if(!countPerAssignment[assignMeanNum]){
                 countPerAssignment[assignMeanNum] = 0;
            }

            countPerAssignment[assignMeanNum]++;
            
            if(!sumPerAssignment[assignMeanNum]){
                sumPerAssignment[assignMeanNum] = [];
            }

            let datum = data[i];

            for(let j=0; j<datum.length; ++j){
                if(!sumPerAssignment[assignMeanNum][j]){
                    sumPerAssignment[assignMeanNum][j] = 0;
                }
                sumPerAssignment[assignMeanNum][j] += datum[j];
            }
        }

        let newMeans = [];

        for(let i=0; i<sumPerAssignment.length; ++i){
            let newMean = [];
            if(sumPerAssignment[i]){
                for(let j=0; j<sumPerAssignment[i].length; ++j){
                    let sum = sumPerAssignment[i][j];
                    newMean[j] = sum / countPerAssignment[i];
                }
            }
            else{
                newMean = [0, 0];
            }
            
            newMeans.push(newMean);
        }

        return newMeans;


    }


    //the ith data maps to 1 through k
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
        return assignments;
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



    //creates random k points
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


    function draw(means, data, assignments, dataExtremes, dataRange) {
        let canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            height = 400,
            width = 400;

        ctx.clearRect(0,0,width, height);
        ctx.globalAlpha = 0.3;

        for (let point_index =0; point_index<assignments.length; ++point_index)
        {
            let mean_index = assignments[point_index],
                point = data[point_index],
                mean = means[mean_index];

            ctx.save();

            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(
                (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
                (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
            );
            ctx.lineTo(
                (mean[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
                (mean[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
            );
            ctx.stroke();
            ctx.closePath();
        
            ctx.restore();
        }
        ctx.globalAlpha = 1;

        for (let point of data)
        {
            ctx.save();

            var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
                y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

            ctx.strokeStyle = '#333333';
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        }

        for (var point of means){
            ctx.save();

            var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
                y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

            ctx.fillStyle = 'green';
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI*2, true);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }

    }

    start();

})();