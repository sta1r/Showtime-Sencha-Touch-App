/**
 * @class Profiles
 * @extends Ext.Controller
 * The Profiles controller
 */
Ext.define("Showtime.controller.Explore", {
    extend: 'Ext.app.Controller',
    requires: ['Showtime.view.explore.ExplorePanel', 'Showtime.view.popup.CourseList', 'Showtime.view.popup.StudentList', 'Showtime.store.CourseProfileStore'],
    config: {
        refs: {
            exploreItem: '.explore-card',
            backButton: '#backButton',
            studentsButton: '#studentsButton',
            coursesButton: '#coursesButton',
            infoButton: '#infoButton',
            profileStudentsButton: '#profileStudentsButton',
            profileCoursesButton: '#profileCoursesButton'
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
                tap: function(button) {
                    button.hide();
                    this.index({home: true});
                }
            },
            studentsButton: {
                tap: function(button, event, eOpts) {
                    //show/hide the students list popup panel
                    this.studentsList(button);
                }
            },
            coursesButton: {
                tap: function(button, event, eOpts) {
                    //create the courses list popup panel
                    this.coursesList(button);
                }
            },
            infoButton: {
                tap: function(button) {
                    this.displayInfo(button);
                }
            },
            profileStudentsButton: {
                tap: function(button, event, eOpts) {
                    //create the courses list popup panel
                    this.studentsList(button);
                }
            },
            profileCoursesButton: {
                tap: function(button, event, eOpts) {
                    //create the courses list popup panel
                    this.coursesList(button);
                }
            }
        },
        masked: {
            xtype: 'loadmask',
            message: 'Loading'
        }
    },
    init: function() {
        //listen for the global button tap events from the profile toolbar
        this.getApplication().on({
            profileStudentsButtonTap: this.studentsList,
            scope: this
        });
        this.getApplication().on({
            profileCoursesButtonTap: this.coursesList,
            scope: this
        });
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
            this.loadProfiles();

            viewport = this.getApplication().viewport;
            viewport.add(this.explorePanel);
            viewport.setActiveItem(0);
        }
        else {
            viewport = this.getApplication().viewport;
            viewport.setActiveItem(0);
            if (options && options.courseData) {
                //load the profile list
                this.loadProfiles(options.courseData);

            } else if (options && options.home) {
                this.loadProfiles();
            }
        }
    },

    //TODO - check this works - destroying cached store..
    loadProfiles: function(courses) {
        var profileStore;
        if (courses) {
            profileStore = Ext.getStore('courseProfiles');
            if (profileStore) {
                profileStore.removeAll(true); //clear out the existing data
                profileStore.destroy();       //kill the current store
            }
            profileStore = Ext.create('Showtime.store.CourseProfileStore', {
                proxy: {
                    url: 'http://showtime.arts.ac.uk/lcf/2012/'+courses.slug+'.json'
                }
            });
        } else {
            profileStore = Ext.getStore('onlineProfile');
        }

        var explore_controller = this;

        profileStore.addListener('load', function (store, records, success, operation, eOpts) {
            recordData = records.slice(this.recordcount, records.length);
            explore_controller.explorePanel.loadProfiles(recordData, courses);
            Ext.ComponentQuery.query('#explore-carousel')[0].show();
            explore_controller.explorePanel.unmask();   //finished loading
        });

        Ext.ComponentQuery.query('#explore-panel')[0].mask({
            xtype: 'loadmask',
            message: 'Loading profiles'
        });
        exploreCarousel = Ext.ComponentQuery.query('#explore-carousel')[0];
        if (exploreCarousel) {exploreCarousel.hide();}

        profileStore.load();
    },

    studentsList: function(button) {
        if (!this.studentsListPopup) {
            this.studentsListPopup = Ext.create('Showtime.view.popup.StudentList');

            //add listeners for taps on list items
            Ext.ComponentQuery.query('#studentList')[0].on({
                itemtap: function(list, index, target, record, e) {
                    //fire custom event to be picked up by profile controller...
                    this.getApplication().fireEvent('fetchProfile', {profileData: record.data});
                    //hide the studentsListPopup
                    this.studentsListPopup.hide();

                },
            scope: this
            });
        }
        this.studentsListPopup.showBy(button);
    },

    coursesList: function(button) {
        if (!this.coursesListPopup) {
            this.coursesListPopup = Ext.create('Showtime.view.popup.CourseList');

            //add listeners for taps on list items
            Ext.ComponentQuery.query('#courseList')[0].on({
                itemtap: function(list, index, target, record, e) {
                    //fire custom event to be picked up by profile controller...
                    this.index({courseData: record.data})
                    //hide the coursesListPopup
                    this.coursesListPopup.hide();
                },
                scope: this
            });
        }
        //Showtime.stores.offlineProfiles.clearFilter(true);
        //Showtime.stores.offlineProfiles.sort('firstName', 'ASC');
        this.coursesListPopup.showBy(button);
    },

    displayInfo: function(button) {
        if (this.infoPanel) {
            this.infoPanel.destroy();
        }
        //panel to display generic about message & credit
        this.infoPanel = Ext.create('Ext.Panel', {
            id: 'info',
            html: '<div id="description">'
                + '<h4>Welcome to London College of Fashion MA_12.</h4>'
                + '<p>We are delighted to present a digital showcase of the most creative and innovative new work from the MA Graduate Season 2012.</p>'
                + '<p>Please show your appreciation for these future fashion stars by <strong>liking</strong> individual images and <strong>sharing</strong> your favourite student profiles. Bookmark links will be emailed to you for later browsing.</p>'
                + '<p>Designed to be an interactive, portable companion to the physical exhibitions, this app was created from Showtime, a web-based portfolio platform offered to all graduating students at University of the Arts London.</p>'
                + '<hr>'
                + '<p>iPad app design and development by Chris Toppon and Alastair Mucklow.</p>'
                + '</div>',
            centered: true,
            modal: true,
            hidden: true,
            hideOnMaskTap: true,
            height: 450,
            width: 500,
            styleHtmlContent: true,
            scroll: 'vertical'
        });
        this.infoPanel.showBy(button);
    }


});