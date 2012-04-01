/**
 * @class Showtime.views.ProfilePanelToolbar
 * @extends Ext.Toolbar
 * Custom toolbar
 */
Ext.define('Showtime.view.profile.Toolbar', {
    extend: 'Ext.Toolbar',
    id: 'profile-toolbar',
    config: {
        docked: 'top',
        top: 0,
        left: 0,
        width: '100%',
        items: [
            {
                xtype: 'button',
                id: 'profileBackButton',
                //button will appear styled as a back button
                ui: 'back',
                text: 'Back'
            },
            {
                xtype: 'button',
                id: 'profileStudentsButton',
                ui: 'action',
                text: 'Students'
            },
            {
                xtype: 'button',
                id: 'profileCoursesButton',
                ui: 'action',
                text: 'Courses'
            },
            {
                id: 'profileToolbarLoad',
                ui: 'plain',
                iconCls: 'toolbarLoader'
            },
            {
                xtype: 'spacer',
                flex: 1
            },
            {
                xtype: 'button',
                id: 'actionButton',
                iconMask: true,
                ui: 'plain',
                iconCls: 'action'
            },
            {
                xtype: 'button',
                id: 'descButton',
                iconMask: true,
                ui: 'plain',
                iconCls: 'user_list'
            }
        ]
    },
    initialize: function(){
        this.callParent();
        Ext.ComponentQuery.query('#profileToolbarLoad')[0].hide();
    }
});