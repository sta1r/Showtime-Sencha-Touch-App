//register an xtype for bufferelist component:
Ext.reg('bufferedList', Ext.ux.BufferedList);

/**
 * @class Showtime.views.StudentsListPopup
 * @extends Ext.ux.BufferedList
 * A popup list of A-Z of students
 */
Showtime.views.StudentsListPopup = Ext.extend(Ext.ux.BufferedList, {
	//cls: 'explore-menu',
	floating: true,
	title: 'Students',
	itemId: 'StudentList',
	width: 300,
	height: 600,
	store: Showtime.stores.offlineStudentList,
	itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
	grouped: true,
	indexBar: true,
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

Ext.reg('students-list-popup', Showtime.views.StudentsListPopup);