/**
 * This file sets application-wide settings and launches the application when everything has
 * been loaded onto the page. By default we just render the application's Viewport inside the
 * launch method (see app/view/Viewport.js).
 */ 
/*global Ext,Showtime*/
//Ext.Loader.setConfig({enabled: true});
//Ext.Loader.setPath('Ext', 'js/touch/lib/touch2/src');
Ext.Loader.setPath('Ext.ux', 'js/touch/app/ux');
Ext.require('Ext.device.*');
Ext.application({
    name: 'Showtime',

    //tabletStartupScreen: 'tablet_startup.png',
    //phoneStartupScreen: 'phone_startup.png',
    //icon: 'http://showtime.arts.ac.uk/img/touch/icon.png',
    //glossOnIcon: true,
    appFolder: 'js/touch/app',
    controllers: ['Explore', 'Profiles'],
    models: ['CourseModel', 'ProfileModel', 'StudentModel'],
    stores: ['CourseStore', 'ProfileStore', 'StudentStore'],
    views: ['Main', 'explore.ExplorePanel', 'profile.ProfilePanel'],

    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    mainLaunch: function() {
        //uncomment the line below for phonegap
        //if (!device || !this.launched) {return;}

        this.viewport = Ext.create('Showtime.view.Main');

        //what happens next is the exploreItems controller launch function will load the view..
    },
    profiles: {
        tabletPortrait: function() {
            //return Ext.is.Tablet && Ext.orientation == 'portrait';
        },
        tabletLandscape: function() {
            //return Ext.is.Tablet && Ext.orientation == 'landscape';
        }
    },
    setThumbUrl: function (id, dataUrl) {
        var profile = this.stores.offlineProfiles.getById(id);
        profile.set('thumb', dataUrl);
        this.stores.offlineProfiles.sync();
    }
})