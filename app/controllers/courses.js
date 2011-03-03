showtime.controllers.courses = new Ext.Controller({
	list: function(options) {
		//can't autoload the store as it may run before deviceready in phonegap - so store must be loaded manually.
		//load is asynchronous so a callback must be used to process the returned data
		showtime.stores.courseList.load({
		    scope   : this,
		    callback: function(records, operation, success) {
				//handle timeout here?
		    }
		});
	}
});