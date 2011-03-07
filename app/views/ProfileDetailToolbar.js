//define a custom toolbar by extending the object
showtime.ProfileDetailToolbar = Ext.extend(Ext.Toolbar, {
    dock: 'top',
    overlay: true,
    initComponent: function(){
        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
        
        this.backButton = new Ext.Button({
        	//button will appear styled as a back button
            ui: 'back',
            text: 'Back',
            //function called when the button is clicked
            handler: this.onBackButtonTap
        });
        
		this.browseButton = new Ext.Button({
			ui: 'action',
			text: 'Browse',
			handler: this.onBrowseButtonTap,
			scope: this
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
        showtime.ProfilesListToolbar.superclass.initComponent.call(this);       
    },
    
    onBackButtonTap: function() {
    	Ext.dispatch({
            controller: showtime.controllers.profiles,
            action: 'index',
            back: true
        });
    },
    
	onBrowseButtonTap: function() {
		if (!this.popup) {
			this.popup = new Ext.TabPanel({
				cls: 'explore-menu',
				floating: true,
				width: 300,
				height: 660,
				items: [{
					title: 'Student',
					items: [{
						width: 300,
						height: 600,
			            xtype: 'list',
			            store: showtime.stores.profilesList,
			            itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
			            grouped: true,
			            indexBar: true,
			            multiSelect: false,
			            singleSelect: true,
			            allowDeselect: true,
			            itemSelector: 'div.x-list-item',
			            listeners: {
							itemTap: function(selected, index, item, e) {
								Ext.dispatch({
		                            controller: showtime.controllers.profiles,
		                            action: 'view',
		                            profileData: selected.store.data.items[index].data
		                        });
								//hide the browse list
								this.popup.hide();
							},
							scope: this
						}
					}]
				},{
					title: 'Course',
					items: [{
						width: 300,
						height: 600,
			            xtype: 'list',
			            store: showtime.stores.courseList,
			            itemTpl: '<div class="course"><strong>{name}</strong></div>',
			            listeners: {
							itemTap: function(selected, index, item, e) {
								Ext.dispatch({
		                            controller: showtime.controllers.profiles,
		                            action: 'index',
		                            courseData: selected.store.data.items[index].data
		                        });
								//hide the browse list
								this.popup.hide();
								this.backButton.show();
							},
							scope: this
						}
					}]
				}],
				listeners: {
					beforeshow: function(comp) {
						//deselecting any selected items - workaround for bug in Sencha Touch:
						//using fix from: http://www.sencha.com/forum/showthread.php?114896-OPEN-534-List-items-can-no-longer-be-deselected-in-0.99
						studentlist = comp.items.items[0].items.items[0];					
						var selArray = studentlist.getSelectedRecords();
						for (i=0;i<selArray.length;i++) {
						studentlist.deselect(selArray[i]); }
						
						courselist = comp.items.items[1].items.items[0];						
						var selArray = courselist.getSelectedRecords();
						for (i=0;i<selArray.length;i++) {
						courselist.deselect(selArray[i]); }
					}
				}
				
			});
		}		
		showtime.stores.profilesList.clearFilter(true);
		showtime.stores.profilesList.sort('firstName', 'ASC');
		this.popup.showBy(this.browseButton, 'fade');
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
            controller: showtime.controllers.profiles,
            action: 'showBio'
        });
    }
    
});
