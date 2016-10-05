/*
* A bunch of jQuery helper functions
**/

;(function($) {
// Returns true if the point intersects the rectangle
// Presumes: point has left/top properties and
//					 rectangle has left/top, width/height properties
var util = {
	pointIntersects:function(point, rect) {
		return ((point.left > rect.left && point.left < rect.left + rect.width) &&
			(point.top > rect.top && point.top < rect.top + rect.height));
	},
	rectIntersects:function(a, b) {
		if (a.left + a.width < b.left) return false;
		if (a.left > b.left + b.width) return false;
		if (a.top + a.height < b.top) return false;
		if (a.top > b.top + b.height) return false;
		return true;
	},
	// Returns a rectangle from a object, Element, jQuery selector or array
	getRectangle:function(pointSelectorOrElement) {
		if (typeof pointSelectorOrElement == 'string') {
			return $(pointSelectorOrElement).rectangle();
		} else if (typeof pointSelectorOrElement == 'object') {
			if (pointSelectorOrElement instanceof Element)
                return $(pointSelectorOrElement).rectangle();
			if (pointSelectorOrElement instanceof jQuery) 
				return pointSelectorOrElement.rectangle();
			if (pointSelectorOrElement instanceof Array) {
				if (pointSelectorOrElement.length == 2) {
					// Presume left,top
					return {
						left:pointSelectorOrElement[0],
						top: pointSelectorOrElement[1],
						width: 1,
						height: 1
					}
				} else if (pointSelectorOrElement.length == 4) {
					// Presume left,top,width,height
					return {
						left:pointSelectorOrElement[0],
						top: pointSelectorOrElement[1],
						width:pointSelectorOrElement[2],
						height:pointSelectorOrElement[3]	
					}
				}
			}
			// Normalise to top,left,width,height
			if (typeof pointSelectorOrElement.width == 'undefined')
				pointSelectorOrElement.width = 1;
			if (typeof pointSelectorOrElement.height == 'undefined')
				pointSelectorOrElement.height = 1;
			if (typeof pointSelectorOrElement.left == 'undefined' && typeof pointSelectorOrElement.x !== 'undefined')
				pointSelectorOrElement.left = pointSelectorOrElement.x;
			if (typeof pointSelectorOrElement.top == 'undefined' && typeof pointSelectorOrElement.y !== 'undefined')
				pointSelectorOrElement.top = pointSelectorOrElement.y;
			return pointSelectorOrElement;
		}
	}
}
// Converts the page coordinates to coordinates
// relative to the element's parent
$.fn.convertToRelative = function(left, top) {
	var offset = $(this.get(0).parentElement).offset();
  
  // Calculate relative pixel position, also taking into account
  // scrolling of the window
  var relativePixelPos = {
    left: left - offset.left + window.scrollX,
    top: top - offset.top + window.scrollY
  }
  return relativePixelPos;
}

// Returns a rectangle of an element 
// based on its position and outer width/height
$.fn.rectangle = function() {
		var r = this.position();
		r.width = this.outerWidth();
		r.height = this.outerHeight();
		return r;
}

$.fn.size = function() {
	return {
		width: this.outerWidth(),
		height: this.outerHeight()
	}
}

// Returns pos+size of an element based on its offset
// and outer width/height
$.fn.rectangleOffset = function() {
		var r = this.offset();
		r.width = this.outerWidth();
		r.height = this.outerHeight();
		return r;
}

// Returns true if the element(s) intersects
$.fn.intersects = function(point) {
    point = $(point);
    var me = this;
    var match = false;
    point.each(function(i, pointElement) {
        var pointRect = util.getRectangle(pointElement);
        me.each(function(index, element) {
            if (element == pointElement) return; // ignore self
            $e = $(element);
            var rect = $e.rectangle();
            if (util.rectIntersects(pointRect, rect)) {
                match = true;
            }
        });
    });
    return match;
}

// Returns a jQuery collection of all elements which intersect point
$.fn.findIntersecting = function (point) {
	var pointRect = point;
	if (typeof point === 'undefined') pointRect = util.getRectangle($(this));
	else pointRect = util.getRectangle(point);

	var t = $([]);
	this.each(function(index, element) {
		var $e = $(element);
		if ($e.intersects(pointRect)) {
			t = t.add($e);
		}
	})
	return t;
}

$.fn.findNotIntersecting = function(point) {
	var pointRect = point;
	if (typeof point === 'undefined') pointRect = util.getRectangle($(this));
	else pointRect = util.getRectangle(point);

	var t = $([]);
	this.each(function(index, element) {
		var $e = $(element);
		if (!$e.intersects(pointRect)) {
			t = t.add($e);
		}
	})
	return t;
}
})(jQuery);