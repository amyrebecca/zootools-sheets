# Zoo Tools for Google Sheets

## Development

Zoo Tools for Google Sheets is a custom Google Sheets add-on originally developed for a curriculum for a college level introductory astronomy course using [Galaxy Zoo](http://www.galaxyzoo.org/) data.

It is developed with:
- [Google Apps Script](https://developers.google.com/apps-script/)
- [math.js library](http://mathjs.org/)
- [underscore.js library](http://underscorejs.org/)
- [leaflet.js](https://leafletjs.com/) with an open street map tile set. 

## Usage

The add-on can be installed [via link](https://chrome.google.com/webstore/detail/zoo-tools-for-google-shee/fahnglbfamicnajdcloniiikdmngihgi?authuser=0).

More information about the curriculum and course activities is found on the [course landing page](https://drive.google.com/drive/folders/0B18vKHxr-rUfaHJXczZrSDc3dTA).

## Contributing

### Issues

When submitting issues please be as descriptive as possible. Include browser and operating system combination as well as any screen shots. Bonus points for console messages.

### Pull Requests

If you want to add to the development of this add-on, please fork and submit a pull request. Unfortunately there isn't a good way to develop this add-on locally. You will need to pull down this repo and setup and copy the contents of the files into a Google Sheet you've setup for development. Please test any new features in all of the latest browser version as well as following Google's [test add-on](https://developers.google.com/apps-script/add-ons/test) guidelines.

It is critical that the oauth client id is never updated or else it will completely break the add-on. [See open Google issue](https://issuetracker.google.com/issues/73439010). The associated cloud project, Google Maps API key, and Oauth client ID and secret is managed on Google Cloud Platform which Zooniverse devs will have access to.
