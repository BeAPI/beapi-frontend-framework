// Critical Var
var color = require('gulp-color'),
	penthouse = require('penthouse'),
    path = require('path'),
    fs = require('fs');

// Define your env.
var 	_configCritical = JSON.parse(fs.readFileSync('assets/css/critical/conf/bea-critical-conf.json', 'utf8')),
		_envUrl = _configCritical.envUrl;

function funcPenthouse(_width, _height, _viewport, _url, _page) {
	penthouse({
		url : _url,
		css : path.join('assets/css/style.min.css'),
		// OPTIONAL params
		width : _width,   // viewport width
		height : _height,   // viewport height
		forceInclude : [
			// '.keepMeEvenIfNotSeenInDom',
			// /^\.regexWorksToo/
		],
		timeout: 30000, // ms; abort critical css generation after this timeout
		strict: false, // set to true to throw on css errors (will run faster if no errors)
		maxEmbeddedBase64Length: 1000, // charaters; strip out inline base64 encoded resources larger than this
		userAgent: 'Penthouse Critical Path CSS Generator' // specify which user agent string when loading the page
		/* phantomJsOptions: { // see `phantomjs --help` for the list of all available options
			'proxy': 'http://proxy.company.com:8080',
			'ssl-protocol': 'SSLv3'
		} */
	},
	function(err, criticalCss) {
		fs.writeFileSync('assets/css/critical/'+ _page + '-' + _viewport +'.css', criticalCss);
		console.log(color('Critical CSS successfully generated for [[ page ' + _page + ' ]]   [[ '+ _viewport + ' viewport ]]   [[ ' + _url + ' ]]', 'GREEN'));
	});
}

// Test generate critical css
module.exports = function(gulp, plugins) {
	return function() {
		_configCritical.pages.forEach( function(page) {
			page.url = _envUrl + page.url;
			_configCritical.viewports.forEach( function(viewport) {
				funcPenthouse(viewport.width, viewport.height, viewport.name, page.url, page.name);
			});
		});
	};
};