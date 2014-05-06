var os = require('os');

exports.index = function(req, res){

	res.render('default_index',{
		cpus: os.cpus().map(function(cpu, key){
			cpu.name = 'core_' + key;

			return cpu;
		})
	});
	
}
