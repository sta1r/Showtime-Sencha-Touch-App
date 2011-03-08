Ext.regApplication({
    name: 'showtime',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'http://showtime.arts.ac.uk/img/touch/icon.png',
    glossOnIcon: true
    
    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    mainLaunch: function() {
        //if (!device || !this.launched) {return;}
        this.views.viewport = new this.views.Viewport();
    },
	profiles: {
        tabletPortrait: function() {
            return Ext.is.Tablet && Ext.orientation == 'portrait';
        },
        tabletLandscape: function() {
            return Ext.is.Tablet && Ext.orientation == 'landscape';
        }
    }
});