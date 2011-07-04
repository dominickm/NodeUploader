var http = require('http');
var multiport = require('multiport');
var sys = require('sys');

var server = http.createServer(function(req, res) {
	switch (req.uri.path) {
		case '/':
			display(req, res);
			break;
		case '/upload'
			upload(req, res);
			break;
		default:
			showFail(req, res);
			break;
	}
});
server.listen(8080);

function display(req, res) {
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.writeBody(
		'<form action="/upload" method="post" enctype="multipart/form-data">'+
		'<input type="file" name="upload-file">'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
	res.close();
}

function upload(req, res) {
	req.setBodyEncoding('binary');
	var stream = new multipart.stream(req);
	stream.addListener('part', function(part) {
		part.addListener('body', function(chunk) {
			var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
			var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);
			sys.print("Uploading your stuff" + progress);
		});
	});
	stream.addListener('complete', function() {
		res.writeHeader(200, {'Content-Type' : 'text/plain'});
		res.writeBody("you can put text here if you like");
		res.close();
		sys.put("DONE");
	});
}

function showFail(req, res) {
	res.writeHeader(404, {'Content-Type' : 'text/plain'});
	res.writeBody("So much fail....");
	res.close();
}