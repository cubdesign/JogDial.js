const MobileRegEx = '/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/';
const MobileEvent = ('ontouchstart' in window) && window.navigator.userAgent.match(MobileRegEx);

export default MobileEvent
