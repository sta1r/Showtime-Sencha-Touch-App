var templates = {};

templates.profileListLandscape = new Ext.XTemplate(
	'<div class="land explore-container">',
	        '<tpl for=".">',
			'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=column>" : ""]}',
				'<div class="explore-item item{[xindex]}">',					
	        	'<div class="thumbnail">',
						'<div class="box">',
	        			'<img src="{thumb}" />',
						'</div>',
					'</div>',
					'<div class="caption">',
						'<span class="fullname">{fullName}</span>',
						'<span class="course">{course}</span>',
					'</div>',
				'</div>',
			'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
		'</tpl>',
	'</div>'
);
templates.profileListPortrait = new Ext.XTemplate(
	'<div class="vert explore-container">',
		'<tpl for=".">',
			'{[ xindex == 1 || xindex % 2 == 1 ? "<div class=row>" : ""]}',
				'<div class="explore-item item{[xindex]}">',					
            	'<div class="thumbnail">',
            		'<div class="box">',
            			'<img src="{thumb}" />',
						'</div>',
					'</div>',
					'<div class="caption">',
						'<span class="fullname">{fullName}</span>',
						'<span class="course">{course}</span>',
					'</div>',
				'</div>',
			'{[ xindex == xcount || xindex % 2 == 0 ? "</div>" : ""]}',
		'</tpl>',
	'</div>' 
	);

/**
 * @class Showtime.view.explore.ExplorePanel
 * @extends Ext.Panel
 * The panel containing our contact list.
 */
Ext.define('Showtime.view.explore.ExplorePanel', {
    extend: 'Ext.Panel',
    requires: ['Showtime.view.explore.Toolbar'],
    id: 'explore-panel',
    masked: {
        xtype: 'loadmask',
        message: 'Loading profiles'
    },
    config: {
        alias: 'explore-panel',
        tpl: templates.profileListLandscape,
        layout: 'fit',
        masked: {
            xtype: 'loadmask',
            message: 'Loading profiles'
        }
    },
    initialize: function() {
        this.callParent();

        this.tbar = Ext.create('Showtime.view.explore.Toolbar', {
            title: 'LCF MA_12',
            config: {
                docked: 'top'
            }
        });

        //add the toolbar (will be docked)
        this.add(this.tbar);
    },
    /*
     * Load (or reload) profiles into the main carousel
     */
    loadProfiles: function(records, courseData) {
        //remove the existing carousel to rebuild it
        this.removeAll(true);
        this.setMasked(true);
        if (courseData) {
            this.tbar.setTitle(courseData.name);
            Ext.ComponentQuery.query('#backButton')[0].show();
        } else {
            this.tbar.setTitle('LCF MA_12');
        }

        //generate card components for main carousel
        var cards = this.createCards(records);

        //create a new carousel and populate with cards
        this.carousel = Ext.create('Ext.Carousel', {
            hidden: true,
            layout: 'fit',
            items: cards,
            id: 'explore-carousel',
            itemId: 'carousel',
            listeners: {
                /*: function(container, newCard, oldCard, index){
                    var current_page = this.getActiveIndex()+1;
                    var total_pages = this.items.length;
                    console.log('data page: '+Showtime.store.Profile.currentPage);
                    console.log('current page: '+current_page);
                    console.log('total pages: '+total_pages);

                    //if near end of carousel, load new data
                    console.log('endreached?'+Showtime.store.Profile.endReached)
                    if ( current_page >= total_pages && !Showtime.stores.onlineProfiles.endReached) {
                        loading.show();
                        Showtime.store.onlineProfile.nextPage();
                    }
                },*/
                deactivate: function(){
                    this.removeAll(true);
                }
            }
        });

        this.add(this.carousel);
        this.carousel.show('fade');
    },

    /*
     * Generates carousel card components using supplied data
     */
    createCards: function(records) {
        //sort the records into arrays with max 8 items each
        var carditems = [], x=0;
        for (var i=0; i<records.length; i++) {
            if (i % 8 == 0) {
                x = i / 8;
                carditems[x] = [];
            }
            carditems[x].push(records[i].data);
        }

        //create components for each card
        var cards = [];

        //define the tile object:
        Ext.define('Showtime.view.Card',  {
            extend: 'Ext.Component',
            xtype: 'explore-card',
            config: {
                profileData: []
            },
            // have to fire the event as they are not bubbled up from components:
            initialize: function () {
                this.callParent();
                var me = this;
                this.element.on ({
                    scope: me,
                    tap: function (e, t) {
                        me.fireEvent ('tap', me, e, t);
                    }
                });
            }
        });

        Ext.each(carditems, function(cardData){
            var component = Ext.create('Showtime.view.Card', {
                profileData: cardData
            });
            var renderData = function() {
                //detect current profile
                //var tpl = Showtime.getProfile() == "tabletPortrait" ? templates.profileListPortrait : templates.profileListLandscape;
                var tpl = templates.profileListLandscape;
                tpl.overwrite(component.element, cardData);
                component.element.repaint();
                component.items = new Ext.CompositeElementLite();
                component.items.fill(Ext.query('.explore-item', component.element.dom));
            };

            if (component.rendered) {
                renderData();
            } else {
                component.on('painted', renderData, this, {single: true});
            }

            cards.push(component);
        });

        return cards;
    }/*,
    trimCards: function(startcard, endcard) {
        //remove all cards of index not within the range of startcard and endcard
        for (var i=1; i<=startcard; i++){
            console.log('removing:'+i);
            console.log(this.carousel.items.items[i-1]);
            this.carousel.remove(this.carousel.items.items[i-1]);
        }
    }*/
});