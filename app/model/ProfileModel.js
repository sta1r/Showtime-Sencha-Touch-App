/**
 * @class Profiles
 * @extends Ext.data.Model
 * The Profiles model used in the main carousel listing and A-Z popup
 */
Ext.define("Showtime.model.ProfileModel", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: "id"},
            {name: "profileName", type: "string"},
            {name: "firstName", type: "string"},
            {name: "lastName", type: "string"},
            {name: "fullName", type: "string"},
            {name: "course", type: "auto"},
            {name: "thumb", type: "auto"},
            {name: "updated"}
        ]
        /*setThumbUrl: function() {
            var url = this.get('thumb');

            var script = document.createElement("script");
            script.setAttribute("src",
                "http://src.sencha.io/data.Showtime.setThumbUrl-" + this.getId() +
                "/" + url
            );
            script.setAttribute("type","text/javascript");
            document.body.appendChild(script);
        }*/
        }
});
