/**
 * @class Showtime.views.CoursesListPopup
 * @extends Ext.ux.BufferedList
 * A popup with a list of courses
 */
Ext.define('Showtime.view.popup.CourseList', {
    extend: Ext.Panel,
    config: {
        cls: 'explore-menu',
        centered: true,
        modal         : true,
        hideOnMaskTap : true,
        items: [{
            title: 'Courses',
            itemId: 'courseList',
            width: 300,
            height: 600,
            xtype: 'list',
            store: 'courseStore',
            itemTpl: '<div class="course"><strong>{name}</strong></div>',
        }],
        listeners: {
            show: function(comp) {
                list = Ext.ComponentQuery.query('#courseList')[0];
                list.deselectAll();
            },
            deactivate: function(){
                //this.removeAll(true);
            }
        }
    }
});