Facebook Ads Library Enhancer

Description

This user script enhances the visibility and control of the Facebook Ads Library interface. It provides features to customize the URL parameters, control the display of ads based on a minimum number, and enable automatic scrolling for continuous loading and filtering of ads.

Installation

To use this script, you need a browser extension like Tampermonkey. Follow the steps below:

1. Install the Tampermonkey extension for your browser (Chrome, Firefox, Safari, Opera Next, or Microsoft Edge).
2. Click on the Tampermonkey icon in your browser toolbar.
3. Choose the "Dashboard" option.
4. Navigate to the "Utilities" tab.
5. In the "URL" section, enter the URL for this script:
    https://raw.githubusercontent.com/anass-kabil-cloudlink/Facebook-Ads-Library-Enhancer-UserScript/main/main.js
7. Click the "Import" button to add the script to Tampermonkey.

Features

- URL Customization Form

- Allows customization of URL parameters for Facebook Ads Library.
- Start and stop observing URL changes.
- Launch customized URL in a new tab.
- Refresh URL to revert changes.


- Ad Control Panel

- Set a minimum number of ads to keep displayed.
- Apply filter to hide ads based on the specified minimum.


- Automatic Scrolling

- Enable continuous scrolling for loading more ads.
- Apply filter while scrolling for dynamic ad control.

Usage

1. Open the Facebook Ads Library interface.
2. Customize URL parameters using the URL Form in the control panel.
3. Set the minimum number of ads to keep using the Ad Control form.
4. Enable scrolling and filtering by toggling the Scroll button in the control panel.


Additional Notes
Apply these Filters on ads block to minify the page load resources:
1. using custom adblock filters
- || static.xx.fbcdn.net/rsrc.php/v3iKjt4/*.js$script
- || static.xx.fbcdn.net/rsrc.php/y*.js$script
-|| video.xx.fbcdn.net/v/*.mp4$media
- || static.xx.fbcdn.net/rsrc.php/v3iC_l4/y_/l/*.js$script
- || scontent.frak*^
- || video.frak*^
- || frak^
- || *.mp4$media
- || *.jpg$image
- || *.jpeg$image
- || *.png$image
- || *.gif$image
- || *.webp$image
- || *.svg$image

2.Alternatively, enable request blocking at developer tools in your browser for these:

- scontent.frak2-2.fna.fbcdn.net
- scontent.frak1-1.fna.fbcdn.net
- scontent.frak2-1.fna.fbcdn.net
- gateway.facebook.com/ws/realtime?x-dgw-appid=541639493889025&x-dgw-appversion=0&x-dgw-authtype=1%3A0&x-dgw-version=5&x-dgw-uuid=100065466140549&x-dgw-tier=prod&x-dgw-app-stream-group=group1

Feel free to contribute to this script by providing feedback or suggestions for improvement. You can also report any issues or bugs you encounter while using it.

