var _ 			= require('underscore');
var usageBuffer = [];

var parseIfconfig = function(data){

	var data = data.split("\n");
	var interfaces = [];

	_(data.length/2).times(function(key){

		var traffic = data[key === 0 ? 1 : (key*2)+1].match(/\:(\d+)/g).map(function(o){
			return o.substr(1, o.length);
		});

		var name = data[key === 0 ? 0 : key*2];

		var i = name.indexOf('HWaddr');
		if(i >= 0){
			name = name.substr(0, i - 2);
		}

		name = name.replace('Link encap:', '');
		name = name.replace(/(  *)/g, ' ');

		interfaces.push({
			n: name,
			t: traffic
		});

	});

	usageBuffer.push(interfaces);
}

var processIfconfig = function(){

	if(usageBuffer.length > 2){
		usageBuffer.shift();

		var usage = [];

		_(_.keys(usageBuffer[0]).length).times(function(key){

			var ifaceIn = usageBuffer[1][key]['t'][0] - usageBuffer[0][key]['t'][0];
			var ifaceOut = usageBuffer[1][key]['t'][1] - usageBuffer[0][key]['t'][1];

			usage.push({
				//name
				n: usageBuffer[1][key]['n'],
				//out bandwith in kb
				o: (ifaceOut * 0.0009765625).toFixed(2),
				//in bandwith in kb
				i: (ifaceIn * 0.0009765625).toFixed(2)
			});
		})

		return usage;
	}

}

exports.parseIfconfig = function(data) {

    parseIfconfig(data);

    return processIfconfig();
}

exports.resetUsageData = function() {
    usageBuffer = [];
}