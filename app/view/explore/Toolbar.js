/**
 * @class Showtime.view.explore.Toolbar
 * @extends Ext.Toolbar
 * Custom toolbar
 */
Ext.define('Showtime.view.explore.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'explore-toolbar',
    config: {
        docked: 'top',
        items: [
            {
                xtype: 'button',
                id: 'backButton',
                //button will appear styled as a back button
                ui: 'back',
                text: 'Back',
                hidden: true
            },
            {
                xtype: 'button',
                id: 'studentsButton',
                ui: 'action',
                text: 'Students'
            },
            {
                xtype: 'button',
                id: 'coursesButton',
                ui: 'action',
                text: 'Courses'
            },
            {
                id: 'toolbarLoad',
                ui: 'plain',
                iconCls: 'toolbarLoader'
            },
            {
                xtype: 'spacer',
                flex: 1
            },
            {
                iconMask: true,
                id: 'infoButton',
                ui: 'plain',
                iconCls: 'info'
            }
        ],
        listeners: {
            deactivate: function() {
                console.log('destry');
                this.removeAll(true);
            }
        }
    },
    initialize: function(){
        this.callParent();
        Ext.ComponentQuery.query('#toolbarLoad')[0].hide();

        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
		
		/*this.refreshButton = new Ext.Button({
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
		});*/
    }
});