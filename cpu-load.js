var _ 			= require('underscore');
var usageBuffer = [];

var parseProcStat = function(data){
	var cores = data.split("\n");

	var coreUsages = {};

	_.each(cores, function(core, key){
		var usage = core.split(' ').map(function(num){
			return parseInt(num);
		});

		usage.shift();

		var totalSum = _.reduce(usage, function(prev, curr){
			return prev + curr;
		}, 0);

		var workSum = usage[0] + usage[1] + usage[2];

		coreUsages[key] = {
			total : totalSum,
			work: workSum
		};

	});

	usageBuffer.push(coreUsages);

}

var showCpuUsage = function(){

	if(usageBuffer.length > 2){
		usageBuffer.shift();

		var usage = [];

		_(_.keys(usageBuffer[0]).length).times(function(core){

			// http://stackoverflow.com/questions/3017162/how-to-get-total-cpu-usage-in-linux-c/3017438#3017438
			var work_over_period = usageBuffer[1][core]['work'] - usageBuffer[0][core]['work'];

			var total_over_period = usageBuffer[1][core]['total']  - usageBuffer[0][core]['total'];

			var cpu = work_over_period / total_over_period * 100;

			usage.push(parseFloat(cpu).toFixed(1));
		})

		return usage;
	}
}

exports.parseLoad = function(data) {

    parseProcStat(data);

    return showCpuUsage();
}

exports.resetUsageData = function() {
    usageBuffer = [];
}