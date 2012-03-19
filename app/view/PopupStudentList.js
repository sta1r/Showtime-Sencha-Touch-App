//register an xtype for bufferelist component:
//Ext.reg('bufferedList', Ext.ux.BufferedList);

/**
 * @class Showtime.views.StudentsListPopup
 * @extends Ext.ux.BufferedList
 * A popup list of A-Z of students
 */
Ext.define('Showtime.view.PopupStudentList', {
    extend: Ext.Panel,
    //requires: 'Ext.ux.BufferedList',
    config: {
        cls: 'explore-menu',
        floating: true,
        width: 300,
        height: 660,
        cardSwitchAnimation: false,
        initialize: function(){
            this.items = [{
                title: 'Students',
                id: 'StudentList',
                width: 300,
                height: 600,
                //xtype: 'bufferedList',
                xtype: 'List',
                store: 'offlineStudent',
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
            this.callParent();
        }
    }
});
//Showtime.view.PopupStudentList
//Ext.reg('students-list-popup', Showtime.views.StudentsListPopup);