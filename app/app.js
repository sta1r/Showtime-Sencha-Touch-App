/**
 * This file sets application-wide settings and launches the application when everything has
 * been loaded onto the page. By default we just render the application's Viewport inside the
 * launch method (see app/views/Viewport.js).
 */ 
/*global Ext,Showtime*/
Ext.regApplication({
    name: 'Showtime',
    
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'http://showtime.arts.ac.uk/img/touch/icon.png',
    glossOnIcon: true,
    
    defaultTarget: "viewport",
    defaultUrl   : 'Profiles/index',
    
    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    mainLaunch: function() {
        //uncomment the line below for phonegap
        //if (!device || !this.launched) {return;}
        this.viewport = new Showtime.Viewport({
            application: this
        });
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
});