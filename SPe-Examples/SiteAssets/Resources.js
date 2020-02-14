// Branding

SPe.Util.load([
	"/sites/Test3/SiteAssets/Branding/M4W.Branding.css",
	"/sites/Test3/SiteAssets/Branding/M4W.Branding.js"
]);

// Home

if (SPe.path("/Home.aspx")) {

// Slides

require(["/libs/jquery-3.4.1.min.js"], function () {
require(["/sites/Test3/SiteAssets/Slides/responsiveslides.min.js"], function () {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Slides/responsiveslides.css",
	"/sites/Test3/SiteAssets/Slides/M4W.Slides.css",
	"/sites/Test3/SiteAssets/Slides/M4W.Slides.js"
]);

SPe.Util.do("SPe.initSlides");

});
});

// Tabs

SPe.Util.load([
	"/sites/Test3/SiteAssets/Tabs/M4W.HomeTabs.js"
]);

SPe.Util.do("SPe.initTabs");

// Chart

require(["/libs/Chart.bundle.min.js"], function () {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Chart/M4W.Dashboard.js"
]);

SPe.Util.do("SPe.initDashboard");

});

}

// Requests

if (SPe.path("/Requests")) {

// Request Form

SPe.Util.load([
	"/sites/Test3/SiteAssets/Requests/M4W.RequestModernForm.js"
]);

SPe.loadRequestForm = function () { SPe.Util.do("SPe.initRequestForm"); };

if (SPe.path("/Requests/AllItems.aspx")) {

SPe.Form.observe(SPe.loadRequestForm);

}
else {

SPe.Util.wait(SPe.loadRequestForm);

}

// Requests View

if (SPe.path("/Requests/AllItems.aspx")) {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Requests/M4W.RequestsModernView.js"
]);

SPe.Util.do("SPe.initRequestView");

}

}

// Claims

if (SPe.path("/Claims")) {

// Claim Form

SPe.Util.load([
	"/sites/Test3/SiteAssets/Claims/M4W.ClaimModernForm.js"
]);

SPe.loadClaimForm = function () { SPe.Util.do("SPe.initClaimForm"); };

if (SPe.path("/Claims/AllItems.aspx")) {

SPe.Form.observe(SPe.loadClaimForm);

}
else {

SPe.Util.wait(SPe.loadClaimForm);

}

}