Ext.regApplication({
    name: 'Showtime',
    launch: function() {
        console.log('launch');
    }
	profiles: {
        tabletPortrait: function() {
            return Ext.is.Tablet && Ext.orientation == 'portrait';
        },
        tabletLandscape: function() {
            return Ext.is.Tablet && Ext.orientation == 'landscape';
        }
    }
});