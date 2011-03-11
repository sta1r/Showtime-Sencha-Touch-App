/**
 * @class Showtime.views.ProfilesListToolbar
 * @extends Ext.Toolbar
 * Custom toolbar
 */
Showtime.views.ProfileListToolbar = Ext.extend(Ext.Toolbar, {
//define a custom toolbar by extending the object
//showtime.ProfilesListToolbar = Ext.extend(Ext.Toolbar, {
    dock: 'top',
    initComponent: function(){
        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
        
        this.backButton = new Ext.Button({
        	itemId: 'backButton',
        	//button will appear styled as a back button
            ui: 'back',
            text: 'Back',
            hidden: true
        });
        
		this.browseButton = new Ext.Button({
			itemId: 'browseButton',
			ui: 'action',
			text: 'Browse'
		});
		
		this.infoButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'info',
			handler: this.onInfoButtonTap,
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
			this.refreshButton,
			this.infoButton
        ];

        //call parent initComponent: because this class is an extended toolbar, the toolbar init needs to be called also:
        Showtime.views.ProfileListToolbar.superclass.initComponent.call(this);       
    },
    
    
    onInfoButtonTap: function() {
    	if (!this.infoPanel) {
	    	//panel to display generic about message & credit
			this.infoPanel = new Ext.Panel({
				id: 'info',
				html: '<div id="description">' 
					+ '<h4>Welcome to MA_11</h4>' 
					+ '<p>We are delighted to present a digital showcase of new work from the London College of Fashion Graduate School.</p>'
					+ '<p>Please show your appreciation for this wonderful work by <strong>liking</strong> individual images and <strong>bookmarking</strong> your favourite student profiles. Bookmark links will be emailed to you for later browsing.</p>'
					+ '<p>Designed to be an interactive, portable companion to the physical exhibitions, this app was created from Showtime, a web-based portfolio platform offered to all graduating students at University of the Arts London.</p>'
					+ '<hr>'
					+ '<p>iPad app design and development by Chris Toppon and Alastair Mucklow.</p>'
					+ '<p>Soon to be available on the App Store.</p>'
					+ '</div>',
				floating: true,
				centered: true,
				modal: true,
				hidden: true,
				hideOnMaskTap: true,
				height: 450,
				width: 500,
				styleHtmlContent: true,
	            scroll: 'vertical',
			});
    	} 	
    	this.infoPanel.show('fade');
    },
    
});
Ext.reg('profile-listtoolbar', Showtime.views.ProfileListToolbar);