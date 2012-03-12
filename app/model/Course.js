/**
 * @class Course
 * @extends Ext.data.Model
 * The Course model
 */
Ext.define("Showtime.model.Course", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: "id", type: "int"},
            {name: "name", type: "string"},
            {name: "slug", type: "string"},
            {name: "url", type: "string"}
        ]
    }
});

