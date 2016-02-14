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

	// Toggle panel
	function togglePanel () { 
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).removeClass("arrow-right").addClass("arrow-left");
		} else {
			$(this).removeClass("arrow-left").addClass("arrow-right");
		}
		$(panel).toggleClass('hidden');
	}

	function clean () {
		$(txt).val('');
		$('.rc').remove();
		spanClean();
		$('.route-section').remove();
	}

	// 
	function generateRouteSection (key) {
		var body, list ='';
		for (var i in newjson[key].routes) {
			list += '<li class="route">\n\t<span class="route-title">' + i + '</span>\n<div class="detail"><a href="#" class="detail-txt">Подробнее</a></div>\n</li>';
		}
		body = '<div class="route-section">
					<h2 class="district-title">' + key + ':</h2>
						<ul class="route-list">\n' + list + '</ul></div>';
		$(routes).append(body);
		$('.route-title').one('click', routehandler);
	}

	//input-menu. add items to input
	function listBindEvt () {
		$('#list .item').on('click', function() {
			var value = $(this).text();

			//add spans
			if (inArr(spans, value) === -1) {
				spans.push(value);
				$(txt).before("<span class='rc'>" + value + "<i class='cross'></i></span>");
				$(txt).val('');
				generateRouteSection(value);
			}

			// remove items
			$('#main-input span:nth-last-child(2) > .cross').on('click', function() {
				var value = $(this).parent('span').text();
				$(this).parent('span').remove();
				$('.district-title:contains('+ value +':)').closest('.route-section').remove();
				spanClean();
			});
		});
	}

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
		var choices = [];
		for (var i in newjson) {
			choices.push(i);
		}
		var matches = [];
		for (var k=0; k<choices.length; k++)
			if (~choices[k].toLowerCase().indexOf(term)) matches.push(choices[k]);
		suggest(matches);

		//toggle list if matches not found
		noMatches = matches.length > 0 ? false : true;
	}


	//formatting and returning vars
	function renderItem (item, search){
		search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
		return '<li class="item" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</li>';
	}

	//rendering Route context
	function renderContext (data, target) {
		if (!((typeof data == "object") && (data instanceof Array))) return '';
		var list = '';
		var body = '';
		for (var i = 0; i < data.length; i++) {
			list += '<li class="item">' + data[i]+ '</li> \n';
		}
		body = '<div class="context"><div class="context-head"><div class="end">' + data[0] + ' - ' + data[data.length -1] + '</div><div class="arrow arrow-bottom"></div></div><ul id="stop-list" class="vars">' + list + '</ul></div>';
		var parent = $(target).closest('.route-list');
		var numberOfChildren = $(parent).children('.route').length;
		var targetPos = $(target).closest('.route-list').children('.route').index($(target)) + 1;
		var pos = Math.ceil(targetPos / 4) * 4;
		if (pos === Math.ceil(numberOfChildren / 4) * 4) {
			$(parent).append(body);
		} else {
			$(parent).children('.route').eq(pos - 1).after(body);
		}

		$('.context .arrow').one('click', toggleContextMenu);
	}

	//toggle dropdown menu arrow in Route section
	function toggleContextMenu () {
		$('.context .vars').toggleClass('show');
		if ($(this).hasClass('active')) {
			$(this).removeClass("arrow-top").addClass("arrow-bottom");
		} else {
			$(this).removeClass("arrow-bottom").addClass("arrow-top");
		}
		$(this).toggleClass('active');

		$(this).one('click', toggleContextMenu);
	}

	//choose route types
	function generateByType(e) {
		e.preventDefault();
		$('.type').not($(this)).removeClass('active');
		$(this).toggleClass('active');
		$(inputMenu).removeClass('show');
		if ($(this).hasClass('active')) {
			$(inputMenu).addClass('show');
		}
		clean();
	}

	function routehandler () {
		var route = $(this).closest('.route');
		var a = $('.detail-txt', route);
		var title = route.closest('.route-section').children('.district-title').text();
		title = title.substring(0, title.length - 1);
		var data = newjson[title].routes[$(this).text()];
		console.log(data);
		
		//toggle route detail
		$(a).one('click', function(e) {
			e.preventDefault();

			$(route).toggleClass('detailed');

			if (!detailedRoute) {
				console.log('1');
				detailedRoute = route;
				renderContext(data, route);
			} else if (detailedRoute.get(0) === route.get(0)) {
				console.log('2');
				if (route.hasClass('detailed')) {
					detailedRoute = route;
					$('.context').remove();
					renderContext(data, route);
				} else {
					detailedRoute = null;
					$('.context').remove();
					console.log('bug');
				}
			} else {
				console.log('3');
				detailedRoute.removeClass('detailed');
				detailedRoute = route;
				$('.context').remove();
				renderContext(data, route);
			}


			$('#routes .vars').mCustomScrollbar({
				theme:"minimal-dark",
				autoHideScrollbar: true
			});
		});

		route.toggleClass('active');
		if (route.hasClass('detailed')) {
			route.toggleClass('detailed active');
			$('.context').remove();
		}
		$(this).one('click', routehandler);
	}

	var tglPanel = document.getElementById('toggle-panel');
	var panel = document.getElementById('panel');
	var inputMenu = $('.input-menu');
	var mainInput = document.getElementById('main-input');
	var List = document.getElementById('list');
	var txt = document.getElementById('txt');
	var types = $('.type');
	var routes = $('#routes');
	var listArrow = $('.input-menu .arrow');
	var noMatches = false;
	var detailedRoute;

	var json = {
	    "Автово" : {
	        "routes" : {
	            "К 145" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 146" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 14" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 148" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 135" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "145" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ]
	        }
	    },
	    "Адмиралтейская": {
	        "routes" : {
	            "К 65" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 46" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 4" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 48" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "К 35" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ],
	            "45" : [
	            	"Славы проспект (ул. Софийская)",
					"Софийская д.40",
					"Софийская д.43",
					"Белы Куна (ул. Софийская)",
					"Белы Куна (ул. Пражская)",
					"Метро Международная"
	            ]
	        }
	    }
	};

	var newjson = JSON.parse(JSON.stringify(json));

	// var data = [
	// 	"Славы проспект (ул. Софийская)",
	// 	"Софийская д.40",
	// 	"Софийская д.43",
	// 	"Белы Куна (ул. Софийская)",
	// 	"Белы Куна (ул. Пражская)",
	// 	"Метро Международная"
	// ];

	//spans in input
	var spans = [];

	// generateByType
	$(types).on('click', generateByType);

	//Toggle panel
	$(tglPanel).on('click', togglePanel);

	
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

	// scroll
	$('.panel-wrap').mCustomScrollbar({
		theme:"minimal-dark",
		autoHideScrollbar: true
	});
	
	//toggle route
	// $('.route-title').bind('click', routehandler(e));

});