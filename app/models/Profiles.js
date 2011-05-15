/**
 * @class Profiles
 * @extends Ext.data.Model
 * The Profiles model used in the main carousel listing and A-Z popup
 */
Ext.regModel("Profiles", {
    fields: [
        {name: "id", type: "int"},
        {name: "profileName", type: "string"},
        {name: "firstName", type: "string"},
        {name: "lastName", type: "string"},
        {name: "fullName", type: "string"},
        {name: "course", type: "auto"},
        {name: "thumb", type: "auto"},
        {name: "updated"},
    ],
    
    proxy: {
		type: 'scripttag',
	    url : 'http://showtime.arts.ac.uk/lcf/ma/2011/explore.json',
	    reader: {
            type: 'json',
            root: 'data.Profiles'
        }
	}
});

// Data Store
Ext.regStore('Profiles', {
    model: 'Profiles',
    getGroupString : function(record) {
        return record.get('firstName')[0];
    },
    //sortOnFilter: false,
    //defaultSortDirection: 'DESC',
    //sorters: [{ property : 'updated', direction: 'DESC' }],
    pageSize: 130
});

//add the store to the global Showtime namespace:
Showtime.stores.profiles = Ext.getStore('Profiles');