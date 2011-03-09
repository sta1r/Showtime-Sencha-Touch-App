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
                                    console.log('view profile + pass data:');
                                    console.log(data);
                                }
                            }
		        		}		        		
	        		},
                }
            });
            
            ProfilesStore = Ext.getStore('ProfilesStore');
            //load data into the store
            ProfilesStore.load({
			    scope   : this,
			    callback: function(records, operation, success) {
					//handle timeout here?
					//if success/failure
					Ext.each(records, function(record){
						record.data.updated = record.data.updated.replace(/[^\d]/g, "");
					});
					//send records to view:
					this.listPanel.loadProfiles(records);
			    }
			});
			
			//replace with default in store config
			ProfilesStore.sort('updated', 'DESC');
            
            /*this.listPanel.query('#addButton')[0].on({
                tap: this.compose,
                scope: this
            });*/
            
            this.application.viewport.setActiveItem(this.listPanel);
        }
        else {
        	/*if (options.courseData) {
				//filter by course			
				showtime.stores.profilesList.filter('course', options.courseData.name);
				showtime.stores.profilesList.sort('updated', 'DESC');
				showtime.views.profilesList.loadProfiles(showtime.stores.profilesList.data.items, options.courseData);
			} else if (options.back) {
				showtime.stores.profilesList.clearFilter(true);
				showtime.stores.profilesList.sort('updated', 'DESC');
				showtime.views.profilesList.loadProfiles(showtime.stores.profilesList.data.items);
			}*/
            
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
	load: function(options) {
		//can't autoload the store as it may run before deviceready in phonegap - so store must be loaded manually.
		//load is asynchronous so a callback must be used to process the returned data
		showtime.stores.profilesList.load({
		    scope   : this,
		    callback: function(records, operation, success) {
				//handle timeout here?
				//if success/failure
				Ext.each(records, function(record){
					record.data.updated = record.data.updated.replace(/[^\d]/g, "");
				});
				//send records to view:
				showtime.views.profilesList.loadProfiles(records);
		    }
		});
		showtime.stores.profilesList.sort('updated', 'DESC');
	},
    view: function(options) {		
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
		//it is not possible in sencha to use a store / model proxy to read a single json record so:
		 Ext.util.JSONP.request({
             url: '/showtime/'+options.profileData.profileName+'.json',
             callbackKey: 'callback',
             callback: function(result) {

			 	if (result.data.Student) {
			 		showtime.views.profileDetail.loadProfile(result.data.Student, options.profileData);
			 		showtime.views.viewport.setActiveItem(
			            showtime.views.profileDetail, options.animation
			        );
			 		//remove the loading indicator
			        Ext.getBody().unmask();
			 	}
		 	 }
		 });
		 
    },
    showBio: function(options) {
    	showtime.views.profileDetail.showBio();
    }
});