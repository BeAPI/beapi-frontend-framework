"use strict";

let fs = require('fs');

let updateStyle = function (content, type) {
	let regex = /[V|v]ersion: ([\d(\.)?]{0,})/g;

	let nextVersion = content.replace(regex, function(match, gr1){
		let typeArr = gr1.split('.');
		typeArr = parseIntArr(typeArr);
		if (typeArr.length === 2) {
			typeArr.push(0);
		}

		if (type === 'patch') {
			typeArr = patchUpdate(typeArr);
		} else if (type === 'minor') {
			typeArr = minorUpdate(typeArr);
		} else if (type === 'major') {
			typeArr = majorUpdate(typeArr);
		}


		console.log('\x1b[33m%s\x1b[0m\x1b[40m', 'style.css version updated to : ' + typeArr.join('.'));

		return match.replace(gr1, typeArr.join('.'));
	});

	fs.writeFileSync('style.css', nextVersion);
}

let majorUpdate = function (types) {
	types[0] += 1;
	types[1] = 0;
	types[2] = 0;

	return types;
}

let minorUpdate = function (types) {
	types[1] += 1;
	types[2] = 0;

	return types;
}

let patchUpdate = function (types) {
	types[2] += 1;

	return types;
}

let parseIntArr = function (arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = parseInt(arr[i]);
	}
	return arr;
}

module.exports = function(gulp, plugins) {
	return function() {
		let content = fs.readFileSync('style.css', 'utf8');
		let type = 'patch';
		let typeAvailable = ['major', 'minor', 'patch'];
		for (let i = 0; i < process.argv.length; i++) {
			if (process.argv[i] === '-t' || process.argv[i] === '-type' ) {
				if (typeAvailable.indexOf(process.argv[i + 1]) > -1) {
					type = process.argv[i + 1];
				}
			}
		}
		updateStyle(content, type);
	};
};