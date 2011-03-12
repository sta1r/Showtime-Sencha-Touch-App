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
        
		this.browseButton = new Ext.Button({
			itemId: 'browseButton',
			ui: 'action',
			text: 'Browse',
		});
		
		this.actionButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'action',
			handler: this.onActionButtonTap,
		});
		
		this.userButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'user_list',
			handler: this.onUserButtonTap,
		});
		
		this.refreshButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'refresh',
			listeners: {
				//the following handlers allow to tap and hold for a 'hard' refresh - i.e. reload the browser or just tap to reload the json
				//inspired by http://www.sencha.com/forum/showthread.php?105239-Tap-doubletap-amp-taphold-on-one-component
				// and http://www.sencha.com/forum/showthread.php?105114-Inline-method-for-attaching-dom-events
				//this is necessary otherwise both events can be fired at once (the tap seems to be fired before AND after a taphold)
				el: {
					tap: function(e) { 
						if(this.delayedTask == null && !this.held){            
			                //setup a delayed task that is called IF double click is not later detected
			                this.delayedTask = new Ext.util.DelayedTask(
			                  function(){
			                    //refresh store
			                	this.delayedTask = null;
			                  }, this);  
			                
			                //invoke (with reasonable time to cancel)
			                this.delayedTask.delay(300);
						} 
					},
					taphold: function(e) { 
						//cancel and clear the queued single click tasks if it's there
			            if(this.delayedTask != null){
			              this.delayedTask.cancel();
			              this.delayedTask = null;
			            }                        
			            this.held = true;
			            //handle the taphold
			            window.location.reload();
			        }
				},
				scope: this
			}
		});
        
        //specify what appears on the toolbar: back button, spacer (see Ext.Spacer)
        this.items = [
            this.backButton,
			this.browseButton,
            {xtype: 'spacer'},
            this.actionButton,
			this.userButton
        ];

        //call parent initComponent: because this class is an extended toolbar, the toolbar init needs to be called also:
        Showtime.views.ProfilePanelToolbar.superclass.initComponent.call(this);       
    },
    
    onActionButtonTap: function() {
    	/*Ext.dispatch({
            controller: showtime.controllers.profiles,
            action: 'index',
            back: true
        });*/
    },
    
    onUserButtonTap: function() {
    	Ext.dispatch({
            controller: Showtime.controllers.profiles,
            action: 'showBio'
        });
    }
    
});
Ext.reg('profile-toolbar', Showtime.views.ProfilePanelToolbar);