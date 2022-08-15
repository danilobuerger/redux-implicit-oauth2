const SETTINGS =
  "scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no";

function isFirefox() {
  return navigator.userAgent.indexOf("Firefox") != -1;
}

function getPopupLeft(width) {
  const wLeft = window.screenLeft || window.screenX;
  return wLeft + (window.outerWidth - width) / 2;
}

function getPopupTop() {
  const wTop = window.screenTop || window.screenY;
  return wTop + 200;
}

function openPopup(url, name, width, height) {
  const top = getPopupTop();
  const left = getPopupLeft(width);
  const popup = window.open(
    url,
    name,
    `${SETTINGS},width=${width},height=${height},top=${top},left=${left}`
  );
  // We need to force the location of the window to make sure it's in the same place in all cases.
  // However, Firefox does not react well to popup.moveTo(), but spawns the window in the desired location using initial position.
  if (!isFirefox()) popup.moveTo(left, top);
  popup.focus();
  return popup;
}

export default openPopup;
