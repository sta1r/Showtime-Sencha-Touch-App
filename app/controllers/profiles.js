showtime.controllers.profiles = new Ext.Controller({
	index: function(options) {
	    showtime.views.viewport.setActiveItem(
	        showtime.views.profilesList, options.animation
	    );
	},
    show: function(options) {
    	var id = parseInt(options.id),
        profile = showtime.stores.profiles.getById(id);
	    if (profile) {
	        showtime.views.profileDetail.updateWithRecord(profile);
	        showtime.views.viewport.setActiveItem(
	            showtime.views.profileDetail, options.animation
	        );
	    }
    }
});