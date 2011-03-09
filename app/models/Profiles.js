/**
 * @class Profiles
 * @extends Ext.data.Model
 * The Profiles model
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
	    url : '/showtime/lcf/ma/2011/explore.json',
	    reader: {
            type: 'json',
            root: 'data.Profiles'
        }
	}
});

// Model for Profile *in list* - there is a separate model for individual profile
/*showtime.models.ProfilesList = Ext.regModel("showtime.models.ProfilesList", {
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
    idProperty: 'id',
    proxy: {
		type: 'scripttag',
	    url : '/showtime/lcf/ma/2011/explore.json',
	    reader: {
            type: 'json',
            root: 'data.Profiles'
        }
	}
});*/

// Data Store
Ext.regStore('ProfilesStore', {
//showtime.stores.profilesList = new Ext.data.Store({
    //model: "showtime.models.ProfilesList",
    model: 'Profiles',
    getGroupString : function(record) {
        return record.get('firstName')[0];
    },
    //sortOnFilter: false,
    //defaultSortDirection: 'DESC',
    //sorters: [{ property : 'updated', direction: 'DESC' }],
    pageSize: 130
});