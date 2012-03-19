/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.define("Showtime.controller.Explore", {
    extend: 'Ext.app.Controller',
    requires: ['Showtime.view.PopupStudentList'],
    config: {
        refs: {
            exploreItem: '.explore-card',
            backButton: '#backButton',
            studentsButton: '#studentsButton',
            coursesButton: '#coursesButton'
        },
        control: {
            exploreItem: {
                tap: function (component, event, target) {;
                    var tileElement = event.getTarget('.explore-item');
                    if (tileElement) {
                        var carousel = this.explorePanel.carousel;
                        var carouselCard = carousel.innerItems[carousel.getActiveIndex()];
                        var index = carouselCard.items.indexOf(tileElement);
                        var data = carouselCard.getProfileData()[index];
                        if (Ext.isObject(data)) {
                            //this.view({profileData: data});
                            console.log('firing fetchProfile event');
                            this.getApplication().fireEvent('fetchProfile', {profileData: data});
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
                tap: function(e) {
                    console.log('tap tap');
                    //create the students list popup panel
                    this.studentsList(this);
                }
            },
            coursesButton: {
                tap: function(e) {
                    console.log('tap tap');
                    //create the courses list popup panel
                    this.coursesList(this);
                }
            }
        },
        masked: {
            xtype: 'loadmask',
            message: 'Loading'
        }
    },

    launch: function() {
        this.index();
    },

    index: function(options) {
        //if explore panel not setup yet, create it:
        if (!this.explorePanel) {
            //create the panel

            this.explorePanel = Ext.create('Showtime.view.explore.ExplorePanel');

            //load the profile list
            console.log('trying loading profiles');
            this.loadProfiles();

            //load the complete student list for the A-Z
            Ext.getStore('onlineStudent').load();

            viewport = this.getApplication().viewport;
            viewport.add(this.explorePanel);
            viewport.setActiveItem(0);
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
        console.log('controller:ExploreItems:loadProfiles: Loading profiles');
        var offlineStore;
        if (courses) {
            offlineStore = Ext.getStore('offlineCourseProfile');
            offlineStore.clearListeners();
        } else {
            offlineStore = Ext.getStore('offlineProfile');
        }

        var profile_controller = this;

        //listen for the refresh (load) method on the offline store:
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

            profile_controller.explorePanel.setMasked(false);
            console.log('done loading profiles');
        });

        //tell the store to load using its proxy
        this.explorePanel.setMasked(true);
        Ext.getStore('onlineProfile').load();

    },

    studentsList: function(button) {
        if (!this.studentsListPopup) {
            this.studentsListPopup = Ext.create('Showtime.view.PopupStudentList');

            //add listeners for taps on list items
            /*Ext.ComponentQuery.query('#StudentList')[0].on({
             itemTap: function(selected, index, item, e) {
             this.view({profileData: selected.store.data.items[index].data});
             //hide the studentsListPopup
             this.studentsListPopup.hide();
             },
             scope: this
             });*/
        }
        offlineStore = Ext.getStore('offlineProfile');
        offlineStore.clearFilter(true);
        offlineStore.sort('firstName', 'ASC');
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