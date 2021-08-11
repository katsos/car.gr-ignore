const SELECTORS = {
  'ad_container': '.list li',
};

chrome.runtime.sendMessage({ action: 'init' }, console.log);

function getAds() {
  return Array.from(document.querySelectorAll(SELECTORS.ad_container));
}

function getIgnored() {
  return new Promise((res, rej) => {
    chrome.runtime.sendMessage({ action: 'get_ignored' }, res);
  });
}

function setIgnored(url) {
  return new Promise((res, rej) => {
    chrome.runtime.sendMessage({ action: 'set_ignored', url }, res);
  });
}

function ignore(ad) {
  const href = getAdHref(ad);
  setIgnored(href);
  hideContainer(ad)
}

function getAdHref(ad) {
  return ad.href;
}

function setIgnoreButton(ads = getAds()) {
  ads.map((ad) => {
    const btn = document.createElement('button');
    btn.innerText = 'Ignore';
    btn.style     = 'position:absolute; bottom:0; left: 0;';
    btn.className = 'btn btn-outline-primary btn-sm';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      ignore(ad);
    });
    ad.querySelector('div').appendChild(btn);
  });
}

function hideIgnoredAds(ads, ignored) {
  return ads.map((ad) => {
    const href = getAdHref(ad);
    if (!ignored.includes(href)) return ad;
    hideContainer(ad);
  });
}

function hideContainer(ad) {
  ad.parentNode.removeChild(ad);
}

(async () => {
  const ads = getAds();
  
  const ignored = await getIgnored();
  hideIgnoredAds(ads, ignored);
  console.log(`${ads.length} ads, ${ignored.length} ignored.`);

  setTimeout(() => setIgnoreButton(ads), 1000);
})();

