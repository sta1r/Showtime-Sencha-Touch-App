/**
 * @class Showtime.views.CoursesListPopup
 * @extends Ext.ux.BufferedList
 * A popup with a list of courses
 */
Ext.define('Showtime.view.popup.CourseList', {
    extend: Ext.Panel,
    //requires: 'Ext.ux.BufferedList',
    config: {
        cls: 'explore-menu',
        floating: true,
        centered: true,
        modal         : true,
        hideOnMaskTap : true,
        width: 300,
        height: 660,
        items: [{
            title: 'Courses',
            itemId: 'courseList',
            width: 300,
            height: 600,
            //xtype: 'bufferedList',
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
                this.removeAll(true);
            }
        }
    }
});