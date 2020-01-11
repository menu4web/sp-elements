(function () {

"use strict";

// Logo

var refLogo = SPe.Form.elGetByClass(document, "div", "logoCell-");
if (refLogo) { SPe.hide(refLogo); }

// Buttons

var refShareSite = SPe.Form.elGetByText(document, "button", "ShareSite");
if (refShareSite) { SPe.hide(refShareSite); }

}());