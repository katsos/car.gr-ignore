import localforage from 'localforage';

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'car-gr-ignore',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'ignore', // Should be alphanumeric, with underscores.
  description: 'Super powers unleashed',
});

const SELECTORS = {
  ad_container: '.list-unstyled li',
  ignoreButtonClassname: 'carIgnore',
};

function getAds() {
  return Array.from(document.querySelectorAll(SELECTORS.ad_container));
}

async function getIgnored() {
  return localforage.keys();
}

function ignore(ad) {
  const adIdentifier = getAdIdentifier(ad);
  localforage.setItem(adIdentifier, new Date());
  hideAd(ad);
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

function hideIgnoredAds(ads = [], ignored = []) {
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
  const ignored = (await getIgnored()) || [];

  hideIgnoredAds(ads, ignored);
  console.log(`${ads.length} ads, ${ignored.length} ignored.`);

  if (document.getElementsByClassName(SELECTORS.ignoreButtonClassname).length) {
    return;
  }

  setIgnoreButton(ads);
}, 1000);
