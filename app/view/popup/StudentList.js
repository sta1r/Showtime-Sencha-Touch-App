//register an xtype for bufferelist component:
//Ext.reg('bufferedList', Ext.ux.BufferedList);

/**
 * @class Showtime.views.StudentsListPopup
 * @extends Ext.ux.BufferedList
 * A popup list of A-Z of students
 */
Ext.define('Showtime.view.popup.StudentList', {
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
            title: 'Students',
            id: 'studentList',
            width: 300,
            height: 600,
            //xtype: 'bufferedList',
            xtype: 'list',
            store: 'studentAZStore',
            itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
            grouped: true,
            indexBar: true,
            //multiSelect: false,
            //singleSelect: true,
            //allowDeselect: true,
            itemSelector: 'div.x-list-item'
        }],
        listeners: {
            show: function(comp) {
                list = Ext.ComponentQuery.query('#studentList')[0];
                list.deselectAll();
            },
            deactivate: function(){
                this.removeAll(true);
            }
        }
    }
});