var Solver = require('../../lib/jsLPSolver/src/solver');

var SimplexService = function() {
    var solver = new Solver();

    this.test = function() {
        var model = {
            optimize: "profit",
            opType: "max",
            constraints: {
                space: {max: 205},
                price: {max: 40000}
            },
            variables: {
                press: {space: 15, price: 8000, profit: 100},
                lathe: {space: 30, price: 4000, profit: 150},
                drill: {space: 14, price: 4500, profit: 80}
            },
            ints: {
                press: 1 ,lathe: 1 ,drill: 1
            }
        };

        var results = solver.Solve(model);
        return results;
        }
};

module.exports = new SimplexService();
