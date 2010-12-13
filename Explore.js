(function() {

	//model that describes the profiles structure
	Ext.regModel('Explore', {
	    fields: [
	        'profilename',
	        'fullname',
	        'course',
	        'hero'
	    ],
	    idProperty: 'id'
	});
	
	//this panel displays the thumbs on the explore screen
	Showtime.ExplorePanel = Ext.extend(Ext.Panel, {
	    cls: 'explore-panel',
	    
	    // landscape mode - use vertical columns
	    landscapeTpl: new Ext.XTemplate(
	        '<div class="explore-container" style="height: 100%">',
	            '<tpl for=".">',
						'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=column>" : ""]}',
							'<div class="explore-item item{[xindex]}">',					
			            	'<div class="thumbnail">',
									'<div class="box">',
			            			'<img src="{hero}" />',
									'</div',
								'</div>',
								'<div class="caption">',
									//'<span>Student {#} of {[xcount]}</span>',
									'<span>{fullname}</span>',
									'<span>{course}</span>',
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
						'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=row>" : ""]}',
							'<div class="explore-item item{[xindex]}">',					
			            	'<div class="thumbnail">',
			            		'<div class="box">',
			            			'<img src="{hero}" />',
									'</div',
								'</div>',
								'<div class="caption">',
									'<span>Student {#} of {[xcount]}</span>',
									'<span>{course}</span>',
								'</div>',
							'</div>',
						'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
	   			'</tpl>',
				'</div>'    
		),
		
	    initComponent: function() {
	        this.addEvents('profileSelected');
	        this.enableBubble('profileSelected');
	        
	        this.profilesPerItem = Ext.getOrientation() == "portrait" ? 9 : 8;        
	        this.monitorOrientation = true;
	        
	        this.layout = "card";
	        
	        Showtime.ExplorePanel.superclass.initComponent.call(this);   
	        
	        this.mon(this, "itemtap", this.onItemTap, this);
	        this.mon(this, "orientationChange", this.onOrientation, this);
	        
	        //this.showProfiles('test', 0);
	    },
	    
	    afterRender: function() {
	    	Showtime.ExplorePanel.superclass.afterRender.apply(this, arguments);
	    	this.setOrientation(Ext.getOrientation());
	    },
	
	    /**
	     * Displays profiles
	     */    
	    showProfiles: function(course, defaultProfileIndex) {
	        this.course = course;
	        
	        if (this.profileDataCache) {
	            this.profileDataCache.clearCallbacks();
	            this.profileDataCache = null;
	        }
	        
	        this.removeAll(true);
	        this.doLayout();
	        
	        //if (course) {
	            this.profileDataCache = new Showtime.ProfileDataCache(course);

	            // Get first 16 items
	            this.profileDataCache.getItems(0, 8, function() {
	                var totalProfiles = this.profileDataCache.totalItems,
	                    totalItems = Math.ceil(totalProfiles/this.profilesPerItem);
	                
	                
	                if (totalItems > 0) {
	                    var carousel = new Showtime.BufferedCarousel({
	                        createItem: this.onCreateItem.createDelegate(this),
	                        itemCount: totalItems,
	                        initialCarouselPosition: defaultProfileIndex != null ? Math.floor(defaultProfileIndex/this.profilesPerItem) : 0,
	                        direction: Ext.getOrientation() == "portrait" ? 'vertical' : 'horizontal'
	                    });
	                    this.add(carousel);
	                    carousel.mon(carousel, 'buffer', this.onCarouselBuffer, this);
	                }
	                else {
	                    this.add({html: '<div class="profilelist-panel-empty"><span>No profiles available</span></div>'})
	                }
	                
	                this.layout.setActiveItem(this.items.get(0));
	                this.doLayout();
	            }, this);
	        //}
	    },    
	
	    /**
	     * Creates each card individually as needed by the carousel
	     */  
	    onCreateItem: function(itemIndex) {
	        if (!this.category && !this.textSearch) { return; }
	
	        var productsPerItem = this.productsPerItem,
	            productIndex = itemIndex * productsPerItem,
	            productDataCache = this.productDataCache;
	        if (productDataCache.totalItems != null && productIndex >= productDataCache.totalItems) { return; }
	        
	        var component = new Ext.Component({
	            listeners: {
	                afterrender: function() {
	                    this.mon(component.el, 'tap', function(e) {
	                        var item = e.getTarget('.productlist-item', component.el);
	                        if (item) {
	                            var index = component.items.indexOf(item),
	                                data = component.productData[index];
	                            
	                            if (Ext.isObject(data)) {
	                                this.fireEvent('productSelected', this, component.productData[index]);
	                            }
	                        }
	                    }, this);
	                },
	                scope: this
	            }
	        });
	        
	        productDataCache.getItems(productIndex, productsPerItem, function(results) {
	            var tpl = Ext.getOrientation() == "portrait" ? this.portraitTpl : this.landscapeTpl;
	            
	            component.productData = results;
	            
	            var renderData = function() {
	                tpl.overwrite(component.el, results);
	                component.el.repaint();
	                component.items = new Ext.CompositeElementLite();
	                component.items.fill(Ext.query('.productlist-item', component.el.dom));
	            };
	            
	            if (component.rendered) {
	                renderData();
	            }
	            else {
	                component.on('render', renderData, this, {single: true});
	            }
	        }, this);
	        
	        var maxIndex = productDataCache.maxIndex();
	        if (maxIndex-50 < productIndex) {
	            productDataCache.getItems(maxIndex, 100);
	        }
	        
	        return component;
	    },    
	    onOrientation: function(target, orientation) {
	    	tpl = orientation == "portrait" ? this.portraitTpl : this.landscapeTpl;
	    },	    
	    onOrientationChange: function(target, orientation) {
	        var profilesPerItem = this.profilesPerItem,
	        	newProfilesPerItem = orientation == "portrait" ? 9 : 8,
	            changed = newProfilesPerItem != profilesPerItem;
	
	        if (changed) {
	            this.profilesPerItem = newProfilesPerItem;
	            
	            var carousel = this.items.get(0);
	            if (carousel && carousel instanceof Showtime.BufferedCarousel) {
	                var currentItemIndex = carousel.getIndex(),
	                    currentProfileIndex = currentItemIndex*profilesPerItem;
	            }
	            
	            this.showProfiles(null, currentProfileIndex);
	        }
	    },
	    
	    getTitleText: function() {
	        title = 'MA 2011';
	        return title;
	    },
	    
	    onCarouselBuffer: function(carousel, i) {
	        if (i <= 0 || i >= carousel.itemCount-1) {
	            carousel.el.dom.style.backgroundColor = '';
	        }
	        else {
	            carousel.el.dom.style.backgroundColor = 'white';
	        }
	    }	
	});
	
	
	//add this panel to the component registry
	Ext.reg('showtime-explorepanel', Showtime.ExplorePanel);
})();
