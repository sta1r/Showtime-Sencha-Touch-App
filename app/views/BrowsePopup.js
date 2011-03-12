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
	initComponent: function(){
		this.items = [{
			title: 'Student',
			itemId: 'AZList',
			width: 300,
			height: 600,
	        xtype: 'list',
	        store: Showtime.stores.profiles,
	        itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
	        grouped: true,
	        indexBar: true,
	        multiSelect: false,
	        singleSelect: true,
	        allowDeselect: true,
	        itemSelector: 'div.x-list-item',
		},{
			title: 'Course',
			itemId: 'CourseList',
			width: 300,
			height: 600,
	        xtype: 'list',
	        store: Showtime.stores.courses,
	        itemTpl: '<div class="course"><strong>{name}</strong></div>',
		}]
		Showtime.views.BrowsePopup.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		beforeshow: function(comp) {
			//deselecting any selected items - workaround for bug in Sencha Touch:
			//using fix from: http://www.sencha.com/forum/showthread.php?114896-OPEN-534-List-items-can-no-longer-be-deselected-in-0.99
			studentlist = comp.items.items[0];					
			var selArray = studentlist.getSelectedRecords();
			for (i=0;i<selArray.length;i++) {
			studentlist.deselect(selArray[i]); }
			
			courselist = comp.items.items[1];						
			var selArray = courselist.getSelectedRecords();
			for (i=0;i<selArray.length;i++) {
			courselist.deselect(selArray[i]); }
		}
	}
	
});

Ext.reg('browse-popup', Showtime.views.BrowsePopup);