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
    // landscape mode - use vertical columns
    landscapeTpl: new Ext.XTemplate(
        '<div class="explore-container" style="height: 100%">',
            '<tpl for=".">',
					'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=column>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
								'<div class="box">',
		            			'<img src="http://dxcpw8yg8uhxn.cloudfront.net/{hero}gallery.jpg" />',
								'</div',
							'</div>',
							'<div class="caption">',
								'<span>Student {#} of {[xcount]}</span>',
								'<span>Course</span>',
							'</div>',
						'</div>',
					'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
    			'</tpl>',
        '</div>'
    ),
    // portrait mode - use horizontal rows
    portraitTpl: new Ext.XTemplate(
			'<div class="explore-container" style="height: 100%">',
				'<tpl for=".">',
					'{[ xindex == 1 || xindex % 3 == 1 ? "<div class=row>" : ""]}',
						'<div class="explore-item item{[xindex]}">',					
		            	'<div class="thumbnail">',
		            		'<div class="box">',
		            			'<img src="http://dxcpw8yg8uhxn.cloudfront.net/{hero}gallery.jpg" />',
								'</div',
							'</div>',
							'<div class="caption">',
								'<span>Student {#} of {[xcount]}</span>',
								'<span>Course</span>',
							'</div>',
						'</div>',
					'{[ xindex == xcount || xindex % 3 == 0 ? "</div>" : ""]}',
   			'</tpl>',
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
                   {
                	   "profilename":"NickyV",
                	   "hero":"293de11e97a9ae068f861eb90155c280",
                	   "media":[
                	            {"id":"1", "imageuri":"e6c116fb16ee20e3b17b1bdb5d3e4fd0"},
                	            {"id":"2", "imageuri":"ee16bf23b6613fd01f47015dc8cb9ff0"},
                	            {"id":"3", "imageuri":"249c8b9386b9ba0b5b55a2041cf1457b"},
                	            {"id":"4", "imageuri":"4c1e32e81cdce73c02f4076ca4985b4f"},
                	            {"id":"5", "imageuri":"b82eeceb52bf296f9e30bbf278dea725"},
                	            {"id":"6", "imageuri":"821ae4eea4742b96d8cb4d42c24b178e"},
                	   ]
                   },
                   {
                	   "profilename":"BornaIzadpanah",
                	   "hero":"7c7e5dcb32b51c7ad6c152fe43b65f8b",
                	   "media":[
                	            {"id":"1", "imageuri":"7c7e5dcb32b51c7ad6c152fe43b65f8b"},
                	            {"id":"2", "imageuri":"35a960489806d450dc65191bba857327"},
                	            {"id":"3", "imageuri":"90a0fcece3b576759d574d7f72674da5"},
                	            {"id":"4", "imageuri":"5e5cf418d3eab0cb117121f9bd141a03"},
                	            {"id":"5", "imageuri":"a7d9775f67ededd0a1254fe29eb61ea7"},
                	            {"id":"6", "imageuri":"b256e9d91cf9737ea522ba6d7dfd8c70"},
                	            {"id":"7", "imageuri":"1b7656924c0ddf7790325b3ba35c7bb7"},
                	            {"id":"8", "imageuri":"b33d6bfeaf198e1e1647f0b83b1bf8cd"},
                	            {"id":"9", "imageuri":"13b67ff0d36c890da3b58566b56e8861"}
                	   ]
                   }

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
            //profile = record.get('profilename');
        	profile = record.data;
        //alert(record);
        this.fireEvent('profileSelected', this, profile);
    }
});
//add this panel to the component registry
Ext.reg('showtime-explorepanel', Showtime.ExplorePanel);
