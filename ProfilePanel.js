(function() {
    Ext.ns("Showtime");

    Showtime.ProfilePanel = Ext.extend(Ext.Panel, {

        initComponent: function() {
            this.monitorOrientation = true;
            this.layout = "fit";

            /*this.descriptionPanel = new Ext.Panel({
                cls: "productdetail-description",
                scroll: true,
                tpl: new Ext.XTemplate(
                    "{description:this.renderDescription}",
                    {
                        renderDescription: function(desc) {
                            if (desc.search(/<.*?>/g) >= 0) {
                                return desc;
                            }
                            else {
                                return desc.replace(/\r?\n/g, '<br />');
                            }
                        }
                    }
                )
            });*/

            /*this.imagePanel = new Ext.Panel({
                cls: "productdetail-image",
                flex: 1,
                tpl: new Ext.XTemplate(
                    '{images:this.renderImage}',
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
                )
            });*/
            
            this.summaryPanel = new Ext.Carousel({
                cls: "profile-summary",
                flex: 1,
                layout: 'fit',
                direction: 'horizontal',
                ui: 'light',
                activeItem: 1,
                tpl: new Ext.XTemplate(
                	'<tpl for="media">',
                    '<img src="http://dxcpw8yg8uhxn.cloudfront.net/{imageuri}touch.jpg" />',
                    '</tpl>'
                )
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
                        //items: [this.imagePanel, this.descriptionPanel]
                    },
                    this.summaryPanel
                ]
            }];

            this.landscapeLayout = [{
                layout: {
                    //type: "hbox",
                    align: "stretch"
                },
                items: [
                    this.summaryPanel,
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
            this.profile = profile;
            //var width = this.imagePanel.getWidth();
            //profile.maxWidth = width;
            
            //this.descriptionPanel.update(profile);
            //this.imagePanel.update(profile);
            
            this.summaryPanel.update(profile);

        },

        resetLayout: function() {
            var portrait = Ext.getOrientation() == "portrait",
                newOrientationLayout = portrait ? this.portraitLayout : this.landscapeLayout;

            if (newOrientationLayout != this.orientationLayout) {
                this.orientationLayout = newOrientationLayout;

                //if (this.descriptionPanel.ownerCt) {
                    //this.descriptionPanel.ownerCt.remove(this.descriptionPanel, false);
                    //this.imagePanel.ownerCt.remove(this.imagePanel, false);
                    //this.summaryPanel.ownerCt.remove(this.summaryPanel, false);
                //}

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