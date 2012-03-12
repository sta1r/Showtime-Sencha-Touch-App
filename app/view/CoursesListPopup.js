//register an xtype for bufferelist component:
Ext.reg('bufferedList', Ext.ux.BufferedList);

/**
 * @class Showtime.views.CoursesListPopup
 * @extends Ext.ux.BufferedList
 * A popup with a list of courses
 */
Showtime.views.CoursesListPopup = Ext.extend(Ext.Panel, {
	cls: 'explore-menu',
	floating: true,
	width: 300,
	height: 660,
	cardSwitchAnimation: false,
	initComponent: function(){
		this.items = [{
			title: 'Courses',
			itemId: 'CourseList',
			width: 300,
			height: 600,
			xtype: 'bufferedList',
		    store: Showtime.stores.offlineCourses,
		    itemTpl: '<div class="course"><strong>{name}</strong></div>',
			listeners: {
				beforeshow: function(comp) {
					comp.getSelectionModel().deselectAll();
				}
			}
		}];
		Showtime.views.CoursesListPopup.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('courses-list-popup', Showtime.views.CoursesListPopup);