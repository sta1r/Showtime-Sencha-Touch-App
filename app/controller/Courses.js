/**
 * @class Courses
 * @extends Ext.Controller
 * The Courses controller
 */
Ext.define("Showtime.controller.Courses", {
    extend: 'Ext.app.Controller',
    launch: function(options) {
		//load the course data
        Ext.getStore('onlineCourse').load();
	}
	
});