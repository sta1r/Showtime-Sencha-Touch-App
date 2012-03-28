/**
 * @class Showtime.views.StudentsListPopup
 * @extends Ext.ux.BufferedList
 * A popup list of A-Z of students
 */
Ext.define('Showtime.view.popup.StudentList', {
    extend: Ext.Panel,
    config: {
        cls: 'explore-menu',
        centered: true,
        modal         : true,
        hideOnMaskTap : true,
        items: [{
            title: 'Students',
            id: 'studentList',
            width: 300,
            height: 600,
            xtype: 'list',
            store: 'studentAZStore',
            itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
            grouped: true,
            indexBar: true,
            itemSelector: 'div.x-list-item'
        }],
        listeners: {
            show: function(comp) {
                list = Ext.ComponentQuery.query('#studentList')[0];
                list.deselectAll();
            },
            deactivate: function(){
                //this.removeAll(true);
            }
        }
    }
});