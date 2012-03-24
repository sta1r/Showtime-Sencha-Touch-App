/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.define("Showtime.controller.Profiles", {
    extend: 'Ext.app.Controller',
    requires: ['Showtime.view.popup.CourseList', 'Showtime.view.popup.StudentList'],
    config: {
        masked: {
            xtype: 'loadmask',
            message: 'Loading'
        }
    },

    init: function() {
        //listen for the fetchProfile event
        this.getApplication().on({
            fetchProfile: this.fetchProfile,
            scope: this
        });
    },

    fetchProfile: function(data) {
        var date1 = new Date();
//        console.log('fetchprofile: 0');

        //setup explorePanel
        this.setupProfilePanel();
        this.attachListeners();

        var date2 = new Date();
//        console.log('fetchprofile: '+(date2.getTime() - date1.getTime())+' ms (+'+(date2.getTime() - date1.getTime())+'ms)');

        var date3 = new Date();
 //       console.log('fetchprofile: '+(date3.getTime() - date2.getTime())+' ms (+'+(date3.getTime() - date1.getTime())+'ms)');
        //put a mask on while loading
        //this.profilePanel.setMasked(true);

        //it is not possible in sencha to use a store / model proxy to read a single json record so:
        Ext.data.JsonP.request({
            url: 'http://showtime.arts.ac.uk/'+data.profileData.profileName+'.json',
            callbackKey: 'callback',
            timeout: 2000,
            callback: function(success, response) {
                if (success) {
                    if (response.data.Student) {
                        this.profilePanel.loadProfile(response.data.Student, data.profileData);
                    }
                } else {
                    console.log('error loading profile');
                    console.log('did not receive a response in time');
                    //profiles.index({home: true});
                    //need to go back to the explore view...
                    this.getApplication().viewport.setActiveItem(0);
                }
                //remove the loading indicator
                //this.profilePanel.setMasked(false);
            },
            scope: this
        });
    },

    setupProfilePanel: function() {

        viewport = this.getApplication().viewport;
        if (this.profilePanel) {
            console.log('recreating - destroying shit');
            viewport.remove(this.profilePanel);
            this.profilePanel.removeAll(true);
            this.profilePanel.destroy();
        }
        //always happens even if wasn't properly destroyed
        this.profilePanel = Ext.create('Showtime.view.profile.ProfilePanel', {
            xtype: 'profile-panel',
            listeners: {
                body: {
                    tap: function(target) {
                        console.log('tapped');
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

        //Explicitly attach the listeners for the buttons as they are lost when profile panel is destroyed
        Ext.ComponentQuery.query('#profileStudentsButton')[0].on({
            tap: function(button) {
                this.getApplication().fireEvent('profileStudentsButtonTap', button);
            },
            scope: this
        });
        Ext.ComponentQuery.query('#profileCoursesButton')[0].on({
            tap: function(button) {
                this.getApplication().fireEvent('profileCoursesButtonTap', button);
            },
            scope: this
        });
 //       console.log('created profile panel');
        //open the profile in the viewport

        this.profilePanel.hide();
        viewport.add(this.profilePanel);
        viewport.setActiveItem(1);
        this.profilePanel.show();
    },

    attachListeners: function(){
        /* Not these listeners are forcibly re-attached due to them being automatically removed when the panel is destroyed
        * between transitions of the explore/profile panels... otherwise they would be defined in the ref/config
        * of the controller :( */
        this.control({
            '#profileBackButton': {
                tap: function() {
                    this.getApplication().viewport.setActiveItem(0);
                }
            }
        });

        this.control({
            '#actionButton': {
                tap: function() {
                    this.bookmark();
                }
            }
        });
        this.control({
            '#descButton': {
                tap: function(button) {
                    this.displayDescription(button);
                }
            }
        });
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

    displayDescription: function(button) {
    	this.profilePanel.showDesc(button);
    }

});