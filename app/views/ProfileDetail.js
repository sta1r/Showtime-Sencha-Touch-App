showtime.views.ProfileDetail = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        overlay: true,
        items: [
            {
                text: 'Back',
                ui: 'back',
                listeners: {
                    'tap': function () {
                        Ext.dispatch({
                            controller: showtime.controllers.profiles,
                            action: 'index',
                            animation: {type:'slide', direction:'right'}
                        });
                    }
                }
            },
            {
                text: 'Browse',
                ui: 'action',
                listeners: {
                    'tap': function () {
                        console.log(showtime.views);
                    }
                }
            },
        ]
    }],
    fullscreen: true,
    //layout: 'fit',
    initComponent: function() {
    	profilepanel = this;
    	//var toolbar = this.getDockedItems()[0];
    	//toolbar.show();
    	showtime.views.ProfileDetail.superclass.initComponent.apply(this, arguments);
    },
    updateWithRecord: function(result) {
    	/*Ext.each(this.items.items, function(item) {
            item.update(record.data);
        });*/
        var toolbar = this.getDockedItems()[0];

        toolbar.setTitle(result.Student.firstName+' '+result.Student.lastName);
        //toolbar.getComponent('edit').record = record;

		
		profilepanel.removeAll(true);
	    if (profilecarousel) {
	    	profilecarousel.hide();
	    }
	    profilecarousel = undefined;
	    
	    var media_cards = this.createCards(result);
	    
        var profilecarousel = new Ext.Carousel({
        	fullscreen: true,
        	//hidden: true,
        	//layout: 'fit',
        	//flex: 1,
        	items: media_cards,
        	id: 'profilecar',
            itemId: 'carousel',
        	/*listeners: {
        		beforeadd: function(container, card, index) {
        			if (index == 0) {
        				profilepanel.bottomSheet.update(card.mediaData);
        				if (profilepanel.tbar.isVisible()) {
            				profilepanel.bottomSheet.show();
            			}
        			}
        		},
        		beforecardswitch: function(container, newCard, oldCard, index){
        			profilepanel.bottomSheet.update(newCard.mediaData);
        			if (profilepanel.tbar.isVisible()) {
        				profilepanel.bottomSheet.show();
        			}
        		}
        	}*/
        });
        
        //using add rather than setting items so we can fire event for each card
        //carousel.add(media_cards);
        //profilecarousel.doLayout();
        profilepanel.add(profilecarousel);

        //update the form values
        /*profilepanel.formBase.student = Ext.ModelMgr.create({
            'firstname' : result.data.Student.Student.firstName,
            'lastname'  : result.data.Student.Student.lastName,
            'profileurl': result.data.Student.Student.profileurl,
            'shorturl'  : result.data.Student.Student.shorturl,
        }, 'Student');

        form.loadModel(profilepanel.formBase.student);
        
        form.updateRecord(profilepanel.formBase.student, true);
        
        //quick hack - place the course name in the result data - because at present only course id is available in json
        result.data.Student.Student['course'] = profile.course;
        
        profilepanel.descriptionPanel.update(result.data.Student.Student);*/
        
        profilepanel.doLayout();
        profilepanel.show();
        
        //imagepanel.doLayout();
        
        //remove the loading indicator
        //Ext.getBody().unmask();
    },
    
    createCards: function(result) {
    	var video_cards = [];
    	var image_cards = [];
    	var media_cards = [];
    	
    	//create a component containing the media item and panel sheet for the title/like button
    	//each component is a 'card' in the carousel and the collection of components is added to the carousel's item property
    	Ext.each(result.Media, function(media, i){
    		
    		//only process video and images (publications ignored)
    		if (media.video || media.touch || media.profile ) {
    			
        		//create component to hold media
        		var mediaCmp = new Ext.Component({
        			tpl: new Ext.XTemplate(
        					'{[this.renderMedia(values)]}',
        					{
        						renderMedia: function(media){
            						if (media.video) {	                    		
        	                    		if (media.video_host == 'vimeo') {
        		                    		return '<div class="video vimeo"><iframe class="vimeo-player" type="text/html" width="640" height="385" src="http://player.vimeo.com/video/'+media.video_id+'?byline=0&amp;portrait=0&amp;color=ffffff" frameborder="0"></iframe></div>';
        		                    	} else {
        	                    			return '<div class="video youtube"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+media.video_id+'" frameborder="0"></iframe></div>';
        	                    		}    		
        	                    	}  else {
        	                    		if (media.touch) {
        	                    			return '<div class="profileimage size-touch" style="background-image:url('+media.touch+');background-repeat:no-repeat;"></div>';
        								} else if (media.screen) {
        									return '<div class="profileimage size-touch" style="background-image:url('+media.screen+');background-repeat:no-repeat;"></div>';
        								}
        	                    		else if (media.profile) {
        									return '<div class="profileimage size-profile" style="background-image:url('+media.profile+');background-repeat:no-repeat;"></div>';
        								}
        	                    	}
        						}
        					}
        			),
        			data: media,
        		});
        			
        		//the carousel card that holds the media/sheet
        		var card = new Ext.Panel({
        			mediaData: media,
        			items: mediaCmp,
        			layout: 'fit'
        		});
        		
        		//separate cards into video or image stacks
        		if (media.video) {
        			video_cards.push(card);
        		} else {
        			image_cards.push(card);
        		}
        		
    		}
    	});
    	//join video and image cards together (video first seems to prevent crashing)
    	media_cards = video_cards.concat(image_cards);
    	return media_cards;
    }
    
});