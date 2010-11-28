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
            id: 'home'
        }];/*,{
            xtype: 'showtime-profile-panel',
            id: 'profile'
        }];*/
        
        //call the Ext.Panel init (parent of this class)
        Showtime.MasterPanel.superclass.initComponent.call(this);
        
        //add managed event handlers to the panel to listen for bubbled up events
        this.mon(this, 'profileSelected', this.onProfileSelected, this);
    },
    
    //this event listener has bubbled up from the tap event specified in homepanel.js
    onProfileSelected: function(t, profile) {
    	alert('You tapped: '+profile);
        this.showProfile(profile);
    },
    
    showProfile: function(profile) {
    	//this function will load the profile card passing the tapped profile id
        /*var profileDetail = Ext.getCmp('profileDetail');
        this.setCard(profileDetail, 'pop');
        profileDetail.showProfile(profile);*/
    }
});    

//register xtype
Ext.reg('showtime-masterpanel', Showtime.MasterPanel);