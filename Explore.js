SS.Explore = Ext.extend(Ext.Panel, {
    layout: 'card',
    fullscreen: true,
	onReady: function() {
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
	}
    
});

Ext.reg('ss-explore', SS.Explore);