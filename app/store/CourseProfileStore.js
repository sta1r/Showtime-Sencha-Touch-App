Ext.define('Showtime.store.CourseProfileStore', {
    extend: 'Ext.data.Store',
    requires: 'Ext.ux.proxy.JsonPCache',
    config: {
        storeId: 'courseProfiles',
        model: 'Showtime.model.ProfileModel',
        autoLoad: false,
        proxy: {
            type: 'jsonpcache',
            cacheKey: 'CourseProfileCache',
            //url set when created
            reader:{
                type: 'json',
                rootProperty: 'data.Profiles'
            },
            timeout: 7000,
            listeners: {
                exception:function () {
                    console.log("store:CourseProfiles: Timed out so now offline");
                    loading.hide();

                    Showtime.stores.offlineProfiles.load();
                    if(typeof networkState != 'undefined' && networkState == 'unknown') {
                        Ext.Msg.alert('Offline', 'Could not connect - internet connection required');
                    } else {
                        Ext.Msg.alert('Connection timed out', 'Sorry, could not reach the Showtime server, please try later');
                    }
                }
            }
        },
        urlChanged: false,
        endReached: false,
        oldPage: 0,
        pageSize: 64 //important this needs to be greater than and in multiples of the number of profiles per page (8) e.g. 16, 24, 32 etc
    }
});