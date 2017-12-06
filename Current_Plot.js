var fs = require('fs');
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  endpoint: "dynamodb.us-east-1.amazonaws.com",
  accessKeyId: "AKIAILBLVZUSZDU3GWHQ",
  secretAccessKey: "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"
});
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Temperature_145";
setInterval(function() {
	var d = new Date();
	d = d.toString();
	var tmp = d.split(' ');
	var time = tmp[4];
	var temp = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
	temp = temp/1000;
	var temperature = temp.toString();
	var params = {
	    TableName:table,
	    Item:{
	        "Time": time,
	        "Temperature": temperature,
	    }
	};
console.log("Adding a new item...");
	docClient.put(params, function(err, data) {
	    if (err) {
	        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	    } else {
	        console.log("Added item:", JSON.stringify(data, null, 2));
	    }
	});
}, 60000);
