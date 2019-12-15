// ~site/SiteAssets/Requests/M4W.RequestsClassicView.js

(function () {

"use strict";

var statusColor = function (rStatus) {
	var ec = "#ff0000";
	if (rStatus === "New") { ec = "#0000ff"; }
	if (rStatus === "Completed") { ec = "#03925e"; }
	return "<span style='color: " + ec + "'>" + rStatus + "</span>";
};

var requestStatus = function (ctm) {
	var rStatus = ctm.CurrentItem.Status;
	rStatus = statusColor(rStatus);
	return rStatus;
};

var ctm = {};
ctm.Templates = {};
ctm.Templates.Fields = {
	"Status": { "View": requestStatus }
};
SPClientTemplates.TemplateManager.RegisterTemplateOverrides(ctm);

}());