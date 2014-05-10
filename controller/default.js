var io 			= require('socket.io').listen(4040);
var cpuLoad     = require('./../cpu-load.js');
var sysInfo     = require('./../sys-info.js');
var _ = require('underscore');

exports.index = function(req, res){

	res.render('default_index');
	
}


exports.endpoint = function(req, res){
	var params = req.body;

	console.log(_.keys(params));

	if(params.load){

		io.sockets.emit('cpu-load', cpuLoad.parseLoad(params.load));
		
	}

	if(params.mem){

            io.sockets.emit('overall-info', {
            	mem: sysInfo.parseMem(params.mem)
            });

	}

	res.send();
}