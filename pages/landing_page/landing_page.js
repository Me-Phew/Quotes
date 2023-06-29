const axiosInstance = axios.create({
  baseURL: "https://api.quotes.dripsiaga.pl/",
  timeout: 5000,
});

const loader = document.querySelector(".loader");
const bigQuote = document.querySelector(".big-quote");
const bigQuoteFrontFace = document.querySelector(".front");
const shareQuoteBtn = document.querySelector(".big-quote .share");
const shareModal = document.querySelector(".share-modal");
const errorModal = document.querySelector(".error-modal");
const errorDetails = document.querySelector(
  ".error-modal .error-wrapper .error-details"
);
const closeShareModalBtn = document.querySelector(".share-modal .close");
const copyShareUrlBtn = document.querySelector(".share-modal .share-btn");
const shareUrlInput = document.querySelector(".share-modal .share-url");
const copiedIndicator = document.querySelector(".share-modal .share-btn img");
const nextQuoteBtn = document.querySelector(".next-quote");
const shareSiteBtn = document.querySelector("button.share-site");
const shareWrapper = document.querySelector(".share-modal .share-wrapper");
const tryAgainBtn = document.querySelector(
  ".error-modal .error-wrapper .try-again"
);

const bigQuoteContent = document.querySelector(".big-quote .content");
const bigQuoteAuthor = document.querySelector(".big-quote .author");
const bigQuotePopularityCount = document.querySelector(
  ".big-quote .popularity-count"
);

let loading = false;
let errorState = false;
let flipped = false;

let clickable = false;
let clicked = false;

let currentQuoteId;

function toggleLoadingState() {
  loading = !loading;
  bigQuote.classList.toggle("loading");
  loader.classList.toggle("loading");
  bigQuoteFrontFace.classList.toggle("loading");
}

function ensureFlipped() {
  toggleNextQuoteBtnAnimation();

  if (flipped) {
    flipBigQuote();
    setTimeout(loadRandomQuote, 1500);
  } else {
    loadRandomQuote();
  }
}

function loadRandomQuote() {
  toggleLoadingState();
  if (clicked) {
    toggleClickedState();
  }

  axiosInstance
    .get("/quotes/random")
    .then((res) => {
      updateBigQuote(res.data);
    })
    .catch((err) => {
      showError(err);
    });
}

function adjustContentFontSize(contentLength) {
  bigQuoteContent.classList = [];
  bigQuoteContent.classList.add("content");

  if (contentLength <= 230) {
    bigQuoteContent.classList.add("font-size-default");
    bigQuoteContent.classList.add("text-short");
  } else if (contentLength > 230 && contentLength <= 300) {
    bigQuoteContent.classList.add("font-size-medium");
    bigQuoteContent.classList.add("text-short");
  } else if (contentLength > 300 && contentLength <= 500) {
    bigQuoteContent.classList.add("font-size-medium");
  } else if (contentLength > 500) {
    bigQuoteContent.classList.add("font-size-small");
  }
}

function updateBigQuote(quoteData) {
  bigQuoteContent.innerText = quoteData.content;
  bigQuoteAuthor.innerText = quoteData.author;
  bigQuotePopularityCount.innerText = quoteData.popularity;
  currentQuoteId = quoteData.id;
  adjustContentFontSize(bigQuoteContent.innerText.length);
  updateAuthorInfo();
  toggleLoadingState();

  if (nextQuoteBtn.disabled) {
    toggleNextQuoteBtn();
  }
}

function updateAuthorInfo() {
  let dateOfBirth;
  let shortBiography;
  let photoUrl;

  if (dateOfBirth) {
    // update
  }

  if (shortBiography) {
    // update
  }

  if (photoUrl) {
    // update
  }

  if (dateOfBirth || shortBiography || photoUrl) {
    toggleClickable();
  }
}

function toggleClickable() {
  clickable = true;
  bigQuote.classList.add("clickable");
}

function toggleErrorState() {
  bigQuote.classList.toggle("error");
  errorModal.classList.toggle("closed");
  if (!nextQuoteBtn.disabled) {
    toggleNextQuoteBtn();
  }
}

function showError(err) {
  toggleLoadingState();
  toggleErrorState();

  errorDetails.innerText = err;
}

function toggleClickedState() {
  clicked = !clicked;
  bigQuote.classList.toggle("clicked");
}

function flipBigQuote() {
  if (!loading && clickable) {
    bigQuote.classList.toggle("flipped");
    flipped = !flipped;

    if (!clicked) {
      toggleClickedState();
    }
  }
}

function toggleModal() {
  shareModal.classList.toggle("closed");
  copiedIndicator.src =
    "https://fonts.gstatic.com/s/i/googlematerialicons/content_copy/v16/gm_grey200-24dp/1x/gm_content_copy_gm_grey200_24dp.png";
}

function setShareUrl(shareType) {
  let shareUrl;

  switch (shareType) {
    case "quote": {
      shareUrl = "https://mephew.ddns.net/quotes?quote_id=" + currentQuoteId;
      break;
    }
    case "site": {
      shareUrl = "https://mephew.ddns.net/quotes";
      break;
    }
  }

  shareUrlInput.value = shareUrl;
}

const shareCurrentQuote = (e, shareType) => {
  return function () {
    e.stopPropagation();
    setShareUrl(shareType);
    toggleModal();
  };
};

function copiedShareUrl() {
  copiedIndicator.src =
    "https://fonts.gstatic.com/s/i/googlematerialicons/done/v15/gm_grey200-24dp/1x/gm_done_gm_grey200_24dp.png";
}

function copyShareUrl() {
  const copyToClipboard = (text) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(text);
    return Promise.reject("The Clipboard API is not available.");
  };

  url = shareUrlInput.value;

  copyToClipboard(url)
    .then(() => {
      copiedShareUrl();
    })
    .catch((err) => {
      showError(err);
    });
}

function loadQuote(quoteId) {
  toggleLoadingState();
  axiosInstance
    .get("/quotes/" + quoteId)
    .then((res) => {
      updateBigQuote(res.data);
    })
    .catch((err, res) => {
      showError(err);
    });
}

function loadInitialQuote() {
  quoteId = location.href.split("?")[1];

  if (quoteId) {
    quoteId = quoteId.split("=")[1];
    loadQuote(quoteId);
  } else {
    loadRandomQuote();
  }
}

function toggleNextQuoteBtnAnimation() {
  nextQuoteBtn.classList.toggle("clicked");
  setTimeout(() => {
    nextQuoteBtn.classList.toggle("clicked");
  }, 1600);
}

const debounce = (fn, delay) => {
  let timeoutID;

  return function (...args) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const throttle = (fn, delay) => {
  let last = 0;

  return (...args) => {
    const now = new Date().getTime();
    if (now - last < delay) {
      return;
    }

    last = now;
    return fn(...args);
  };
};

function toggleNextQuoteBtn() {
  nextQuoteBtn.disabled = !nextQuoteBtn.disabled;
}

function reloadQuote() {
  toggleErrorState();
  loadInitialQuote();
}

function init() {
  shareSiteBtn.addEventListener("click", (e) => shareCurrentQuote(e, "site")());
  bigQuote.addEventListener("click", flipBigQuote);
  shareQuoteBtn.addEventListener("click", (e) =>
    shareCurrentQuote(e, "quote")()
  );
  closeShareModalBtn.addEventListener("click", toggleModal);
  shareModal.addEventListener("click", toggleModal);
  copyShareUrlBtn.addEventListener("click", copyShareUrl);
  nextQuoteBtn.addEventListener("click", throttle(ensureFlipped, 1600));
  shareWrapper.addEventListener("click", (e) => e.stopPropagation());
  loadInitialQuote();
  adjustContentFontSize(bigQuoteContent.innerText.length);
  tryAgainBtn.addEventListener("click", throttle(reloadQuote, 1500));
}

init();
