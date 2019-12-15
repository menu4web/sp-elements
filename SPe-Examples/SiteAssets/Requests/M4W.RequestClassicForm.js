// ~site/SiteAssets/Requests/M4W.RequestClassicForm.js

document.write("<script src='/libs/SPe.js'></script>");

_spBodyOnLoadFunctions.push(function () {

"use strict";

// Elements

var refForm = SPe.Form.get();
var refFormTable = SPe.Form.tblGet(refForm);
var refTitle = SPe.Form.elGetByText(refForm, "input", "Title");
var refRequester = SPe.Form.elGetByText(refForm, "input", "Requester") || SPe.Form.elGetByText(refForm, "span", "Requester");
var refEmail = SPe.Form.elGetByText(refForm, "input", "E-mail");
var refNotes = SPe.Form.elGetByText(refForm, "textarea", "Notes");
var refLocation = SPe.Form.elGetByText(refForm, "span", "Location");
var refStatus = SPe.Form.elGetByText(refForm, "span", "Status");

// Mode

var mode = !refTitle ? "view" : refTitle.value ? "edit" : "new";

// Header

SPe.Form.headerAdd(refFormTable, "<span style='color: #996633'>" + SPe.Util.toTitleCase(mode) + "</span> <span style='color: #3366cc'>Request</span>");

// New & Edit

if (mode === "new" || mode === "edit") {

// Fields

if (mode === "new") {
	SPe.Query.ready(function () {
		SPe.Query.currentUserProperties(function (user) {
			var name = user.get_displayName();
			var account = user.get_accountName();
			SPe.Form.setField(refTitle, name.substring(0, name.indexOf(" ")) + "'s Request");
			SPe.Form.setField(refRequester, name);
			SPe.Form.setField(refEmail, account.substring(account.lastIndexOf("|") + 1));
		});
	});
}

if (mode === "edit") {
	SPe.Form.elRewrite(refTitle);
	SPe.Form.elRewrite(refRequester);
	SPe.Form.elRewrite(refEmail, SPe.Form.textLinkify(refEmail.value));
}

refNotes.rows = "3";

SPe.Form.rowAdd(refStatus, "<hr style='border: 0; border-bottom: 1px solid #0078d4'/>");

// Tabs

var tabs = mode === "new" ? [
	["CONTACT INFORMATION", ["0-2","3-5",8]],
	["REQUEST DETAILS", ["0-2","6-7",8]]
] : [
	["CONTACT INFORMATION", ["0-2","3-5",8,9]],
	["REQUEST DETAILS", ["0-2","6-7",8,9]]
];

SPe.Tabs.add(refRequester, tabs);

if (mode === "new") { SPe.Tabs.msgMonitor([refRequester, refEmail], "tab_0-0"); }

}

// View

if (mode === "view") {

// Sections

var hline = "<hr/>";

SPe.Form.rowAdd(refRequester, hline);
SPe.Form.rowAdd(refLocation, hline);
SPe.Form.rowAdd(refStatus, hline);

}

});