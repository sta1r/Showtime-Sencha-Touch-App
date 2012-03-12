//Offline Data Store:
Ext.define('Showtime.store.OfflineProfile', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'offlineProfile',
        model: 'Showtime.model.Profile',
        proxy: {
            type: 'localstorage',
            id: 'LocalProfiles'
        },
        grouper: {
            groupFn: function(record) {
                return record.get('firstName')[0];
            }
        },
        listeners: {
            load: function (store, records, success) {
                console.log('store:Profile:offline: Loading the offline profile store');
                console.log(this.data);
            }
        }
        //sortOnFilter: false,
        //defaultSortDirection: 'DESC',
        //sorters: [{ property : 'updated', direction: 'DESC' }],
    }
});

//Offline Data Store:
Ext.define('Showtime.store.OfflineCourseProfile', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'offlineCourseProfile',
        model: 'Showtime.model.Profile',
        proxy: {
            type: 'localstorage',
            id: 'LocalCourseProfiles'
        },
        grouper: {
            groupFn: function(record) {
                return record.get('firstName')[0];
            }
        },
        listeners: {
            load: function (store, records, success) {
                console.log('store:Profile:offline: Loading the offline course profile store');
            }
        }
    }
});

// Online Data Store:
Ext.define('Showtime.store.Profile', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'onlineProfile',
        model: 'Showtime.model.Profile',
        proxy: {
            type: 'jsonp',
            url : 'http://showtime.arts.ac.uk/lcf/ma/2012.json',
            reader:{
                type: 'json',
                rootProperty: 'data.Profiles'
            },
            timeout: 7000,
            listeners: {
                exception:function () {
                    console.log("store:Profile:online: Timed out so now offline");
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
        listeners: {
            load:function (store, records, success) {
                //TODO test for success
                console.log("store:Profile:online: Loading");
                var courses = false, offlineStore;
                //is this a request for profiles on a course?
                if (store.getProxy().getUrl() != 'http://showtime.arts.ac.uk/lcf/ma/2012.json') {
                    courses = true;
                    offlineStore = Ext.getStore('offlineCourseProfile');
                    console.log('store:Profile:online: Fetched ' + records.length + ' course profiles');
                } else {
                    offlineStore = Ext.getStore('offlineProfile');
                    console.log('store:Profile:online: Fetched ' + records.length + ' profiles');
                }

                //empty the offline store if loading the first page of json:
                if (store.urlChanged) {
                    console.log('store:Profile:online: First page so emptying the offline store');
                    offlineStore.removeAll();
                    store.urlChanged = false;
                }

                console.log('store:Profile:online: Emptying the offline store proxy');
                offlineStore.getProxy().clear();

                console.log('store:Profile:online: Adding ' + records.length + ' records to the offlineStore');

                this.each(function(record){
                    //replace all non-numeric characters to reduce date/time into sortable number
                    record.data.updated = record.data.updated.replace(/[^\d]/g, "");
                    //add record to store
                    if (offlineStore.findExact('id', record.data.id) == -1) {
                        var profile = offlineStore.add(record.data)[0];
                        //profile.setThumbUrl();
                    }
                });

                //save the records to local storage
                offlineStore.sync();

                //now we can sort by updated date/time
                offlineStore.sort('updated', 'DESC');

                //set the total amount of records:
                offlineStore.recordcount = offlineStore.data.length;

                console.log('store:Profile:online: Offline store now contains '+ offlineStore.data.length +' records');
                records = undefined;
            },
            datachanged: function (store) {
                console.log('store:Profile:online: store changed');
                //console.log(store.data)
            }
        },
        pageSize: 64 //important this needs to be greater than and in multiples of the number of profiles per page (8) e.g. 16, 24, 32 etc
        //pageSize: 60
    }
});