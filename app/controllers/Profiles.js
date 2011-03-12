/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.regController("Profiles", {
	index: function(options) {

		if (!this.listPanel) {
			//create the panel
            this.listPanel = this.render({
                xtype: 'explore-panel',
                listeners: {
                	el: {
	        			//listen for a tap on elements with .explore-item class:
	        			delegate: '.explore-item',
	        			scope: this,
		        		tap: function(e, target) {
		        			if (target) {
		        				var carousel = this.listPanel.carousel;
		        				var carousel_item = carousel.items.items[carousel.getActiveIndex()];
			        			var index = carousel.items.items[carousel.getActiveIndex()].items.indexOf(target);
			        			var data = carousel_item.profileData[index];
                                if (Ext.isObject(data)) {
                                	this.view({profileData: data});
                                }
                            }
		        		}
	        		},
                }
            });
            
            this.loadProfiles();

            Ext.dispatch({
	            controller: 'Courses',
	            action: 'load'
	        });
            
            //listen here for button taps and fire appropriate controller func
			profiles = this;
			
			this.listBackButton = this.listPanel.query('#backButton')[0];
			this.listBackButton.on({
            	tap: function() {
            		this.hide();
            		profiles.index({home: true});
            	},
            	//scope: this
            });
            this.browseButton = this.listPanel.query('#browseButton')[0];
            this.browseButton.on({
            	tap: function() {
            		//create the browse panel
            		profiles.browse(this);
            	},
            });
            
            this.application.viewport.setActiveItem(this.listPanel);
        }
        else {
        	if (options && options.courseData) {
				//filter by course			
				Showtime.stores.profiles.filter('course', options.courseData.name);
				Showtime.stores.profiles.sort('updated', 'DESC');
				this.listPanel.loadProfiles(Showtime.stores.profiles.data.items, options.courseData);
			} else if (options && options.home) {
				Showtime.stores.profiles.clearFilter(true);
				Showtime.stores.profiles.sort('updated', 'DESC');
				this.listPanel.loadProfiles(Showtime.stores.profiles.data.items);
			}
            
            this.application.viewport.setActiveItem(this.listPanel, {
                type: 'slide',
                direction: 'right'
            });            
        }
		
	},

	loadProfiles: function() {
		//add the store to the global Showtime namespace:
		Showtime.stores.profiles = Ext.getStore('Profiles');
	
		//tell the store to load from its proxy
        Showtime.stores.profiles.load({
		    scope   : this,
		    callback: function(records, operation, success) {
				//handle timeout here? and/or success/failure
				Ext.each(records, function(record){
					//remove all non-numeric characters to reduce date/time into sortable number
					record.data.updated = record.data.updated.replace(/[^\d]/g, "");
				});
				//now we can sort by updated date/time
				Showtime.stores.profiles.sort('updated', 'DESC');
				//send records to view:
				this.listPanel.loadProfiles(records);
		    }
		});			
		
	},

    view: function(options) {

    	if (!this.detailPanel || this.detailPanel.isDestroyed) {
    		this.detailPanel = this.render({
                xtype: 'profile-panel',
                listeners: {
                	//destroy this panel when we go back to the main view to save memory:
	                deactivate: function(detail) {
	                    detail.destroy();
	                    //console.log('destroying panel');
	                },
	                scope: this
	            }
            });
    		
    		//add listeners for detailpanel buttons            
            this.detailBackButton = this.detailPanel.query('#backButton')[0];
    		this.detailBackButton.on({
            	tap: function() {
            		profiles.index()
            	}
            });
            this.detailBrowseButton = this.detailPanel.query('#browseButton')[0];
            this.detailBrowseButton.on({
            	tap: function() {
            		profiles.browse(this)
            	}
            });
    	}
    	
		//load profile
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
		
		//it is not possible in sencha to use a store / model proxy to read a single json record so:
		Ext.util.JSONP.request({
        	url: '/showtime/'+options.profileData.profileName+'.json',
            callbackKey: 'callback',
            callback: function(result) {
				if (result.data.Student) {
					
			 		this.detailPanel.loadProfile(result.data.Student, options.profileData);
			 		this.application.viewport.setActiveItem(
			            this.detailPanel, options.animation
			        );
			 		//remove the loading indicator
			        Ext.getBody().unmask();
				}
			},
			scope: this
		});
    },

    browse: function(button) {
    	//if not exists create popup panel
    	//sort store etc
    	if (!this.browsePopup) {
    		this.browsePopup = new Showtime.views.BrowsePopup();
    		
    		//add listeners for list taps
    		this.browsePopup.query('#AZList')[0].on({
    			itemTap: function(selected, index, item, e) {
	                this.view({profileData: selected.store.data.items[index].data});
					//hide the browse list
					this.browsePopup.hide();
				},
				scope: this
    		});
    		this.browsePopup.query('#CourseList')[0].on({
    			itemTap: function(selected, index, item, e) {
	    			this.index({courseData: selected.store.data.items[index].data})
					//hide the browse list
					this.browsePopup.hide();
					this.listBackButton.show();
				},
				scope: this
    		});
		}
		Showtime.stores.profiles.clearFilter(true);
		Showtime.stores.profiles.sort('firstName', 'ASC');
		this.browsePopup.showBy(button, 'fade');
    },
    
    showBio: function(options) {
    	Showtime.views.profileDetail.showBio();
    }
    
});