/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.define("Showtime.controller.Profiles", {
    extend: 'Ext.app.Controller',
    config: {
        routes: {},
        refs: {
            mainView: 'main-view',
            explorePanel: 'explore-panel',
            exploreItem: '.explore-item',
            backButton: '#backButton',
            studentsButton: '#studentsButton',
            coursesButton: '#coursesButton'
        },
        control: {
            exploreItem: {
                tap: function(e, target) {
                    console.log('tap tap');
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
            backButton: {
                tap: function() {
                    //this.hide();
                    this.index({home: true});
                }
            },
            studentsButton: {
                tap: function() {
                    console.log('tap tap');
                    //create the students list popup panel
                    this.studentsList(this);
                }
            },
            coursesButton: {
                tap: function() {
                    console.log('tap tap');
                    //create the courses list popup panel
                    this.coursesList(this);
                }
            }
        }
    },

    launch: function() {
        this.index();
    },

	index: function(options) {
        // Create loading message
        loading = new Ext.LoadMask(Ext.getBody(), {msg:"Loading..."});

        //if explore panel not setup yet, create it:
        if (!this.explorePanel) {
            // Show loading message
            loading.show();

			//create the panel
            this.explorePanel = Ext.create('Showtime.view.explore.ExplorePanel');

            //load the profile list
            console.log('trying loading profiles');
            this.loadProfiles();
            console.log('done loading profiles');

            //load the complete student list for the A-Z
            Ext.getStore('onlineStudent').load();

            //Showtime.view.Main.setActiveItem(this.explorePanel);
            //add the panel to the main view container
            //Showtime.view.Main.add(this.explorePanel);
            Showtime.view.Main.setActiveItem(this.explorePanel);

        }
        else {
        	if (options && options.courseData) {
        		//load profiles using course json
                var onlineProfileStore = Ext.getStore('onlineProfile');
                onlineProfileStore.proxy.url = 'http://showtime.arts.ac.uk/lcf/2012/'+options.courseData.slug+'.json';
                onlineProfileStore.urlChanged = true;
                onlineProfileStore.data.removeAll();
                onlineProfileStore.oldPage = onlineProfileStore.currentPage;
                onlineProfileStore.currentPage = 1;
                onlineProfileStore.endReached = false;

        		//load the profile list
            	this.loadProfiles(options.courseData, true);

			} else if (options && options.home) {
                var offlineProfileStore = Ext.getStore('offlineProfile');
                offlineProfileStore.clearFilter(true);
                offlineProfileStore.sort('updated', 'DESC');
                onlineProfileStore.proxy.url = 'http://showtime.arts.ac.uk/lcf/ma/2012.json';
                onlineProfileStore.endReached = false;
                onlineProfileStore.currentPage = onlineProfileStore.oldPage;
				this.explorePanel.loadProfiles(offlineProfileStore.data.items, false, true);
			}

            Showtime.view.Main.setActiveItem(this.explorePanel, {
                type: 'slide',
                direction: 'right'
            });
        }
	},
	//load the profile list using the store (see models/profiles.js)
	loadProfiles: function(courses, init) {
        console.log('controller:Profiles:loadProfiles: Loading profiles');
		var offlineStore;
		if (courses) {
			offlineStore = Ext.getStore('offlineCourseProfile');
			offlineStore.clearListeners();
		} else {
			offlineStore = Ext.getStore('offlineProfile');
		}

		var profile_controller = this;

		//listen for the load method on the offline store:
		offlineStore.addListener('refresh', function (store, data, eOpts) {
			console.log('controller:Profiles > store:Profile:offline: Loading from offline store');
			//send records to view (see view/ExplorePanel.js):
			if (!this.recordcount) {	this.recordcount = 0;	}

			if (this.recordcount == data.items.length) {
                Ext.getStore('onlineProfile').endReached = true;
			}
            console.log('controller:Profiles > store:Profile:offline: recordcount:'+this.recordcount);
            console.log('controller:Profiles > store:Profile:offline: data:'+data.items.length);
			var reload, therecordData;

			recordData = data.items.slice(this.recordcount, data.items.length);
			if (courses) {
				if (init) {
					console.log('controller:Profiles > store:Profiles:offline: Clearing filter to:'+courses.name);
					this.clearFilter(true);
					this.filter('course', courses.name);
					this.sort('updated', 'DESC');
					init = false;
					reload = true;
					console.log('controller:Profiles > store:Profiles:offline: Current store items:');
					recordData = data.items;
				} else {
					recordData = data.items.slice(this.recordcount, data.items.length);
				}
			}
            console.log('controller:Profiles:loadProfiles: Applying profile data to the explore Panel');
			profile_controller.explorePanel.loadProfiles(recordData, courses, reload);
			reload = false;

			//remove un-needed cards:
			//profile_controller.explorePanel.trimCards();

			loading.hide();
		});

		//tell the store to load using its proxy
        Ext.getStore('onlineProfile').load();

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
									//Ext.get('player').update('<iframe class="vimeo-player" type="text/html" width="640" height="385" src="js/touch/app/view/blank.html" frameborder="0"></iframe>');
									//Ext.get('player').down('iframe').set({src: 'http://player.vimeo.com/video/'+target.target.parentElement.id.substr(3)+'?byline=0&amp;portrait=0&amp;color=ffffff'})
									Ext.get('player').update('<iframe class="vimeo-player" type="text/html" width="640" height="385" src="http://player.vimeo.com/video/'+target.target.parentElement.id.substr(3)+'?byline=0&amp;portrait=0&amp;color=ffffff" frameborder="0"></iframe>');
								}
								else {
									//Ext.get('player').update('<iframe class="youtube-player" type="text/html" width="640" height="385" src="js/touch/app/view/blank.html" frameborder="0"></iframe>');
									//Ext.get('player').down('iframe').set({src: 'http://www.youtube.com/embed/'+target.target.parentElement.id.substr(3)})
                                            Ext.get('player').update('<iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+target.target.parentElement.id.substr(3)+'" frameborder="0"></iframe>');
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
            this.profilePanel.query('#backButton')[0].on({
            	tap: function() {
            		profiles.index()
            	}
            });
            this.profilePanel.query('#studentsButton')[0].on({
            	tap: function() {
            		//create the students list popup panel
            		profiles.studentsList(this);
            	},
            });
            this.profilePanel.query('#coursesButton')[0].on({
            	tap: function() {
            		//create the courses list popup panel
            		profiles.coursesList(this);
            	},
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
                    Showtime.view.Main.setActiveItem(
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

    studentsList: function(button) {
    	if (!this.studentsListPopup) {
    		this.studentsListPopup = new Showtime.view.StudentsListPopup();

    		//add listeners for taps on list items
    		Ext.ComponentQuery.query('#StudentList')[0].on({
    			itemTap: function(selected, index, item, e) {
	                this.view({profileData: selected.store.data.items[index].data});
					//hide the studentsListPopup
					this.studentsListPopup.hide();
				},
				scope: this
    		});
		}

		Showtime.stores.offlineProfiles.clearFilter(true);
		Showtime.stores.offlineProfiles.sort('firstName', 'ASC');
		this.studentsListPopup.showBy(button, 'fade');
    },

    coursesList: function(button) {
    	if (!this.coursesListPopup) {
    		this.coursesListPopup = new Showtime.view.CoursesListPopup();

    		//add listeners for taps on list items
    		Ext.ComponentQuery.query('#CourseList')[0].on({
    			itemTap: function(selected, index, item, e) {
	    			this.index({courseData: selected.store.data.items[index].data})
					//hide the coursesListPopup
					this.coursesListPopup.hide();
					this.exploreBackButton.show();
				},
				scope: this
    		});
		}

		Showtime.stores.offlineProfiles.clearFilter(true);
		Showtime.stores.offlineProfiles.sort('firstName', 'ASC');
		this.coursesListPopup.showBy(button, 'fade');
    },

    bookmark: function(options) {
    	if (!this.bookmarkForm) {
    		this.bookmarkForm = new Showtime.view.BookmarkFormPanel();
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