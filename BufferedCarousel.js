Ext.ns("SS");

SS.BufferedCarousel = Ext.extend(Ext.Carousel, {

    constructor: function(options) {
        options = Ext.apply({}, options, {
            bufferSize: 2
        });
        SS.BufferedCarousel.superclass.constructor.call(this, options);
    },
    
    initComponent: function() {
        this.items = [];
        var indicator = this.indicator;
        this.indicator = false;
        
        SS.BufferedCarousel.superclass.initComponent.apply(this, arguments);
        
        if (indicator) {
            this.indicator = new SS.BufferedCarousel.Indicator({
                carousel: this
            });
        }
    },
    
    afterRender: function() {
        SS.BufferedCarousel.superclass.afterRender.apply(this, arguments);
        
        this.body.on({
            touchstart: this.onTouchStart,
            scope: this
        });
        
        this.bufferCards(this.initialCarouselPosition || 0);
        this.el.repaint();
        this.mon(this, 'cardswitch', this.handleCardSwitch, this);
    },
    
    onTouchStart: function() {
        this.onTransitionEnd();
    },

    handleCardSwitch: function(carousel, card) {
        this.bufferCards(card.carouselPosition);
    },

    /**
     * Creates/removes cards to the left and right of the current card
     */    
    bufferCards: function(index) {
        // Quick return if there is nothing to do
        if (this.lastBufferedIndex == index) { return; }
        this.lastBufferedIndex = index;
        
        this.fireEvent('buffer', this, index);
        
        // Initialize variables
        var
            // size of the window
            bufferSize = this.bufferSize,
            // constrained start index of the window
            start = (index-bufferSize).constrain(0, this.itemCount-1),
            // constrained end index of the window
            end = (index+bufferSize).constrain(0, this.itemCount-1), 
            items = this.items,
            // flag to determine if any items were added/removed
            changed = false,
            // will be set to the item where its position == index
            activeCard;

        // make sure the index is within bounds
        index = index.constrain(0, this.itemCount-1);
        
        // cull existing items
        var i = 0;
        while (i < items.length) {
            var item = items.get(i),
                itemIndex = item.carouselPosition;
            
            if (itemIndex < start || itemIndex > end) {
                this.remove(item, true);
                changed = true;
            }
            else {
                i++;
            }
        }
        
        // function to create a card and add to the carousel
        var createCard = function(carouselPos, layoutPos) {
            var card = this.createItem(i);
            if (card) {
                card.carouselPosition = carouselPos;
                if (layoutPos != null) {
                    this.insert(layoutPos, card);
                }
                else {
                    this.add(card);
                }
                if (carouselPos == index) {
                    activeCard = card;
                }
                changed = true;
            }
        };
        
        // add new items
        if (items.length) { // if existing items, add to the left and right
            var first = items.first().carouselPosition,
                last = items.last().carouselPosition;
            for (var i = first-1; i>=start; i--) {
                if (i >= 0) {
                    createCard.call(this, i, 0);
                }
            }
            
            for (var i = last+1; i<=end; i++) {
                createCard.call(this, i);
            }
        }
        else { // if no existing items, just add cards
            for (var i = start; i<=end; i++) {
                if (i >= 0) {
                    createCard.call(this, i);
                }
            }
        }
        
        // if changed, make sure the layout is updated
        // also, update the active item if needed
        if (changed) {
            this.doLayout();
            
            var activeItem = this.layout.getActiveItem();
            if (activeCard && activeItem != activeCard) {
                this.layout.setActiveItem(activeCard);
            }
        }
    },
    
    getIndex: function() {
        var activeItem = this.layout.getActiveItem();
        return activeItem ? activeItem.carouselPosition : -1;
    }
});

SS.BufferedCarousel.Indicator = Ext.extend(Ext.Component, {
    baseCls: "ss-pagedCarousel-indicator",
    
    initComponent: function() {
        if (this.carousel.rendered) {
            this.render(this.carousel.body);
        }
        else {
            this.carousel.on('render', function() {
                this.render(this.carousel.body);
            }, this, {single: true});
        }
    },
    
    onRender: function() {
        SS.BufferedCarousel.Indicator.superclass.onRender.apply(this, arguments);
        
        this.positionIndicator = this.el.createChild({tag: 'span'});
    },
    
    onBeforeCardSwitch: function(carousel, card) {
        if (card) {
            var position = card.carouselPosition/(this.carousel.itemCount-1),
                position = isNaN(position) ? 0 : position*100,
                el = this.el;
            
            this.positionIndicator[this.carousel.direction=='vertical'?'setTop':'setLeft'](position.toFixed(2)+"%");
            
            el.setStyle('opacity', '1');
            
            if (this.hideTimeout != null) {
                clearTimeout(this.hideTimeout);
            }
            
            this.hideTimeout = setTimeout(function() {
                el.setStyle('opacity', '0');
            }, 1500);
        }
    },
    
});