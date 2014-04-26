var Solver = require('../../lib/jsLPSolver/src/solver');

var GB = Math.pow(1024, 3)

var SimplexService = function() {
    var solver = new Solver();

    var cacheLatency = 1,
        diskLatency = 10,
        tapeLatency = 45;
    var budget = 15;

    this.solve_model = function(totalSize) {
        //TODO: 10 CDN mirrors? content moving charge?

        //TODO: calculate these based on individual estimates
        averageEstimatedCacheServes = 100
        averageEstimatedDiskServes = 25
        //TODO: make sure (individual estimated serves * individual sizes)
        //      == (averageServes * solved storage amount) when assigning media
        //      to each storage location

        // in bytes
        var model = {
            optimize: "latency",
            opType: "min",
            constraints: {
                //TODO: can we combine storage and serve costs?
                storageCost: {max: 1/10 * budget},
                serveCost: {max: 9/10 * budget},
                space: {min: totalSize}
            },
            variables: {
                cache: {
                    storageCost: 0.25 / (10 * GB),
                    serveCost: 0.30 / GB * averageEstimatedCacheServes,
                    latency: cacheLatency,
                    space: 1
                },
                disk: {
                    storageCost: 0.025 / (10 * GB),
                    serveCost: 0.10 / GB * averageEstimatedDiskServes,
                    latency: diskLatency,
                    space: 1
                },
                tape: {
                    storageCost: 0,
                    serveCost: 0,
                    latency: tapeLatency,
                    space: 1
                }
            },
            ints: { cache: 1 , disk: 1 , tape: 1 }
        };

        var results = solver.Solve(model);
        return results;
    };
};

module.exports = new SimplexService();
