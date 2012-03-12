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
                itemId: 'backButton',
                //button will appear styled as a back button
                ui: 'back',
                text: 'Back',
                hidden: true
            },
            {
                xtype: 'button',
                itemId: 'studentsButton',
                ui: 'action',
                text: 'Students'
            },
            {
                xtype: 'button',
                itemId: 'coursesButton',
                ui: 'action',
                text: 'Courses'
            },
            {   xtype: 'spacer',
                flex: 1},
            {
                iconMask: true,
                ui: 'plain',
                iconCls: 'info',
                handler: this.onInfoButtonTap
            }
        ]
    },
    initialize: function(){
        this.callParent();

        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
        
        /*this.backButton = Ext.create('Ext.Button', {
            config: {
                itemId: 'backButton',
                //button will appear styled as a back button
                ui: 'back',
                text: 'Back',
                hidden: true
            }
        });
        
		this.studentsButton = Ext.create('Ext.Button', {
            config: {
                itemId: 'studentsButton',
                ui: 'action',
                text: 'Students'
            }
		});
		
		this.coursesButton = Ext.create('Ext.Button', {
            config: {
                itemId: 'coursesButton',
                ui: 'action',
                text: 'Courses'
            }
		});
		
		this.infoButton = Ext.create('Ext.Button', {
            config: {
                iconMask: true,
                ui: 'plain',
                iconCls: 'info',
                handler: this.onInfoButtonTap
            }
		});*/
		
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
        
        //specify what appears on the toolbar: back button, spacer (see Ext.Spacer)
        /*this.add([
            this.backButton,
			this.studentsButton,
			this.coursesButton,
            {xtype: 'spacer', flex: 1},
			//this.refreshButton,
			this.infoButton
        ]);*/
    },
    
    
    onInfoButtonTap: function() {
    	if (!this.infoPanel) {
	    	//panel to display generic about message & credit
			this.infoPanel = new Ext.Panel({
				id: 'info',
				html: '<div id="description">' 
					+ '<h4>Welcome to London College of Fashion MA_12.</h4>' 
					+ '<p>We are delighted to present a digital showcase of the most creative and innovative new work from the MA Graduate Season 2012.</p>'
					+ '<p>Please show your appreciation for these future fashion stars by <strong>liking</strong> individual images and <strong>sharing</strong> your favourite student profiles. Bookmark links will be emailed to you for later browsing.</p>'
					+ '<p>Designed to be an interactive, portable companion to the physical exhibitions, this app was created from Showtime, a web-based portfolio platform offered to all graduating students at University of the Arts London.</p>'
					+ '<hr>'
					+ '<p>iPad app design and development by Chris Toppon and Alastair Mucklow.</p>'
					+ '</div>',
				floating: true,
				centered: true,
				modal: true,
				hidden: true,
				hideOnMaskTap: true,
				height: 450,
				width: 500,
				styleHtmlContent: true,
	            scroll: 'vertical'
			});
    	}
    	this.infoPanel.show('fade');
    }
});