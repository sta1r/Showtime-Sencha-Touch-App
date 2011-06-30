/**
 * @class Showtime.views.BrowsePopup
 * @extends Ext.TabPanel
 * A popup tabpanel with two lists - A-Z of students and list of courses
 */
Showtime.views.BrowsePopup = Ext.extend(Ext.TabPanel, {
	cls: 'explore-menu',
	floating: true,
	width: 300,
	height: 660,
	cardSwitchAnimation: false,
	initComponent: function(){
		this.items = [{
			title: 'Student',
			itemId: 'StudentList',
			width: 300,
			height: 600,
	        xtype: 'list',
	        store: Showtime.stores.offlineStudentList,
	        itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
	        grouped: true,
	        indexBar: true,
	        multiSelect: false,
	        singleSelect: true,
	        allowDeselect: true,
	        itemSelector: 'div.x-list-item',
	        listeners: {
	    		beforeshow : function(comp) {
	    	        //console.log('beforeshow');
	    	        comp.getSelectionModel().deselectAll();
				}
			}
		},{
			title: 'Course',
			itemId: 'CourseList',
			width: 300,
			height: 600,
	        xtype: 'list',
	        store: Showtime.stores.offlineCourses,
	        itemTpl: '<div class="course"><strong>{name}</strong></div>',
		}]
		Showtime.views.BrowsePopup.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		beforeshow: function(comp) {
			this.query('#StudentList')[0].getSelectionModel().deselectAll();
			this.query('#CourseList')[0].getSelectionModel().deselectAll();
		}
	}
	
});

Ext.reg('browse-popup', Showtime.views.BrowsePopup);