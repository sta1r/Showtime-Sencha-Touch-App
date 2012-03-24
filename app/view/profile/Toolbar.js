/**
 * @class Showtime.views.ProfilePanelToolbar
 * @extends Ext.Toolbar
 * Custom toolbar
 */
Ext.define('Showtime.view.profile.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'profile-toolbar',
    config: {
        docked: 'top',
        overlay: true,
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
                id: 'userButton',
                iconMask: true,
                ui: 'plain',
                iconCls: 'user_list'
            }
        ]
    }
});