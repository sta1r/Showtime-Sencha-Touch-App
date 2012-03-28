/**
 * @class Showtime.Main
 * @extends Ext.Panel
 */
Ext.define('Showtime.view.Main', {
    extend: 'Ext.Container',
    requires: ['Ext.Container'],
    alias: 'showtime-viewport',
    config: {
        id: 'Main',
        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 1
            }
        },
        fullscreen: true
    }
});