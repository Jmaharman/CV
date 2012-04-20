// First attempt of any sort at creating a Node.js script.
// Would ideally like to come back and make the functions more re-usable possible for another project.

var fs = require('fs'),
	mustache = require('mustache'),
    xml2js = require('xml2js'),
    less = require('less'),
    _ = require("underscore"),
    johnharman = {};

johnharman.engine = function () {
	this.initialize(arguments);
};

// Extend the prototype of engine using what I believe is a more readable format.
_.extend(johnharman.engine.prototype, {
	initialize: function() {
		// Found these functions were called more than once from the watch, so throttling them slightly.
		this.generateLessCss = _.throttle(this.generateLessCss, 5000);
		this.createCV = _.throttle(this.createCV, 5000);
		// Ensure all functions have the context of "this" assigned to an instance of my engine class.
		_.bindAll(this, 'generateLessCss', 'createCV', 'loadData', 'parseXml', 'loadTemplate', 'generateTemplate', 'parseLessCss', 'saveLessCss');
	},

	createCV: function() {
		this.loadData();
	},

	loadData: function() {
		fs.readFile( 'data/cv.xml', 'ascii', this.parseXml);
	},

	parseXml: function( err, data ) {
		var jsonData;

		if ( err ) {
			console.error("Could not open the CV file: %s", err);
			process.exit(1);
		}

		var parser = new xml2js.Parser();

		parser.parseString(data, this.loadTemplate);
	},

	loadTemplate: function( err, data ) {
		if ( err ) {
			console.error(err);
			process.exit(1);
		}

		this.parsedXml = data;

		fs.readFile( 'templates/index.html', 'ascii', this.generateTemplate);
	},

	generateTemplate: function( err, data ) {
		var html;
		if ( err ) {
			console.error("Could not open file: %s", err);
			process.exit(1);
		}
		// Use toString on the buffer

		html = mustache.to_html(data.toString('ascii'), this.parsedXml);

		this.saveFile('published/index.html', html, "Template saved in published/index.html");
	},

	saveFile: function( file, contents, message ) {
		fs.writeFile(file, contents, function (err) {
			if ( err ) {
				console.error("Could not save file: %s", err);
				process.exit(1);
			}
			console.log(message, 'at ' + new Date());
		});
	},

	generateLessCss: function() {
		var gen = this;
		fs.readFile( 'lesscss/styles.less', 'ascii', function(err, data) { gen.parseLessCss(err, data, 'styles'); });
		fs.readFile( 'lesscss/linear.less', 'ascii', function(err, data) { gen.parseLessCss(err, data, 'linear'); });
	},

	parseLessCss: function( err, dataBuffer, file ) {
		var gen = this;

		if ( err ) {
			console.error("Error reading file: %s", err);
			process.exit(1);
		}

		less.render(dataBuffer.toString('ascii'), function( err, data) { gen.saveLessCss( err, data, file );});
	},

	saveLessCss: function( err, css, file ) {
		if ( err ) {
				console.error("Parser error: %s", err);
				process.exit(1);
		}
		this.saveFile('published/content/css/' + file + '.css', css, 'Less CSS Generated for ' + file);
	}
});

// Instantiate a new engine and run the generation methods.
var engine = new johnharman.engine();
engine.generateLessCss();
engine.createCV();

// Keep an eye on any changing files and re-run the generators.
fs.watch(__dirname + '/templates/index.html', engine.createCV);
fs.watch(__dirname + '/data/cv.xml', engine.createCV);
fs.watch(__dirname + '/lesscss/styles.less', engine.generateLessCss);
fs.watch(__dirname + '/lesscss/shared.less', engine.generateLessCss);
fs.watch(__dirname + '/lesscss/linear.less', engine.generateLessCss);