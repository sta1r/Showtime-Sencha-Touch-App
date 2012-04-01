/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.define("Showtime.controller.Profiles", {
    extend: 'Ext.app.Controller',
    requires: ['Showtime.view.popup.CourseList', 'Showtime.view.popup.StudentList', 'Showtime.view.profile.Bookmark'],
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
            timeout: 4000,
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
                tap: function(target) {

                },
                //destroy this panel when we go back to the main view to save memory:
                deactivate: function(profile) {
                    profile.destroy();
                    Ext.destroy(profile);
                    Ext.destroy(Ext.get('player'));
                    Ext.destroy(Ext.get('vidOverlay'));
                },
                scope: this,
                delegate: 'profile-carousel'
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
                tap: function(button) {
                    this.bookmark(button);
                }
            }
        });
        this.control({
            '#actionButon': {
                tap: function(button) {
                    this.bookmark(button);
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
        this.control({
            '#likeButton': {
                tap: function(button) {
                    this.sendLike(button);
                }
            }
        });
    },


    bookmark: function(button) {
    	if (this.bookmarkForm) {
            this.bookmarkForm.removeAll(true);
            this.bookmarkForm.destroy();
        }
        this.bookmarkForm = Ext.create('Showtime.view.profile.Bookmark');

        this.bookmarkForm.on({
            beforesubmit : function(form, values, options){
                options.waitMsg = {message:'Submitting', cls : 'loading'};
            },
            submit : function(form, result){
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
        this.bookmarkForm.setRecord(Ext.ComponentQuery.query('#profile-panel')[0].student);

        this.bookmarkForm.showBy(button);
    },

    displayDescription: function(button) {
    	this.profilePanel.showDesc(button);
    },

    sendLike: function(button) {
        var bottomToolbar = Ext.ComponentQuery.query('#bottom-toolbar')[0];

        this.profilePanel.mask({
            xtype: 'loadmask',
            message: 'Liking'
        });

        Ext.Ajax.request({
            url:'http://showtime.arts.ac.uk/media/like/' + bottomToolbar.data.id,
            timeout: 3000,
            scope: this,
            success: function(response) {
                console.log('liked media id=' + bottomToolbar.data.id);
                try {
                    var obj = Ext.decode(response.responseText);
                } catch (ex){
                    if (ex.message && ex.name) {
                        console.log("sendLike caught an exception of type "  + ex.name + ": ", ex.message);
                        //console.log(ex);
                    } else {
                        console.log("sendLike caught a poorly-typed exception: " + ex);
                    }
                    console.log(ex.stack);
                }
                if (obj && obj.success == true) {
                    // like saved successfully
                    var likeTerm = obj.likes == 1 ? 'like' : 'likes';
                    // modal to display like count to user
                    this.likeModal = Ext.create('Ext.Panel', {
                        id:'likeModal',
                        centered: true,
                        hidden: true,
                        modal: true,
                        hideOnMaskTap: true,
                        height:80,
                        width:180,
                        html: obj.likes + ' ' + likeTerm + '!'
                    });
                    likeModal = this.likeModal;
                    likeModal.on('hide', function () {
                        likeModal.destroy();
                    });
                    this.profilePanel.add(likeModal);

                    Ext.ComponentQuery.query('#profile-panel')[0].unmask();
                    likeModal.show('pop');
                    //hide modal after a second
                    setTimeout(function () {
                        likeModal.hide();
                    }, 1000);
                } else {
                    //failed to like
                    console.log('like failed');
                    this.likeFailure();
                }
            },
            failure: this.likeFailure
        });
    },

    likeFailure: function(response) {
        if (response && response.status) { console.log('server-side failure with status code ' + response.status); }
        var loader = Ext.ComponentQuery.query('loadmask')[0];
        if (loader) {
            loader.setIndicator(false);
            loader.setMessage('Unable to like');
            console.log('error liking media');
        }
        //wait two seconds then hide modal:
        setTimeout(function () {
            Ext.ComponentQuery.query('#profile-panel')[0].unmask();
        }, 1200);
    }

});