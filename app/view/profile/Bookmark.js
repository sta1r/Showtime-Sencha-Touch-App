/**
 * @class Showtime.views.BookmarkFormPanel
 * @extends Ext.Panel
 * 
 */
Ext.define('Showtime.view.profile.Bookmark', {
    extend: 'Ext.ux.form.JSONPFormPanel',
    requires: 'Ext.ux.form.JSONPFormPanel',
    //extend: 'Ext.form.Panel',
    id: 'bookmark-panel',
    config: {
        id: 'bookmark-form',
        scroll: 'vertical',
        url   : 'http://showtime.arts.ac.uk/lcf/sendprofile/',
        standardSubmit : false,
        //timeout: 4000,
        cls: 'emailForm',
        modal: true,
        hideOnMaskTap: true,
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
                        clearIcon: true
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
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {xtype: 'spacer'},
                    {
                        text: 'Reset',
                        itemId: 'resetButton'
                    },
                    {
                        text: 'Send',
                        ui: 'confirm',
                        itemId: 'submitButton'
                    }
                ]
            }
        ],
        listeners : {
            show: function(bookmarkForm) {
                var emailField = Ext.ComponentQuery.query('#bookmarkemail')[0];
                emailField.on('keyup', function(field, e){
                    //what's all this about? at the time of writing, pressing the Go button on the ipad keyboard has no
                    //effect - it won't submit the form. So a listener is needed to detect the return key (13)
                    //then submit manually...
                    if (e.browserEvent.keyCode == 13) {
                        console.log('submitting form');
                        bookmarkForm.submit();
                    }
                });
            },
            submit: function(options) {
                if (Ext.util.Format.trim(this.getValues().email) == '') {
                    console.log('email empty');
                    return false;
                } else {
                    this.hide();
                    Ext.Msg.alert('Share this profile by email', 'An email with a link to this profile has been sent to '+this.getValues().email);
                }
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments), result);
                this.setMask(false);
            }
        }
    }
    
});