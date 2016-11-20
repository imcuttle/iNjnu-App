var querystring = require('querystring');
var request = require('http').request;
var u = require('url');
var zlib = require("zlib");
var $ = require('cheerio');


module.exports = {
	getGzip(url, params, type) {
		return new Promise(resolve => {
			request(
				u.parse(url), 
				res => {
			        var gunzip = zlib.createGunzip();
	                res.pipe(gunzip);
	                var chunks = [];
	                gunzip.on('data', function(chunk) {
			            chunks.push(chunk);
			        });
			        gunzip.on('end', function() {
			        	var html = Buffer.concat(chunks).toString();
			        	if(type==='jq') {
			        		resolve($.load(html))
			        	} else {
			        		resolve(html);
			        	}
			        })

				}
			).end();
		})
	},

	get(url, params, type) {
		return new Promise(resolve => {
			request(
				u.parse(url), 
				res => {
					if(res.statusCode!==200) {
						console.error('POST', res.statusCode, url, JSON.stringify(params))
					}
	                var chunks = [];
	                res.on('data', function(chunk) {
			            chunks.push(chunk);
			        });
			        res.on('end', function() {
			        	var html = Buffer.concat(chunks).toString();
			        	if(type==='jq') {
			        		resolve($.load(html))
			        	} else {
			        		resolve(html);
			        	}
			        })

				}
			).end();
		})
	},

	post(url, params, type, headers) {
		return new Promise(resolve => {
			request(
				Object.assign(u.parse(url), {
					method: 'POST',
					headers: headers || {}
				}),
				res => {
					if(res.statusCode!==200) {
						console.error('POST', res.statusCode, url, JSON.stringify(params))
					}
					var chunks = [];
					res.on('data', function(chunk) {
						chunks.push(chunk);
					});
					res.on('end', function() {
						var html = Buffer.concat(chunks).toString();
						if(type==='jq') {
							resolve($.load(html))
						} else {
							resolve(html);
						}
					})

				}
			).end(querystring.stringify(params));
		})
	}
}