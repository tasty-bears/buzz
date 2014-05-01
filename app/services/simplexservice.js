var Solver = require('../../lib/jsLPSolver/src/solver');

var GB = Math.pow(1024, 3)

var SimplexService = function() {
    var solver = new Solver();

    var cacheLatency = 1,
        diskLatency = 10,
        tapeLatency = 45;
    var budget = 15;

    userActivity = 40; // how many times the average user will access
                       // each media item. super rough estimate
                       // - highballing since we are testing a lot

    // assume our latency constants are super awesome and exactily proportional
    // to the relative user activity for each type of media
    var cacheActivity = tapeLatency / cacheLatency;
    var diskActivity = tapeLatency / diskLatency;

    // in bytes
    this.create_model = function(totalMediaSize, avgCacheServes, avgDiskServes) {
        return {
            optimize: "latency",
            opType: "min",
            constraints: {
                //TODO: can we combine storage and serve costs?
                storageCost: {max: 1/10 * budget},
                serveCost: {max: 9/10 * budget},
                space: {min: totalMediaSize}
            },
            variables: {
                cache: {
                    storageCost: 0.25 / (10 * GB),
                    serveCost: 0.30 / GB * avgCacheServes,
                    latency: cacheLatency,
                    space: 1
                },
                disk: {
                    storageCost: 0.025 / (10 * GB),
                    serveCost: 0.10 / GB * avgDiskServes,
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
    }
    

    this.solve_model = function(totalMediaSize, numUsers) {
        //TODO: 10 CDN mirrors? content moving charge?

        var avgEstCacheServes = numUsers * userActivity * cacheActivity
        var avgEstDiskServes = numUsers * userActivity * diskActivity

        var model = this.create_model(totalMediaSize, avgEstCacheServes, avgEstDiskServes)

        var results = solver.Solve(model);
        return results;
    };
};

module.exports = new SimplexService();
