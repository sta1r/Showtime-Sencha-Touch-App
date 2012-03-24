/**
 * @class Showtime.views.BookmarkFormPanel
 * @extends Ext.Panel
 * 
 */
Showtime.views.BookmarkFormPanel = Ext.define(Ext.ux.JSONPFormPanel, {
	itemId: 'bookmarkForm',
    scroll: 'vertical',
    url   : 'http://showtime.arts.ac.uk/lcf/sendprofile/',
    standardSubmit : false,
	cls: 'emailForm',
	autoRender: true,
    floating: true,
    modal: true,
    centered: true,
    height: 270,
    width: 480,
    items: [
        {
            xtype: 'fieldset',
            title: 'Share this profile by email',
			instructions: 'Please enter an email address. An email will be sent with a link to this profile on the Showtime website.',
            defaults: {
                required: true,
                labelAlign: 'left'
            },
            items: [
	            {
	                xtype: 'emailfield',
	                name : 'email',
	                label: 'Email',
	                id: 'bookmarkemail',
	                placeHolder: 'you@domain.com',
	                useClearIcon: true
	            },{
	                xtype: 'hiddenfield',
	                name : 'profileurl',
	                value: ''
	            },{
	                xtype: 'hiddenfield',
	                name : 'shorturl',
	                value: ''
	            },{
	                xtype: 'hiddenfield',
	                name : 'firstname',
	                value: ''
	            },{
	                xtype: 'hiddenfield',
	                name : 'lastname',
	                value: ''
	            }
            ]
        }
    ],
    listeners : {
		beforehide : function(cmp){
			emailfield = Ext.getCmp('bookmarkemail');
			//make sure keyboard gets hidden
			emailfield.fieldEl.dom.blur();
		},
		beforedeactivate : function(cmp){
			console.log('deactivate', cmp);
		},
		beforesubmit : function(form, values){
            if (Ext.util.Format.trim(values.email) == '') {
            		console.log('email empty');
            	return false;
            }					
        },
        exception : function(form, result){
            console.log('failure', Ext.toArray(arguments), result);
            this.hideMask();
        }
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                {xtype: 'spacer'},
                {
                    text: 'Reset',
                    itemId: 'resetButton',
                },
                {
                    text: 'Send',
                    ui: 'confirm',
                    itemId: 'submitButton',
                }
            ]
        }
    ],
    
    
});