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
                xtype: 'profile-listpanel',
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
            
            this.load();

            Ext.dispatch({
	            controller: 'Courses',
	            action: 'load'
	        });
            
            //listen here for button taps and fire appropriate controller func
            
            /*this.listPanel.query('#addButton')[0].on({
                tap: this.compose,
                scope: this
            });*/
            
            this.application.viewport.setActiveItem(this.listPanel);
        }
        else {
        	if (options.courseData) {
				//filter by course			
				Showtime.stores.profiles.filter('course', options.courseData.name);
				Showtime.stores.profiles.sort('updated', 'DESC');
				this.listPanel.loadProfiles(Showtime.stores.profiles.data.items, options.courseData);
			} else if (options.back) {
				Showtime.stores.profiles.clearFilter(true);
				Showtime.stores.profiles.sort('updated', 'DESC');
				this.listPanel.loadProfiles(Showtime.stores.profiles.data.items);
			}
            
            //this.listPanel.store.sort();
            
            this.application.viewport.setActiveItem(this.listPanel, {
                type: 'slide',
                direction: 'right'
            });            
        }
		
		
	    /*showtime.views.viewport.setActiveItem(
	        showtime.views.profilesList, options.animation
	    );*/
	},

	load: function() {
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
    	
    	if (!this.detailPanel) {
    		
    		this.detailPanel = this.render({
                xtype: 'profile-detailpanel',
            });
    		
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
			
		}
    },
    
    browse: function(options) {
    	//if not exists create popup panel
    	//sort store etc
    	
    },
    
    showBio: function(options) {
    	Showtime.views.profileDetail.showBio();
    }
    
});