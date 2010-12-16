//declare the Showtime namespace for our own components
Ext.ns("Showtime");
Showtime.MasterPanel = Ext.extend(Ext.Panel, {
    layout: 'card',
    fullscreen: true,
    
    //called when this object is created
    initComponent: function(){	
        //specify the items in the panel:
        //each xtype is the registered name of each panel which is setup by Homepanel.js
        //only one can be displayed at a time
        this.items = [{
            xtype: 'showtime-explorepanel',
            id: 'explore'
        },{
            xtype: 'showtime-profilepanel',
            id: 'profile'
        }];
        
        //call the Ext.Panel init (parent of this class)
        Showtime.MasterPanel.superclass.initComponent.call(this);
        
        //add managed event handlers to the panel to listen for bubbled up events
        this.mon(this, 'back', this.onBack, this);
        this.mon(this, 'profileSelected', this.onProfileSelected, this);
    },

    afterRender: function() {
    	Showtime.MasterPanel.superclass.afterRender.apply(this, arguments);
        this.showHome();
    },
    
    onBack: function() {
        var current = this.getLayout().activeItem;
        animation = {
            type: 'slide',
            direction: 'right',
            //need to fix css:
            //reveal: true
        }
        this.showHome(animation);
    },    

	//show the homepage
    showHome: function(anim) {
    	var profileList = Ext.getCmp('explore');
    	
    	//profileList.showProfiles();
    	
    	//fade to the home card
        this.setActiveItem('explore', anim || 'fade');
    },    
    
    //this event listener has bubbled up from the tap event specified in homepanel.js
    onProfileSelected: function(t, profile) {
    	//alert('You tapped: '+profile);
        this.showProfile(profile);
    },
    
    showProfile: function(profile) {
    	//Ext.getCmp will get the registered component (xtype) using the reference id specified in initComponent above
        var profileDetail = Ext.getCmp('profile');
        //transition to the panel
        animation = {
                type: 'slide',
                direction: 'left',
                //need to fix css:
                //cover: true
            }
        this.setActiveItem(profileDetail, animation);
        //send the profilename to the profilepanel so it can load the data from there
        profileDetail.showProfile(profile.profilename);
        profileDetail.tbar.setTitle(profile.fullname);
    },

});    

//register xtype
Ext.reg('showtime-masterpanel', Showtime.MasterPanel);