var activePostId = 0;
var postLength = 10;

$(document).ready(function() {
	// Prevent browser's default touch gestures
	$('#touch-scroll1').on('touchmove', function(e) {
		e.preventDefault();
	});
	$('#touch-scroll2').on('touchmove', function(e) {
		e.preventDefault();
	});

  var htScroll1 = new Hammer($("#touch-scroll1")[0], {
    preventDefault: true
  });
  htScroll1.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
  htScroll1.on("swipeup", function(e) {
    // Swipe up.
    setActivePost(activePostId + 1);
    console.log("swipeup " + activePostId);
  });
  htScroll1.on("swipedown", function(e) {
    // Swipe down.
    setActivePost(activePostId - 1);
    console.log("swipedown " + activePostId);
  });
  

  /*var region = new ZingTouch.Region(document.getElementById("toucharea"));

  var target = document.getElementById("touch-scroll1");
  region.bind(target, "pan", function(e){ e.preventDefault(); });
  region.bind(target, "swipe", function(e){
    console.log("swwwwwipe");
    var dir = Math.floor(e.detail.data[0].currentDirection);
    if((dir >= 0) && (dir < 180)){
      // Swipe down.
      activePostId += 1;
    }
    else {
      // Swipe up.
      activePostId -= 1;
    }
    setActivePost(activePostId);
    console.log("swipe " + activePostId + " " + dir);
  });

  target = document.getElementById("touch-scroll2");
  region.bind(target, "pan", function(e){ e.preventDefault(); });
  region.bind(target, "swipe", function(e){
    var dir = Math.floor(e.detail.data[0].currentDirection);
    if((dir > 90) && (dir < 270)){
      // Swipe down.
      activePostId += 1;
    }
    else {
      // Swipe up.
      activePostId -= 1;
    }
    setActivePost(activePostId);
    console.log("swipe " + activePostId + " " + dir);
  });*/

  var users = [
    "user1",
    "user2",
    "user3",
  ];
  var pages = [
    "page1",
    "ad1",
    "page2",
  ];
  for(var i = 0; i < postLength; i++) {
    var isPage = Math.random() > 0.5;
    var name;
    if(isPage) {
      name = pages[Math.floor(Math.random() * pages.length)];
    } else {
      name = users[Math.floor(Math.random() * users.length)];
    }
    $("#post-list").append(createPost(i, name, isPage));
  }
  setActivePost(5);
});

function createPost(id, name, isPage) {
  var post = "";
  post += "<article id=\"post-" + id + "\" class=\"post"
  if(isPage) {
    // Make page post differ.
    post += " post-page";
  }
  post += "\" data-user=\"" + name + "\">"
  post += "<header class=\"post-head\">"
  post += "<div><img src=\"\" class=\"avatar\"></div>"
  post += "<div class=\"post-meta\">"
  post += "<div class=\"name\">" + name + " posted</div>"
  post += "<div class=\"date\">2016-19-05 at 19:45</div>"
  post += "</div>"
  post += "</header>"
  post += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet condimentum enim, non fermentum justo mattis placerat. Morbi et porttitor leo. Morbi eleifend consequat vehicula. Nam sit amet leo nec sem fringilla interdum. Sed semper lorem nisi, id placerat sem imperdiet et. Curabitur sed malesuada orci. Morbi ac nulla in nisi sagittis dapibus consectetur quis tellus. Donec ornare interdum bibendum. Cras accumsan ligula ultrices lacus tincidunt, non ultricies augue porta. Etiam in rhoncus eros. Sed ut lacus vel tellus tincidunt maximus consectetur ut nunc. Integer est purus, commodo ac dolor in, ultricies rutrum mi. Suspendisse potenti. Praesent ex erat, gravida non faucibus eu, viverra id dolor. Donec a odio ullamcorper, pellentesque justo at, accumsan turpis. Phasellus suscipit tincidunt urna nec bibendum."
  post += "</article>"

  return post;
}

function scrollToPost(id) {
  var nid = "#post-" + id;
  //$("#post-" + id)[0].scrollIntoView();
  $('html, body').animate({
      scrollTop: $(nid).offset().top
  }, 1000);
}

function setActivePost(id) {
  if(activePostId) {
    $("#post-" + activePostId).removeClass("post-active");
  }

  // Clamp id in range 0 ... postLength.
  if(id < 0) {
    id = 0;
  } else if(id >= postLength) {
    id = postLength - 1;
  }

  // Only update active id if it changed.
  if(activePostId != id) {
    activePostId = id;
    $("#post-" + activePostId).addClass("post-active");
    scrollToPost(activePostId);
  }
  console.log(activePostId);
}
