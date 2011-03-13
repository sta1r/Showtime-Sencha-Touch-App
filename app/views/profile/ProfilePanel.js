/**
 * @class Showtime.views.ProfilePanel
 * @extends Ext.Panel
 * 
 */
Showtime.views.ProfilePanel = Ext.extend(Ext.Panel, {    
    initComponent: function() {
    	profilepanel = this;
    	
    	//use custom toolbar
		this.tbar = new Showtime.views.ProfilePanelToolbar();
		//add the toolbar to the panel's docked items
		this.dockedItems = [this.tbar];
		
		//create sheet for title/like button - this is reusable by each image
		this.bottomSheet = new Ext.Sheet({
			id: 'bottomSheet',
			cls: 'bottom',
			dock: 'bottom',
			overlay: true,
			modal: false,
			layout: {
				type: 'hbox',
				align: 'right'
			},
			height: 45,
			stretchX: true,
			tpl: new Ext.XTemplate(
				'<div class="title">{title}</div>'	
			),
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				flex: 1,
				items: [
				{ xtype: 'spacer'},			
				{
					xtype: 'button',
					iconMask: true,
					ui: 'plain',
					iconCls: 'heart',
					cls: 'like',
					handler: function() {
			            Ext.getBody().mask('Liking...', 'x-mask-loading', false);
			            bottomSheet = Ext.getCmp('bottomSheet');
			            Ext.Ajax.request({
			                url: '/showtime/media/like/'+bottomSheet.data.id,
			                success: function(response, opts) {
								//console.log('You liked media id=' + bottomSheet.data.id);
								var obj = Ext.decode(response.responseText);
								//console.log(obj);
								if (obj.success == true) {
									//console.log('likes='+obj.likes);
									//like saved successfully
									// modal to display like count to user
								 	likeTerm = obj.likes == 1 ? 'like' : 'likes';
									this.likeModal = new Ext.Panel({
										id: 'likeModal',
										floating: true,
										centered: true,
										hidden: true,
										modal: true,
										height: 80,
										width: 180,
										html: obj.likes + ' ' + likeTerm + '!'
									});
									likeModal = this.likeModal;
									likeModal.on('hide', function() {
										likeModal.destroy();
									});
									likeModal.show('pop');
								} else {
									//failed to like
								}									
								Ext.getBody().unmask();
			                }
			            });
			        }
				}]
			}]
			//add custom animation?
			//place the like button in the items/docked items property here?
			//listener for click to fire ajax on like button
		});
		//add the toolbar to the panel's docked items
		this.dockedItems.push(this.bottomSheet);
		
		profilepanel.on('deactivate', function(profilepanel){
			//destroy the carousel
			if (profilepanel.items.items[0]) {
				profilepanel.items.items[0].destroy();
			}
			if (profilepanel.descriptionPanel) {
				profilepanel.descriptionPanel.destroy();
			}
			/*if (profilepanel.tbar) {
				profilepanel.tbar.destroy()
			}*/
		});
		
    	Showtime.views.ProfilePanel.superclass.initComponent.apply(this, arguments);
    },
	
	//load a profile
	loadProfile: function(result, listData) {		
		//profilepanel.setLoading(true);

        this.tbar.setTitle(result.Student.firstName+' '+result.Student.lastName);
        //toolbar.getComponent('edit').record = record;
        
		
		profilepanel.removeAll(true);
	    if (profilecarousel) {
	    	profilecarousel.hide();
	    }
	    profilecarousel = undefined;
	    
	    var media_cards = this.createCards(result);
	    
        var profilecarousel = new Ext.Carousel({
        	fullscreen: true,
        	id: 'profilecar',
            itemId: 'carousel',
        	listeners: {
        		beforeadd: function(container, card, index) {
        			if (index == 0) {
        				profilepanel.bottomSheet.update(card.mediaData);
        			}
        		},
        		beforecardswitch: function(container, newCard, oldCard, index){
        			profilepanel.bottomSheet.update(newCard.mediaData);
        		}
        	}
        });
        
        //using add rather than setting items so we can fire event for each card
        profilecarousel.add(media_cards);      
        profilecarousel.doLayout();
        //add the carousel
        profilepanel.add(profilecarousel);

        //create an instance of the student model (used by form)
        profilepanel.student = new Showtime.models.Student({
        	'firstname' : result.Student.firstName,
            'lastname'  : result.Student.lastName,
            'profileurl': result.Student.profileurl,
            'shorturl'  : result.Student.shorturl,
        });
        
        //quick hack - place the course name in the result data - because at present only course id is available in json
        result.Student['course'] = listData.course;
        
        //profilepanel.descriptionPanel.update(result.Student);
        profilepanel.studentdata = result.Student;
        
        profilepanel.doLayout();
        profilepanel.show();
	      
        //bottomSheet seems to like to be shown only after profilepanel has been shown
        profilepanel.bottomSheet.show();
        //profilepanel.setLoading(false);
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
    },
    
    showDesc: function() {
    	if (!this.descriptionPanel) {
    		//setup description panel
    		this.descriptionPanel = new Ext.Panel({
    			id: 'description',
    			tpl: new Ext.XTemplate('<div id="description"><h4>{firstName} {lastName}</h4><h5>{course}</h5>{description}</div>'),
    			data: profilepanel.studentdata,
    			floating: true,
    			centered: true,
    			modal: true,
    			hidden: false,
    			height: 450,
    			width: 420,
    			/*dockedItems: [{
    				dock: 'top',
    				xtype: 'container', 
    				title: 'About'
    			}],*/
    			styleHtmlContent: true,
                scroll: 'vertical',
                listeners: {
    				body: {
    					click: function(e) {
    						//prevent links in the profile description opening safari
    						e.stopEvent(true);
    					},
    					delegate: 'a'
    				},
    				deactivate: {
    					//this.destroy();
    				}
    			}
    		});
    	};
    	this.descriptionPanel.show();
    }
    
});
Ext.reg('profile-panel', Showtime.views.ProfilePanel);