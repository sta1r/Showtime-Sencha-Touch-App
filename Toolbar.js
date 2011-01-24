//define a custom toolbar by extending the object
Showtime.Toolbar = Ext.extend(Ext.Toolbar, {
	//overlay: true,
    dock: 'top',
	//hidden: 'true',
   
    initComponent: function(){
		//Adds the specified events to the list of events which this Observable may fire.
        this.addEvents('back');
        this.addEvents('profileSelected');
        this.enableBubble('profileSelected');
        this.addEvents('courseSelected');
        this.enableBubble('courseSelected');

        //grab the toolbar object into the variable 'self' so it can be referenced within other objects
        var self = this;

		// begin student list
		Ext.regModel('Student', {
		    fields: ['firstName', 'lastName', 'fullName', 'profileName'],
		    proxy: {
		    	type: 'ajax',
		    	url: '/showtime/lcf/ma/2011/index.json',
		    	reader: {
		    		type: 'json',
		    		root: 'data.Profiles'
		    	}
		    }
		});
		
		Showtime.StudentStore = new Ext.data.Store({
		    model: 'Student',
		    sorters: 'firstName',
		    getGroupString : function(record) {
		        return record.get('firstName')[0];
		    },
		    autoLoad: true
		});
		// end student list
		
		// begin course list
		Ext.regModel('Courses', {
			fields: [
			    'name', 'slug'
			],
			
		    proxy: {
		    	type: 'ajax',
		    	url: '/showtime/lcf/ma/2011/courses.json',
		    	reader: {
		    		type: 'json',
		    		root: 'data.Courses'
		    	}
		    }		
		});
		
		Showtime.CourseStore = new Ext.data.Store({
		    model: 'Courses',
		    sorters: 'name',
		    autoLoad: true
		});
		// end course list
		
		//define some button objects
        this.backButton = new Ext.Button({
        	//button will appear styled as a back button
            ui: 'back',
            text: 'Back',
            hidden: true,
            //function called when the button is clicked
            handler: function() {
        		//fire the back event on the toolbar
                self.fireEvent('back', this);
            }
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
			hidden: true,
			//handler: this.onActionButtonTap,
			handler: function() {
				self.fireEvent('action', this);
				//console.log('Firing info event');
			},
			scope: this
		});
		
		this.infoButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'info',
			hidden: true,
			handler: function() {
				self.fireEvent('info', this);
				//console.log('Firing info event');
			}
		});
		
		this.userButton = new Ext.Button({
			iconMask: true,
			ui: 'plain',
			iconCls: 'user_list',
			hidden: true,
			handler: function() {
				self.fireEvent('user', this);
				//console.log('Firing user event');
			}
		});
        
        //specify what appears on the toolbar: back button, spacer (see Ext.Spacer)
        this.items = [
            this.backButton,
			this.browseButton,
            {xtype: 'spacer'},
			this.actionButton,
			this.infoButton,
			this.userButton
        ];
        //call parent initComponent: because this class is an extended toolbar, the toolbar init needs to be called also:
        Showtime.Toolbar.superclass.initComponent.call(this);       
    },
    
	showToolbar: function() {
		this.show();
		this.doComponentLayout();
	},
	
	hideToolbar: function() {
		this.hide();
		this.doComponentLayout();
	},
	
    showBackButton: function() {
        this.backButton.show();
        //refresh the layout
        this.doComponentLayout();
    },
    
	//function called by ShowHome in MasterPanel - hides back button
    hideBackButton: function() {
        this.backButton.hide();
      //refresh the layout
        this.doComponentLayout();
    },

    showBrowseButton: function() {
        this.browseButton.show();
        //refresh the layout
        this.doComponentLayout();
    },

	//function called by ShowHome in MasterPanel - hides back button
    hideBrowseButton: function() {
        this.browseButton.hide();
      //refresh the layout
        this.doComponentLayout();
    },

	showActionButton: function() {
		this.actionButton.show();
		this.doComponentLayout();
	},
	
	showInfoButton: function() {
		this.infoButton.show();
		this.doComponentLayout();
	},
	
	showUserButton: function() {
		this.userButton.show();
		this.doComponentLayout();
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
			            store: Showtime.StudentStore,
			            itemTpl: '<div class="student"><strong>{firstName}</strong> {lastName}</div>',
			            grouped: true,
			            indexBar: true,
			            multiSelect: false,
			            singleSelect: true,
			            allowDeselect: true,
			            itemSelector: 'div.x-list-item',
			            listeners: {
							itemTap: function(selected, index, item, e) {
								this.fireEvent('profileSelected', selected, selected.store.data.items[index].data);
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
			            store: Showtime.CourseStore,
			            itemTpl: '<div class="course"><strong>{name}</strong></div>',
			            listeners: {
							itemTap: function(selected, index, item, e) {
								this.fireEvent('courseSelected', selected, selected.store.data.items[index].data);
								//hide the browse list
								this.popup.hide();
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
    }/*,
	
	onActionButtonTap: function() {
		if (!this.popup) {
			this.popup = new Ext.Panel({
                floating: true,
                modal: true,
                centered: true,
                width: 300,
				height: 200,
                styleHtmlContent: true,
                html: '<p>Email yourself a link to this profile:</p>' +
				'<input type="text">',
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    title: 'Bookmark'
                }],
                scroll: 'vertical'
            });
		}
		this.popup.showBy(this.actionButton, 'fade');
	}*/
    
});
//add the toolbar to the component registry
Ext.reg('showtime-toolbar', Showtime.Toolbar);
