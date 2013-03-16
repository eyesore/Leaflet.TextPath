Leaflet.TextPath
================

Shows a text along a Polyline.

Usage
-----

For example, show path orientation on mouse over :

```
    var layer = L.polyLine(...);

    layer.on('mouseover', function () {
        this.setText('  ►  ', {repeat: true, fillColor: 'red'});
    });

    layer.on('mouseout', function () {
        this.setText(null);
    });
```

This fork adds a couple of options, and completely changes that way that the repeat option works.

Note:  If your repeat text is only a single character as in the example above, the original functionality will perform better.  This version creates a textPath element for each repition of the text by default.  You have better control over the spacing.  We are using it for road names.  To use the original repeat functionality, which created a single <textpath> element, set the **simpleRepeat** option *and* the **repeat** option to true.

An example of the extended functionality:

```
    // add road name to geojson roads as they are added to the map
    map.on('layeradd', function(e){
        var layer = e.layer;
        if(layer.feature && layer.feature.properties.roadName) {
            layer.setText(layer.feature.properties.roadName, {
                repeat: true,
                offset: 25
            });
        }
    });
```

# Options

**repeat**
Boolen, default: false
If true, will repeat the text along the path as many times as will fit.

**center**
Boolean, default: false
If true, *and repeat is false*, will place the text approximately in the center of the path.

**fillColor**
String, default: 'black'
Text color attribute.

**offset**
Int, default: 0
Percentage of the path to offset the text if repeat is false, or percentage of the path to put in between repitions of the text if repeat is true.  If center is true, offset will be overridden.
Note that this is an int, and not a string ( 5, not '5%' ).

**simpleRepeat**
Boolean, default: false
Restores the original repeat functionality when passed together with **repeat** == true.  This will result in a single <textpath> being appended to the layer's path instead of one for each repitition, and may perform better, especially for very long LineStrings.

Screenshot
----------

![screenshot](https://raw.github.com/eyesore/Leaflet.TextPath/master/screenshot.png)

Credits
-------
Most of the SVG legwork was done by the original plugin author.

The main idea comes from Tom Mac Wright's *[Getting serious about SVG](http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/)*
