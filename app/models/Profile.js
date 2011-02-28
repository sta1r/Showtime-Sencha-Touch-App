// Model for a Profile
showtime.models.Profile = Ext.regModel("app.models.Profile", {
    fields: [
        {name: "id", type: "int"},
        {name: "profileName", type: "string"},
        {name: "firstName", type: "string"},
        {name: "lastName", type: "string"},
        {name: "fullName", type: "string"},
        {name: "course", type: "auto"},
        {name: "thumb", type: "auto"},
    ],
    idProperty: 'id',
    proxy: {
		//type: "profilestorage"
		type: 'scripttag',
	    url : '/showtime/explore.json',
	    reader: {
            type: 'json',
            root: 'data.Profiles'
        }
	}
});


// Data Store
showtime.stores.profiles = new Ext.data.Store({
    model: "app.models.Profile",
    pageSize: 120
});

//Needs a proxy - can either be standard one or custom. 
// Showtime needs a ajax/jsonp proxy - with caching..dynamic buffering..
// possible solution build custom json/ajax proxy with datacaching - buffering functions built ins

//example of custom proxy:
/*Ext.data.ProxyMgr.registerType("profilestorage",
    Ext.extend(Ext.data.Proxy, {
        create: function(operation, callback, scope) {
        },
        read: function(operation, callback, scope) {
        },
        update: function(operation, callback, scope) {
        },
        destroy: function(operation, callback, scope) {
        }
    })
);*/