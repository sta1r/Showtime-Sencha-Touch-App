var basedir = (location.hostname == 'localhost' ? '/showtime' : ''); 

Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'http://showtime.arts.ac.uk/img/touch/icon.png',
    glossOnIcon: true,
    onReady: function() {
		Showtime.MasterPanel = new Showtime.MasterPanel();
    }

});