define(['backbone'],
	function(Backbone){

	var cvOverview = Backbone.View.extend({
		el: 'body', // Not normal practice but is valid enough in this case of only having one page.

		events: {
			'click .project h5,.position h3,.bio h3': 'toggleViewableContent'
		},

		initialize: function() {
			// Once the view has been initialized set all of the expandable areas to be minified so the page seems less daunting and easier to scan.
			this.$('.project,.position,.bio').addClass('minified');
		},

		toggleViewableContent: function(event) {
			// Find the closest parent div and toggle the minified and maximized classes.
			// The reason why the div always has one of the two classes is because we don't show minimize or maximise icons unless javascript is enabled and the classes are added.
			$(event.currentTarget).closest('article').toggleClass('minified').toggleClass('maximized');
		}
	});

	return cvOverview;
});