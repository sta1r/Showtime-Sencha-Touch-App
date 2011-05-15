# Instructions:

In order for the web app to work in a local development environment this folder (/app/webroot/js/touch/lib) should contain a symlink to
a folder on your system containing the Sencha Touch files. This is to allow the same source to be shared with the XCode project and for
easier upgrading.

1. Download the Sencha Touch library and extract it somewhere e.g. ~/Code/Sencha/sencha-touch (when upgrading the Sencha Touch library overwrite the files in this folder with the latest version)
2. cd into the folder this readme is located e.g. cd /Applications/MAMP/htdocs/showtime/app/webroot/js/touch/lib
3. Create symlink here to the sencha touch library e.g. ln -s /Applications/MAMP/htdocs/showtime/app/webroot/js/touch/app/ showtime_app (info: http://hints.macworld.com/article.php?story=2001110610290643)
4. When run from localhost the web app should function as intended. 
5. For a live environment the required sencha library files should be copied into this folder (only sencha-touch.js and the sencha css file are needed)