/*
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
}