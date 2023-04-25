// Requests

SPe.Util.load(["/sites/DEV_SLAVA/SiteAssets/Requests/M4W.RequestModernForm.js", "/sites/DEV_SLAVA/SiteAssets/Requests/M4W.RequestsModernView.js"]);
SPe.loadRequestForm = function () { SPe.Util.do("SPe.initRequestForm"); };
SPe.loadRequestsView = function () { SPe.Util.do("SPe.initRequestsView"); };

// Claims

SPe.Util.load(["/sites/DEV_SLAVA/SiteAssets/Claims/M4W.ClaimModernForm.js", "/sites/DEV_SLAVA/SiteAssets/Claims/M4W.ClaimsModernView.js"]);
SPe.loadClaimForm = function () { SPe.Util.do("SPe.initClaimForm"); };
SPe.loadClaimsView = function () { SPe.Util.do("SPe.initClaimsView"); };

// Resources

SPe.resources = function () {

if (SPe.path("/Requests")) {

if (SPe.path("Form.aspx")) { SPe.Util.wait(SPe.loadRequestForm); } else { SPe.Form.observe(SPe.loadRequestForm); }
if (SPe.path("AllItems.aspx")) { SPe.Util.wait(SPe.loadRequestsView); }

}

if (SPe.path("/Claims")) {

if (SPe.path("Form.aspx")) { SPe.Util.wait(SPe.loadClaimForm); } else { SPe.Form.observe(SPe.loadClaimForm); }
if (SPe.path("AllItems.aspx")) { SPe.Util.wait(SPe.loadClaimsView); }

}

};

SPe.Util.wait(SPe.resources);