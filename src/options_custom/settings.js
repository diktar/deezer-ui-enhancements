window.addEvent("domready", function () {
    // Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        //settings.manifest.myButton.addEvent("action", function () {
        //    alert("You clicked me!");
        //});
    });
});
