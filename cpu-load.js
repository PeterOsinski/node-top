var os 			= require('os');
var _ 			= require('underscore');
var sys 		= require('sys');
var exec 		= require('child_process').exec;

var cpusLen 	= os.cpus().length;
var usageBuffer = [];

var parseProcStat = function(data){
	var cpus = os.cpus();
	var cores = data.split("\n").slice(0, cpus.length + 1);
	var avg = cores.shift();

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
		var cpus = os.cpus();

		_(cpusLen).times(function(core){

			// http://stackoverflow.com/questions/3017162/how-to-get-total-cpu-usage-in-linux-c/3017438#3017438
			var work_over_period = usageBuffer[1][core]['work'] - usageBuffer[0][core]['work'];

			var total_over_period = usageBuffer[1][core]['total']  - usageBuffer[0][core]['total'];

			var cpu = work_over_period / total_over_period * 100;

			usage.push({
				load: parseFloat(cpu).toFixed(1),
				speed: cpus[core].speed
			});
		})

		return usage;
	}
}

exports.getLoad = function() {

	exec("cat /proc/stat", function(error, stdout, stderr) {

        parseProcStat(stdout);

    });

    return showCpuUsage();
}

exports.resetUsageData = function() {
    usageBuffer = [];
}