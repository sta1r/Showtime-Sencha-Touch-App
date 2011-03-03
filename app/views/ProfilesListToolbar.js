//define a custom toolbar by extending the object
showtime.ProfilesListToolbar = Ext.extend(Ext.Toolbar, {
    dock: 'top',
    hidden: true,
    initComponent: function(){
        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;
        
        //load course info
        Ext.dispatch({
            controller: showtime.controllers.courses,
            action: 'list'
        });
        
        this.backButton = new Ext.Button({
        	//button will appear styled as a back button
            ui: 'back',
            text: 'Back',
            hidden: true,
            //function called when the button is clicked
            handler: this.onBackButtonTap
        });
        
		this.browseButton = new Ext.Button({
			ui: 'action',
			text: 'Browse',
			handler: this.onBrowseButtonTap,
			scope: this
		});
		
		this.infoButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'info',
			handler: function() {
				self.fireEvent('info', this);
				//console.log('Firing info event');
			}
		});
		
		this.refreshButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'refresh',
			handler: function() {
				self.fireEvent('refresh', this);
				//console.log('Firing info event');
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
        showtime.ProfilesListToolbar.superclass.initComponent.call(this);       
    },
    
    onBackButtonTap: function() {
    	this.hide();
    	Ext.dispatch({
            controller: showtime.controllers.profiles,
            action: 'index',
            back: true
        });
    },
    
	onBrowseButtonTap: function() {
		if (!this.popup) {
			showtime.stores.profilesList.sort('firstName');
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
		this.popup.showBy(this.browseButton, 'fade');
    }
    
});
