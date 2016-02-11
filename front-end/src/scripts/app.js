$(document).ready(function() {
	var tglPanel = document.getElementById('toggle-panel');
	var panel = document.getElementById('panel');

	// Toggle panel
	$(tglPanel).on('click', function(){
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).html('>');
		} else {
			$(this).html('<');
		}
		$(panel).toggleClass('hidden');
	});
});