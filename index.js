//Ext.namespace('showtime');

/*showtime.Splash = new Ext.Panel ({
	

showtime.Explore = {}

showtime.Profile = {}*/


Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
		
		var splash = new Ext.Component({
			title: 'Splash',
			cls: 'splash',
			html: '<div><h1>Welcome to Showtime</h1></div>'	
		});
	
		var explore = new Ext.Component({
			title: 'Explore',
			cls: 'explore',
		    html: '<div><h1>Explore page</h1></div>'
		});
		
		var profile = new Ext.Component({
			title: 'Profile',
			cls: 'profile',
		    //html: '<div><h1>Profile page</h1></div>',
			scroll: 'vertical',
			tpl: [
				'<tpl for=".">',
					'<div class="image"><img src="{uri}smlthumb.jpg"></div>',
				'</tpl>'
			]
		});
		
		// Call to Showtime
		Ext.util.JSONP.request({
			url: 'http://showtime.arts.ac.uk/DoisAvoir.json',
			callbackKey: 'jsoncallback',
			callback: function(data) {
				data = data.data.Student.Media;
				profile.update(data);
			}
		});
		
		var tabs = new Ext.TabPanel({
			renderTo: Ext.getBody(),
		    activeTab: 1,
			fullscreen: true,
            cardSwitchAnimation: 'slide',
		    items: [splash,explore,profile]
		});
    }



});