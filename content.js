function filterOnSubscriptionsOrChannel() {
  var videos = getVideoElements();

  for (video of videos) {
    var oldTitle = video.titleElement.getAttribute("title");
    video.titleElement.innerHTML = createNewTitle(oldTitle);

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
    endPartOfTitle == "Ten Minute Power Hour"
  ) {
    return oldTitle;
  }

  return endPartOfTitle;
}

function getVideoElements() {
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
        // if authorElement is null then we might be looking at the channel page or a video
        if (
          possibleAuthorElement == null ||
          possibleAuthorElement.innerHTML === "GameGrumps"
        ) {
          var video = {
            titleElement: getTitleElement(linkElements),
            authorElement: possibleAuthorElement
          };
          videos.push(video);
        }
      }
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

if (document.URL.match(/https:\/\/www\.youtube\.com\/watch.*/gm)) {
  filterRelatedVideos();
} else {
  filterOnSubscriptionsOrChannel();
}
