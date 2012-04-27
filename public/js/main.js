// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    modernizr: 'libs/modernizr/modernizr-min',

    // Require.js plugins
    text: 'libs/require/text',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates'
  },
	urlArgs: "bust=" +  (new Date()).getTime()
});

// Let's kick off the application
require( ['jquery', 'views/cv-overview', 'modernizr'], function($, vwCVOverview, Modernizr){

  // When generating a new PDF from the HTML we hide a few things and there is no need for the javascript functionality below.
  if (window.location.search === '?generator') {
    $('body').addClass('generator');
    return;
  }

  new vwCVOverview();

  if (Modernizr.canvas){
    require(['views/skill-graph'], function(vwSkillGraph) {
      new vwSkillGraph();
    });
  }
});