/*
 * MVR - Minimum Viable Reddit
 * 
 * author:  Guy Bianco IV <@gjbiancoiv>
 * created: September 7, 2017
 */
(function() {
  'use strict';

  // TODO whitelist comments when support added
  // whitelist only main subreddit pages (https://regex101.com/r/7Fdbzd/3)
  if(!document.URL.match(/^.*reddit\.com\/?(?:r\/\w*\/?(\?.*)?)?$/)) {
    return;
  }

  // constants
  var SELECTED_CLASS = 'selectedPost';
  var SCROLL_OFFSET = -5; // pixels

  // good ol' global variables :P
  var posts;
  var currentPost = 0;
  var expanded = false;

  function init() {

    // grab our list of posts
    var postList = document.getElementById('siteTable');
    posts = postList.querySelectorAll('.thing');

    // select default intial post
    posts[currentPost].classList.add(SELECTED_CLASS);

    // TODO select post when clicked
    // for(var pi in posts) {
    //   var p = posts[pi];
    //   p.addEventListener('click', function() {
    //     changeSelected(0);
    //   });
    // }

    document.addEventListener('keydown', function(key) {
      // avoid triggering while typing in text boxes
      var aeType = document.activeElement.type;
      if(aeType === 'textarea' || aeType === 'input') {
        return;
      }
      // also avoid triggering if any modifiers are pressed
      if(key.ctrlKey || key.shiftKey || key.altKey || key.metaKey) {
        return;
      }
      switch(key.code) {
        case 'KeyJ':
          // select next post
          changeSelected(currentPost + 1);
          break;
        case 'KeyK':
          // select prev post
          changeSelected(currentPost - 1);
          break;
        case 'KeyH':
          // toggles in-line viewing ("expando")
          expanded = !expanded;
          toggleSingleExpando(posts[currentPost]);
          break;
        case 'KeyL':
          // open post in new tab
          window.open(posts[currentPost].querySelector('a.title').href);
          break;
        case 'KeyM':
          // open comments in new tab
          window.open(posts[currentPost].querySelector('.first>a').href);
          break;
        case 'Period':
          // go to next page
          window.location = document.querySelector('.next-button > a').href;
          break;
        case 'Comma':
          // go to prev page
          window.location = document.querySelector('.prev-button > a').href;
          break;
      }
    });
  }

  // handles updating DOM when our selected post changes
  function changeSelected(newIndex) {
    // change our current post
    var oldPost = posts[currentPost];
    currentPost = Math.max(0, Math.min(newIndex, posts.length - 1));
    var newPost = posts[currentPost];

    // change our post
    oldPost.classList.remove(SELECTED_CLASS);
    newPost.classList.add(SELECTED_CLASS);
    if(expanded) {
      toggleSingleExpando(oldPost);
      toggleSingleExpando(newPost);
    }

    // scroll to post
    // FIX has issue scrolling to last post on a page (possibly others?)
    window.scroll(0, [newPost.offsetTop + newPost.offsetParent.offsetTop + SCROLL_OFFSET]);
  }

  function toggleSingleExpando(post) {
    var expando = post.querySelector('.expando-button');
    if(expando) {
      expando.click();
    }
  }

  // initialize on page load
  if(window.onload) {
    var curronload = window.onload;
    var newonload = function(evt) {
      curronload(evt);
      init(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = init;
  }
})();