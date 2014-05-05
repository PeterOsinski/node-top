var os 			= require('os');
var _ 			= require('underscore');
var sys 		= require('sys');
var exec 		= require('child_process').exec;

/*

A better indicator is the load average, if I simplify, it is the amount of waiting tasks because of insufficient resources.

You can access it in the uptime command, for example: 13:05:31 up 6 days, 22:54,  5 users,  load average: 0.01, 0.04, 0.06. 
The 3 numbers at the end are the load averages for the last minute, the last 5 minutes and the last 15 minutes. 
If it reaches 1.00, (no matter of the number of cores) it is that something it waiting.
 */
console.log(os.loadavg());


var usageBuffer = [];
var cpusLen = os.cpus().length;

var parseProcStat = function(data){
	var cores = data.split("\n").slice(0, cpusLen + 1);
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

		_(cpusLen).times(function(core){

			var work_over_period = usageBuffer[1][core]['work'] - usageBuffer[0][core]['work'];

			var total_over_period = usageBuffer[1][core]['total']  - usageBuffer[0][core]['total'];

			var cpu = work_over_period / total_over_period * 100;

			usage.push(parseFloat(cpu).toFixed(1));
		})

		console.log(usage.join('  '));
	}
}

setInterval(function(){

	exec("cat /proc/stat", function(error, stdout, stderr) { 
	
		parseProcStat(stdout);

	});
	
	showCpuUsage();
	
}, 500)