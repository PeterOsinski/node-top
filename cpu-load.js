var os 			= require('os');
var _ 			= require('underscore');
var sys 		= require('sys');
var exec 		= require('child_process').exec;

var cpusLen 	= os.cpus().length;
var usageBuffer = [];

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

			// http://stackoverflow.com/questions/3017162/how-to-get-total-cpu-usage-in-linux-c/3017438#3017438
			var work_over_period = usageBuffer[1][core]['work'] - usageBuffer[0][core]['work'];

			var total_over_period = usageBuffer[1][core]['total']  - usageBuffer[0][core]['total'];

			var cpu = work_over_period / total_over_period * 100;

			usage.push(parseFloat(cpu).toFixed(1));
		})

		return usage;
	}
}

var CPU_LOAD_INTERVAL;
exports.startLogging = function(interval, cb) {

	console.log('start measuring cpu load');

    CPU_LOAD_INTERVAL = setInterval(function() {

        exec("cat /proc/stat", function(error, stdout, stderr) {

            parseProcStat(stdout);

        });

        cb(showCpuUsage());

    }, interval || 500);
}

exports.stopLogging = function() {

	console.log('stop measuring cpu load...');

    clearInterval(CPU_LOAD_INTERVAL);
    
}

exports.resetUsageData = function() {
    usageBuffer = [];
}