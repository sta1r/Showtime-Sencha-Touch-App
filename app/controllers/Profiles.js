/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.regController("Profiles", {
	index: function(options) {

		if (!this.explorePanel) {
			//create the panel
            this.explorePanel = this.render({
                xtype: 'explore-panel',
                listeners: {
                	el: {
	        			//listen for a tap on elements with .explore-item class:
	        			delegate: '.explore-item',
	        			scope: this,
		        		tap: function(e, target) {
		        			if (target) {
		        				var carousel = this.explorePanel.carousel;
		        				var carousel_item = carousel.items.items[carousel.getActiveIndex()];
			        			var index = carousel.items.items[carousel.getActiveIndex()].items.indexOf(target);
			        			var data = carousel_item.profileData[index];
                                if (Ext.isObject(data)) {
                                	this.view({profileData: data});
                                }
                            }
		        		}
	        		},
                }
            });
            
            this.loadProfiles();

            Ext.dispatch({
	            controller: 'Courses',
	            action: 'load'
	        });
            
            //listen here for button taps and fire appropriate controller func
			profiles = this;
			
			this.exploreBackButton = this.explorePanel.query('#backButton')[0];
			this.exploreBackButton.on({
            	tap: function() {
            		this.hide();
            		profiles.index({home: true});
            	},
            	//scope: this
            });
            this.browseButton = this.explorePanel.query('#browseButton')[0];
            this.browseButton.on({
            	tap: function() {
            		//create the browse panel
            		profiles.browse(this);
            	},
            });
            
            this.application.viewport.setActiveItem(this.explorePanel);
        }
        else {
        	if (options && options.courseData) {
				//filter by course			
				Showtime.stores.profiles.filter('course', options.courseData.name);
				Showtime.stores.profiles.sort('updated', 'DESC');
				this.explorePanel.loadProfiles(Showtime.stores.profiles.data.items, options.courseData);
			} else if (options && options.home) {
				Showtime.stores.profiles.clearFilter(true);
				Showtime.stores.profiles.sort('updated', 'DESC');
				this.explorePanel.loadProfiles(Showtime.stores.profiles.data.items);
			}
            
            this.application.viewport.setActiveItem(this.explorePanel, {
                type: 'slide',
                direction: 'right'
            });            
        }
		
	},

	loadProfiles: function() {	
		//tell the store to load from its proxy
        Showtime.stores.profiles.load({
		    scope   : this,
		    callback: function(records, operation, success) {
				//handle timeout here? and/or success/failure
				Ext.each(records, function(record){
					//remove all non-numeric characters to reduce date/time into sortable number
					record.data.updated = record.data.updated.replace(/[^\d]/g, "");
				});
				//now we can sort by updated date/time
				Showtime.stores.profiles.sort('updated', 'DESC');
				//send records to view:
				this.explorePanel.loadProfiles(records);
		    }
		});			
		
	},

    view: function(options) {

    	if (!this.profilePanel || this.profilePanel.isDestroyed) {
    		this.profilePanel = this.render({
                xtype: 'profile-panel',
                listeners: {
                	body: {
						tap: function() { 						
			            	if (this.profilePanel.tbar.isVisible()){
			            		this.profilePanel.tbar.hide();
			            		this.profilePanel.bottomSheet.hide();
			            		this.profilePanel.doLayout();
			                } else {
			                	this.profilePanel.tbar.show();              	
			                	this.profilePanel.bottomSheet.show();
			                	this.profilePanel.doLayout();
			                }
						},
						scope: this
					},
                	//destroy this panel when we go back to the main view to save memory:
	                deactivate: function(profile) {
	                    profile.destroy();
	                    //console.log('destroying panel');
	                },
	                scope: this
	            }
            });
    		
    		//add listeners for profilePanel buttons            
            this.profileBackButton = this.profilePanel.query('#backButton')[0];
    		this.profileBackButton.on({
            	tap: function() {
            		profiles.index()
            	}
            });
            this.profileBrowseButton = this.profilePanel.query('#browseButton')[0];
            this.profileBrowseButton.on({
            	tap: function() {
            		profiles.browse(this)
            	}
            });
            this.profilePanel.query('#actionButton')[0].on({
            	tap: function() {
            		this.bookmark()
            	},
            	scope: this
            });
            this.profilePanel.query('#userButton')[0].on({
            	tap: function() {
            		this.user()
            	},
            	scope: this
            });
    	}
    	
		//load profile
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
		
		//it is not possible in sencha to use a store / model proxy to read a single json record so:
		Ext.util.JSONP.request({
        	url: 'http://showtime.arts.ac.uk/'+options.profileData.profileName+'.json',
            callbackKey: 'callback',
            callback: function(result) {
				if (result.data.Student) {
					
			 		this.profilePanel.loadProfile(result.data.Student, options.profileData);
			 		this.application.viewport.setActiveItem(
			            this.profilePanel, options.animation
			        );
			 		//remove the loading indicator
			        Ext.getBody().unmask();
				}
			},
			scope: this
		});
    },

    browse: function(button) {
    	if (!this.browsePopup) {
    		this.browsePopup = new Showtime.views.BrowsePopup();
    		
    		//add listeners for taps on list items
    		this.browsePopup.query('#StudentList')[0].on({
    			itemTap: function(selected, index, item, e) {
	                this.view({profileData: selected.store.data.items[index].data});
					//hide the browse list
					this.browsePopup.hide();
				},
				scope: this
    		});
    		this.browsePopup.query('#CourseList')[0].on({
    			itemTap: function(selected, index, item, e) {
	    			this.index({courseData: selected.store.data.items[index].data})
					//hide the browse list
					this.browsePopup.hide();
					this.exploreBackButton.show();
				},
				scope: this
    		});
		}
		Showtime.stores.profiles.clearFilter(true);
		Showtime.stores.profiles.sort('firstName', 'ASC');
		this.browsePopup.showBy(button, 'fade');
    },
    
    bookmark: function(options) {
    	if (!this.bookmarkForm) {
    		this.bookmarkForm = new Showtime.views.BookmarkFormPanel();   		
    		this.bookmarkForm.on({
    			beforesubmit : function(form, values, options){
					options.waitMsg = {message:'Submitting', cls : 'loading'};
				},
		        submit : function(form, result){
					console.log(form, result);
					form.hide('fade');
					form.reset();
		        }
    		});
    		
    		this.bookmarkForm.query('#submitButton')[0].on({
    			tap: function(){
    				this.bookmarkForm.submit();
    			},
    			scope: this
    		});
    		this.bookmarkForm.query('#resetButton')[0].on({
    			tap: function(){
    				this.bookmarkForm.reset();
    			},
    			scope: this
    		});
    		
    		//populate the form's hidden fields with the model instance profilepanel.student
    		this.bookmarkForm.load(profilepanel.student);	
    	}
        this.bookmarkForm.show();
    },
    
    user: function(options) {
    	this.profilePanel.showDesc();
    }
    
});