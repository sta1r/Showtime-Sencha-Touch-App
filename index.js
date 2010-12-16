Ext.setup({
    tabletStartupScreen: 'img/touch/tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'img/touch/icon.png',
    glossOnIcon: true,
    onReady: function() {
		Showtime.MasterPanel = new Showtime.MasterPanel();
    }

});