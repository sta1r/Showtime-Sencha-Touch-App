(function() {
    Ext.ns("Showtime");

    Showtime.ProfilePanel = Ext.extend(Ext.Panel, {
    	scroll: false,
        initComponent: function() {
			this.tbar = new Showtime.Toolbar();	//setup the toolbar, see Toolbar.js
			this.tbar.overlay = true; //set the toolbar to appear overlaid on the image
			//this.hidden = true; //start hidden (when loaded before viewing profile)
			this.dockedItems = [this.tbar];	//add the toolbar to the panel's docked items
	        //this.tbar.setTitle(); //set the heading in the toolbar
	        this.tbar.showBackButton();
			//this.tbar.hideBrowseButton();
			this.tbar.showActionButton();
			this.tbar.showInfoButton();
			
			//this.tbar.addEvents('back');
	        this.tbar.enableBubble('back');
	        this.mon(this, 'back', this.onBack, this);
			
	        //this.tbar.enableBubble('courseSelected');
	        //this.mon(this, 'back', this.onBack, this);
	        
			this.tbar.enableBubble('info');
			this.mon(this, 'info', this.onInfo, this);
			
			this.tbar.enableBubble('action');
			this.mon(this, 'action', this.onAction, this);
	        
			//this.showDescriptionSheet();
	        
            this.monitorOrientation = true;
            
            this.layout = "fit";
            
            this.imagePanel = new Ext.Panel({
                cls: "profile-summary",
                flex: 1,
                //hidden: true,
                fullscreen: true,
                layout: 'fit',
				listeners: { // listen for a tap on the image - show overlay and toolbar
					body: {
						tap: function() { 
							
			            	if (this.tbar.isVisible()){
			            		this.tbar.hideToolbar();
			            		this.bottomSheet.hide();
			            		this.descriptionPanel.hide();
			            		this.doLayout();
			                 } else {
			                	this.tbar.showToolbar();
			                	this.bottomSheet.show();
			                	this.doLayout();
			                 }
						},
						scope: this
					}
				}
            });

			this.descriptionPanel = new Ext.Panel({
				id: 'description',
				tpl: new Ext.XTemplate('<div id="description"><h4>About this profile</h4>{description}</div>'),
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
					}
				}
			});
			
			//create sheet for title/like button - this is reusable by each image
			this.bottomSheet = new Ext.Sheet({
				dock: 'bottom',
				overlay: true,
				modal: false,
				layout: {
					type: 'fit',
					align: 'stretch'
				},
				tpl: new Ext.XTemplate('<div class="title">{title}</div>'),
				//place the like button in the items/docked items property here?
    			//listener for click to fire ajax on like button
    		});		
			//add the toolbar to the panel's docked items
			this.dockedItems.push(this.bottomSheet);
			
	        var formBase = {
	            scroll: 'vertical',
	            url   : 'http://localhost:8888/showtime/emailProfile.php',
	            standardSubmit : false,
				cls: 'emailForm',
	            items: [
	                {
	                    xtype: 'fieldset',
	                    title: 'Bookmark this profile',
						instructions: 'Please enter your email address. You will receive an email with a link to this profile on the Showtime website.',
	                    defaults: {
	                        required: true,
	                        labelAlign: 'left'
	                    },
	                    items: [
	                    {
	                        xtype: 'emailfield',
	                        name : 'email',
	                        label: 'Email',
	                        placeHolder: 'you@domain.com',
	                        useClearIcon: true
	                    }, {
	                        xtype: 'hiddenfield',
	                        name : 'secret',
	                        value: false
	                    }]
	                }
	            ],
	            listeners : {
	                submit : function(form, result){
	                    console.log('success', Ext.toArray(arguments));
	                },
	                exception : function(form, result){
	                    console.log('failure', Ext.toArray(arguments));
	                }
	            },

	            dockedItems: [
	                {
	                    xtype: 'toolbar',
	                    dock: 'bottom',
	                    items: [
	                        {xtype: 'spacer'},
	                        {
	                            text: 'Reset',
	                            handler: function() {
	                                form.reset();
	                            }
	                        },
	                        {
	                            text: 'Send',
	                            ui: 'confirm',
	                            handler: function() {
	                                /*if(formBase.user){
	                                    form.updateRecord(formBase.user, true);
	                                }*/
	                                form.submit({
	                                    waitMsg : {message:'Submitting', cls : 'loading'}
	                                });
									console.log('form submitted');
	                            }
	                        }
	                    ]
	                }
	            ]
	        };

		    Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                height: 270,
                width: 480
            });
	        form = new Ext.form.FormPanel(formBase);

            this.portraitLayout = [{
                layout: {
                    align: "fit"
                },
                items: this.imagePanel
            }];

            this.landscapeLayout = [{
                layout: {
                    align: "fit"
                },
                items: this.imagePanel
            }];

            Showtime.ProfilePanel.superclass.initComponent.apply(this, arguments);

            this.mon(this, "orientationChange", this.resetLayout, this);

        },

        afterRender: function() {
            Showtime.ProfilePanel.superclass.afterRender.apply(this, arguments);

            this.resetLayout();
        },

        /**
         * Displays the details of the selected product
         */
        showProfile: function(profile) {
            //profile.maxWidth = width;
            var imagepanel = this.imagePanel;
            imagepanel.removeAll(true);
            
            var profilepanel = this;
            

        	var makeJSONPRequest = function() {
                Ext.getBody().mask('Loading...', 'x-mask-loading', false);
                Ext.util.JSONP.request({
                    url: '/showtime/'+profile+'.json',
                    callbackKey: 'callback',
                    callback: function(result) {
	                	var video_cards = [];
	                	var image_cards = [];
	                	var media_cards = [];
	                	
	                	//create a component containing the media item and panel sheet for the title/like button
	                	//each component is a 'card' in the carousel
	                	//the collection of components is added to the carousel's item property
	                	Ext.each(result.data.Student.Media, function(media, i){
	                		
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
			            		                    	}
			            	                    		else {
			            	                    			return '<div class="video youtube"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+media.video_id+'" frameborder="0"></iframe></div>';
			            	                    		}    		
			            	                    	}  else {
			            	                    		if (media.touch) {								
			            	                    			return '<div class="profileimage size-touch" style="background-image:url('+media.touch+');background-repeat:no-repeat;"></div>';
			            								} else if (media.profile) {
			            									return '<div class="profileimage size-profile" style="background-image:url('+media.profile+');background-repeat:no-repeat;"></div>';
			            								}
			            	                    	}
		                						}
		                					}
		                			),
		                			data: media,
		                		});
		                			
		                		//the carousel card the holds the media/sheet
		                		var card = new Ext.Panel({
		                			mediaData: media,
		                			items: mediaCmp,
		                			layout: 'fit'
		                		});
		                		
		                		//re-order cards so video comes first - seems to prevent crashing
		                		if (media.video) {
		                			video_cards.push(card);
		                		} else {
		                			image_cards.push(card);
		                		}
		                		
	                		}
	                	});
	                	
	                	media_cards = video_cards.concat(image_cards);
						
	                    var carousel = new Ext.Carousel({
	                    	listeners: {
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
	                    	}
	                    });
	                    
	                    //using add rather than setting items so we can fire event for each card
	                    carousel.add(media_cards);
	                    carousel.doLayout();
	                    
	                    imagepanel.add(carousel);
	                    
	                    profilepanel.descriptionPanel.update(result.data.Student.Student);
	                    
	                    profilepanel.doLayout();                  
	                    imagepanel.doLayout();
	                    
	                    //remove the loading indicator
	                    Ext.getBody().unmask();
                    }
                });
            };
            
            imagepanel.removeAll();
            
            makeJSONPRequest(profile);

        },

        resetLayout: function() {
            var portrait = Ext.getOrientation() == "portrait",
                newOrientationLayout = portrait ? this.portraitLayout : this.landscapeLayout;

            if (newOrientationLayout != this.orientationLayout) {
                this.orientationLayout = newOrientationLayout;

                if (this.imagePanel.ownerCt) {
                    this.imagePanel.ownerCt.remove(this.imagePanel, false);
                }
                
                this.removeAll(true);

                //this.descriptionPanel.flex = portrait ? 4 : 1;

                this.add.apply(this, newOrientationLayout);
                this.layout.activeItem = this.items.first();
                
                //this.imagePanel
                
                this.doLayout();
            }
        },
        
        getTitleText: function() {
            return this.profile.profileName;
        },

		onInfo: function() {
			this.descriptionPanel.show();
			// user can tap anywhere to dismiss descriptionPanel
			
			/*if (this.descriptionPanel.isVisible()) {
				this.descriptionPanel.hide();
	        } else {
				this.descriptionPanel.show();
	        }*/
		},
		
		onAction: function() {
			form.show();		
		},
		
		onBack: function() {
			this.descriptionPanel.hide();
			this.imagePanel.removeAll(true)
		}
    });

    Ext.reg("showtime-profilepanel", Showtime.ProfilePanel);

})();