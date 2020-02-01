// Branding

SPe.Util.load([
	"/sites/Test3/SiteAssets/Branding/M4W.Branding.css",
	"/sites/Test3/SiteAssets/Branding/M4W.Branding.js"
]);

// Home

if (SPe.path("/Home.aspx")) {

// Slides

SPe.Util.load([
	"/libs/jquery-3.4.1.min.js"
]);

/*
SystemJS.import("/libs/jquery-3.4.1.min.js");
*/

SPe.Util.when(["$"], function () {
	SPe.Util.load([
	"/sites/Test3/SiteAssets/Slides/responsiveslides.css",
	"/sites/Test3/SiteAssets/Slides/responsiveslides.min.js"
	]);
});

SPe.Util.when(["$", "$.fn.responsiveSlides"], function () {
	SPe.Util.load([
	"/sites/Test3/SiteAssets/Slides/M4W.Slides.css",
	"/sites/Test3/SiteAssets/Slides/M4W.Slides.js"
	]);
});

SPe.Util.do("SPe.initSlides");

// Tabs

SPe.Util.load([
	"/sites/Test3/SiteAssets/Tabs/M4W.HomeTabs.js"
]);

/*
SystemJS.import("/sites/Test3/SiteAssets/Tabs/M4W.HomeTabs.js");
*/

SPe.Util.do("SPe.initTabs");

// Chart

SystemJS.import("/libs/Chart.bundle.min.js");

SPe.Util.when(["Chart"], function () {
	SPe.Util.load([
	"/sites/Test3/SiteAssets/Chart/M4W.Dashboard.js"
	]);
});

SPe.Util.do("SPe.initDashboard");

}

// Requests

if (SPe.path("/Requests")) {

// Request Form

SPe.Util.load([
	"/sites/Test3/SiteAssets/Requests/M4W.RequestModernForm.js"
]);

SPe.loadForm = function () { SPe.Util.do("SPe.initForm"); };

if (SPe.path("/Requests/AllItems.aspx")) {

SPe.Form.observe(SPe.loadForm);

}
else {

SPe.Util.wait(SPe.loadForm);

}

// Requests View

if (SPe.path("/Requests/AllItems.aspx")) {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Requests/M4W.RequestsModernView.js"
]);

SPe.Util.do("SPe.initView");

}

}