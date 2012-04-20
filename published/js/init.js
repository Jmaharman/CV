$(document).ready(function() {
	if (window.location.search === '?generator') {
		$('body').addClass('generator');
		return;
	}

	var mainView = new johnharman.views.cvOverview();
});