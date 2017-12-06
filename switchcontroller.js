var fs = require('fs');
var exec = require('child_process').exec;
const thingShadow = require('../thing/');

var thingShadows = thingShadow({
	keyPath: '/home/pi/Desktop/Certificates/af40262ef6-private.pem.key',
	certPath: '/home/pi/Desktop/Certificates/af40262ef6-certificate.pem.crt',
	caPath:'/home/pi/Desktop/Certificates/VeriSign.pem',
	clientId: 'Switch1',
	region: 'us-east-1',
	host: 'a2gvnier88ja3l.iot.us-east-1.amazonaws.com'
});

function setGpio(value) {
 //fs.chmod("/sys/class/gpio/gpio12",'777');
 //fs.writeFile("/sys/class/gpio/gpio12/value",value,function(err){
//	if(err) {
//	return console.log(err);
//	}
if (value==1){
var cmd = 'gpio write 1 1';}
else{
var cmd = 'gpio write 1 0';}


exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
})

// console.log("Set GPIO="+value);
//});
// console.log("Set GPIO="+value);

}


function getGpio(){
 value = fs.readFileSync("/sys/class/gpio/gpio12/value",'utf8');
 console.log("Read GPIO="+value);
 if(value == 1){
	return "ON";
 } else {
	return "OFF";
}
//	return process.argv[2];
}

var clientTokenUpdate;
var myCallbacks = { };

var initialPumpState = getGpio();

console.log("Pump is " + initialPumpState);

var pumpState = {"state":{"reported":{"pump_mode":initialPumpState}}};
console.log(JSON.stringify(pumpState));

thingShadows.on('connect',function(){
	var clientToken;


thingShadows.register('Switch1');

setTimeout(function(){
	clientToken = thingShadows.update('Switch1',pumpState);
},2000);
});

thingShadows.on('status',
	function(thingName, state, clientToken, stateObject) {
		console.log('received '+state+' on '+thingName+': '+
					JSON.stringify(stateObject));
});

thingShadows.on('delta',
	function(thingName, stateObject) {
		console.log('received delta '+' on '+thingName+': '+
					JSON.stringify(stateObject));
		if(stateObject.state.pump_mode === "ON") {
			console.log("~~~~~~~~changing Mode ----> ON~~~~~");
			setGpio(1);
		setTimeout(function(){
			clientToken = thingShadows.update('Switch1',{"state":{"reported":{"pump_mode":"ON"}}});
		}, 1000);
		} else if(stateObject.state.pump_mode === "OFF") {
			console.log("~~~~~CHANGING MODE ----> OFF ~~~~~");
			setGpio(0);
			setTimeout(function() {
				clientToken = thingShadows.update('Switch1',{"state":{"reported":{"pump_mode":"OFF"}}});
			}, 1000);
		}
	});
thingShadows.on('timeout',
	function(thingName, clientToken) {
		console.log('received timeout'+' on '+thingName+': '+
					clientToken);
	});