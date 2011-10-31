/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.regController("Profiles", {
	index: function(options) {
		try{
		// Create loading message
		loading = new Ext.LoadMask(Ext.getBody(), {msg:"Loading..."});
		
		//if explore panel not setup yet, create it:
		if (!this.explorePanel) {
			// Show loading message
			loading.show();
			
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
            
            //load the profile list
            this.loadProfiles();
			
			//load the course list
            Ext.dispatch({
	            controller: 'Courses',
	            action: 'load'
	        });
            
            //load the complete student list for the A-Z
			Showtime.stores.onlineStudentList.load();
            
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
        		//load profiles using course json
        		Showtime.stores.onlineProfiles.proxy.url = 'http://showtime.arts.ac.uk/lcf/2011/'+options.courseData.slug+'.json';
        		Showtime.stores.onlineProfiles.urlChanged = true;
				Showtime.stores.onlineProfiles.data.removeAll();
				Showtime.stores.onlineProfiles.oldPage = Showtime.stores.onlineProfiles.currentPage;
				Showtime.stores.onlineProfiles.currentPage = 1;
				Showtime.stores.onlineProfiles.endReached = false;
        		
        		//load the profile list
            	this.loadProfiles(options.courseData, true);
        		
        		/*Showtime.stores.onlineProfiles.load();
				//filter by course
				Showtime.stores.offlineCourseProfiles.filter('course', options.courseData.name);
				Showtime.stores.offlineCourseProfiles.sort('updated', 'DESC');
				this.explorePanel.loadProfiles(Showtime.stores.offlineCourseProfiles.data.items, options.courseData);*/
				
			} else if (options && options.home) {
				Showtime.stores.offlineProfiles.clearFilter(true);
				Showtime.stores.offlineProfiles.sort('updated', 'DESC');
				Showtime.stores.onlineProfiles.proxy.url = 'http://showtime.arts.ac.uk/lcf/ug/2011.json';
				Showtime.stores.onlineProfiles.endReached = false;
				Showtime.stores.onlineProfiles.currentPage = Showtime.stores.onlineProfiles.oldPage;
				this.explorePanel.loadProfiles(Showtime.stores.offlineProfiles.data.items, false, true);
			}
            
            this.application.viewport.setActiveItem(this.explorePanel, {
                type: 'slide',
                direction: 'right'
            });            
        }
		} catch (ex) {
                if (ex.message && ex.name) {
                    console.log("someMethod caught an exception of type "  + ex.name + ": ", ex.message);
                    console.log(ex);
                } else {
                    console.log("someMethod caught a poorly-typed exception: " + ex);
                }
                console.log(ex.stack);
            }
	},
	//load the profile list using the store (see models/profiles.js)
	loadProfiles: function(courses, init) {	
		var offlineStore;
		if (courses) {
			offlineStore = Showtime.stores.offlineCourseProfiles;
			offlineStore.clearListeners();
		} else {
			offlineStore = Showtime.stores.offlineProfiles;
		}
		
		var profile_controller = this;
		
		//listen for the load method on the offline store:
		offlineStore.addListener('load', function (store, records, success) {
			
			
			//console.log(store, records, success);
			console.log('loading from offline store');
			//send records to view (see views/ExplorePanel.js):
			if (!this.recordcount) {	this.recordcount = 0;	}
			
			if (this.recordcount == this.data.items.length) {
				Showtime.stores.onlineProfiles.endReached = true;
			}

			var reload, therecordData;
			
			recordData = this.data.items.slice(this.recordcount, this.data.items.length);
			if (courses) {
				if (init) {
					console.log('CLEARING FILTER to:'+courses.name);
					this.clearFilter(true);
					this.filter('course', courses.name);
					this.sort('updated', 'DESC');
					init = false;
					reload = true;
					console.log('current store items:');
					recordData = this.data.items;
				} else {
					recordData = this.data.items.slice(this.recordcount, this.data.items.length);
				}
			}
			profile_controller.explorePanel.loadProfiles(recordData, courses, reload);
			reload = false;
			
			//remove un-needed cards:
			//profile_controller.explorePanel.trimCards();
			
			loading.hide();
		});
		
		//tell the store to load using its proxy
		Showtime.stores.onlineProfiles.load();
        
	},

    view: function(options) {
try {
    	if (!this.profilePanel || this.profilePanel.isDestroyed) {
    		this.profilePanel = this.render({
                xtype: 'profile-panel',
                listeners: {
                	body: {
						tap: function(target) {
							if (Ext.get(target.target).is('.video img')) {
								this.profilePanel.overlay.setCentered(true);
								this.profilePanel.overlay.show();
								if (target.target.parentElement.id.substr(0, 3) == 'vm_') {
									Ext.get('player').update('<iframe class="vimeo-player" type="text/html" width="640" height="385" src="js/touch/app/views/blank.html" frameborder="0"></iframe>');
									Ext.get('player').down('iframe').set({src: 'http://player.vimeo.com/video/'+target.target.parentElement.id.substr(3)+'?byline=0&amp;portrait=0&amp;color=ffffff'})
									//Ext.get('player').update('<iframe class="vimeo-player" type="text/html" width="640" height="385" src="http://player.vimeo.com/video/'+target.target.parentElement.id.substr(3)+'?byline=0&amp;portrait=0&amp;color=ffffff" frameborder="0"></iframe>');
								}
								else {
									Ext.get('player').update('<iframe class="youtube-player" type="text/html" width="640" height="385" src="js/touch/app/views/blank.html" frameborder="0"></iframe>');
									Ext.get('player').down('iframe').set({src: 'http://www.youtube.com/embed/'+target.target.parentElement.id.substr(3)})
									//Ext.get('player').update('<iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+target.target.parentElement.id.substr(3)+'" frameborder="0"></iframe>');
								}
								
								
							} else {
				            	if (this.profilePanel.tbar.isVisible()){
				            		this.profilePanel.tbar.hide();
				            		this.profilePanel.bottomSheet.hide();
				            		this.profilePanel.doLayout();
				                } else {
				                	this.profilePanel.tbar.show();              	
				                	this.profilePanel.bottomSheet.show();
				                	this.profilePanel.doLayout();
				                }
				            }
						},
						scope: this
					},
                	//destroy this panel when we go back to the main view to save memory:
	                deactivate: function(profile) {                	
	                    profile.destroy();
	                    Ext.destroy(profile);
	                    Ext.destroy(Ext.get('player'));
	                    Ext.destroy(Ext.get('vidOverlay'));
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
    	
		//put a mask while loading
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
		
		//timeout in case of failure
        setTimeout(function(){
        	var body = Ext.getBody();
        	var msg = body.down('.x-mask-loading');
        	if (msg) {
	        	msg.setHTML('Unable to load');
	        	console.log('did not receive a response in time');
				setTimeout(function(){
					Ext.getBody().unmask();
					//go back to the thumbs list
					profiles.index({home: true});
				}, 2000);
			}
        }, 3000);
		
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
				} 
				//remove the loading indicator
			    Ext.getBody().unmask();
			},
			scope: this
		});
		} catch (ex) {
                if (ex.message && ex.name) {
                    console.log("profile->view method caught an exception of type "  + ex.name + ": ", ex.message);
                    console.log(ex);
                } else {
                    console.log("profile->view caught a poorly-typed exception: " + ex);
                }
                console.log(ex.stack);
            }
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

		Showtime.stores.offlineProfiles.clearFilter(true);
		Showtime.stores.offlineProfiles.sort('firstName', 'ASC');
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
					Ext.Msg.alert('Share this profile by email', 'An email with a link to this profile has been sent');
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