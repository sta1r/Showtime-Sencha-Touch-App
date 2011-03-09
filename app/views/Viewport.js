/**
 * @class Showtime.Viewport
 * @extends Ext.Panel
 */
Showtime.Viewport = Ext.extend(Ext.Panel, {
    id        : 'viewport',
    layout    : 'card',
    cardSwitchAnimation: 'slide',
    fullscreen: true,
});

/*showtime.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    cardSwitchAnimation: 'slide',
    initComponent: function() {
        //put instances of cards into app.views namespace
        Ext.apply(showtime.views, {
            profilesList: new showtime.views.ProfilesList(),
            profileDetail: new showtime.views.ProfileDetail(),
            //contactForm: new app.views.ContactForm()
        });
        //put instances of cards into viewport
        Ext.apply(this, {
            items: [
                showtime.views.profilesList,
                showtime.views.profileDetail,
                //app.views.contactForm,
            ]
        });
        showtime.views.Viewport.superclass.initComponent.apply(this, arguments);
    }
});*/