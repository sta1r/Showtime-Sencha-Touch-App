/**
 * @class Showtime.Main
 * @extends Ext.Panel
 */
Ext.define('Showtime.view.Main', {
    extend: 'Ext.Panel',
    config: {
        id: 'viewport',
        layout: 'card',
        cardSwitchAnimation: 'slide',
        fullscreen: true
    }
});