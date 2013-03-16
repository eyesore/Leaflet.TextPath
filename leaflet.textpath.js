/*
 * Forked and based on:
 * https://github.com/makinacorpus/Leaflet.TextPath
 *
 * Inspired by Tom Mac Wright article :
 * http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/
 */

var PolylineTextPath = {
    setText: function (text, options) {
        /* If empty text, hide */
        if (!text)
            return this._textCleanup();

        options = L.Util.extend(this._setTextDefaults(), options);

        var id = 'pathdef-' + L.Util.stamp(this),
            svg = this._map._pathRoot;
        this._path.setAttribute('id', id);

        var textNode = this._createElement('text'),
            textPath = this._createElement('textPath');

        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#'+id);
        textNode.setAttribute('fill', options.fillColor);
        textNode.setAttribute('dy', this._path.getAttribute('stroke-width') - 1);
        textPath.appendChild(document.createTextNode(text));
        textNode.appendChild(textPath);

        // TODO get rid of add/remove
        svg.appendChild(textNode);
        var patternLength = textPath.getComputedTextLength(),
            pathLength = this._path.getTotalLength(),
            ratio = patternLength / pathLength * 100,
            textRepeat;  // array to be populated with repitions
        textNode.removeChild(textPath);
        svg.removeChild(textNode);

        // maybe already divided by zero, whoops
        if(pathLength === 0 || patternLength === 0 || ratio > 90)
            return this._textCleanup();

        if(options.repeat) {
            var maxCopies = Math.floor(100 / (ratio + options.offset));
            if(options.simpleRepeat) {
                // repeating string in a single textPath - todo simplify or remove
                text = new Array(Math.floor(pathLength / patternLength)).join(text);
                textPath.removeChild(textPath.firstChild);
                textPath.appendChild(document.createTextNode(text));
                options.repeat = false;
                options.center = false;
            }
            else if(maxCopies <= 1) {
                options.repeat = false;
                options.center = true;
            }
            else {
                options.center = false;  // no centering if we can repeat
                textRepeat = this._repeatPattern(textPath, maxCopies, options.offset, ratio);
            }
        }

        if(options.center)
            options.offset = (100 - ratio) / 2;

        if(textRepeat) {
            var i;
            for(i = 0; i < textRepeat.length; i++)
                textNode.appendChild(textRepeat[i]);
        }
        else {
            textPath.setAttribute('startOffset', options.offset + '%');  // typesafety?
            textNode.appendChild(textPath);
        }

        svg.appendChild(textNode);
        this._textNode = textNode;
        console.log(textNode);
        return this;
    },

    /**
     * Get a repeated version of the text for insertion.
     * @param  {SVG.textPath} pattern The textPath that will be spaced along the path
     * @param  {int} count Number of times to repeat
     * @param {int}  offset Percentage of the total path to leave between each repition
     * @param {int} ratio Percentage of the total path occupied by pattern
     * @return {array} Copies of the original pattern, with offsets
     */
    _repeatPattern: function(pattern, count, offset, patternLength)
    {
        var i, nextCopy, id,
            nextOffset = offset,
            out = [];

        for(i = 0; i < count; i++)
        {
            id = 'pathdef-' + L.Util.stamp(this);
            nextCopy = this._createElement('textPath');
            nextCopy = L.Util.extend(nextCopy, pattern);
            nextCopy.setAttribute('startOffset', nextOffset + '%');
            nextCopy.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#'+id);
            out.push(nextCopy);
            nextOffset += Math.floor(offset + patternLength);
        }
        return out;
    },

    _textCleanup: function()
    {
        if(this._textNode)
            this._map._pathRoot.removeChild(this._textNode);
    },

    _setTextDefaults: function()
    {
        return {
            repeat: false,
            simpleRepeat: false,
            center: false,  // only apply if text is not repeated - overrides offset
            fillColor: 'black',
            offset: 0 // percentage of total path length, use for startOffset and space between repeats
        };
    }
};

L.Polyline.include(PolylineTextPath);

L.LayerGroup.include({
    setText: function(text, options) {
        for (var layer in this._layers) {
            if (typeof this._layers[layer].setText === 'function') {
                this._layers[layer].setText(text, options);
            }
        }
        return this;
    }
});
