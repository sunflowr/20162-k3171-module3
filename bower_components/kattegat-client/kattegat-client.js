/**
* A small set of helper functions for Kattegat apps
**/
;window.kattegat = {
	// Small function to check browser
	device: {
	  android: function() {
	      return navigator.userAgent.match(/Android/i);
	  },
	  ios: function() {
	      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	  },
	  opera: function() {
	      return navigator.userAgent.match(/Opera Mini/i);
	  },
	  winphone: function() {
	      return navigator.userAgent.match(/IEMobile/i);
	  },
	  mobile: function() {
	      return (kattegat.device.android() || kattegat.device.ios() || kattegat.device.opera() || kattegat.device.winphone());
	  }
	},
	// Flashes a message for the user.
	// if isError, shows it with the 'error' class
	notify: function(msg, isError) {
		if (typeof isError == 'undefined') isError = false;
		var cls = "toast";
		if (isError) cls += " error";
		if (isError) {
			console.log("ERR: " + msg);
		} else {
			console.log("LOG: " + msg);
		}

		$('<div class="' + cls + '">' + msg + '</div>')
			.appendTo("body")
			.transition({opacity:1.0})
			.transition({opacity:0.0, delay: 3000}, function() {
				$(this).remove();
			});
	},
	// Flashes an error message for the user
	notifyError:function(msg) {
		this.notify(msg, true);
	},

	// Makes sure that value is at least min and no greater than max
	rangeClip:function(value, min, max) {
		value = Math.min(value, max);
		value = Math.max(value, min);
		return value;
	},

	// Scales a number from one range to another
	rangeScale:function(value, existingMin, existingMax, newMin, newMax) {
		// Clip number to range
		if (value < existingMin) value = existingMin;
		if (value > existingMax) value = existingMax;
		
		// Convert to a percentage relative to existing range
		value = value - existingMin;
		var existingRange = existingMax - existingMin;
		var pc = (value - existingMin)/existingRange;
		
		// Apply tp new range
		var newRange = newMax - newMin;
		value =  pc*newRange;
		value += newMin; // And boost to min

		// Shouldn't go over new range, but for our sanity...
		if (value < newMin) value = newMin;
		if (value > newMax) value = newMax;
		return value;
	}
}

// Helper class to smooth data values.
// It does this over a window of size 'samples'
function Smoother(samples) {
  this.data = new Array();
  this.low = 99999999;
  this.high = 0;
  for (var i=0;i<samples; i++) {
    this.data.push(0);
  }
}
// Return the data as an indexed array:
// [ [1, datapoint1], [2, datapoint2] ...]
// Made so that smoother can fit into a plotting library
Smoother.prototype.getIndexedData = function() {
	var t = new Array();
	for (var i = this.data.length - 1; i >= 0; i--) {
		t.push([i+1, this.data[i]]);
	};
	return t;
}
// Return the raw data
Smoother.prototype.getData = function() {
	return this.data;
}
// Push a new data value into the window (removing the oldest)
Smoother.prototype.push = function(v) {
    this.data.shift();
    this.data.push(v);
    if (v > this.high) this.high = v;
    if (v < this.low) this.low =v;
}
// Return highest number in current window
Smoother.prototype.getHigh = function() {
	return this.high;
}
// Return smallest number in current window
Smoother.prototype.getLow = function() {
	return this.low;
}
// Return the difference between newest and oldest data point
Smoother.prototype.getGradient = function() {
	return this.data[this.data.length-1] - this.data[0];
}
// Return average of current window
Smoother.prototype.get = function() {
  var count = 0;
  for (var i=0;i<this.data.length; i++) {
    count += this.data[i];
  }
  count = count / this.data.length;
  return count;
}
$(document).on("ready", function() {
	// If document has
	//		kattegat-livereload="true"
	// attribute, we'll attempt to get the livereload script
	if ($("body").attr("kattegat-livereload") == "true") {
		if (location.host.indexOf('.io') > 0 || 
			location.host.indexOf('.net') > 0 || 
			location.host.indexOf('.com') > 0 || 
			location.host.indexOf('.net') > 0) {
			console.log("Live-reload disabled for hosted sketch")
		} else $.getScript("http://" + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js');
	}
});/*
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
})(jQuery);;/*
Helper code to use Web Audio.

First run:
  kattegatAudio.initialize()

Load sounds via:
  kattegatAudio.load(name, url, callback);

Play a sound:
  kattegatAudio.play(name);

*/

;window.kattegatAudio = {
initialized: false,
sounds: {},
// Initialize audio context (this needs to be called only once)
initialize: function()  {
  if (this.initialized) return; // Already initialised
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
    this.initialized = true;
    return audioContext;
  } catch (e) {
    return null;
  }
},


/*
 Loads a set of sounds. Eg:
 var sounds = { 
   snare: 'snare.wav',
   kick: 'kick.wav',
   voice: 'vox.wav'
 }
 loadSounds(sounds, function(sounds) {
  console.log("Loaded sounds!");
 })
*/
loadSet: function(map, complete) {
  var names = _.keys(map);
  this.loadSetImpl(names, map, complete);
},

loadSetImpl: function(names, map, complete) {
  // Remove item from array
  var name = names.pop();
  var me = this;

  // Load sound
  this.load(name, map[name], function() {
    if (names.length == 0) {
      // No more sounds to load
      if (typeof complete !== 'undefined')
        complete(map);
    } else {
      // More sounds to load
      me.loadSetImpl(names, map, complete);
    }
  })
},

// Plays a sound previously loaded with loadSound
//  Note that 'time' parameter is to when to schedule playback.
//  0 is to start immediately, while 'window.audioContext.currentTime + 1' would be one second in future
play: function(name, time) {
  this.initialize();

  if (_.isUndefined(time)) time = 0;
  if (_.isUndefined(this.sounds[name])) throw new Error(name + " has not been loaded");
  var source = this.getSource(name);
  source.connect(window.audioContext.destination);
  source.start(time);
},

// Returns the data for a previously loaded sound
getSound: function(name) {
  if (_.isUndefined(this.sounds[name])) throw new Error(name + " has not been loaded");
  return this.sounds[name];
},

// Creates (or reuses) a buffer source for a previously loaded sound
getSource: function(name) {
  if (_.isUndefined(this.sounds[name])) throw new Error(name + " has not been loaded");
  var source = window.audioContext.createBufferSource();
  source.buffer = this.sounds[name];
  return source;
},

/*
 Loads a sound and associates a name with it. Eg:
 load('snare', 'snare.wav', function(name) { 
    console.log(name + " loaded!")
  });
*/
load: function(name, url, complete) {
  this.initialize();
  var req = new XMLHttpRequest();
  var me = this;
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';

  req.onload = function() {
    window.audioContext.decodeAudioData(req.response, function(data) {
      // Keep track of each sound we load
      me.sounds[name] =  data;
      if (!_.isUndefined(complete)) complete(name);
    })
  }
  req.send();
} 
};/**
* this code is from all around the web :)
* if u want to put some credits u are welcome!
*/
// From: http://inspirit.github.io/jsfeat/js/compatibility.js
window.kattegat.compatibility = (function() {
        var lastTime = 0,
        isLittleEndian = true,

        URL = window.URL || window.webkitURL,

        requestAnimationFrame = function(callback, element) {
            var requestAnimationFrame =
                window.requestAnimationFrame        || 
                window.webkitRequestAnimationFrame  || 
                window.mozRequestAnimationFrame     || 
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };

            return requestAnimationFrame.call(window, callback, element);
        },

        cancelAnimationFrame = function(id) {
            var cancelAnimationFrame = window.cancelAnimationFrame ||
                                        function(id) {
                                            clearTimeout(id);
                                        };
            return cancelAnimationFrame.call(window, id);
        },

        getUserMedia = function(options, success, error) {
            var getUserMedia =
                window.navigator.getUserMedia ||
                window.navigator.mozGetUserMedia ||
                window.navigator.webkitGetUserMedia ||
                window.navigator.msGetUserMedia ||
                function(options, success, error) {
                    error();
                };

            return getUserMedia.call(window.navigator, options, success, error);
        },

        detectEndian = function() {
            var buf = new ArrayBuffer(8);
            var data = new Uint32Array(buf);
            data[0] = 0xff000000;
            isLittleEndian = true;
            if (buf[0] === 0xff) {
                isLittleEndian = false;
            }
            return isLittleEndian;
        };

    return {
        URL: URL,
        requestAnimationFrame: requestAnimationFrame,
        cancelAnimationFrame: cancelAnimationFrame,
        getUserMedia: getUserMedia,
        detectEndian: detectEndian,
        isLittleEndian: isLittleEndian
    };
})();