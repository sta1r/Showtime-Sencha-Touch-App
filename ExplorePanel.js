//model that describes the profiles structure
Ext.regModel('Explore', {
    fields: [
        'imgurl',
        'profilename'
    ],
    idProperty: 'profilename'
});

//this panel displays the thumbs on the explore screen
Showtime.ExplorePanel = Ext.extend(Ext.DataView, {
    cls: 'explore-panel',
    
    landscapeTpl: new Ext.XTemplate(
        '<div class="vbox" style="height: 100%">',
            '<div class=\'hbox boxCenter\'>',
            	'<tpl for=".">',
            		'<div class="thumbnail">',
            			'<img src="{imgurl}" />',
        			'</div>',
    			'</tpl>',
            '</div>',
        '</div>'
    ),
    
    portraitTpl: new Ext.XTemplate(
    	'<div class="vbox" style="height: 100%">',
            '<div class=\'hbox boxCenter\'>',
            	'<tpl for=".">',
            		'<div class="thumbnail">',
            			'<img src="{imgurl}" />',
            		'</div>',
        		'</tpl>',
            '</div>',
        '</div>'
    ),
    
    initComponent: function() {
        this.addEvents('profileSelected');
        this.enableBubble('profileSelected');
        
        this.monitorOrientation = true;
        this.scroll = false;
        this.tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
        this.store = new Ext.data.Store({
            model: 'Explore',
            data: [
                   {imgurl: 'http://dxcpw8yg8uhxn.cloudfront.net/e3fb5a47873cf5f309f3b1f2c6edd2d4gallery.jpg', profilename: 'thailanddemocrazy'},
                   {imgurl: 'http://dxcpw8yg8uhxn.cloudfront.net/682a2efbd2503413d58e46105cf5f4a6gallery.jpg', profilename: 'juliab'},
                   {imgurl: 'http://dxcpw8yg8uhxn.cloudfront.net/4ac851b2ad2063a7257c4c42f240bfa9gallery.jpg', profilename: 'jangchoi'},
            ],
            autoDestroy: true
        });
        //this is important - the dataview will not work if the selector is invalid
        //here it is set to each thumb
        this.itemSelector = '.thumbnail';
        
        Showtime.ExplorePanel.superclass.initComponent.call(this);
        
        this.mon(this, "orientationChange", this.onOrientation, this);
        this.mon(this, "itemtap", this.handleItemTap, this);
    },
    
    afterRender: function() {
    	Showtime.ExplorePanel.superclass.afterRender.apply(this, arguments);
    },
    
    onOrientation: function(target, orientation) {
        this.tpl = orientation == "portrait" ? this.portraitTpl : this.landscapeTpl;
        this.refresh();
    },
    //fired when profile is tapped
    handleItemTap: function(dv, idx, el, e){
        var record = this.store.getAt(idx),
            profile = record.get('profilename');
        //alert('You tapped: ' + profile);
        this.fireEvent('profileSelected', this, profile);
    }
});
//add this panel to the component registry
Ext.reg('showtime-explorepanel', Showtime.ExplorePanel);
