function filterVideoElements() {
  for (video of videos) {
    var oldTitle = video.titleText;
    video.titleElement.innerText = createNewTitle(oldTitle);

    if (oldTitle != video.titleElement.innerHTML) {
      video.titleElement.style.color = "#E5862D";
    }
  }
}

function createNewTitle(oldTitle) {
  var split = oldTitle.split(" - ");
  if (split.length == 1) {
    return oldTitle;
  }

  var endPartOfTitle = split[split.length - 1];

  if (
    endPartOfTitle == "Game Grumps Animated" ||
    endPartOfTitle == "Game Grumps Compilations" ||
    endPartOfTitle == "Game Grumps" ||
    endPartOfTitle == "Guest Grumps" ||
    endPartOfTitle == "Ten Minute Power Hour" ||
    endPartOfTitle == "Steam Train" ||
    endPartOfTitle == "Game Grumps VS"
  ) {
    return oldTitle;
  }

  return endPartOfTitle;
}

function getVideoElementsForChannelOrSubs() {
  videos = [];

  var videoElements = document.getElementsByClassName(
    "style-scope ytd-grid-renderer"
  );

  for (i in videoElements) {
    var element = videoElements[i];
    if (element.innerHTML) {
      linkElements = element.querySelectorAll("a");
      if (linkElements.length > 0) {
        var possibleAuthorElement = getAuthorElement(linkElements);
        var titleElement = getTitleElement(linkElements);
        // if authorElement is null then we might be looking at the channel page or a video
        if (
          possibleAuthorElement == null ||
          possibleAuthorElement.innerHTML === "GameGrumps"
        ) {
          var video = {
            titleElement: titleElement,
            authorElement: possibleAuthorElement,
            titleText: titleElement.getAttribute("title")
          };
          videos.push(video);
        }
      }
    }
  }

  return videos;
}

function getVideoElementsForWatch() {
  videos = [];

  var secondaryVideoElements = document.getElementsByClassName(
    "style-scope ytd-watch-next-secondary-results-renderer"
  );

  var i = 0;
  for (element of secondaryVideoElements) {
    i++;
    if (i < 2) {
      continue;
    }

    var titleElementRoot = element.querySelectorAll("h3")[0];

    if (titleElementRoot) {
      var titleElement = titleElementRoot.querySelectorAll("span")[0];
      var video = {
        titleElement: titleElement,
        authorElement: element.querySelectorAll("ytd-channel-name")[0],
        titleText: titleElement.innerText
      };

      if (video.authorElement.innerText === "GameGrumps") {
        videos.push(video);
      }
    } else {
      // playlist probably
    }
  }

  return videos;
}

function getTitleElement(linksElements) {
  for (element of linksElements) {
    if (element.getAttribute("id") == "video-title") {
      return element;
    }
  }

  // Todo: throw?
  return null;
}

function getAuthorElement(linksElements) {
  for (element of linksElements) {
    // Author does not have an id
    if (element.getAttribute("id") == null) {
      return element;
    }
  }

  // Todo: throw?
  return null;
}

var exec = null;

if (document.URL.match(/https:\/\/www\.youtube\.com\/watch.*/gm)) {
  exec = function() {
    var videos = getVideoElementsForWatch();
    filterVideoElements(videos);
  };
} else {
  exec = function() {
    var videos = getVideoElementsForChannelOrSubs();
    filterVideoElements(videos);
  };
}

setInterval(exec, 500);
