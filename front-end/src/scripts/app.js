$(document).ready(function() {
	var tglPanel = document.getElementById('toggle-panel');
	var panel = document.getElementById('panel');
	var metroInput = document.getElementById('metro-input');
	var metroList = document.getElementById('metro-list');


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

	// Toggle list
	$('.input-menu .arrow').on('click', function() {
		$('#metro-list').toggleClass('show');
		
		if ($(this).hasClass('active')) {
			$(this).removeClass("arrow-top").addClass("arrow-bottom");
		} else {
			$(this).removeClass("arrow-bottom").addClass("arrow-top");
		}
		$(this).toggleClass('active');
	});

	//input-menu. add items
	$('#metro-list .item').click(function() {
		var value = $(this).text();
		var temp = $(metroInput).html();
		$(metroInput).html(temp + "<span class='cross' contenteditable='false'>" + value+ "</span>");
		$('#metro-input span').click(function(){
			$(this).remove();
		});
	});

	$('#metro-input span').click(function(){
		$(this).remove();
	});

});