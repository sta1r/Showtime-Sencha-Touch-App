/**
 * @class Profiles
 * @extends Ext.data.Model
 * The Profiles model used in the main carousel listing and A-Z popup
 */
Ext.regModel("Profile", {
    fields: [
        {name: "id"},
        {name: "profileName", type: "string"},
        {name: "firstName", type: "string"},
        {name: "lastName", type: "string"},
        {name: "fullName", type: "string"},
        {name: "course", type: "auto"},
        {name: "thumb", type: "auto"},
        {name: "updated"},
    ],
    setThumbUrl: function() {
        var url = this.get('thumb');
		
        var script = document.createElement("script");
        script.setAttribute("src",
            "http://src.sencha.io/data.Showtime.setThumbUrl-" + this.getId() +
            "/" + url
        );
        script.setAttribute("type","text/javascript");
        document.body.appendChild(script);
    }
});

	
// Online Data Store:
Ext.regStore('Profiles', {
    model: 'Profile',
    proxy: {
		type: 'scripttag',
	    url : 'http://showtime.arts.ac.uk/lcf/ug/2011.json',
	    reader: new Ext.data.JsonReader({
                root: 'data.Profiles'
        }),
        timeout: 2000,
		listeners: {
		    exception:function () {
		        console.log("Timed out so now offline");
		        loading.hide();
		        //if empty and offline - display message internet connection required?
		        Showtime.stores.offlineProfiles.load();
		    }
		},
	},
	listeners: {
		load:function (store, records, success) {
			console.log('fetching json feed from server');
			
    		console.log('emptying the offline store');
			//empty the offline store
			Showtime.stores.offlineProfiles.proxy.clear();
			
			console.log('adding ' + records.length + ' records');
			this.each(function(record){
				//remove all non-numeric characters to reduce date/time into sortable number
				record.data.updated = record.data.updated.replace(/[^\d]/g, "");
				//add record to store
				var profile = Showtime.stores.offlineProfiles.add(record.data)[0];
				//profile.setThumbUrl();
			});
			
			Showtime.stores.offlineProfiles.sync();
			
			//now we can sort by updated date/time
			Showtime.stores.offlineProfiles.sort('updated', 'DESC');
			
			//load from the now primed offline store:
			Showtime.stores.offlineProfiles.load();
		}
	},
    pageSize: 60
});

//Offline Data Store:
Ext.regStore('OfflineProfiles', {
    model: 'Profile',
    proxy: {
		type: 'localstorage',
	    id: 'LocalProfiles'
	},
    getGroupString : function(record) {
        return record.get('firstName')[0];
    },
    //sortOnFilter: false,
    //defaultSortDirection: 'DESC',
    //sorters: [{ property : 'updated', direction: 'DESC' }],
});


//add the stores to the global Showtime namespace:
Showtime.stores.onlineProfiles = Ext.getStore('Profiles');
Showtime.stores.offlineProfiles = Ext.getStore('OfflineProfiles');