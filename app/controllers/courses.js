/**
 * @class Courses
 * @extends Ext.Controller
 * The Courses controller
 */
Ext.regController("Courses", {

	load: function(options) {
		//put the courses store into the global Showtime namespace:
		Showtime.stores.courses = Ext.getStore('Courses');
		
		//can't autoload the store as it may run before deviceready in phonegap - so store must be loaded manually.
		//load is asynchronous so a callback must be used to process the returned data
		Showtime.stores.courses.load({
		    scope   : this,
		    callback: function(records, operation, success) {
				//handle timeout here?
		    }
		});
	}
	
});