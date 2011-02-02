(function() {
    Ext.ns("Showtime");

    Showtime.ProfilePanel = Ext.extend(Ext.Panel, {
    	scroll: false,
        initComponent: function() {
	        this.monitorOrientation = true;
            this.layout = "fit";
    
			this.tbar = new Showtime.Toolbar();	//setup the toolbar, see Toolbar.js
			this.tbar.overlay = true; //set the toolbar to appear overlaid on the image
			//this.hidden = true; //start hidden (when loaded before viewing profile)
			this.dockedItems = [this.tbar];	//add the toolbar to the panel's docked items
	        //this.tbar.setTitle(); //set the heading in the toolbar
	        this.tbar.showBackButton();
			//this.tbar.hideBrowseButton();
			this.tbar.showActionButton();
			this.tbar.showUserButton();
			
			//this.tbar.addEvents('back');
	        this.tbar.enableBubble('back');
	        this.mon(this, 'back', this.onBack, this);
			
	        //this.tbar.enableBubble('courseSelected');
	        //this.mon(this, 'back', this.onBack, this);
	        
			this.tbar.enableBubble('user');
			this.mon(this, 'user', this.onUser, this);
			
			this.tbar.enableBubble('action');
			this.mon(this, 'action', this.onAction, this);
	                    
            
            this.imagePanel = new Ext.Panel({
                cls: "profile-summary",
                flex: 1,
                hidden: true,
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
						swipe: function() {
							if (this.tbar.isVisible()){
			            		this.tbar.hideToolbar();
			            		this.bottomSheet.hide();
			            		this.descriptionPanel.hide();
			            		this.doLayout();
			                }
						},
						scope: this
					}
				}
            });
            
			this.descriptionPanel = new Ext.Panel({
				id: 'description',
				tpl: new Ext.XTemplate('<div id="description"><h4>{firstName} {lastName}</h4><h5>{course}</h5>{description}</div>'),
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
				id: 'bottomSheet',
				cls: 'bottom',
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
			
			/*Model for the bookmark form*/
			Ext.regModel('Student', {
	            fields: [
	                {name: 'firstname', type: 'string'},
	                {name: 'lastname',  type: 'string'},
	                {name: 'profileurl',type: 'string'},
	                {name: 'shorturl',  type: 'string'},
	            ]
	        });
					
			/*Bookmark Form:*/
	        this.formBase = {
	            scroll: 'vertical',
	            url   : 'http://showtime.arts.ac.uk/lcf/sendprofile/',
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
	                        id: 'bookmarkemail',
	                        placeHolder: 'you@domain.com',
	                        useClearIcon: true
	                    },{
	                        xtype: 'hiddenfield',
	                        name : 'profileurl',
	                        value: ''
	                    },{
	                        xtype: 'hiddenfield',
	                        name : 'shorturl',
	                        value: ''
	                    },{
	                        xtype: 'hiddenfield',
	                        name : 'firstname',
	                        value: ''
	                    },{
	                        xtype: 'hiddenfield',
	                        name : 'lastname',
	                        value: ''
	                    }
	                    ]
	                }
	            ],
	            listeners : {
					beforehide : function(cmp){
						console.log('hidden', cmp);
						emailfield = Ext.getCmp('bookmarkemail');
						emailfield.fieldEl.dom.blur();
					},
					beforedeactivate : function(cmp){
						console.log('deactivate', cmp);
					},
					beforesubmit : function(form, values){
	                    //console.log(values);
	                    if (Ext.util.Format.trim(values.email) == '') {
	                    	console.log('email empty');
	                    	return false;
	                    }					
	                },
	                submit : function(form, result){
	                    //console.log('success', Ext.toArray(arguments), result);	                    
	                    form.hide('fade');
	                    form.reset();
	                },
	                exception : function(form, result){
	                    console.log('failure', Ext.toArray(arguments), result);
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
									//console.log(form);
	                                form.submit({
	                                    waitMsg : {message:'Submitting', cls : 'loading'}
	                                });
									//console.log('form submitted');
	                            }
	                        }
	                    ]
	                }
	            ]
	        };

		    Ext.apply(this.formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                height: 270,
                width: 480
            });
	        form = new Ext.form.FormPanel(this.formBase);

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
         * Displays the details of the selected profile
         */
        showProfile: function(profile) {
            //profile.maxWidth = width;
            var imagepanel = this.imagePanel;
            imagepanel.removeAll(true);
            imagepanel.show();
            
            var profilepanel = this;
            

        	var makeJSONPRequest = function() {
                //Ext.getBody().mask('Loading...', 'x-mask-loading', false);
                Ext.util.JSONP.request({
                    url: '/showtime/'+profile.profileName+'.json',
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
	                    	                    
	                    //update the form values
	                    profilepanel.formBase.student = Ext.ModelMgr.create({
                            'firstname' : result.data.Student.Student.firstName,
                            'lastname'  : result.data.Student.Student.lastName,
                            'profileurl': result.data.Student.Student.profileurl,
                            'shorturl'  : result.data.Student.Student.shorturl,
                        }, 'Student');

                        form.loadModel(profilepanel.formBase.student);
	                    
                        form.updateRecord(profilepanel.formBase.student, true);
                        
                        //quick hack - place the course name in the result data - because at present only course id is available in json
                        result.data.Student.Student['course'] = profile.course;
                        
	                    profilepanel.descriptionPanel.update(result.data.Student.Student);
	                    
	                    profilepanel.doLayout();                  
	                    imagepanel.doLayout();
	                    
	                    //remove the loading indicator
	                    //Ext.getBody().unmask();
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
								
				if (this.bottomSheet.isVisible()){
					this.bottomSheet.hide();
				}
				this.removeAll(true);
				//console.log('orientationchange');
                                
                this.add.apply(this, newOrientationLayout);
                this.layout.activeItem = this.items.first();
                
                this.doLayout();
				
            }
        },
        
        getTitleText: function() {
            return this.profile.profileName;
        },

		onUser: function() {
			this.descriptionPanel.show();
			// user can tap anywhere to dismiss descriptionPanel
		},
		
		/*onLike: function() {
			this.likeModal.show();
		},*/
		
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