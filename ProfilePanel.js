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
			//this.tbar.addEvents('back');
	        this.tbar.enableBubble('back');
	        
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
							//this.showDescriptionSheet();
			            	if (this.tbar.isVisible()){
			            		this.tbar.hideToolbar();
			                 } else {
			                	this.tbar.showToolbar();
			                 }
						},
						scope: this
					}
				}
            });

			this.descriptionPanel = new Ext.Panel({
				layout: 'card',
                styleHtmlContent: true,
                html: '<h4>Description</h4><p>Need the description content to sit in here. Can we set it in the JSON request below?</p>' + 
				'<h4>Youtube test</h4>' +
				'<iframe title="YouTube video player" class="youtube-player" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/P4OWWy-1Oyk?rel=0" frameborder="0"></iframe>' +
				'<iframe title="YouTube video player" class="youtube-player" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/NtzDtV2Jbk8" frameborder="0"></iframe>' + 
				'<iframe title="YouTube video player" class="youtube-player" type="text/html" width="480" height="390" src="http://www.youtube.com/embed/lLPbvrbY0to?rel=0" frameborder="0"></iframe>' +
				'<h4>Vimeo test</h4>' +
				'<iframe src="http://player.vimeo.com/video/12377177" width="400" height="225" frameborder="0"></iframe>' +
				'<h4>Scribd test</h4>' +
				'<a title="View Scribd in HTML5 on Scribd" href="http://www.scribd.com/doc/30964170/Scribd-in-HTML5" style="margin: 12px auto 6px auto; font-family: Helvetica,Arial,Sans-serif; font-style: normal; font-variant: normal; font-weight: normal; font-size: 14px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; display: block; text-decoration: underline;">Scribd in HTML5</a> <object id="doc_836040420025661" name="doc_836040420025661" height="600" width="100%" type="application/x-shockwave-flash" data="http://d1.scribdassets.com/ScribdViewer.swf" style="outline:none;" >		<param name="movie" value="http://d1.scribdassets.com/ScribdViewer.swf">		<param name="wmode" value="opaque"> 		<param name="bgcolor" value="#ffffff"> 		<param name="allowFullScreen" value="true"> 		<param name="allowScriptAccess" value="always"> 		<param name="FlashVars" value="document_id=30964170&access_key=key-1ar9e5ms2364hpdfeixn&page=1&viewMode=list&custom_logo_image_url=http%3A%2F%2Fi5.scribdassets.com%2Fpublic%2Fimages%2Fuploaded%2F72595926%2Fy4t0wM2gXND9YfLmd74O.jpeg&custom_logo_click_url=www.scribd.com"> 		<embed id="doc_836040420025661" name="doc_836040420025661" src="http://d1.scribdassets.com/ScribdViewer.swf?document_id=30964170&access_key=key-1ar9e5ms2364hpdfeixn&page=1&viewMode=list&custom_logo_image_url=http%3A%2F%2Fi5.scribdassets.com%2Fpublic%2Fimages%2Fuploaded%2F72595926%2Fy4t0wM2gXND9YfLmd74O.jpeg" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" height="600" width="100%" wmode="opaque" bgcolor="#ffffff"></embed> 	</object>	' +
				'<h4>Issuu test</h4>' +
				'<div><object style="width:420px;height:540px" ><param name="movie" value="http://static.issuu.com/webembed/viewers/style1/v1/IssuuViewer.swf?mode=embed&amp;viewMode=presentation&amp;layout=http%3A%2F%2Fskin.issuu.com%2Fv%2Flight%2Flayout.xml&amp;showFlipBtn=true&amp;documentId=101110194436-b7b2db521e0e4e9c8c7c2319656841df&amp;docName=2011_course_brochure_prelim_webonly&amp;username=MCDpsych&amp;loadingInfoText=2011%20APA%20Course%20Brochure&amp;et=1291911175346&amp;er=39" /><param name="allowfullscreen" value="true"/><param name="menu" value="false"/><embed src="http://static.issuu.com/webembed/viewers/style1/v1/IssuuViewer.swf" type="application/x-shockwave-flash" allowfullscreen="true" menu="false" style="width:420px;height:540px" flashvars="mode=embed&amp;viewMode=presentation&amp;layout=http%3A%2F%2Fskin.issuu.com%2Fv%2Flight%2Flayout.xml&amp;showFlipBtn=true&amp;documentId=101110194436-b7b2db521e0e4e9c8c7c2319656841df&amp;docName=2011_course_brochure_prelim_webonly&amp;username=MCDpsych&amp;loadingInfoText=2011%20APA%20Course%20Brochure&amp;et=1291911175346&amp;er=39" /></object><div style="width:420px;text-align:left;"><a href="http://issuu.com/MCDpsych/docs/2011_course_brochure_prelim_webonly?mode=embed&amp;viewMode=presentation&amp;layout=http%3A%2F%2Fskin.issuu.com%2Fv%2Flight%2Flayout.xml&amp;showFlipBtn=true" target="_blank">Open publication</a> - Free <a href="http://issuu.com" target="_blank">publishing</a> - <a href="http://issuu.com/search?q=psychiatry" target="_blank">More psychiatry</a></div></div>',
                scroll: 'vertical'
			});
			
			this.descriptionSheet = new Ext.Sheet({
				cls: "descriptionSheet",
				layout: 'fit',
				hidden: true,
				modal: true,
				hideOnMaskTap: true,
				centered: false,
                height: 700,
				arrive: 'bottom',
				depart: 'bottom',
		        /*listeners: {
		         hide: function(){
		           console.log('deactivate')
		           this.detailPanel.setCard(0); 
		         },
		         scope: this
		        },*/
		        renderTo: this.body,
		        stretchX: true,
		        items: [this.descriptionPanel]
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
            var thepanel = this.imagePanel;

        	var makeJSONPRequest = function() {
                Ext.getBody().mask('Loading...', 'x-mask-loading', false);
                Ext.util.JSONP.request({
                    url: '/showtime/'+profile+'.json',
                    callbackKey: 'callback',
                    callback: function(result) {
	                	var items = [];
	                    Ext.each(result.data.Student.Media, function(media, i){
	                    	if (media.video) {
	                    		
	                    		items.push({
		                    		//html: '<div class="image" style="background-image: url('+media.touch+');"></div>',
									html: '<div class="video"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+media.video_id+'" frameborder="0"></iframe></div>',
		                    		id: 'card'+i
		                    	});
	                    		
	                    	} else {	
	                    	
		                    	items.push({
		                    		//html: '<div class="image" style="background-image: url('+media.touch+');"></div>',
									html: '<div class="profileimage"><img src="'+media.touch+'" /></div>',
		                    		id: 'card'+i
		                    	});
	                    	
	                    	}
	                     }
	                    );           
	                    var carousel = new Ext.Carousel({
	                    	items: items
	                    });
	                    
	                    thepanel.add(carousel);                    
	                    thepanel.doLayout();
	                    //remove the loading indicator
	                    Ext.getBody().unmask();
                    }
                });
            };
            
            thepanel.removeAll();
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
            return this.profile.profilename;
        },

		showDescriptionSheet: function() {
			this.descriptionSheet.show();
		}

    });

    Ext.reg("showtime-profilepanel", Showtime.ProfilePanel);

})();