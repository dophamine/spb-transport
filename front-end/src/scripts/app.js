$(document).ready(function() {
	var tglPanel = document.getElementById('toggle-panel');
	var panel = document.getElementById('panel');

	// Toggle panel
	$(tglPanel).on('click', function(){
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).removeClass("arrow-right").addClass("arrow-left");
		} else {
			$(this).removeClass("arrow-left").addClass("arrow-right");
		}
		$(panel).toggleClass('hidden');
	});
});