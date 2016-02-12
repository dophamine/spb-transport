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
	var noMatches = false;

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
	});

	//input-menu. add items to input
	function listBindEvt () {
		$('#list .item').on('click', function() {
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
	}

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


	//auto complete 
	
	function suggest (str) {
		return function (matches) {
			for (var i = 0; i < matches.length; i++) {
				$(list).append(renderItem(matches[i], str));
			}
			listBindEvt();
		};
	}

	function search(term, suggest){
		term = term.toLowerCase();
		var choices = [
			'Автово', 
			'Адмиралтейская', 
			'Академическая',
			'Балтийская',
			'Бухарестская',
			'Василеостровская',
			'Владимирская',
			'Старая деревня'
		];
		var matches = [];
		for (var i=0; i<choices.length; i++)
			if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
		suggest(matches);

		//toggle list if matches not found
		noMatches = matches.length > 0 ? false : true;
		
	}

	$('#txt').on('input propertychange', function() {
		var str = $(this).val();
		$(list).children().remove();
		if (str.length >= 1) {
			search(str, suggest(str));
			if (!$(listArrow).hasClass('active')) {
				$(listArrow).click();
			}
		} else {
			if ($(listArrow).hasClass('active')) {
				$(listArrow).click();
			}
		}
	});

	function renderItem (item, search){
		search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
		return '<li class="item" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</li>';
	}
});