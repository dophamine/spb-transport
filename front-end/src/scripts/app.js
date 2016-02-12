$(document).ready(function() {

	function inArr (arr, value) {
		if (arr.length === 0) return -1;
		for (var i=0; i < arr.length; i++) {
			if (arr[i] === value) return i;
		}
		return -1;
	}

	function spanClean () {
		spans = [];
		$('.rc').each(function(index, el) {
			spans.push($(el).text());
		});
	}

	var tglPanel = document.getElementById('toggle-panel');
	var panel = document.getElementById('panel');
	var mainInput = document.getElementById('main-input');
	var List = document.getElementById('list');
	var txt = document.getElementById('txt');
	var listArrow = $('.input-menu .arrow');

	//spans in input
	var spans = [];

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
	$(listArrow).on('click', function() {
		$('#list').toggleClass('show');
		
		if ($(this).hasClass('active')) {
			$(this).removeClass("arrow-top").addClass("arrow-bottom");
		} else {
			$(this).removeClass("arrow-bottom").addClass("arrow-top");
		}
		$(this).toggleClass('active');
	});

	//hide list on blur
	$(panel).on('click', function(e) {
		if (!$(e.target).is('.input-menu *') && $(listArrow).hasClass('active') ) {
			$(listArrow).click();
		}
		console.log("ok, you clicked on " + $(e.target));
	});

	//input-menu. add items to input
	$('#list .item').click(function() {
		var value = $(this).text();

		//add spans
		if (inArr(spans, value) === -1) {
			spans.push(value);
			$(txt).before("<span class='rc'>" + value + "<i class='cross'></i></span>");
		}

		// remove items
		$('#main-input span:nth-last-child(2) > .cross').on('click', function() {
			var value = $(this).parent('span').text();
			$(this).parent('span').remove();
			spanClean();
		});
	});

	//Toggle placeholder
	$('.input-menu').on('click', function() {
		if (spans.length > 0) {
			if (!$(txt).hasClass('ph-hidden')) {
				$(txt).addClass('ph-hidden');
			}
		} else if ($(txt).hasClass('ph-hidden')) {
			$(txt).removeClass('ph-hidden');
		}
	});

	$(mainInput).click(function() {
		$(txt).focus();
	});

});