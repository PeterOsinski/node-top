var os 		= require('os');
var sys 	= require('sys');
var exec	= require('child_process').exec;
var _ = require('underscore');
var async = require('async');

exports.getInfo = function(callback){
     

    async.parallel({
    	sys: function(cb){
    		
				// A better indicator is the load average, if I simplify, it is the amount of waiting tasks because of insufficient resources.
				// You can access it in the uptime command, for example: 13:05:31 up 6 days, 22:54,  5 users,  load average: 0.01, 0.04, 0.06. 
				// The 3 numbers at the end are the load averages for the last minute, the last 5 minutes and the last 15 minutes. 
				// If it reaches 1.00, (no matter of the number of cores) it is that something it waiting.
			
    		cb(null, {
    			'loadavg': os.loadavg().map(function(val){
					return val.toFixed(2);
				}),
				'uptime': Math.round(os.uptime()),
				'platform': os.platform()
    		})

    	},
    	mem: function(cb){

    		execFree(function(data){

    			cb(null, data);

    		})

    	},
    	ps: function(cb){

    		execPs(function(data){

    			cb(null, data);

    		})

    	},
    	df: function(cb){

    		execDf(function(data){

    			cb(null, data);

    		})

    	}
	}, function(err, results){
		callback(results);
	});
}

var execDf = function(cb){

	exec('df -h', function(error, stdout, stderr){

		var data = stdout.split("\n");
		data.shift();
		cb(data);

	})

}

var execPs = function(cb){
	
	var cmd = 'ps -eo pcpu,pmem,user,pid,command,start,time --sort %cpu | tail -n 10';
	exec(cmd, function(error, stdout, stderr) {

		//mem, cpu, user, pid, command, start, time
		cb(stdout.split("\n").reverse());

	});

}

var execFree = function(cb){

/*

	The memory meter in htop says a low number, such as 9%, when top shows something like 90%! 
	(Or: the MEM% number is low, but the bar looks almost full. What's going on?)
 
	The number showed by the memory meter is the total memory used by processes. 
	The additional available memory is used by the Linux kernel for buffering and disk cache, 
	so in total almost the entire memory is in use by the kernel. 
	I believe the number displayed by htop is a more meaningful metric of resources used: the number corresponds to the green bars; 
	the blue and brown bars correspond to buffers and cache, 
	respectively (as explained in the Help screen accessible through the F1 key). 
	Numeric data about these is also available when configuring the memory meter to display as text (in the Setup screen, F2).
	
	free -m

 */

	exec("free -m | tail -n 3", function(error, stdout, stderr) {

        var data = stdout.split("\n");

        // //structure: total, used, free
        var mem = data[0].match(/[0-9]{1,}/gi).slice(0,3);

        var cache_buff = data[1].match(/[0-9]{1,}/gi).slice(0,3);
        // //cache buff has no 'total' value
        cache_buff.unshift(0);

        var swap = data[2].match(/[0-9]{1,}/gi).slice(0,3);

        //all values in megabytes
        cb({
        	mem: mem,
        	cachebuff: cache_buff,
        	swap: swap
        });
    });
}

