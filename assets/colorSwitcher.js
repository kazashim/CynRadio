$(function(){
	var tmpStyleCont = $('#tmpStyleCont'),
		curTemplate = 'default',
		templates;

	// http://bgrins.github.io/spectrum/
	function colorPickerStart() {
		$("#changeTemplateColors .color[type!=hidden]").spectrum({
			showAlpha: true,
			showInput: true,
			clickoutFiresChange: true,
			showButtons: false,
			change: function(color) {
				setColor($(this), color.toString());
				reloadCSS();
			}
		});

		var tmp = {};
		templates = $('#templates > div');
		templates.each(function() {
			var colors = {};
			$('#changeTemplateColors .'+$(this).attr('id')+' .color').each(function() {
				colors[$(this).attr('data-def')] = $(this).val();
			});
			tmp[$(this).attr('id')] = {
				text: $(this).text(),
				colors: colors
			};
		});
		templates = tmp; tmp = '';

		reloadCSS();
	}

	function reloadCSS() {
		var tmpStyleCont = $('#tmpStyleCont');
		if(!tmpStyleCont[0])
			tmpStyleCont = $('<style type="text/css" id="tmpStyleCont">').appendTo('head');

		var styles = templates[curTemplate].text;

		// replace colors
		for(var k in templates[curTemplate].colors)
			styles = styles.split(k).join(templates[curTemplate].colors[k]);

		tmpStyleCont.html(styles);
		$('#getCss textarea').html(styles);
		return styles;
	}

	function setColor(obj, color) {
		obj.spectrum('set', color);
		$('#changeTemplateColors .'+curTemplate+' .color').each(function() {
			if($(this).attr('data-from') && $(this).attr('data-from') == obj.attr('data-def')) {
				var lessColor = $('#changeTemplateColors .'+curTemplate+' .color[data-def='+$(this).attr('data-from')+']').val();

				if($(this).attr('data-darken'))
					lessColor = lessDarken(lessColor, $(this).attr('data-darken'));

				if($(this).attr('data-lighten'))
					lessColor = lessLighten(lessColor, $(this).attr('data-lighten'));

				if($(this).attr('data-fade'))
					lessColor = lessFade(lessColor, $(this).attr('data-fade'));

				$(this).spectrum('set', lessColor);
				templates[curTemplate]['colors'][$(this).attr('data-def')] = lessColor;
			}
		});
		templates[curTemplate]['colors'][obj.attr('data-def')] = color;
	}

	// less color functions
	function hexToRGB(hex){
		hex = parseInt(hex.replace('#',''),16);
		return [hex >> 16, hex >> 8 & 0xFF, hex & 0xFF];
	}
	function lessColor(color) {
		return new less.tree.Color(hexToRGB(color), 1);
	}
	function lessAmount(val) {
		return new less.tree.Value(val);
	}
	function lessDarken(color, amount) {
		return less.tree.functions.darken(lessColor(color), lessAmount(amount)).toCSS();
	}
	function lessLighten(color, amount) {
		return less.tree.functions.lighten(lessColor(color), lessAmount(amount)).toCSS();
	}
	function lessFade(color, amount) {
		return less.tree.functions.fade(lessColor(color), lessAmount(amount)).toCSS();
	}


	// template change
	$(document).on('change', '#chooseTemplate', function() {
		curTemplate = $(this).val();
		$('#changeTemplateColors > div').each(function() {
			$(this).css('display', ($(this).hasClass(curTemplate)?'block':'none'));
		});
		reloadCSS();
	});

	// color schemes change
	$(document).on('change', '#predefined input[name=predefinedColor]', function() {
		var mainColor = $(this).attr('data-color');

		$('#changeTemplateColors .'+curTemplate+' .color').each(function() {
			if(!$(this).attr('data-from'))
				setColor($(this), $(this).hasClass('main')?mainColor:$(this).attr('data-def'));
		});
		reloadCSS();
	});

	// lighter
	$(document).on('click', '#light > span', function() {
		$('body').removeClass().addClass($(this).attr('class'));
	});

	// css download
	$(document).on('click', '#getCss a.download', function() {
		var zip = new JSZip();
		zip.file("zetta-menu.css", reloadCSS());
		$(this).attr("href", "data:application/zip;base64," + zip.generate());
	});
	$(document).on('click', '#getCss textarea', function() {
		$(this).select();
	});

	// init
	colorPickerStart();
});