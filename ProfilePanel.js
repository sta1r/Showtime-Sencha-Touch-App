(function() {
    Ext.ns("Showtime");

    Showtime.ProfilePanel = Ext.extend(Ext.Panel, {
        initComponent: function() {
            this.monitorOrientation = true;
            this.layout = "fit";
            
            this.imagePanel = new Ext.Panel({
                cls: "profile-summary",
                flex: 1,
                fullscreen: true,
                layout: 'fit'
            });

            this.portraitLayout = [{
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [
                    {
                        flex: 1,
                        layout: {
                            type: "hbox",
                            align: "stretch"
                        },

                    },
                    this.imagePanel
                ]
            }];

            this.landscapeLayout = [{
                layout: {
                    //type: "hbox",
                    align: "fit"
                },
                items: [
                    this.imagePanel,
                    {
                        flex: 1,
                        layout: {
                            type: "vbox",
                            align: "stretch"
                        },
                        //items: [this.imagePanel, this.descriptionPanel]
                    }
                ]
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

            var height = this.imagePanel.getHeight();
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
	                    	items.push({
	                    		html: '<div class="image"><img src="'+media.touch+'" height="100%" /></div>',
	                    		cls: 'card'+i
	                    	});
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
                this.doLayout();
            }
        },
        
        getTitleText: function() {
            return this.profile.profilename;
        }

    });

    Ext.reg("showtime-profilepanel", Showtime.ProfilePanel);

})();