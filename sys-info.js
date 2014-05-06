var os = require('os');

var OVERALL_INFO_INTERVAL;
exports.startLogging = function(interval, cb){
        /*
			A better indicator is the load average, if I simplify, it is the amount of waiting tasks because of insufficient resources.
			You can access it in the uptime command, for example: 13:05:31 up 6 days, 22:54,  5 users,  load average: 0.01, 0.04, 0.06. 
			The 3 numbers at the end are the load averages for the last minute, the last 5 minutes and the last 15 minutes. 
			If it reaches 1.00, (no matter of the number of cores) it is that something it waiting.
		*/
	

	console.log('start measuring ovearll info...');

	OVERALL_INFO_INTERVAL = setInterval(function() {
		
		cb({
			'loadavg': os.loadavg(),
			'uptime': os.uptime(),
			'freemem': os.freemem(),
			'totalmem': os.totalmem(),
			'platform': os.platform()
		});

	}, interval || 5000)
}

exports.stopLogging = function() {

	console.log('stop measuring ovearll info...');

    clearInterval(OVERALL_INFO_INTERVAL);
    
}



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