/**
 * @class Showtime.Main
 * @extends Ext.Panel
 */
Ext.define('Showtime.view.Main', {
    extend: 'Ext.Panel',
    alias: 'main-view',
    config: {
        id: 'Main',
        layout: 'card',
        cardSwitchAnimation: 'slide',
        fullscreen: true
    }
});