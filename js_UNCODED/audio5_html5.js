/*
 * Sticky Radio Player - Full Width Shoutcast and Icecast HTML5 Player - v1.4.1
 *
 * Copyright 2016-2018, LambertGroup
 *
 */

(function($) {

	//vars
	var val = navigator.userAgent.toLowerCase();

	//functions
	function supports_mp3_audio(current_obj) {
			  var a = document.getElementById(current_obj.audioID);
			  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	}

	function detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container) {
				//activate current
				$(current_obj.thumbsHolder_Thumbs[current_obj.current_img_no]).css({
					"background":options.playlistRecordBgOnColor,
					"border-bottom-color":options.playlistRecordBottomBorderOnColor,
					"color":options.playlistRecordTextOnColor
				});
				//auto scroll carousel if needed
				if (!current_obj.is_very_first) {
					carouselScroll(-1,current_obj,options,audio5_html5_thumbsHolder);
				}

				var currentAudio;
				//alert (current_obj.playlist_arr[current_obj.origID]['radiostream']);
				if (current_obj.playlist_arr[current_obj.origID]['radiostream']!='') {
						currentAudio=current_obj.playlist_arr[current_obj.origID]['radiostream'];
				} else {
					//nothing
				}

				//alert (currentAudio);
				return currentAudio;
			};



	function changeSrc(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage) {
			    clearInterval(current_obj.radioReaderAjaxInterval);
				//now_playing first call start
				$.get( options.pathToAjaxFiles+"now_playing.php", {the_stream:current_obj.playlist_arr[current_obj.origID]['radiostream'],'_': $.now()}, function( data ) {
					current_obj.playlist_arr[current_obj.origID]['title']=data;
					changeCurrentSongTitle(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
				});
				//now_playing first call end
				changeCurrentSongTitle(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);

				//audio5_html5_Audio.type='audio/ogg; codecs="vorbis"';
				//document.getElementById(current_obj.audioID).type='audio/ogg; codecs="vorbis"';
				if (!current_obj.isFlashNeeded) {
					document.getElementById(current_obj.audioID).src=detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container);
					document.getElementById(current_obj.audioID).load();
					if (options.autoPlay) {
						audio5_html5_play_btn.click();
					}
				} else {
					if (current_obj.myFlashObject!='') {
						current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container),options.initialVolume);
					}
				}


				//alert (audio5_html5_Audio.type );


				/*if (val.indexOf("android") != -1) {
					//nothing
				} else if ((val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) && current_obj.is_very_first) {
					//nothing
					audio5_html5_play_btn.click();
				} else {
					if (options.autoPlay) {
						cancelAll();
						document.getElementById(current_obj.audioID).play();
						//audio5_html5_play_btn.click();
						audio5_html5_play_btn.addClass('AudioPause');
					} else {
						audio5_html5_play_btn.removeClass('AudioPause');
					}
					audio5_html5_play_btn.click();
				}*/

				//now_playing interval call
				setTimeout(function(){
							current_obj.radioReaderAjaxInterval=setInterval(function(){
									$.get( options.pathToAjaxFiles+"now_playing.php", {the_stream:current_obj.playlist_arr[current_obj.origID]['radiostream'],'_': $.now()}, function( data ) {
										current_obj.playlist_arr[current_obj.origID]['title']=data;
										changeCurrentSongTitle(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
									});
							},options.nowPlayingInterval*1000);
				},options.nowPlayingInterval*1000);
			};


	function goToRadioByUrl(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage) {
				//alert (current_obj.playlist_arr.length);
				var is_found=false;
				var j=0;
				while (j<current_obj.playlist_arr.length && !is_found && current_obj.playlist_arr.length>0) {
				//for (var j=0;j<current_obj.playlist_arr.length;j++) {
					  //alert (j+'    ---   '+current_obj.playlist_arr.length);
					  //urlLowerCases=current_obj.playlist_arr[j]['associatedpageurl'].toLowerCase();
					  //alert (current_obj.playlist_arr[j]['associatedpageurl']+ '  ==     '+current_obj.cur_loc);
					  if (current_obj.playlist_arr[j]['associatedpageurl']==current_obj.cur_loc) {
						 	is_found=true;

					   		current_obj.current_img_no=j;
							current_obj.origID=$("div[rel=\'"+current_obj.current_img_no+"\']").attr('data-origID');
							//alert (current_obj.current_img_no+' --  '+current_obj.origID);

							changeSrc(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
							carouselScroll(-1,current_obj,options,audio5_html5_thumbsHolder);
					  }
					  j++;
				}
				//alert (is_found+'  ---  '+j);

	}



	function changeCurrentSongTitle(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage) {
				audio5_html5_Title.width(current_obj.titleWidth);
				audio5_html5_radioStation.width(current_obj.titleWidth);



				current_obj.curSongText='';
				if (options.showTitle && current_obj.playlist_arr[current_obj.origID]['title']!=null && current_obj.playlist_arr[current_obj.origID]['title']!='') {
	            	current_obj.curSongText+="<b>"+options.translateSongTitle+"</b>"+current_obj.playlist_arr[current_obj.origID]['title'];
	            }


				if (options.showRadioStation && current_obj.playlist_arr[current_obj.origID]['station']!=null && current_obj.playlist_arr[current_obj.origID]['station']!='') {
					audio5_html5_radioStation.html("<b>"+options.translateRadioStation+"</b>"+current_obj.playlist_arr[current_obj.origID]['station']);
				}

				var author_arr=current_obj.playlist_arr[current_obj.origID]['title'].split('-');
				var photo_path=options.noImageAvailable;
				// load details of the artist
				//MARIA MULDAUR
				author_arr[0]=author_arr[0].trim();

				if (options.grabLastFmPhoto) {
						current_obj.lastfm.artist.getInfo({artist: author_arr[0]}, {success: function(data){
							/*alert (data.artist.image.toSource());
							[
								{'#text':"http://userserve-ak.last.fm/serve/34/98245565.png", size:"small"},
								{'#text':"http://userserve-ak.last.fm/serve/64/98245565.png", size:"medium"},
								{'#text':"http://userserve-ak.last.fm/serve/126/98245565.png", size:"large"},
								{'#text':"http://userserve-ak.last.fm/serve/252/98245565.png", size:"extralarge"},
								{'#text':"http://userserve-ak.last.fm/serve/500/98245565/Cher+PNG.png", size:"mega"}
							]*/
							//alert(data.artist.image[2]['#text']);

							if (data.artist.image[3]['#text'].trim()!='') {
								photo_path=data.artist.image[3]['#text'];
							}
							audio5_html5_ximage.css({
								"background":"url("+photo_path+") #000000",
								"background-repeat":"no-repeat",
								"background-position":"center center",
								"background-size":"cover",
								"border-width":options.imageBorderWidth+"px",
								"border-color":options.imageBorderColor

							});

						}, error: function(code, message){
							//alert('Error #'+code+': '+message);
							audio5_html5_ximage.css({
								"background":"url("+photo_path+") #000000",
								"background-repeat":"no-repeat",
								"background-position":"center center",
								"background-size":"cover",
								"border-width":options.imageBorderWidth+"px",
								"border-color":options.imageBorderColor

							});
						}});
				} else {
							audio5_html5_ximage.css({
								"background":"url("+photo_path+") #000000",
								"background-repeat":"no-repeat",
								"background-position":"center center",
								"background-size":"cover",
								"border-width":options.imageBorderWidth+"px",
								"border-color":options.imageBorderColor

							});
				}

				/*//audio5_html5_ximage.html('<img src="'+current_obj.playlist_arr[current_obj.origID]['image']+'" width="80">');
				audio5_html5_ximage.css({
					"background":"url("+current_obj.playlist_arr[current_obj.origID]['image']+")",
					"border-width":options.imageBorderWidth+"px",
					"border-color":options.imageBorderColor
				});*/


				if (!current_obj.curSongText) {
					/*audio5_html5_Title.css({
						'display':'none',
						'width':0,
						'height':0,
						'padding':0,
						'margin':0
					});*/
				} else {
					if (current_obj.prevSongTitle!=current_obj.playlist_arr[current_obj.origID]['title']) {

								audio5_html5_TitleInside.css({
									"width":"auto"
								});

								current_obj.isStationTitleInsideScrolling=false;
								current_obj.stationTitleInsideWait=0;
								audio5_html5_TitleInside.stop();
								audio5_html5_TitleInside.css({'margin-left':0});
								audio5_html5_TitleInside.html(current_obj.curSongText);

								//alert (current_obj.prevSongTitle+'='+current_obj.playlist_arr[current_obj.origID]['title']);
								clearInterval(current_obj.timeupdateInterval);
								//alert (audio5_html5_Title.width()+'  ----  '+audio5_html5_TitleInside.width());
								if (audio5_html5_TitleInside.width()>current_obj.titleWidth) {
									current_obj.timeupdateInterval=setInterval(function(){
										//$( "#console" ).append( "<span>Test - </span>" );
										if (!current_obj.isStationTitleInsideScrolling && current_obj.stationTitleInsideWait>=5 && audio5_html5_TitleInside.width()>current_obj.titleWidth) {
											current_obj.isStationTitleInsideScrolling=true;
											current_obj.stationTitleInsideWait=0;
											audio5_html5_TitleInside.html(current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** ");
											audio5_html5_TitleInside.css({'margin-left':0});
											audio5_html5_TitleInside.stop().animate({
													'margin-left':(options.playerWidth-audio5_html5_TitleInside.width())+'px'
											 }, parseInt((audio5_html5_TitleInside.width()-options.playerWidth)*10000/150,10), 'linear', function() {
													// Animation complete.
													  current_obj.isStationTitleInsideScrolling=false;
											});
										} else if (!current_obj.isStationTitleInsideScrolling && audio5_html5_TitleInside.width()>current_obj.titleWidth) {
											current_obj.stationTitleInsideWait++;
										}
									},300);
								} else { //center title
									audio5_html5_TitleInside.css({
										"width":"100%"
									});
								}
								current_obj.prevSongTitle=current_obj.playlist_arr[current_obj.origID]['title'];
					}
				}
		}






		//playlist scroll
		function carouselScroll(direction,current_obj,options,audio5_html5_thumbsHolder) {
				if (current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen) {
						var MAX_TOP=(current_obj.thumbsHolder_ThumbHeight+1)*(current_obj.selectedCateg_total_images-options.numberOfThumbsPerScreen);
						var new_top=0;
						//alert (current_obj.audio5_html5_sliderVertical.slider( "option", "animate" ));
						audio5_html5_thumbsHolder.stop(true,true);
						//page scroll enabled
						$('html, body')
		            // Needed to remove previously bound handlers
		            .off('touchstart touchmove')
		            .on('touchstart touchmove', function (e) {
		                e.preventDefault();
		            });
						//page scroll enabled

						if (direction!=-1 && !current_obj.isCarouselScrolling) {
							current_obj.isCarouselScrolling=true;
							new_top=((direction<=2)?(-1)*MAX_TOP:parseInt(MAX_TOP*(direction-100)/100,10));
							if (new_top>0) {
								new_top=0;
							}
							audio5_html5_thumbsHolder.animate({
							    //opacity: 1,
							    //top:parseInt(MAX_TOP*(direction-100)/100,10)+'px'
								top:new_top+'px'
							}, 600, 'easeOutQuad', function() {
							    // Animation complete.
								  current_obj.isCarouselScrolling=false;
									//page scroll enabled
									$('html, body')
										.off('touchstart touchmove')
										.on('touchstart touchmove', function (e) {});
									//page scroll enabled
							});
						} else if (!current_obj.isCarouselScrolling && current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen) {
							current_obj.isCarouselScrolling=true;
							//audio5_html5_thumbsHolder.css('opacity','0.5');
							new_top=(-1)*parseInt((current_obj.thumbsHolder_ThumbHeight+1)*current_obj.current_img_no,10);
							if( Math.abs(new_top) > MAX_TOP ){ new_top = (-1)*MAX_TOP; }
							if (current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {
								current_obj.audio5_html5_sliderVertical.slider( "value" , 100 + parseInt( new_top * 100 / MAX_TOP ) );
							}
							audio5_html5_thumbsHolder.animate({
							    //opacity: 1,
							    top:new_top+'px'
							  }, 500, 'easeOutCubic', function() {
							    // Animation complete.
								  current_obj.isCarouselScrolling=false;
									//page scroll enabled
									$('html, body')
										.off('touchstart touchmove')
										.on('touchstart touchmove', function (e) {});
									//page scroll enabled
							});
						}
				}
		};



		function generateCategories(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_innerSelectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage) {
			  audio5_html5_thumbsHolder.stop(true,true);
			  current_obj.isCarouselScrolling=false;

			  audio5_html5_thumbsHolder.stop().animate({
				  'left': (-1)*audio5_html5_thumbsHolderVisibleWrapper.width()+'px'
			  }, 100, 'easeOutQuad', function() { //it was 600
				  // Animation complete.
					audio5_html5_thumbsHolder.html("");

//current_obj.numberOfCategories=current_obj.category_arr.length;
					for (var j=0;j<current_obj.category_arr.length;j++) {
							current_obj.thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ j +'"><div class="padding">'+current_obj.category_arr[j]+'</div></div>');
							audio5_html5_thumbsHolder.append(current_obj.thumbsHolder_Thumb);


							current_obj.thumbsHolder_Thumb.css({
								"top":(current_obj.thumbsHolder_Thumb.height()+1)*j+'px',
								"background":options.categoryRecordBgOffColor,
								"border-bottom-color":options.categoryRecordBottomBorderOffColor,
								"color":options.categoryRecordTextOffColor
							});

							//activate current
							if (current_obj.category_arr[j]==current_obj.selectedCateg) {
								current_obj.current_img_no=j;
								current_obj.thumbsHolder_Thumb.css({
									"background":options.categoryRecordBgOnColor,
									"border-bottom-color":options.categoryRecordBottomBorderOnColor,
									"color":options.categoryRecordTextOnColor
								});
							}
					}

					current_obj.selectedCateg_total_images=current_obj.numberOfCategories;
					current_obj.categsAreListed=true;

				  var new_selectedCategMarginBottom=0;
				  if (options.showCategories)
				  		new_selectedCategMarginBottom+=options.selectedCategMarginBottom;
				  if (options.showSearchArea)
				  		new_selectedCategMarginBottom+=options.selectedCategMarginBottom;

					audio5_html5_thumbsHolderWrapper.height(2*options.playlistPadding+(current_obj.thumbsHolder_Thumb.height()+1)*options.numberOfThumbsPerScreen+audio5_html5_selectedCategDiv.height()+audio5_html5_searchDiv.height()+new_selectedCategMarginBottom); //current_obj.thumbsHolder_Thumb.height()+1 - 1 is the border
					audio5_html5_thumbsHolderVisibleWrapper.height((current_obj.thumbsHolder_Thumb.height()+1)*options.numberOfThumbsPerScreen);
					audio5_html5_playlistPadding.css({'padding':options.playlistPadding+'px'});

					current_obj.thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', audio5_html5_container);

					//the playlist scroller
					if (current_obj.numberOfCategories>options.numberOfThumbsPerScreen && options.showPlaylist) {
						if (options.isPlaylistSliderInitialized) {
							current_obj.audio5_html5_sliderVertical.slider( "destroy" );
						}
						current_obj.audio5_html5_sliderVertical.slider({
							orientation: "vertical",
							range: "min",
							min: 1,
							max: 100,
							step:1,
							value: 100,
							slide: function( event, ui ) {
								//alert( ui.value );
								carouselScroll(ui.value,current_obj,options,audio5_html5_thumbsHolder);
							}
						});
						 options.isPlaylistSliderInitialized=true;
						//var audio5_html5_selectedCategDiv = $('.selectedCategDiv', audio5_html5_container);
					    //var audio5_html5_searchDiv = $('.searchDiv', audio5_html5_container);
						var sliderVerticalTop_selectedCategMarginBottom=0;
						if (options.showSearchArea)
							  sliderVerticalTop_selectedCategMarginBottom+=options.selectedCategMarginBottom;
						current_obj.audio5_html5_sliderVertical.css({
							'display':'inline',
							'position':'absolute',
							'height':audio5_html5_thumbsHolderWrapper.height()-16-audio5_html5_selectedCategDiv.height()-new_selectedCategMarginBottom-audio5_html5_searchDiv.height()-2*options.playlistPadding+'px', // 16 is the height of  .slider-vertical.ui-slider .ui-slider-handle
							'left':audio5_html5_container.width()+2*options.playerPadding-current_obj.audio5_html5_sliderVertical.width()-options.playlistPadding+'px',
							//'top':(-1)*(audio5_html5_thumbsHolderWrapper.height()-options.playlistPadding-audio5_html5_selectedCategDiv.height()-sliderVerticalTop_selectedCategMarginBottom-2)+'px'
							 'bottom':current_obj.audioPlayerHeight+options.playlistTopPos+options.playlistPadding+audio5_html5_searchDiv.height()+sliderVerticalTop_selectedCategMarginBottom+16+'px'  //16 = .ui-slider-handle
						});

						if (!options.showPlaylistOnInit) {
							current_obj.audio5_html5_sliderVertical.css({
								'opacity': 0,
								'display':'none'
							});
						}
						options.showPlaylistOnInit=true; // to prevent sliderVertical disappereance after yo show the playlist
						$('.thumbsHolder_ThumbOFF', audio5_html5_container).css({
							'width':audio5_html5_container.width()+2*options.playerPadding-current_obj.audio5_html5_sliderVertical.width()-2*options.playlistPadding-3+'px'
						});

					} else {
						if (options.isPlaylistSliderInitialized) {
							current_obj.audio5_html5_sliderVertical.slider( "destroy" );
							options.isPlaylistSliderInitialized=false;
						}
						$('.thumbsHolder_ThumbOFF', audio5_html5_container).css({
							'width':audio5_html5_container.width()+2*options.playerPadding-2*options.playlistPadding+'px'
						});
					}





					//tumbs nav

					current_obj.thumbsHolder_Thumbs.click(function() {
							var currentBut=$(this);
							var i=currentBut.attr('rel');
							current_obj.selectedCateg=current_obj.category_arr[i];
							audio5_html5_innerSelectedCategDiv.html(current_obj.selectedCateg);
							generatePlaylistByCateg(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);

					});


					current_obj.thumbsHolder_Thumbs.mouseover(function() {
						var currentBut=$(this);
						currentBut.css({
							"background":options.categoryRecordBgOnColor,
							"border-bottom-color":options.categoryRecordBottomBorderOnColor,
							"color":options.categoryRecordTextOnColor
						});
					});


					current_obj.thumbsHolder_Thumbs.mouseout(function() {
						var currentBut=$(this);
						var i=currentBut.attr('rel');
						if (current_obj.current_img_no!=i){
							currentBut.css({
								"background":options.categoryRecordBgOffColor,
								"border-bottom-color":options.categoryRecordBottomBorderOffColor,
								"color":options.categoryRecordTextOffColor
							});
						}
					});

				//carouselScroll(-1,current_obj,options,audio5_html5_thumbsHolder);
				// mouse wheel
				audio5_html5_thumbsHolderVisibleWrapper.mousewheel(function(event, delta, deltaX, deltaY) {
					event.preventDefault();
					var currentScrollVal=current_obj.audio5_html5_sliderVertical.slider( "value");
					//alert (currentScrollVal+' -- '+delta);
					if ( (parseInt(currentScrollVal)>1 && parseInt(delta)==-1) || (parseInt(currentScrollVal)<100 && parseInt(delta)==1) ) {
						currentScrollVal = currentScrollVal + delta;
						current_obj.audio5_html5_sliderVertical.slider( "value", currentScrollVal);
						carouselScroll(currentScrollVal,current_obj,options,audio5_html5_thumbsHolder)
						//alert (currentScrollVal);
					}

				});

					audio5_html5_thumbsHolder.css({
						'top':0+'px'
					});
					audio5_html5_thumbsHolder.stop().animate({
						'left': 0+'px'
					}, 400, 'easeOutQuad', function() {
						// Animation complete.
			  		});
			  });




		}

		function generatePlaylistByCateg(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage) {
			audio5_html5_thumbsHolder.stop(true,true);
			current_obj.isCarouselScrolling=false;

			var stationLowerCases='';
			var elementFound=false;
			var animateDur=500;
			if (current_obj.is_very_first)
				animateDur=1;
			if (current_obj.search_val!='')
				animateDur=1;

			audio5_html5_thumbsHolder.stop().animate({
				  'left': (-1)*audio5_html5_thumbsHolderVisibleWrapper.width()+'px'
			}, animateDur, 'easeOutQuad', function() {
				  // Animation complete.
				  audio5_html5_thumbsHolder.html("");

				  current_obj.selectedCateg_total_images=0;
				  for (var j=0;j<current_obj.playlist_arr.length;j++) {
					  elementFound=false;
					  //alert (current_obj.search_val);
					  if (current_obj.search_val!='') {
						  stationLowerCases=current_obj.playlist_arr[j]['station'].toLowerCase();
						  //alert (stationLowerCases.indexOf(current_obj.search_val));
						  if (stationLowerCases.indexOf(current_obj.search_val)!=-1) {
						  		elementFound=true;
						  }
					  } else {
						  if (current_obj.playlist_arr[j]['category'].indexOf(current_obj.selectedCateg+';')!=-1) {
							  elementFound=true;
						  }
					  }

					  if (elementFound) {
						  current_obj.selectedCateg_total_images++;
						  current_obj.thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ (current_obj.selectedCateg_total_images-1) +'" data-origID="'+ j +'"><div class="padding">'+((options.showPlaylistNumber)?(current_obj.selectedCateg_total_images)+'. ':'')+current_obj.playlist_arr[j]['station']+'</div></div>');
						  audio5_html5_thumbsHolder.append(current_obj.thumbsHolder_Thumb);
						  if (current_obj.thumbsHolder_ThumbHeight==0) {
						  		current_obj.thumbsHolder_ThumbHeight=current_obj.thumbsHolder_Thumb.height();
						  }


						  current_obj.thumbsHolder_Thumb.css({
							  "top":(current_obj.thumbsHolder_ThumbHeight+1)*current_obj.selectedCateg_total_images+'px',
							  "background":options.playlistRecordBgOffColor,
							  "border-bottom-color":options.playlistRecordBottomBorderOffColor,
							  "color":options.playlistRecordTextOffColor
						  });



						  current_obj.current_img_no=0;

						  //activate playing one
						  if (current_obj.origID==$("div[rel=\'"+(current_obj.selectedCateg_total_images-1)+"\']").attr('data-origID')){
							  current_obj.thumbsHolder_Thumb.css({
								  "background":options.playlistRecordBgOnColor,
								  "border-bottom-color":options.playlistRecordBottomBorderOnColor,
								  "color":options.playlistRecordTextOnColor
							  });
						  }
					  }
				  }


				  current_obj.categsAreListed=false;

				  var new_selectedCategMarginBottom=0;
				  if (options.showCategories)
				  		new_selectedCategMarginBottom+=options.selectedCategMarginBottom;
				  if (options.showSearchArea)
				  		new_selectedCategMarginBottom+=options.selectedCategMarginBottom;
				  audio5_html5_thumbsHolderWrapper.height(2*options.playlistPadding+(current_obj.thumbsHolder_ThumbHeight+1)*options.numberOfThumbsPerScreen+audio5_html5_selectedCategDiv.height()+audio5_html5_searchDiv.height()+new_selectedCategMarginBottom); //current_obj.thumbsHolder_ThumbHeight+1 - 1 is the border
				  audio5_html5_thumbsHolderVisibleWrapper.height((current_obj.thumbsHolder_ThumbHeight+1)*options.numberOfThumbsPerScreen);
				  audio5_html5_playlistPadding.css({'padding':options.playlistPadding+'px'});

				  current_obj.thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', audio5_html5_container);


				  //the playlist scroller
				  if (current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {

					  if (options.isPlaylistSliderInitialized) {
						  current_obj.audio5_html5_sliderVertical.slider( "destroy" );
					  }
					  current_obj.audio5_html5_sliderVertical.slider({
						  orientation: "vertical",
						  range: "min",
						  min: 1,
						  max: 100,
						  step:1,
						  value: 100,
						  slide: function( event, ui ) {
							  //alert( ui.value );
							  carouselScroll(ui.value,current_obj,options,audio5_html5_thumbsHolder);
						  }
					  });
					  options.isPlaylistSliderInitialized=true;
				  //var audio5_html5_selectedCategDiv = $('.selectedCategDiv', audio5_html5_container);
				  //var audio5_html5_searchDiv = $('.searchDiv', audio5_html5_container);


					  var sliderVerticalTop_selectedCategMarginBottom=0;
					  if (options.showSearchArea)
							sliderVerticalTop_selectedCategMarginBottom+=options.selectedCategMarginBottom;
					  current_obj.audio5_html5_sliderVertical.css({
						  'display':'inline',
						  'position':'absolute',
						  'height':audio5_html5_thumbsHolderWrapper.height()-16-audio5_html5_selectedCategDiv.height()-new_selectedCategMarginBottom-audio5_html5_searchDiv.height()-2*options.playlistPadding+'px', // 16 is the height of  .slider-vertical.ui-slider .ui-slider-handle
						  'left':audio5_html5_container.width()+2*options.playerPadding-current_obj.audio5_html5_sliderVertical.width()-options.playlistPadding+'px',
						  //'top':(-1)*(audio5_html5_thumbsHolderWrapper.height()-options.playlistPadding-audio5_html5_selectedCategDiv.height()-sliderVerticalTop_selectedCategMarginBottom-2)+'px'
						  'bottom':current_obj.audioPlayerHeight+options.playlistTopPos+options.playlistPadding+audio5_html5_searchDiv.height()+sliderVerticalTop_selectedCategMarginBottom+16+'px'  //16 = .ui-slider-handle
					  });
					  if (!options.showPlaylistOnInit) {
						  current_obj.audio5_html5_sliderVertical.css({
							  'opacity': 0,
							  'display':'none'
						  });
					  }


					  options.showPlaylistOnInit=true; // to prevent sliderVertical disappereance after yo show the playlist

					  $('.thumbsHolder_ThumbOFF', audio5_html5_container).css({
						  'width':audio5_html5_container.width()+2*options.playerPadding-current_obj.audio5_html5_sliderVertical.width()-2*options.playlistPadding-3+'px'
					  });

				  } else {
					  if (options.isPlaylistSliderInitialized) {
							current_obj.audio5_html5_sliderVertical.slider( "destroy" );
							options.isPlaylistSliderInitialized=false;
					  }
					  $('.thumbsHolder_ThumbOFF', audio5_html5_container).css({
						  'width':audio5_html5_container.width()+2*options.playerPadding-2*options.playlistPadding+'px'
					  });
				  }


				//tumbs nav
				current_obj.thumbsHolder_Thumbs.click(function() {
						options.autoPlay=true;
						var currentBut=$(this);
						var i=currentBut.attr('rel');

						current_obj.thumbsHolder_Thumbs.css({
							"background":options.playlistRecordBgOffColor,
							"border-bottom-color":options.playlistRecordBottomBorderOffColor,
							"color":options.playlistRecordTextOffColor
						});

						current_obj.current_img_no=i;
						current_obj.origID=$("div[rel=\'"+current_obj.current_img_no+"\']").attr('data-origID');
						audio5_html5_play_btn.addClass('AudioPause');
						changeSrc(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
						carouselScroll(-1,current_obj,options,audio5_html5_thumbsHolder);
				});


				current_obj.thumbsHolder_Thumbs.mouseover(function() {
					var currentBut=$(this);
					currentBut.css({
						"background":options.playlistRecordBgOnColor,
						"border-bottom-color":options.playlistRecordBottomBorderOnColor,
						"color":options.playlistRecordTextOnColor
					});
				});


				current_obj.thumbsHolder_Thumbs.mouseout(function() {
					var currentBut=$(this);
					var i=currentBut.attr('rel');
					if (current_obj.origID!=$("div[rel=\'"+i+"\']").attr('data-origID')){
						currentBut.css({
							"background":options.playlistRecordBgOffColor,
							"border-bottom-color":options.playlistRecordBottomBorderOffColor,
							"color":options.playlistRecordTextOffColor
						});
					}
				});

				// mouse wheel
				audio5_html5_thumbsHolderVisibleWrapper.mousewheel(function(event, delta, deltaX, deltaY) {
					event.preventDefault();
					var currentScrollVal=current_obj.audio5_html5_sliderVertical.slider( "value");
					//alert (currentScrollVal+' -- '+delta);
					if ( (parseInt(currentScrollVal)>1 && parseInt(delta)==-1) || (parseInt(currentScrollVal)<100 && parseInt(delta)==1) ) {
						currentScrollVal = currentScrollVal + delta;
						current_obj.audio5_html5_sliderVertical.slider( "value", currentScrollVal);
						carouselScroll(currentScrollVal,current_obj,options,audio5_html5_thumbsHolder)
						//alert (currentScrollVal);
					}

				});


				audio5_html5_thumbsHolder.css({
					'top':0+'px'
				});
				audio5_html5_thumbsHolder.stop().animate({
					'left': 0+'px'
				}, 400, 'easeOutQuad', function() {
					// Animation complete.
				});




				// check page change start
				current_obj.cur_loc=window.location.href;
				goToRadioByUrl(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
				//alert(current_obj.cur_loc);
				current_obj.cur_intv=setInterval(function(){
				if (current_obj.cur_loc!=window.location.href && current_obj.playlist_arr.length>0) {
					//alert(current_obj.cur_loc);
					current_obj.cur_loc=window.location.href;
					goToRadioByUrl(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
					//alert(current_obj.cur_loc);
				}
				}, 5000);
				// check page change end


			});



		}


		function findNextVideoNumbers(current_obj,options,navigationFlag) {
					if (navigationFlag=='next') {
						if (current_obj.current_img_no==current_obj.selectedCateg_total_images-1)
							current_obj.current_img_no=0;
						else
							current_obj.current_img_no++;
					} else {
						if (current_obj.current_img_no-1<0)
							current_obj.current_img_no=current_obj.selectedCateg_total_images-1;
						else
							current_obj.current_img_no--;
					}

				current_obj.origID=$("div[rel=\'"+current_obj.current_img_no+"\']").attr('data-origID');
		};


		function cancelAll() {
			//alert ($("audio").attr('id'));
			//$("audio")[0].pause();
			$("audio").each(function() {
				$('.AudioPlay').removeClass('AudioPause');
				$(this)[0].pause();
			});
		}

		function getFlashMovieObject(movieName) {
		  if (window.document[movieName])
		  {
			  return window.document[movieName];
		  }
		  if (navigator.appName.indexOf("Microsoft Internet")==-1)
		  {
			if (document.embeds && document.embeds[movieName])
			  return document.embeds[movieName];
		  }
		  else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
		  {
			return document.getElementById(movieName);
		  }
		}


		function getInternetExplorerVersion()
		// -1 - not IE
		// 7,8,9 etc
		{
		   var rv = -1; // Return value assumes failure.
		   if (navigator.appName == 'Microsoft Internet Explorer')
		   {
			  var ua = navigator.userAgent;
			  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			  if (re.exec(ua) != null)
				 rv = parseFloat( RegExp.$1 );
		   }
		   else if (navigator.appName == 'Netscape')
		   {
			 var ua = navigator.userAgent;
			 var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			 if (re.exec(ua) != null)
			   rv = parseFloat( RegExp.$1 );
		   }
		   return parseInt(rv,10);
		}


		function it_supports_mp3(current_obj) {
			  var to_retun=false;
			  if (!(!!(document.getElementById(current_obj.audioID).canPlayType) && ("no" != document.getElementById(current_obj.audioID).canPlayType("audio/mpeg")) && ("" != document.getElementById(current_obj.audioID).canPlayType("audio/mpeg")))) {
				  to_retun=true;
			  }
			  /*var v = document.getElementById(current_obj.audioID);
			  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');*/
			  return to_retun;
		}




	/*$.audio5_html5 = {version: '1.6'};*/
	//core
	$.fn.audio5_html5 = function(options) {

		var options = $.extend({},$.fn.audio5_html5.defaults, options);
		var ver_ie=getInternetExplorerVersion();
		//parse it
		return this.each(function() {
			var audio5_html5_Audio = $(this);


			//the controllers
			var audio5_html5_controlsDef = $('<div class="FrameBehindPlayerText"></div><div class="FrameBehindPlayer"></div> <div class="headphone"></div> <div class="ximage"></div> <div class="AudioControls"> <a class="AudioFacebook" title="Facebook"></a><a class="AudioTwitter" title="Twitter"></a><a class="AudioPlay" title="Play/Pause"></a><a class="AudioPrev" title="Previous"></a><a class="AudioNext" title="Next"></a><a class="AudioShowHidePlaylist" title="Show/Hide Playlist"></a><a class="VolumeButton" title="Mute/Unmute"></a><div class="VolumeSlider"></div>   </div>   <div class="songTitle"><div class="songTitleInside"></div></div>  <div class="radioStation"></div>     <div class="thumbsHolderWrapper"><div class="playlistPadding"><div class="selectedCategDiv"><div class="innerSelectedCategDiv">reading the categories...</div></div> <div class="thumbsHolderVisibleWrapper"><div class="thumbsHolder"></div></div><div class="searchDiv"><input class="search_term" type="text" value="search..." /></div></div></div>  <div class="slider-vertical"></div>');



			//the elements
			var audio5_html5_container = audio5_html5_Audio.parent('.audio5_html5');
			//var audio5_html5_border = $(this).parent();
			//alert (audio5_html5_border.attr('class')+'   ---   '+audio5_html5_container.attr('class'));  // the same

			audio5_html5_container.addClass(options.skin);
			audio5_html5_container.append(audio5_html5_controlsDef);

			var audio5_html5_frameBehindPlayerText = $('.FrameBehindPlayerText', audio5_html5_container);
			var audio5_html5_frameBehindPlayer = $('.FrameBehindPlayer', audio5_html5_container);
			var audio5_html5_controls = $('.AudioControls', audio5_html5_container);
			var audio5_html5_facebook_btn = $('.AudioFacebook', audio5_html5_container);
			var audio5_html5_twitter_btn = $('.AudioTwitter', audio5_html5_container);
			var audio5_html5_play_btn = $('.AudioPlay', audio5_html5_container);
			var audio5_html5_prev_btn = $('.AudioPrev', audio5_html5_container);
			var audio5_html5_next_btn = $('.AudioNext', audio5_html5_container);
			var audio5_html5_showHidePlaylist_btn = $('.AudioShowHidePlaylist', audio5_html5_container);
			var audio5_html5_volumeMute_btn = $('.VolumeButton', audio5_html5_container);
			var audio5_html5_volumeSlider = $('.VolumeSlider', audio5_html5_container);
			var audio5_html5_Title = $('.songTitle', audio5_html5_container);
			var audio5_html5_TitleInside = $('.songTitleInside', audio5_html5_container);
			var audio5_html5_radioStation = $('.radioStation', audio5_html5_container);
			var audio5_html5_ximage = $('.ximage', audio5_html5_container);
			var audio5_html5_headphone = $('.headphone', audio5_html5_container);

			var ver_ie=getInternetExplorerVersion();

			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1 || navigator.userAgent.indexOf('Android') != -1) {
				options.autoHidePlayButton=false;
				audio5_html5_play_btn.css('display','block');
				options.autoPlay=false;
			}


			//initilize the player with the options
			audio5_html5_container.css({
				//'background':options.playerBg,
				'background':"transparent",
				'padding':options.playerPadding+'px'
			});

			audio5_html5_frameBehindPlayer.css({
				'background':options.frameBehindPlayerColor
			});

			audio5_html5_frameBehindPlayerText.css({
				'background':options.beneathTitleBackgroundColor_VisiblePlaylist,
				'opacity':options.beneathTitleBackgroundOpacity_VisiblePlaylist/100,
				'border-bottom':options.beneathTitleBackgroundBorderWidth+'px solid '+options.beneathTitleBackgroundBorderColor
			});
			/****if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
				//audio5_html5_controls.css({margin-top:-20px;});
				audio5_html5_container.css({
					'padding-top':'0px'
				});
			}****/


			jQuery('.audio5_html5_arrow_down').css({
				'border-top-color':options.minButtonColor
			});


			jQuery('.audio5_html5_min').click(function() {
				if (jQuery(this).hasClass('audio5_html5_arrow_down')) {
					jQuery(this).removeClass('audio5_html5_arrow_down');
					jQuery(this).addClass('audio5_html5_arrow_up');
					jQuery('.audio5_html5_arrow_up').css({
						'border-bottom-color':options.minButtonColor
					});
					audio5_html5_container.slideToggle( 400, function() {
					  // Animation complete.
					});
				} else {
					jQuery(this).removeClass('audio5_html5_arrow_up');
					jQuery(this).addClass('audio5_html5_arrow_down');
					audio5_html5_container.slideToggle( 400, function() {
					  // Animation complete.
					});
				}


			});

			var current_obj = {
				current_img_no:0,
				origID:0,
				is_very_first:true,
				total_images:0,
				selectedCateg_total_images:0,
				numberOfCategories:0,
				is_changeSrc:false,
				timeupdateInterval:'',
				totalTime:'',
				playlist_arr:'',
				isCarouselScrolling:false,
				isStationTitleInsideScrolling:false,
				curSongText:'',
				prevSongTitle:'',
				stationTitleInsideWait:0,
				audioPlayerWidth:0,
				audioPlayerHeight:0,

				category_arr:'',
				selectedCateg:'',
				categsAreListed:false,
				thumbsHolder_Thumb:$('<div class="thumbsHolder_ThumbOFF" rel="0"><div class="padding">test</div></div>'),
				thumbsHolder_ThumbHeight:0,
				thumbsHolder_Thumbs:'',

				search_val:'',

				constantDistance:5,
				playerTopMargin:23,
				titleWidth:0,
				radioStationTopPos:0,
				radioStationLeftPos:0,
				titleTopPos:0,
				titleLeftPos:0,
				frameBehindPlayerTopPos:0,
				frameBehindPlayerLeftPos:0,
				imageTopPos:0,
				imageLeftPos:0,
				playTopPos:0,
				playLeftPos:0,
				previousTopPos:0,
				previousLeftPos:0,
				nextTopPos:0,
				nextLeftPos:0,
				headphoneTopPos:0,
				headphoneLeftPos:0,
				volumeTopPos:0,
				volumeLeftPos:0,
				volumesliderTopPos:0,
				volumesliderLeftPos:0,
				showhideplaylistTopPos:0,
				showhideplaylistLeftPos:0,
				smallButtonDistance:0,
				facebookTopPos:0,
				facebookLeftPos:0,
				twitterTopPos:0,
				twitterLeftPos:0,

				numberOfButtonsRightSide:3,

				origParentFloat:'',
				origParentPaddingTop:'',
				origParentPaddingRight:'',
				origParentPaddingBottom:'',
				origParentPaddingLeft:'',

				windowWidth:0,

				audioID:'',
				audioObj:'',//remove it
				radioReaderAjaxInterval:'',
				totalRadioStationsNo:0,
				ajaxReturnedRadioStationsNo:0,
				lastfm:'',

				isFlashNeeded:true,
				myFlashObject:'',
				rndNum:0,
				prevVolumeVal:1,
				cur_loc:'',
				cur_intv:''
			};


			current_obj.audioID=audio5_html5_Audio.attr('id');

			current_obj.isFlashNeeded=it_supports_mp3(current_obj);
			if (ver_ie!=-1) {
				//if (ver_ie!=9) {
					current_obj.isFlashNeeded=true;
				//}
			}
			//alert (current_obj.isFlashNeeded);

			if (!options.showFacebookBut) {
				current_obj.numberOfButtonsRightSide-=1;
			}

			if (!options.showTwitterBut) {
				current_obj.numberOfButtonsRightSide-=1;
			}

			if (!options.showPlaylistBut) {
				current_obj.numberOfButtonsRightSide-=1;
			}



			if (!options.showPlaylistBut) {
				audio5_html5_showHidePlaylist_btn.css({
					'display':'none',
					'padding':0,
					'margin':0
				});
			}

			if (!options.showHeadphone) {
				current_obj.playerTopMargin=0;
			}



			//audio5_html5_border.width(options.playerWidth+10);
			audio5_html5_container.width(options.playerWidth);
			options.origWidth=options.playerWidth;


			audio5_html5_frameBehindPlayer.css({
				'top':parseInt(((audio5_html5_ximage.height()+2*options.imageBorderWidth)-audio5_html5_frameBehindPlayer.height())/2,10)+current_obj.playerTopMargin+'px',
				'left':0+'px'
			});
			current_obj.frameBehindPlayerTopPos=parseInt(audio5_html5_frameBehindPlayer.css('top').substring(0, audio5_html5_frameBehindPlayer.css('top').length-2),10);
			current_obj.frameBehindPlayerLeftPos=parseInt(audio5_html5_frameBehindPlayer.css('left').substring(0, audio5_html5_frameBehindPlayer.css('left').length-2),10);

			audio5_html5_frameBehindPlayerText.css({
				'top':current_obj.frameBehindPlayerTopPos+audio5_html5_frameBehindPlayer.height()+'px',
				'left':0+'px'
			});

			//the image
			audio5_html5_ximage.css({
				'top':current_obj.playerTopMargin+'px',
				'left':parseInt((audio5_html5_container.width()-(audio5_html5_ximage.width()+2*options.imageBorderWidth))/2,10)+'px'
			});
			current_obj.imageTopPos=parseInt(audio5_html5_ximage.css('top').substring(0, audio5_html5_ximage.css('top').length-2),10);
			current_obj.imageLeftPos=parseInt(audio5_html5_ximage.css('left').substring(0, audio5_html5_ximage.css('left').length-2),10);
			if (options.autoHidePlayButton) {
					$('*').on('click', function(){
						audio5_html5_play_btn.css({
							'display':'none'
						});
					});


					audio5_html5_ximage.mouseover(function() {
						audio5_html5_play_btn.css({
							'display':'block'
						});
					});
					audio5_html5_ximage.mouseout(function() {
						audio5_html5_play_btn.css({
							'display':'none'
						});
					});
					audio5_html5_play_btn.mouseover(function() {
						audio5_html5_play_btn.css({
							'display':'block'
						});
					});


			}
			audio5_html5_ximage.click(function() {
						audio5_html5_play_btn.click();
						audio5_html5_play_btn.css({
							'display':'block'
						});
			});






			//play, next, prev buttons
			current_obj.playTopPos=current_obj.frameBehindPlayerTopPos+parseInt((audio5_html5_frameBehindPlayer.height()-audio5_html5_play_btn.height())/2,10);
			current_obj.playLeftPos=parseInt((audio5_html5_frameBehindPlayer.width()-audio5_html5_play_btn.width())/2,10);
			audio5_html5_play_btn.css({
				'top':current_obj.playTopPos+'px',
				'left':current_obj.playLeftPos+'px'
			});
			if (options.autoHidePlayButton) {
				setTimeout(function(){
					audio5_html5_play_btn.fadeOut( 1500, function() {
						 // Animation complete.
					});
				}, 2000);
			}


			if (!options.showNextPrevBut) {
				audio5_html5_prev_btn.css({
					'display':'none',
					'width':0,
					'padding':0,
					'margin':0
				});
				audio5_html5_next_btn.css({
					'display':'none',
					'width':0,
					'padding':0,
					'margin':0
				});
			}
			current_obj.previousTopPos=current_obj.playTopPos+parseInt((audio5_html5_play_btn.height()-audio5_html5_prev_btn.height())/2,10);
			current_obj.previousLeftPos=current_obj.imageLeftPos-audio5_html5_prev_btn.width()-options.nextPrevAdditionalPadding;
			audio5_html5_prev_btn.css({
				'top':current_obj.previousTopPos+'px',
				'left':current_obj.previousLeftPos+'px'
			});

			current_obj.nextTopPos=current_obj.previousTopPos;
			current_obj.nextLeftPos=current_obj.imageLeftPos+(audio5_html5_ximage.width()+2*options.imageBorderWidth)+options.nextPrevAdditionalPadding;
			audio5_html5_next_btn.css({
				'top':current_obj.nextTopPos+'px',
				'left':current_obj.nextLeftPos+'px'
			});


			//headphone
			if (options.showHeadphone) {
				current_obj.headphoneTopPos=0;
				current_obj.headphoneLeftPos=parseInt(current_obj.imageLeftPos+(audio5_html5_ximage.width()+2*options.imageBorderWidth-audio5_html5_headphone.width())/2,10);
				audio5_html5_headphone.css({
					'left':current_obj.headphoneLeftPos+'px',
					'top':current_obj.headphoneTopPos+'px'
				});
			} else {
				audio5_html5_headphone.css({
					'display':'none'
				});
			}

			//volume
			if (!options.showVolume) {
				audio5_html5_volumeMute_btn.css({
					'display':'none',
					'width':0,
					'padding':0,
					'margin':0
				});
				audio5_html5_volumeSlider.css({
					'display':'none',
					'width':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.volumeTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_volumeMute_btn.height())/2);
				current_obj.volumeLeftPos=parseInt((current_obj.previousLeftPos-(audio5_html5_volumeMute_btn.width()+audio5_html5_volumeSlider.width()+current_obj.constantDistance))/2,10);
				audio5_html5_volumeMute_btn.css({
					'top':current_obj.volumeTopPos+'px',
					'left':current_obj.volumeLeftPos+'px'
				});
				current_obj.volumesliderTopPos=current_obj.volumeTopPos+Math.floor((audio5_html5_volumeMute_btn.height()-audio5_html5_volumeSlider.height())/2);
				current_obj.volumesliderLeftPos=current_obj.volumeLeftPos+audio5_html5_volumeMute_btn.width()+current_obj.constantDistance;
				audio5_html5_volumeSlider.css({
					'top':current_obj.volumesliderTopPos+'px',
					'left':current_obj.volumesliderLeftPos+'px'
				});
			}



			// set player height
			current_obj.audioPlayerHeight=audio5_html5_ximage.height()+2*options.imageBorderWidth+current_obj.constantDistance+audio5_html5_radioStation.height()+current_obj.constantDistance+audio5_html5_Title.height()+2*current_obj.constantDistance+current_obj.playerTopMargin;
			if (!options.showRadioStation && !options.showTitle) {
				current_obj.audioPlayerHeight-=42;
			} else if (!options.showTitle) {
				current_obj.audioPlayerHeight-=21;
			}
			audio5_html5_container.height(current_obj.audioPlayerHeight);




			//facebook
			current_obj.smallButtonDistance=parseInt( ( (options.playerWidth-current_obj.nextLeftPos-audio5_html5_next_btn.width()) - current_obj.numberOfButtonsRightSide*audio5_html5_showHidePlaylist_btn.width()  ) /(current_obj.numberOfButtonsRightSide+1) , 10);
			current_obj.facebookTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_facebook_btn.height())/2);
			current_obj.facebookLeftPos=current_obj.nextLeftPos + audio5_html5_next_btn.width() + current_obj.smallButtonDistance;
			//current_obj.constantDistance;
			audio5_html5_facebook_btn.css({
				'top':current_obj.facebookTopPos+'px',
				'left':current_obj.facebookLeftPos+'px'
			});
			if (!options.showFacebookBut) {
				audio5_html5_facebook_btn.css({
					'display':'none',
					'width':0,
					'padding':0,
					'margin':0
				});
				current_obj.facebookLeftPos=current_obj.nextLeftPos + audio5_html5_next_btn.width();
			} else {
					  window.fbAsyncInit = function() {
						FB.init({
						  appId:options.facebookAppID,
						  version:'v2.8',
						  status:true,
						  cookie:true,
						  xfbml:true
						});
					  };

					  (function(d, s, id){
						 var js, fjs = d.getElementsByTagName(s)[0];
						 if (d.getElementById(id)) {return;}
						 js = d.createElement(s); js.id = id;
						 js.src = "//connect.facebook.com/en_US/sdk.js";
						 fjs.parentNode.insertBefore(js, fjs);
					   }(document, 'script', 'facebook-jssdk'));
			}
			audio5_html5_facebook_btn.click(function() {
				/*var imageLink=current_obj.playlist_arr[current_obj.origID]['image'];
				var pathArray = window.location.pathname.split( '/' );
				if (imageLink.indexOf('http://')!=-1 || imageLink.indexOf('https://')!=-1) {
					//imageLink=current_obj.playlist_arr[current_obj.origID]['image'];
				} else {
					if (pathArray[pathArray.length-1].indexOf('.')!=-1) {
						pathArray.pop();
					}
					imageLink=window.location.protocol+'//'+window.location.host+'/'+pathArray.join('/')+'/'+current_obj.playlist_arr[current_obj.origID]['image'];
				}*/
				//alert (imageLink);
				FB.ui(
				  {
				   method: 'feed',
				   name: options.facebookShareTitle,
				   caption: current_obj.playlist_arr[current_obj.origID]['station'],
				   description: options.facebookShareDescription,
				   link: document.URL/*,
				   picture: imageLink*/
				  },
				  function(response) {
					/*if (response && response.post_id) {
					  alert('Post was published.');
					} else {
					  alert('Post was not published.');
					}*/
				  }
				);
			});



			//twitter
			current_obj.twitterTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_facebook_btn.height())/2);
			current_obj.twitterLeftPos=current_obj.facebookLeftPos+audio5_html5_facebook_btn.width()+current_obj.smallButtonDistance;
			audio5_html5_twitter_btn.css({
				'top':current_obj.twitterTopPos+'px',
				'left':current_obj.twitterLeftPos+'px'
			});
			if (!options.showTwitterBut) {
				audio5_html5_twitter_btn.css({
					'display':'none',
					'width':0,
					'padding':0,
					'margin':0
				});
				current_obj.twitterLeftPos=current_obj.facebookLeftPos+audio5_html5_facebook_btn.width();
			} else {
				/*window.twttr = (function (d,s,id) {
				  var t, js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
				  js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
				  return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
				}(document, "script", "twitter-wjs"));*/
			}
			audio5_html5_twitter_btn.click(function() {
				var myURL = "http://www.google.com";
				var my_text=current_obj.playlist_arr[current_obj.origID]['station'].replace("%", "percent");
				my_text=my_text.replace("&", " and ");
        		window.open("https://twitter.com/intent/tweet?url=" + document.URL+ "&text="+my_text,"Twitter","status = 1, left = 430, top = 270, height = 550, width = 420, resizable = 0");
			});


			//show/hide playlist
			current_obj.showhideplaylistTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_showHidePlaylist_btn.height())/2);
			//current_obj.showhideplaylistLeftPos=current_obj.twitterLeftPos+audio5_html5_twitter_btn.width()+current_obj.smallButtonDistance;
			current_obj.showhideplaylistLeftPos=current_obj.volumeLeftPos-current_obj.smallButtonDistance;
			audio5_html5_showHidePlaylist_btn.css({
				'top':current_obj.showhideplaylistTopPos+'px',
				'left':current_obj.showhideplaylistLeftPos+'px'
			});


			//station & title
			audio5_html5_Title.css({'color':options.songTitleColor});
			audio5_html5_radioStation.css({'color':options.radioStationColor});
			current_obj.titleWidth=options.playerWidth-2*options.playlistPadding;

			current_obj.radioStationTopPos=current_obj.imageTopPos+(audio5_html5_ximage.width()+2*options.imageBorderWidth)+2*current_obj.constantDistance;
			current_obj.radioStationLeftPos=options.playlistPadding;

			current_obj.titleTopPos=current_obj.imageTopPos+(audio5_html5_ximage.width()+2*options.imageBorderWidth)+2*current_obj.constantDistance+audio5_html5_radioStation.height()+current_obj.constantDistance;
			current_obj.titleLeftPos=options.playlistPadding;

			audio5_html5_radioStation.css({
				'top':current_obj.radioStationTopPos+'px',
				'left':current_obj.radioStationLeftPos+'px'
			});

			audio5_html5_Title.css({
				'top':current_obj.titleTopPos+'px',
				'left':current_obj.titleLeftPos+'px'
			});



			audio5_html5_frameBehindPlayerText.css({
				'top':current_obj.frameBehindPlayerTopPos+audio5_html5_frameBehindPlayer.height()+'px',
				'left':0+'px',
				'height':parseInt(audio5_html5_container.height()/2,10)+audio5_html5_frameBehindPlayer.height()+'px'
			});



			//generate playlist
			var currentCarouselTop=0;
			var audio5_html5_thumbsHolderWrapper = $('.thumbsHolderWrapper', audio5_html5_container);
			var audio5_html5_playlistPadding = $('.playlistPadding', audio5_html5_container);
			var audio5_html5_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', audio5_html5_container);
			var audio5_html5_thumbsHolder = $('.thumbsHolder', audio5_html5_container);
			current_obj.audio5_html5_sliderVertical = $('.slider-vertical', audio5_html5_container);
			var audio5_html5_selectedCategDiv = $('.selectedCategDiv', audio5_html5_container);
			var audio5_html5_innerSelectedCategDiv = $('.innerSelectedCategDiv', audio5_html5_container);
			var audio5_html5_searchDiv = $('.searchDiv', audio5_html5_container);
			var audio5_html5_search_term = $('.search_term', audio5_html5_container);

			audio5_html5_playlistPadding.css({'padding':options.playlistPadding+'px'});
			audio5_html5_thumbsHolderVisibleWrapper.append('<div class="readingData">'+options.translateReadingData+'</div>');

			if (!options.showPlaylist) {
				//audio5_html5_thumbsHolderWrapper.css({'display':'none'});
				audio5_html5_thumbsHolderWrapper.css({'opacity':0});
			}

			if (!options.showPlaylistOnInit) {
				audio5_html5_thumbsHolderWrapper.css({
					    'opacity': 0,
						'visibility':'hidden',
						'margin-top':'-20px'/*,
						'display':'none'*/
				});

				audio5_html5_frameBehindPlayerText.css({
					'background':options.beneathTitleBackgroundColor_HiddenPlaylist,
					'opacity':options.beneathTitleBackgroundOpacity_HiddenPlaylist/100,
					'border-bottom':options.beneathTitleBackgroundBorderWidth+'px solid '+options.beneathTitleBackgroundBorderColor
				});
			}

			audio5_html5_selectedCategDiv.css({
				'background-color':options.selectedCategBg,
				'background-position':'10px 50%',
				'margin-bottom':options.selectedCategMarginBottom+'px'
			});
			audio5_html5_innerSelectedCategDiv.css({
				'color':options.selectedCategOffColor,
				'background-position':(options.playerWidth-2*options.playlistPadding-20)+'px 50%'
			});


			if (!options.showCategories) {
				audio5_html5_selectedCategDiv.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
				//options.selectedCategMarginBottom=0;
			}



			audio5_html5_searchDiv.css({
				'background-color':options.searchAreaBg,
				'margin-top':options.selectedCategMarginBottom+'px'
			});

			audio5_html5_search_term.val(options.searchInputText);
			audio5_html5_search_term.css({
				'width':parseInt((options.playerWidth-2*options.playlistPadding)-37,10)+'px',
				'background-color':options.searchInputBg,
				'border-color':options.searchInputBorderColor,
				'color':options.searchInputTextColor
			});


			if (!options.showSearchArea) {
				audio5_html5_searchDiv.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			}

			audio5_html5_thumbsHolderWrapper.css({
				'width':audio5_html5_container.width()+2*options.playerPadding+'px',
				/*'top':current_obj.audioPlayerHeight+options.playlistTopPos+'px',*/
				'bottom':((-1)*current_obj.audioPlayerHeight)+'px',
				'left':'0px',
				'background':options.playlistBgColor

			});

			audio5_html5_thumbsHolderVisibleWrapper.width(audio5_html5_container.width());

			/*$.get( options.pathToAjaxFiles+"streamtitle.php", {the_stream:'http://209.236.126.18:8002/;','_': $.now()}, function( data ) {
 				 alert( "Data Loaded: " + data );
			});*/

			//audio5_html5_thumbsHolder.append("<p>reading data...</p>");
			current_obj.playlist_arr=new Array();
			current_obj.category_arr=new Array();
			var resultsSplit_arr=new Array();

			var playlistElements = $('.xaudioplaylist', audio5_html5_container).children();
			playlistElements.each(function() { // ul-s
	            currentElement = $(this);
	            current_obj.total_images++;
	            current_obj.playlist_arr[current_obj.total_images-1]=new Array();
	            current_obj.playlist_arr[current_obj.total_images-1]['title']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['station']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['image']='';
				current_obj.playlist_arr[current_obj.total_images-1]['category']='';
				current_obj.playlist_arr[current_obj.total_images-1]['radiostream']='';
				current_obj.playlist_arr[current_obj.total_images-1]['associatedpageurl']='';
	           /* current_obj.playlist_arr[current_obj.total_images-1]['sources_mp3']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['sources_ogg']='';*/

	            //alert (currentElement.find('.xtitle').html())
	            if (currentElement.find('.xtitle').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['title']=currentElement.find('.xtitle').html();
	            }



	            if (currentElement.find('.xstation').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['station']=currentElement.find('.xstation').html();
	            }

	            if (currentElement.find('.ximage').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['image']=currentElement.find('.ximage').html();
	            }
				if (currentElement.find('.xcategory').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['category']=options.translateAllRadioStations+';'+currentElement.find('.xcategory').html()+';';
					if (!options.grabStreamnameAndGenre) {
							 var my_resultsSplit_arr=new Array();
							 my_resultsSplit_arr = current_obj.playlist_arr[current_obj.total_images-1]['category'].split(';');
							 for (var j=0;j<my_resultsSplit_arr.length;j++) {
								my_resultsSplit_arr[j]=my_resultsSplit_arr[j].trim();
								if (current_obj.category_arr.indexOf(my_resultsSplit_arr[j])===-1 && my_resultsSplit_arr[j]!='') {
									current_obj.category_arr.push(my_resultsSplit_arr[j]);
								}
							 }
					}
				}

				if (currentElement.find('.xassociatedpageurl').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['associatedpageurl']=currentElement.find('.xassociatedpageurl').html();
	            }

				/*if (currentElement.find('.xcategory').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['category']=currentElement.find('.xcategory').html();

				   resultsSplit_arr = current_obj.playlist_arr[current_obj.total_images-1]['category'].split(';');
				   for (var j=0;j<resultsSplit_arr.length;j++) {
					  if (current_obj.category_arr.indexOf(resultsSplit_arr[j])===-1) {
						  current_obj.category_arr.push(resultsSplit_arr[j]);
					  }
				   }
	            }*/

				if (currentElement.find('.xradiostream').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['radiostream']=currentElement.find('.xradiostream').html();

								//start to add '/;' or ';' if is missing start
								if (current_obj.playlist_arr[current_obj.total_images-1]['radiostream'].indexOf("/",9)==-1) {
									current_obj.playlist_arr[current_obj.total_images-1]['radiostream']=current_obj.playlist_arr[current_obj.total_images-1]['radiostream']+'/;';
								}
								if (current_obj.playlist_arr[current_obj.total_images-1]['radiostream'].charAt(current_obj.playlist_arr[current_obj.total_images-1]['radiostream'].length - 1)=='/') {
									current_obj.playlist_arr[current_obj.total_images-1]['radiostream']=current_obj.playlist_arr[current_obj.total_images-1]['radiostream']+';';
								}
								//start to add '/;' or ';' if is missing end

					current_obj.totalRadioStationsNo++;
					if (options.grabStreamnameAndGenre) {
							$.get( options.pathToAjaxFiles+"streamandgenre.php", {the_stream:current_obj.playlist_arr[current_obj.total_images-1]['radiostream'], cur_i:(current_obj.total_images-1), translateAllRadioStations:options.translateAllRadioStations,'_': $.now()}, function( data ) {
									 current_obj.ajaxReturnedRadioStationsNo++;
									 var data_arr=data.split("#----#");
									 /*if (data_arr.length>=1) {
										  current_obj.playlist_arr[data_arr[0]]['station']='';
									 }*/
									 if (data_arr.length>=2) {
										  if (current_obj.playlist_arr[data_arr[0]]['station']=='') {
											 current_obj.playlist_arr[data_arr[0]]['station']=data_arr[1];
										  }
									 }
									 if (data_arr.length>=3) {
										  if (current_obj.playlist_arr[data_arr[0]]['category']=='') {
											 current_obj.playlist_arr[data_arr[0]]['category']=data_arr[2]+';';
										  }
									 }

									 if (current_obj.playlist_arr[data_arr[0]]['category']=='') {
											 current_obj.playlist_arr[data_arr[0]]['category']=options.translateAllRadioStations;
									 }

									 //categs start
									 var resultsSplit_arr=new Array();
									 resultsSplit_arr = current_obj.playlist_arr[data_arr[0]]['category'].split(';');
									 for (var j=0;j<resultsSplit_arr.length;j++) {
										resultsSplit_arr[j]=resultsSplit_arr[j].trim();
										if (current_obj.category_arr.indexOf(resultsSplit_arr[j])===-1 && resultsSplit_arr[j]!='') {
											current_obj.category_arr.push(resultsSplit_arr[j]);
										}
									 }
									  //categs end
									 //alert (current_obj.ajaxReturnedRadioStationsNo+ '  --  '+current_obj.totalRadioStationsNo);
									 //first initialization
									 if (current_obj.ajaxReturnedRadioStationsNo==current_obj.totalRadioStationsNo) {
											current_obj.numberOfCategories=current_obj.category_arr.length;
											current_obj.selectedCateg=options.firstCateg;
											current_obj.category_arr.sort();
											if (options.firstCateg=='' && current_obj.category_arr.indexOf(options.firstCateg)===-1) {
												current_obj.selectedCateg=current_obj.category_arr[0];
											}
											audio5_html5_innerSelectedCategDiv.html(current_obj.selectedCateg);

											$( ".readingData" ).remove();

											generatePlaylistByCateg(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
									}
							});
					}  //if (options.grabStreamnameAndGenre) {
	            }

				/*if (currentElement.find('.xsources_mp3').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['sources_mp3']=currentElement.find('.xsources_mp3').html();
	            }

	            if (currentElement.find('.xsources_ogg').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['sources_ogg']=currentElement.find('.xsources_ogg').html();
	            }*/

			});


			if (!options.grabStreamnameAndGenre) {
									current_obj.numberOfCategories=current_obj.category_arr.length;
									current_obj.selectedCateg=options.firstCateg;
									current_obj.category_arr.sort();
									if (options.firstCateg=='' && current_obj.category_arr.indexOf(options.firstCateg)===-1) {
										current_obj.selectedCateg=current_obj.category_arr[0];
									}
									audio5_html5_innerSelectedCategDiv.html(current_obj.selectedCateg);

									$( ".readingData" ).remove();

									generatePlaylistByCateg(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);


			}




			/*current_obj.numberOfCategories=current_obj.category_arr.length;
			current_obj.category_arr.sort();
			current_obj.selectedCateg=options.firstCateg;
			if (options.firstCateg=='' && current_obj.category_arr.indexOf(options.firstCateg)===-1) {
				current_obj.selectedCateg=current_obj.category_arr[0];
			}
			audio5_html5_innerSelectedCategDiv.html(current_obj.selectedCateg);
            //generate playlist for the first time
			if (current_obj.totalRadioStationsNo<=0) {
	//generatePlaylistByCateg(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
			}*/


//alert (audio5_html5_container.css("top"));



			// create a Cache object
			if (options.grabLastFmPhoto) {
				var cache = new LastFMCache();
				current_obj.lastfm = new LastFM({
					apiKey    : options.lastFMApiKey,
					apiSecret : options.lastFMSecret,
					cache     : cache
				});
			}





			//selectedCategDiv
			audio5_html5_selectedCategDiv.click(function() {
				current_obj.search_val='';
			    audio5_html5_search_term.val(options.searchInputText);

				generateCategories(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_innerSelectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
			});



			audio5_html5_selectedCategDiv.mouseover(function() {
				audio5_html5_innerSelectedCategDiv.css({
					'color':options.selectedCategOnColor
				});
			});


			audio5_html5_selectedCategDiv.mouseout(function() {
				audio5_html5_innerSelectedCategDiv.css({
					'color':options.selectedCategOffColor
				});
			});






			//start initialize volume slider
			audio5_html5_volumeSlider.slider({
				value: options.initialVolume,
				step: 0.05,
				orientation: "horizontal",
				range: "min",
				max: 1,
				animate: true,
				slide:function(e,ui){
						//document.getElementById(current_obj.audioID).muted=false;
						options.initialVolume=ui.value;
						if (!current_obj.isFlashNeeded) {
							document.getElementById(current_obj.audioID).volume=ui.value;
						} else {
							current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container),options.initialVolume);
						}
				},
				stop:function(e,ui){

				}
			});
			document.getElementById(current_obj.audioID).volume=options.initialVolume;
			audio5_html5_volumeSlider.css({'background':options.volumeOffColor});
			$(".ui-slider-range",audio5_html5_volumeSlider).css({'background':options.volumeOnColor});
			//end initialize volume slider



			//buttons start
			audio5_html5_play_btn.click(function() {
					var is_paused;
					if (current_obj.isFlashNeeded) {
						is_paused=!audio5_html5_play_btn.hasClass('AudioPause');
					} else {
						is_paused=document.getElementById(current_obj.audioID).paused;
					}
					cancelAll();
					if (is_paused == false) {
						if (!current_obj.isFlashNeeded) {
							document.getElementById(current_obj.audioID).pause();
						} else {
							current_obj.myFlashObject.myAS3function("_pause_radio_stream_",options.initialVolume);
						}
						audio5_html5_play_btn.removeClass('AudioPause');
					} else {
						if (!current_obj.isFlashNeeded) {
							//v 1.5.0
							document.getElementById(current_obj.audioID).src=detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container);
							document.getElementById(current_obj.audioID).load();
							//v 1.5.0
							document.getElementById(current_obj.audioID).play();
						} else {
							current_obj.myFlashObject.myAS3function("_play_radio_stream_",options.initialVolume);
						}
						audio5_html5_play_btn.addClass('AudioPause');
					}
			});


			audio5_html5_next_btn.click(function() {
				if (!current_obj.categsAreListed) {
					if (current_obj.is_very_first) {
						audio5_html5_play_btn.addClass('AudioPause');
						options.autoPlay=true;
						//$(current_obj.thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');
						current_obj.thumbsHolder_Thumbs.css({
							"background":options.playlistRecordBgOffColor,
							"border-bottom-color":options.playlistRecordBottomBorderOffColor,
							"color":options.playlistRecordTextOffColor
						});


						findNextVideoNumbers(current_obj,options,'next');


						changeSrc(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
						carouselScroll(-1,current_obj,options,audio5_html5_thumbsHolder);
					}
				}
			});

			audio5_html5_prev_btn.click(function() {
				if (!current_obj.categsAreListed) {
					if (current_obj.is_very_first) {
						audio5_html5_play_btn.addClass('AudioPause');
						options.autoPlay=true;
						//$(current_obj.thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');
						current_obj.thumbsHolder_Thumbs.css({
							"background":options.playlistRecordBgOffColor,
							"border-bottom-color":options.playlistRecordBottomBorderOffColor,
							"color":options.playlistRecordTextOffColor
						});


						findNextVideoNumbers(current_obj,options,'previous');

						changeSrc(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
						carouselScroll(-1,current_obj,options,audio5_html5_thumbsHolder);
					}
				}
			});


			audio5_html5_showHidePlaylist_btn.click(function() {
				audio5_html5_thumbsHolderWrapper.css({
						'visibility':'visible'
				});
				//alert (audio5_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio5_html5_thumbsHolderWrapper.css('margin-top').length-2));
				//alert (audio5_html5_thumbsHolderWrapper.css('bottom').substring(0, audio5_html5_thumbsHolderWrapper.css('bottom').length-2));
				if (audio5_html5_thumbsHolderWrapper.css('bottom').substring(0, audio5_html5_thumbsHolderWrapper.css('bottom').length-2) < 0) {
					var aux_opacity=1;
					var aux_display='block';
					//aux_margin_top="0px";
					//the playlist height can't be determine until is generated (it connects to all the servers to grab the info)
					var aux_thumbsHolderWrapper_height=2*options.playlistPadding+(30+1)*options.numberOfThumbsPerScreen+audio5_html5_selectedCategDiv.height()+audio5_html5_searchDiv.height();
					//var aux_margin_top=(-1)*(Math.max(audio5_html5_thumbsHolderWrapper.height(),aux_thumbsHolderWrapper_height)+125)+'px';
					aux_bottom=current_obj.audioPlayerHeight+options.playlistTopPos;
					audio5_html5_thumbsHolderWrapper.css({
						'display':aux_display
					});


					audio5_html5_frameBehindPlayerText.css({
						'background':options.beneathTitleBackgroundColor_VisiblePlaylist,
						'opacity':options.beneathTitleBackgroundOpacity_VisiblePlaylist/100,
						'border-bottom':options.beneathTitleBackgroundBorderWidth+'px solid '+options.beneathTitleBackgroundBorderColor
					});
				} else {
					aux_opacity=0;
					aux_display='none';
					aux_bottom=((-1)*current_obj.audioPlayerHeight);

					if (current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen)
						current_obj.audio5_html5_sliderVertical.css({
							'opacity': 0,
							'display':'none'
						});
					audio5_html5_frameBehindPlayerText.css({
						'background':options.beneathTitleBackgroundColor_HiddenPlaylist,
						'opacity':options.beneathTitleBackgroundOpacity_HiddenPlaylist/100,
						'border-bottom':options.beneathTitleBackgroundBorderWidth+'px solid '+options.beneathTitleBackgroundBorderColor
					});
				}
				audio5_html5_thumbsHolderWrapper.css({
						'opacity': 1,
						'display':'block'
				});
				audio5_html5_thumbsHolderWrapper.animate({
					   'opacity': aux_opacity,
						/*'margin-top':aux_margin_top*/
						'bottom':aux_bottom+'px'

					  }, 500, 'swing', function() {
					    // Animation complete.
						audio5_html5_thumbsHolderWrapper.css({
							'display':aux_display
						});

					if (current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen) {
						current_obj.audio5_html5_sliderVertical.css({
							'opacity': 1,
							'display':aux_display
						});
					}
				});

				//audio5_html5_frameBehindPlayerText.fadeToggle( "fast", function() {
					//complete
			    //});


			});

			audio5_html5_volumeMute_btn.click(function() {
				if (!document.getElementById(current_obj.audioID).muted) {
					document.getElementById(current_obj.audioID).muted=true;
					audio5_html5_volumeMute_btn.addClass('VolumeButtonMuted');
					if (current_obj.isFlashNeeded) {
						current_obj.prevVolumeVal=options.initialVolume;
						options.initialVolume=0;
						current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container),options.initialVolume);
					}
				} else {
					document.getElementById(current_obj.audioID).muted=false;
					audio5_html5_volumeMute_btn.removeClass('VolumeButtonMuted');
					if (current_obj.isFlashNeeded) {
						options.initialVolume=current_obj.prevVolumeVal;
						current_obj.myFlashObject.myAS3function(detectBrowserAndAudio(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container),options.initialVolume);
					}
				}
			});



			//buttons end

				/*$.audio5_html5.goToStation = function(p) {
					//alert ("p: "+p);
					audio5_html5_next_btn.click();
				}	*/


			audio5_html5_thumbsHolder.swipe( {
				swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
				{
					//$('#logulmeu').html("phase: "+phase+"<br>direction: "+direction+"<br>distance: "+distance);
					if (direction=='up' || direction=='down') {
						if (distance!=0) {
							  currentScrollVal=current_obj.audio5_html5_sliderVertical.slider( "value");
							  if (direction=="up") {
									currentScrollVal = currentScrollVal - 1.5;
							  } else {
									currentScrollVal = currentScrollVal + 1.5;
							  }
							  current_obj.audio5_html5_sliderVertical.slider( "value", currentScrollVal);
								//page scroll enabled
								$('html, body')
				            // Needed to remove previously bound handlers
				            .off('touchstart touchmove')
				            .on('touchstart touchmove', function (e) {
				                e.preventDefault();
				            });
								//page scroll enabled
							 carouselScroll(currentScrollVal,current_obj,options,audio5_html5_thumbsHolder)
						}
					}

				  //Here we can check the:
				  //phase : 'start', 'move', 'end', 'cancel'
				  //direction : 'left', 'right', 'up', 'down'
				  //distance : Distance finger is from initial touch point in px
				  //duration : Length of swipe in MS
				  //fingerCount : the number of fingers used
				  },

				  threshold:100,
				  maxTimeThreshold:500,
				  fingers:'all'
			});


			//search area functions
			audio5_html5_search_term.on('click', function() {
				$(this).val('');
			});
			audio5_html5_search_term.on('input', function() {
				//alert( $(this).val() );
				current_obj.search_val=audio5_html5_search_term.val().toLowerCase();
				generatePlaylistByCateg(current_obj,options,audio5_html5_container,audio5_html5_thumbsHolder,audio5_html5_thumbsHolderWrapper,audio5_html5_thumbsHolderVisibleWrapper,audio5_html5_selectedCategDiv,audio5_html5_searchDiv,audio5_html5_playlistPadding,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
			});






			//initialize first Audio
			if (current_obj.isFlashNeeded) {
					//flash fallback
					current_obj.rndNum=parseInt(Math.random() * (999999 - 1000) + 1000);
					audio5_html5_container.append("<div id='swfHolder"+current_obj.rndNum+"'></div>");
					var fn = function() {
						var att = { data:options.pathToAjaxFiles+"flash_player.swf", width:"0", height:"0" };
						var par = { flashvars:"streamUrl="+current_obj.playlist_arr[current_obj.origID]['radiostream']+"&autoPlay="+options.autoPlay+"&initialVolume="+options.initialVolume };
						var id = "swfHolder"+current_obj.rndNum;
						current_obj.myFlashObject = swfobject.createSWF(att, par, id);
						//alert (current_obj.rndNum+'  --  '+current_obj.myFlashObject);
					};
					swfobject.addDomLoadEvent(fn);
					//flash fallback
					if (options.autoPlay) {
							audio5_html5_play_btn.addClass('AudioPause');
					}
			}

			changeSrc(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
					audio5_html5_play_btn.removeClass('AudioPause');
			}

			/*current_obj.radioReaderAjaxInterval=setInterval(function(){
					$.get( options.pathToAjaxFiles+"now_playing.php", {the_stream:current_obj.playlist_arr[current_obj.origID]['radiostream'],'_': $.now()}, function( data ) {
						current_obj.playlist_arr[current_obj.origID]['title']=data;
						changeCurrentSongTitle(current_obj,options,audio5_html5_thumbsHolder,audio5_html5_container,audio5_html5_play_btn,audio5_html5_Title,audio5_html5_TitleInside,audio5_html5_radioStation,audio5_html5_Audio,audio5_html5_ximage);
					});
			},options.nowPlayingInterval*1000);	*/





			var doResize = function() {
				  current_obj.prevSongTitle="";
				  if (current_obj.origParentFloat=='') {
					  current_obj.origParentFloat=audio5_html5_container.parent().css('float');
					  current_obj.origParentPaddingTop=audio5_html5_container.parent().css('padding-top');
					  current_obj.origParentPaddingRight=audio5_html5_container.parent().css('padding-right');
					  current_obj.origParentPaddingBottom=audio5_html5_container.parent().css('padding-bottom');
					  current_obj.origParentPaddingLeft=audio5_html5_container.parent().css('padding-left');
				  }

				  //alert (options.playerWidth+'  !=    '+options.origWidth +'   ||   '+options.playerWidth+'   >    '+$(window).width());

				  if (options.playerWidth!=options.origWidth || options.playerWidth>$(window).width()) {
						  audio5_html5_container.parent().css({
							  'float':'none',
							  'padding-top':0,
							  'padding-right':0,
							  'padding-bottom':0,
							  'padding-left':0
						  });
				  } else {
					  audio5_html5_container.parent().css({
						  'float':current_obj.origParentFloat,
						  'padding-top':current_obj.origParentPaddingTop,
						  'padding-right':current_obj.origParentPaddingRight,
						  'padding-bottom':current_obj.origParentPaddingBottom,
						  'padding-left':current_obj.origParentPaddingLeft
					  });
				  }
				/*audio5_html5_container.parent().css({
						  'float':'none'
					  });*/

				  var responsiveWidth=audio5_html5_container.parent().width();
				  var new_numberOfButtonsRightSide=current_obj.numberOfButtonsRightSide;

				  //var responsiveHeight=audio5_html5_container.parent().height();



				  /*if (options.responsiveRelativeToBrowser) {
					  responsiveWidth=$(window).width();
					  responsiveHeight=$(window).height();
				  }*/





					if (audio5_html5_container.width()!=responsiveWidth) {
						//alert (audio5_html5_container.width()+"!="+responsiveWidth);
						  if (options.origWidth>responsiveWidth) {
							  options.playerWidth=responsiveWidth;
						  } else {
							  options.playerWidth=options.origWidth;
						  }
						  //alert (options.playerWidth);

 						  //alert(audio5_html5_container.width()+' -- '+responsiveWidth+' -- '+options.playerWidth);
						  if (audio5_html5_container.width()!=options.playerWidth) {
						  		  audio5_html5_container.width(options.playerWidth);
								  current_obj.titleWidth=options.playerWidth-2*options.playlistPadding;

								  audio5_html5_Title.width(current_obj.titleWidth);
								  audio5_html5_radioStation.width(current_obj.titleWidth);





								  /*******************************************/


								  //the image
								  audio5_html5_ximage.css({
									  'top':current_obj.playerTopMargin+'px',
									  'left':parseInt((audio5_html5_container.width()-(audio5_html5_ximage.width()+2*options.imageBorderWidth))/2,10)+'px'
								  });
								  current_obj.imageLeftPos=parseInt(audio5_html5_ximage.css('left').substring(0, audio5_html5_ximage.css('left').length-2),10);


								  //play, next, prev buttons
								  current_obj.playTopPos=current_obj.frameBehindPlayerTopPos+parseInt((audio5_html5_frameBehindPlayer.height()-audio5_html5_play_btn.height())/2,10);
								  current_obj.playLeftPos=parseInt((audio5_html5_frameBehindPlayer.width()-audio5_html5_play_btn.width())/2,10);
								  audio5_html5_play_btn.css({
									  'top':current_obj.playTopPos+'px',
									  'left':current_obj.playLeftPos+'px'
								  });

								  current_obj.previousTopPos=current_obj.playTopPos+parseInt((audio5_html5_play_btn.height()-audio5_html5_prev_btn.height())/2,10);
								  current_obj.previousLeftPos=current_obj.imageLeftPos-audio5_html5_prev_btn.width()-options.nextPrevAdditionalPadding;
								  audio5_html5_prev_btn.css({
									  'top':current_obj.previousTopPos+'px',
									  'left':current_obj.previousLeftPos+'px'
								  });

								  current_obj.nextTopPos=current_obj.previousTopPos;
								  current_obj.nextLeftPos=current_obj.imageLeftPos+(audio5_html5_ximage.width()+2*options.imageBorderWidth)+options.nextPrevAdditionalPadding;
								  audio5_html5_next_btn.css({
									  'top':current_obj.nextTopPos+'px',
									  'left':current_obj.nextLeftPos+'px'
								  });


								  //headphone
								  if (options.showHeadphone) {
									  current_obj.headphoneTopPos=0;
									  current_obj.headphoneLeftPos=parseInt(current_obj.imageLeftPos+(audio5_html5_ximage.width()+2*options.imageBorderWidth-audio5_html5_headphone.width())/2,10);

									  audio5_html5_headphone.css({
										  'left':current_obj.headphoneLeftPos+'px',
										  'top':current_obj.headphoneTopPos+'px'
									  });
								  } else {
									  audio5_html5_headphone.css({
										  'display':'none'
									  });
								  }




								  //volume
								  current_obj.volumeTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_volumeMute_btn.height())/2);
								  current_obj.volumeLeftPos=parseInt((current_obj.previousLeftPos-(audio5_html5_volumeMute_btn.width()+audio5_html5_volumeSlider.width()+current_obj.constantDistance))/2,10);
								  audio5_html5_volumeMute_btn.css({
									  'top':current_obj.volumeTopPos+'px',
									  'left':current_obj.volumeLeftPos+'px'
								  });
								  current_obj.volumesliderTopPos=current_obj.volumeTopPos+Math.floor((audio5_html5_volumeMute_btn.height()-audio5_html5_volumeSlider.height())/2);
								  current_obj.volumesliderLeftPos=current_obj.volumeLeftPos+audio5_html5_volumeMute_btn.width()+current_obj.constantDistance;
								  audio5_html5_volumeSlider.css({
									  'top':current_obj.volumesliderTopPos+'px',
									  'left':current_obj.volumesliderLeftPos+'px'
								  });

								  if (options.playerWidth<355) {
									  if (options.showTwitterBut) {
									  	new_numberOfButtonsRightSide-=1;
									  }
								  } else {
									  new_numberOfButtonsRightSide=current_obj.numberOfButtonsRightSide;
								  }

								  //facebook
								  current_obj.smallButtonDistance=parseInt( ( (options.playerWidth-current_obj.nextLeftPos-audio5_html5_next_btn.width()) - new_numberOfButtonsRightSide*audio5_html5_showHidePlaylist_btn.width()  ) /(new_numberOfButtonsRightSide+1) , 10);
								  current_obj.facebookTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_facebook_btn.height())/2);
								  current_obj.facebookLeftPos=current_obj.nextLeftPos + audio5_html5_next_btn.width() + current_obj.smallButtonDistance;
								  //current_obj.constantDistance;
								  audio5_html5_facebook_btn.css({
									  'top':current_obj.facebookTopPos+'px',
									  'left':current_obj.facebookLeftPos+'px'
								  });
								  if (!options.showFacebookBut) {
									  audio5_html5_facebook_btn.css({
										  'display':'none',
										  'width':0,
										  'height':0,
										  'padding':0,
										  'margin':0
									  });
									  current_obj.facebookLeftPos=current_obj.nextLeftPos + audio5_html5_next_btn.width();
								  }



								  //twitter
								  if (!options.showTwitterBut || options.playerWidth<355) {
									  audio5_html5_twitter_btn.css({
										  'display':'none'
									  });
									  current_obj.twitterLeftPos=current_obj.facebookLeftPos+audio5_html5_facebook_btn.width()-6;
								  } else {
									  audio5_html5_twitter_btn.css({
										  'display':'block'
									  });
									  current_obj.twitterTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_facebook_btn.height())/2);
									  current_obj.twitterLeftPos=current_obj.facebookLeftPos+audio5_html5_facebook_btn.width()+current_obj.smallButtonDistance;
									  audio5_html5_twitter_btn.css({
										  'top':current_obj.twitterTopPos+'px',
										  'left':current_obj.twitterLeftPos+'px'
									  });
								  }




								  //show/hide playlist
								  current_obj.showhideplaylistTopPos=current_obj.nextTopPos+Math.floor((audio5_html5_next_btn.height()-audio5_html5_showHidePlaylist_btn.height())/2);
								  //current_obj.showhideplaylistLeftPos=current_obj.twitterLeftPos+audio5_html5_twitter_btn.width()+current_obj.smallButtonDistance;
								  current_obj.showhideplaylistLeftPos=current_obj.volumeLeftPos-current_obj.smallButtonDistance;
								  audio5_html5_showHidePlaylist_btn.css({
									  'top':current_obj.showhideplaylistTopPos+'px',
									  'left':current_obj.showhideplaylistLeftPos+'px'
								  });




								  /*******************************************/




								  audio5_html5_thumbsHolderWrapper.width(audio5_html5_container.width()+2*options.playerPadding);
								  audio5_html5_thumbsHolderVisibleWrapper.width(audio5_html5_container.width())
								  //audio5_html5_thumbsHolder.width(audio5_html5_container.width()+2*options.playerPadding);
								  //audio5_html5_playlistPadding.css({'padding':options.playlistPadding+'px'});

								  //current_obj.thumbsHolder_Thumbs.width(audio5_html5_container.width()-2*options.playlistPadding);


								  audio5_html5_selectedCategDiv.width(options.playerWidth-2*options.playlistPadding);
								  audio5_html5_innerSelectedCategDiv.css({
									  'background-position':(options.playerWidth-2*options.playlistPadding-20)+'px 50%'
								  });


								  //the playlist elements
								  if (current_obj.selectedCateg_total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {
									  current_obj.audio5_html5_sliderVertical.css({
										  'left':audio5_html5_container.width()+2*options.playerPadding-current_obj.audio5_html5_sliderVertical.width()-options.playlistPadding+'px'						  							      });
									  $('.thumbsHolder_ThumbOFF', audio5_html5_container).css({
										  'width':audio5_html5_container.width()+2*options.playerPadding-current_obj.audio5_html5_sliderVertical.width()-2*options.playlistPadding-3+'px'
									  });
								  } else {
									  $('.thumbsHolder_ThumbOFF', audio5_html5_container).css({
										  'width':audio5_html5_container.width()+2*options.playerPadding-2*options.playlistPadding+'px'
									  });
								  }


								  audio5_html5_search_term.css({
									  'width':parseInt((options.playerWidth-2*options.playlistPadding)-50,10)+'px'
								  });
						  }

						  if (options.playerWidth<$(window).width()) {
							  audio5_html5_container.parent().css({
								  'float':current_obj.origParentFloat,
								  'padding-top':current_obj.origParentPaddingTop,
								  'padding-right':current_obj.origParentPaddingRight,
								  'padding-bottom':current_obj.origParentPaddingBottom,
								  'padding-left':current_obj.origParentPaddingLeft
							  });
						  }


				  }


					if (options.playerWidth<445) {
						  audio5_html5_volumeSlider.css ({
							  'display':'none'
						  });
						  audio5_html5_volumeMute_btn.css ({
							  'display':'none'
						  });
						  audio5_html5_showHidePlaylist_btn.css({
									  'left':current_obj.smallButtonDistance+'px'
						  });
					} else {
						  audio5_html5_volumeSlider.css ({
							  'display':'block'
						  });
						  audio5_html5_volumeMute_btn.css ({
							  'display':'block'
						  });

					}
			};

			var TO = false;
			$(window).resize(function() {
				doResizeNow=true;

				if (ver_ie!=-1 && ver_ie==9 && current_obj.windowWidth==0)
					doResizeNow=false;


				if (current_obj.windowWidth==$(window).width()) {
					doResizeNow=false;
					if (options.windowCurOrientation!=window.orientation && navigator.userAgent.indexOf('Android') != -1) {
						options.windowCurOrientation=window.orientation;
						doResizeNow=true;
					}
				} else {
					/*if (current_obj.windowWidth===0 && (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1))
						doResizeNow=false;*/
					current_obj.windowWidth=$(window).width();
				}

				if (options.responsive && doResizeNow) {
					 if(TO !== false)
						clearTimeout(TO);


					 TO = setTimeout(function(){ doResize() }, 300); //300 is time in miliseconds
				}
			});



			if (options.responsive) {
				doResize();
			}



		});
	};


	//
	// plugin customization variables
	//
	$.fn.audio5_html5.defaults = {
		    playerWidth:5000,//removed
			skin: 'whiteControllers',
			initialVolume:0.5,
			autoPlay:true,
			loop:true,//removed
			playerPadding: 0, //removed
			playerBg: '#000000',//removed
			volumeOffColor: '#454545',
			volumeOnColor: '#ffffff',
			timerColor: '#ffffff',//removed
			songTitleColor: '#000000',
			radioStationColor: '#000000',

			frameBehindPlayerColor: '#000000',

			imageBorderWidth:4,
			imageBorderColor:'#000000',

			showFacebookBut:true,
			facebookAppID:'499867206825745',
			facebookShareTitle:'Sticky Radio Player - Full Width Shoutcast and Icecast HTML5 Player',
			facebookShareDescription:'A top-notch responsive HTML5 Radio Player compatible with all major browsers and mobile devices.',
			showVolume:true,
			showTwitterBut:true,
			showRadioStation:true,
			showTitle:true,
			showPlaylistBut:true,
			showPlaylist:true, //removed
			showPlaylistOnInit:false, //removed
			showNextPrevBut:true,
			showHeadphone:true,

			nextPrevAdditionalPadding:-5,

			autoHidePlayButton:true,

			beneathTitleBackgroundColor_VisiblePlaylist:"#c55151",
			beneathTitleBackgroundOpacity_VisiblePlaylist:100,
			beneathTitleBackgroundColor_HiddenPlaylist:"#c55151",
			beneathTitleBackgroundOpacity_HiddenPlaylist:100,
			beneathTitleBackgroundBorderColor:"#000000",
			beneathTitleBackgroundBorderWidth:3,

			translateRadioStation:"Radio Station: ",
			translateSongTitle:"Now Playing: ",
			translateReadingData:"reading data...",
			translateAllRadioStations:"ALL RADIO STATIONS",

			playlistTopPos:5,
			playlistBgColor:'#c55151',
			playlistRecordBgOffColor:'#000000',
			playlistRecordBgOnColor:'#000000',
			playlistRecordBottomBorderOffColor:'#333333',
			playlistRecordBottomBorderOnColor:'#4d4d4d',
			playlistRecordTextOffColor:'#777777',
			playlistRecordTextOnColor:'#00b4f9',

			categoryRecordBgOffColor:'#000000',
			categoryRecordBgOnColor:'#252525',
			categoryRecordBottomBorderOffColor:'#2f2f2f',
			categoryRecordBottomBorderOnColor:'#2f2f2f',
			categoryRecordTextOffColor:'#777777',
			categoryRecordTextOnColor:'#00b4f9',

			numberOfThumbsPerScreen:7,
			playlistPadding:18,

			showCategories:true,
			firstCateg:'ALL RADIO STATIONS',
			selectedCategBg: '#000000',
			selectedCategOffColor: '#FFFFFF',
			selectedCategOnColor: '#00b4f9',
			selectedCategMarginBottom:12,

			showSearchArea:true,
			searchAreaBg: '#000000',
			searchInputText:' search...',
			searchInputBg:'#ffffff',
			searchInputBorderColor:'#333333',
			searchInputTextColor:'#333333',

			minButtonColor:'#FFFFFF',


			responsive:true,
			showPlaylistNumber:true,

			nowPlayingInterval:35,
			grabLastFmPhoto:true,
			grabStreamnameAndGenre:true,

			pathToAjaxFiles:'',
			noImageAvailable:'noimageavailable.jpg',

			lastFMApiKey:'6d38069793ab51b1f7f010d8f4d77000',
			lastFMSecret:'5f1bb73c21038e2ed7125c9ed6205cb8',



			origWidth:0,
			isSliderInitialized:false,
			isProgressInitialized:false,
			isPlaylistSliderInitialized:false

	};

})(jQuery);
