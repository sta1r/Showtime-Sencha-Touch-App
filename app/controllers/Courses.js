/**
 * @class Courses
 * @extends Ext.Controller
 * The Courses controller
 */
Ext.regController("Courses", {

	load: function(options) {
		
		Showtime.stores.offlineCourses.addListener('load', function () {
			console.log('loading from offline courses store');
			//send records to view (see views/ExplorePanel.js):
			//profile_controller.explorePanel.loadProfiles(this.data.items);
			//loading.hide();
		});
		
		//load the course data
		Showtime.stores.courses.load();
	}
	
});