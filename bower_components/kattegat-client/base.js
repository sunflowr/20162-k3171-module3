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
})