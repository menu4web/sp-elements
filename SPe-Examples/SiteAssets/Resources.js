// Branding

SPe.Util.load([
	"/sites/Test3/SiteAssets/Branding/M4W.Branding.css",
	"/sites/Test3/SiteAssets/Branding/M4W.Branding.js"
]);

// Home

if (SPe.path("/Home.aspx")) {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Tabs/M4W.HomeTabs.js",
	"/sites/Test3/SiteAssets/Chart/M4W.Dashboard.js"
]);

SPe.Util.do("SPe.initTabs");
SPe.Util.do("SPe.initDashboard");

}

// Request Form

if (SPe.path("/Requests")) {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Requests/M4W.RequestModernForm.js"
]);

SPe.Form.observe(function () {
	SPe.Util.do("SPe.initForm");
});

}

// Requests View

if (SPe.path("/Requests/AllItems.aspx")) {

SPe.Util.load([
	"/sites/Test3/SiteAssets/Requests/M4W.RequestsModernView.js"
]);

SPe.Util.do("SPe.initView");

}