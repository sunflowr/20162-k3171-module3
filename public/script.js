var postLength = 50;
var currentPost;
var searchingForPost = false;
var infoMessage = "";

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
    setActivePost(getNextPost("user1"), true);
  });
  htScroll1.on("swipedown", function(e) {
    // Swipe down.
    setActivePost(getPrevPost("user1"), true);
  });

  var htScroll1 = new Hammer($("#touch-scroll2")[0], {
    preventDefault: true
  });
  htScroll1.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
  htScroll1.on("swipeup", function(e) {
    // Swipe up.
    setActivePost(getNextPost("page2"), true);
  });
  htScroll1.on("swipedown", function(e) {
    // Swipe down.
    setActivePost(getPrevPost("page2"), true);
  });

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
  $("#post-list").append(createPost(0, users[0], isPage));
  for(var i = 1; i < postLength; i++) {
    var isPage = Math.random() > 0.5;
    var name;
    if(isPage) {
      name = pages[Math.floor(Math.random() * pages.length)];
    } else {
      name = users[Math.floor(Math.random() * users.length)];
    }
    $("#post-list").append(createPost(i, name, isPage));
  }
  $("#post-list").append(createPost(postLength, users[0], isPage));

  // Set active post.
  findCurrentlyActivePost();
});

$(document).scroll(function() {
  findCurrentlyActivePost();
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

function getNextPost(filter) {
  // Make sure current post is set.
  if(!currentPost) {
    currentPost = $("#post-list").children();
  }

  // Find next post based on filter.
  var query = ".post[data-user=\"" + filter + "\"]:first";
  var res = currentPost.nextAll(query);
  if(res.length) {
    // Next post found, return it.
    return res;
  }

  infoMessage = "No messages found";
  return null;
}

function getPrevPost(filter) {
  // Make sure current post is set.
  if(!currentPost) {
    currentPost = $("#post-list").children();
  }

  // Find prev post based on filter.
  var query = ".post[data-user=\"" + filter + "\"]:first";
  var res = currentPost.prevAll(query);
  if(res.length) {
    // Prev post found, return it.
    return res;
  }

  infoMessage = "No messages found";
  return null;
}

function scrollToPost(post) {
  searchingForPost = true;
  //$("#post-" + id)[0].scrollIntoView();
  $("html, body").animate({
      scrollTop: post.offset().top
  }, 1000, function() {
    searchingForPost = false;
  });
}

function setActivePost(post, scroll) {
  if((!post) || (!post.length)) {
    // Show "no more messages" info.
    $("#info-message").text(infoMessage);
    $("#info-message").fadeIn(400).delay(800).fadeOut(400);
    return;
  }

  if(currentPost) {
    currentPost.removeClass("post-active");
  }

  // Only update active id if it changed.
  if(currentPost != post) {
    currentPost = post;
    currentPost.addClass("post-active");

    // If we should scroll to new post.
    if(scroll) {
      scrollToPost(currentPost);
    }
  }
}

function findCurrentlyActivePost() {
  // Do nothing if searching for specific post.
  if(searchingForPost) {
    return;
  }

  var cutoff = $(window).scrollTop();

  // Find current top visible post.
  $("#post-list").children().each(function() {
    if(($(this).offset().top + $(this).height()) > cutoff) {
      // Visible post found, make it current.
      setActivePost($(this), false);

      // Stops the iteration after the first one on screen.
      return false; 
    }
  });
}

