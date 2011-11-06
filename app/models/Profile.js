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
    /*setThumbUrl: function() {
        var url = this.get('thumb');
		
        var script = document.createElement("script");
        script.setAttribute("src",
            "http://src.sencha.io/data.Showtime.setThumbUrl-" + this.getId() +
            "/" + url
        );
        script.setAttribute("type","text/javascript");
        document.body.appendChild(script);
    }*/
});


//Online Student List Data Store:
Ext.regStore('Students', {
    model: 'Profile',
    sorters: 'firstName',
    pageSize: 1,
    proxy: {
		type: 'scripttag',
	    url : 'http://showtime.arts.ac.uk/lcf/ug/2011/students.json',
	    reader: {
            type: 'json',
            root: 'data.Students'
       },
       timeout: 2000,
		listeners: {
		    exception:function () {
		    	//we are offline so use the previously loaded data
		    	console.log('offline - using old student list');
		        Showtime.stores.offlineStudentList.load();
		    }
		},
	},
	listeners: {
		load:function (store, records, success) {
			console.log('fetching student json feed from server');
			
    		console.log('emptying the offline student store');
			//empty the offline store
			Showtime.stores.offlineStudentList.proxy.clear();
			
			console.log('adding ' + records.length + ' student records');
			this.each(function(record){
				//add record to store
				Showtime.stores.offlineStudentList.add(record.data)[0];
			});
			
			Showtime.stores.offlineStudentList.sync();
			
			//load from the now primed offline store:
			Showtime.stores.offlineStudentList.load();
		}
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

		        Showtime.stores.offlineProfiles.load();
		        if(typeof networkState != 'undefined' && networkState == 'unknown') {
	                Ext.Msg.alert('Offline', 'Could not connect - internet connection required');
	            } else {
	                Ext.Msg.alert('Connection timed out', 'Sorry, could not reach the Showtime server, please try later');
	            }
		    }
		},
	},
	urlChanged: false,
	endReached: false,
	oldPage: 0,
	listeners: {
		load:function (store, records, success) {
			//TODO test for success
			
			//is this a request for profiles on a course?
			var courses = false, offlineStore;
			if (store.proxy.url != 'http://showtime.arts.ac.uk/lcf/ug/2011.json') {
				courses = true;
				offlineStore = Showtime.stores.offlineCourseProfiles;
				console.log('fetching course json feed from server');
			} else {
				offlineStore = Showtime.stores.offlineProfiles;
				console.log('fetching json feed from server');
			}
			
			//empty the offline store if loading the first page of json:
			if (store.urlChanged) {
				offlineStore.removeAll();
				store.urlChanged = false;
			}
			
			console.log('emptying the offline store proxy');
			offlineStore.proxy.clear();
			
			console.log('adding ' + records.length + ' records');

			this.each(function(record){
				//replace all non-numeric characters to reduce date/time into sortable number
				record.data.updated = record.data.updated.replace(/[^\d]/g, "");
				//add record to store
				if (offlineStore.findExact('id', record.data.id) == -1) {
					var profile = offlineStore.add(record.data)[0];		
					//profile.setThumbUrl();
				}
			});

			offlineStore.sync();
			
			//now we can sort by updated date/time
			offlineStore.sort('updated', 'DESC');

			//load from the now primed offline store:
			offlineStore.load();

			//set the total amount of records:
			offlineStore.recordcount = offlineStore.data.length;
			
			console.log('Offline store now contains '+ offlineStore.data.length +' records');
			records = undefined;
		},
		datachanged: function (store) {
			console.log('store changed');
			//console.log(store.data)
		}
	},
	pageSize: 64 //important this needs to be greater than and in multiples of the number of profiles per page (8) e.g. 16, 24, 32 etc 
    //pageSize: 60
});

//Offline Data Store:
Ext.regStore('OfflineStudents', {
    model: 'Profile',
    proxy: {
		type: 'localstorage',
	    id: 'LocalStudents'
	},
    getGroupString : function(record) {
        return record.get('firstName')[0];
    },
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

//Offline Data Store:
Ext.regStore('OfflineCourseProfiles', {
    model: 'Profile',
    proxy: {
		type: 'localstorage',
	    id: 'LocalCourseProfiles'
	},
    getGroupString : function(record) {
        return record.get('firstName')[0];
    }
});


//add the stores to the global Showtime namespace:
Showtime.stores.onlineStudentList = Ext.getStore('Students');
Showtime.stores.offlineStudentList = Ext.getStore('OfflineStudents');
Showtime.stores.onlineProfiles = Ext.getStore('Profiles');
Showtime.stores.offlineProfiles = Ext.getStore('OfflineProfiles');
Showtime.stores.offlineCourseProfiles = Ext.getStore('OfflineCourseProfiles');