/**
 * @class Courses
 * @extends Ext.data.Model
 * The Course model
 */
Ext.regModel("Courses", {
    fields: [
        {name: "id", type: "int"},
        {name: "name", type: "string"},
        {name: "slug", type: "string"},
        {name: "url", type: "string"},
    ]
});

//Online Data Store:
Ext.regStore('Courses', {
    model: 'Courses',
    sorters: 'name',
    pageSize: 50,
    proxy: {
		type: 'scripttag',
	    url : 'http://showtime.arts.ac.uk/lcf/ma/2012/courses.json',
	    reader: {
            type: 'json',
            root: 'data.Courses'
       },
       timeout: 2000,
		listeners: {
		    exception:function () {
		    	//we are offline so use the previously loaded data
		    	console.log('offline - using old course list');
		        Showtime.stores.offlineCourses.load();
		    }
		},
	},
	listeners: {
		load:function (store, records, success) {
			console.log('fetching course json feed from server');
			
    		console.log('emptying the offline courses store');
			//empty the offline store
			Showtime.stores.offlineCourses.proxy.clear();
			
			console.log('adding ' + records.length + ' course records');
			this.each(function(record){
				//add record to store
				Showtime.stores.offlineCourses.add(record.data)[0];
			});
			
			Showtime.stores.offlineCourses.sync();
			
			//load from the now primed offline store:
			Showtime.stores.offlineCourses.load();
		}
	}
});

//Offline Data Store:
Ext.regStore('OfflineCourses', {
    model: 'Courses',
    proxy: {
		type: 'localstorage',
	    id: 'LocalCourses'
	}
});

//add the stores to the global Showtime namespace:
Showtime.stores.courses = Ext.getStore('Courses');
Showtime.stores.offlineCourses = Ext.getStore('OfflineCourses');

