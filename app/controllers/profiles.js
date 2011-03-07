showtime.controllers.profiles = new Ext.Controller({
	index: function(options) {
		//showtime.stores.profilesList.clearFilter(true);
		if (options.courseData) {
			//filter by course			
			showtime.stores.profilesList.filter('course', options.courseData.name);
			showtime.stores.profilesList.sort('updated', 'DESC');
			showtime.views.profilesList.loadProfiles(showtime.stores.profilesList.data.items, options.courseData);
		} else if (options.back) {
			showtime.stores.profilesList.clearFilter(true);
			showtime.stores.profilesList.sort('updated', 'DESC');
			showtime.views.profilesList.loadProfiles(showtime.stores.profilesList.data.items);
		}
	    showtime.views.viewport.setActiveItem(
	        showtime.views.profilesList, options.animation
	    );
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
    	showtime.views.profileDetail.descriptionPanel.show();
    }
});