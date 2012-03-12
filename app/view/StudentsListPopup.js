//register an xtype for bufferelist component:
Ext.reg('bufferedList', Ext.ux.BufferedList);

/**
 * @class Showtime.views.StudentsListPopup
 * @extends Ext.ux.BufferedList
 * A popup list of A-Z of students
 */
Showtime.views.StudentsListPopup = Ext.extend(Ext.Panel, {
	cls: 'explore-menu',
	floating: true,
	width: 300,
	height: 660,
	cardSwitchAnimation: false,
	initComponent: function(){
		this.items = [{
			title: 'Students',
			itemId: 'StudentList',
			width: 300,
			height: 600,
			xtype: 'bufferedList',
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
		}];
		Showtime.views.StudentsListPopup.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('students-list-popup', Showtime.views.StudentsListPopup);