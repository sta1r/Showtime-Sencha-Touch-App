//register an xtype for bufferelist component:
Ext.reg('bufferedList', Ext.ux.BufferedList);

/**
 * @class Showtime.views.CoursesListPopup
 * @extends Ext.ux.BufferedList
 * A popup with a list of courses
 */
Showtime.views.CoursesListPopup = Ext.extend(Ext.ux.BufferedList, {
	//cls: 'explore-menu',
	floating: true,
	title: 'Courses',
	itemId: 'CourseList',
	width: 300,
	height: 600,
    store: Showtime.stores.offlineCourses,
    itemTpl: '<div class="course"><strong>{name}</strong></div>',
	multiSelect: false,
	singleSelect: true,
	allowDeselect: true,
	itemSelector: 'div.x-list-item',
	listeners: {
		beforeshow: function(comp) {
			comp.getSelectionModel().deselectAll();
		}
	}
});

Ext.reg('courses-list-popup', Showtime.views.CoursesListPopup);