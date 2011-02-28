showtime.views.ProfilesList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Profiles'
    }],
    items: [{
        xtype: 'list',
        store: showtime.stores.profiles,
        itemTpl: '{firstName} {lastName}',
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: showtime.controllers.profiles,
                action: 'show',
                id: record.getId()
            });
        },
        scroll: 'vertical',
        indexBar: true,
        height: 600,
    }],
    initComponent: function() {
		//can't use autoload as it may run before deviceready in phonegap - so loading manually.
		showtime.stores.profiles.load();
		showtime.views.ProfilesList.superclass.initComponent.apply(this, arguments);
    }
});