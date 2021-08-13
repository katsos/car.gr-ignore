const SELECTORS = {
  ad_container: '.list li',
  ignoreButtonClassname: 'carIgnore'
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

function setIgnored(identifier) {
  return new Promise((res, rej) => {
    chrome.runtime.sendMessage({ action: 'set_ignored', identifier }, res);
  });
}

function ignore(ad) {
  const adIdentifier = getAdIdentifier(ad);
  setIgnored(adIdentifier);
  hideAd(ad)
}

function getAdIdentifier(ad) {
  return ad.querySelector('a').href;
}

function setIgnoreButton(ads = getAds()) {
  ads.map((ad) => {
    const btn = document.createElement('button');
    btn.innerText = 'Ignore';
    btn.className = `btn btn-outline-primary btn-sm ${SELECTORS.ignoreButtonClassname}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      ignore(ad);
    });
    ad.querySelector('div').appendChild(btn);
  });
}

function hideIgnoredAds(ads, ignored) {
  ads.forEach((ad) => {
    const adIdentifier = getAdIdentifier(ad);
    if (!ignored.includes(adIdentifier)) return;
    hideAd(ad);
  });
}

function hideAd(ad) {
  ad.style.display = 'none';
}

setInterval(async () => {
  const ads = getAds();

  const ignored = await getIgnored();
  hideIgnoredAds(ads, ignored);
  console.log(`${ads.length} ads, ${ignored.length} ignored.`);

  if (document.getElementsByClassName(SELECTORS.ignoreButtonClassname).length) return;
  setIgnoreButton(ads);
}, 1000);

