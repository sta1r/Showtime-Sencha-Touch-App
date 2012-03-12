/**
 * @class Showtime.views.ProfilePanelToolbar
 * @extends Ext.Toolbar
 * Custom toolbar
 */
Showtime.views.ProfilePanelToolbar = Ext.extend(Ext.Toolbar, {
//define a custom toolbar by extending the object
//showtime.ProfilePanelToolbar = Ext.extend(Ext.Toolbar, {
    dock: 'top',
    overlay: true,
    initComponent: function(){
        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
        
        this.backButton = new Ext.Button({
        	itemId: 'backButton',
        	//button will appear styled as a back button
            ui: 'back',
            text: 'Back'
        });
        
		this.studentsButton = new Ext.Button({
			itemId: 'studentsButton',
			ui: 'action',
			text: 'Students',
		});
		
		this.coursesButton = new Ext.Button({
			itemId: 'coursesButton',
			ui: 'action',
			text: 'Courses',
		});
		
		this.actionButton = new Ext.Button({
			itemId: 'actionButton',
			iconMask: true,
			ui: 'plain',
			iconCls: 'action',
		});
		
		this.userButton = new Ext.Button({
			itemId: 'userButton',
			iconMask: true,
			ui: 'plain',
			iconCls: 'user_list',
		});
        
        //specify what appears on the toolbar: back button, spacer (see Ext.Spacer)
        this.items = [
            this.backButton,
			this.studentsButton,
			this.coursesButton,
            {xtype: 'spacer'},
            this.actionButton,
			this.userButton
        ];

        //call parent initComponent: because this class is an extended toolbar, the toolbar init needs to be called also:
        Showtime.views.ProfilePanelToolbar.superclass.initComponent.call(this);       
    },
    
});
Ext.reg('profile-toolbar', Showtime.views.ProfilePanelToolbar);