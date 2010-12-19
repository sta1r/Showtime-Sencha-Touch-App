(function() {
    Ext.ns("Showtime");

    Showtime.ProfilePanel = Ext.extend(Ext.Panel, {
        initComponent: function() {
			this.tbar = new Showtime.Toolbar();	//setup the toolbar, see Toolbar.js
			this.tbar.overlay = true; //set the toolbar to appear overlaid on the image
			//this.tbar.hidden = true; //start hidden
			this.dockedItems = [this.tbar];	//add the toolbar to the panel's docked items        
	        //this.tbar.setTitle(); //set the heading in the toolbar
	        this.tbar.showBackButton();
			this.tbar.hideBrowseButton();
			this.tbar.showActionButton();
			this.tbar.showInfoButton();
			
			//this.tbar.addEvents('back');
	        this.tbar.enableBubble('back');
	        this.mon(this, 'back', this.onBack, this);
			
			this.tbar.enableBubble('info');
			this.mon(this, 'info', this.onInfo, this);
	        
			//this.showDescriptionSheet();
	        
            this.monitorOrientation = true;
            
            this.layout = "fit";
            
            this.imagePanel = new Ext.Panel({
                cls: "profile-summary",
                flex: 1,
                fullscreen: true,
                layout: 'fit',
                /*tpl: new Ext.XTemplate(
                        '<div class="img">{images:this.renderImage}</div>',
                        {
                            renderImage: function(images, product) {
                                if (Ext.isArray(images) && images[2]) {
                                    var img = images[5] || images[2];
                                    return String.format('<img src="{0}" />', img.url, product.maxWidth);
                                } else {
                                    return '';
                                }
                            }
                        }
                ),*/
				listeners: { // listen for a tap on the image - show overlay and toolbar
					body: {
						tap: function() { 
							
			            	if (this.tbar.isVisible()){
			            		this.tbar.hideToolbar();
			            		this.descriptionSheet.hide();
			            		this.doLayout();
			                 } else {
			                	this.tbar.showToolbar();
			                	this.doLayout();
			                 }
						},
						scope: this
					}
				}
            });

			this.descriptionPanel = new Ext.Panel({
				layout: 'card',
                styleHtmlContent: true/*,
                scroll: 'vertical'*/
			});
			
	        this.descriptionSheet = new Ext.Sheet({
				cls: "descriptionSheet",
				layout: 'fit',
				hidden: true,
				modal: false,
				//hideOnMaskTap: true,
				centered: false,
	            height: 200,
				arrive: 'bottom',
				depart: 'bottom',
		        //renderTo: this.body,
		        stretchX: true,
		        scroll: true//,
		        //items: [this.descriptionPanel]
			});
			

            this.portraitLayout = [{
                layout: {
                    align: "fit"
                },
                items: this.imagePanel
            }];

            this.landscapeLayout = [{
                layout: {
                    //type: "hbox",
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
            var profilepanel = this;

        	var makeJSONPRequest = function() {
                Ext.getBody().mask('Loading...', 'x-mask-loading', false);
                Ext.util.JSONP.request({
                    url: '/showtime/'+profile+'.json',
                    callbackKey: 'callback',
                    callback: function(result) {
	                	var items = [];
	                    Ext.each(result.data.Student.Media, function(media, i){
	                    	if (media.video) {
	                    		
	                    		if (media.video_host == 'vimeo') {
		                    		items.push({
										html: '<div class="video vimeo"><iframe class="vimeo-player" type="text/html" width="640" height="385" color="ffffff" src="http://player.vimeo.com/video/'+media.video_id+'?byline=0&amp;portrait=0" frameborder="0"></iframe></div>',
			                    		id: 'card'+i
			                    	});
	                    		}
	                    		else {
		                    		items.push({
										html: '<div class="video youtube"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+media.video_id+'" frameborder="0"></iframe></div>',
			                    		id: 'card'+i
			                    	});
	                    		}
	                    		
	                    	} else {    
		                		
								if (media.touch) {								
		                    		items.push({
										html: '<div class="profileimage size-touch" style="background-image:url('+media.touch+');background-repeat:no-repeat;"></div>',
			                    		id: 'card'+i
			                    	});
								} else {
									items.push({
										html: '<div class="profileimage size-profile" style="background-image:url('+media.profile+');background-repeat:no-repeat;"></div>',
			                    		id: 'card'+i
			                    	});
								}
	                    	
	                    	}
	
	                     }
	                    );           
	                    var carousel = new Ext.Carousel({
	                    	items: items
	                    });
	                    
	                    imagepanel.add(carousel);
	                    
	                    profilepanel.descriptionSheet.html = '<div id="description">'+result.data.Student.Student.description+'</div>';

	                    //profilepanel.descriptionSheet.show();
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
			if (this.descriptionSheet.isVisible()) {
				this.descriptionSheet.hide();
	        } else {
				this.descriptionSheet.show();
	        }
		},
		
		onBack: function() {
			this.descriptionSheet.hide();
		}
    });

    Ext.reg("showtime-profilepanel", Showtime.ProfilePanel);

})();