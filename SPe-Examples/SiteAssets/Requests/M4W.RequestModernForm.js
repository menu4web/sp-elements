SPe.initForm = function () { SPe.Util.when(function () { return SPe.Form.elGetByText(document, "label", "Title"); }, function () {

"use strict";

// Elements

var refForm = SPe.Form.get();
var refTitle = SPe.Form.elGetByText(refForm, "input", "Title");
var refRequester = SPe.Form.elGetByText(refForm, "input", "Requester") || SPe.Form.elGetByText(refForm, "label", "Requester");
var refEmail = SPe.Form.elGetByText(refForm, "input", "E-mail");
var refNotes = SPe.Form.elGetByText(refForm, "textarea", "Notes");
var refLocation = SPe.Form.elGetByText(refForm, "label", "Location");
var refStatus = SPe.Form.elGetByText(refForm, "label", "Status");

// Buttons

SPe.Util.when(function () { return SPe.Form.elGetByText(document, "i", "PowerApps"); }, function () {

var refEditAll = SPe.Form.elGetByText(refForm, "i", "Edit"); if (refEditAll) { refEditAll = SPe.Form.elGetParent(refEditAll, "button"); }
var refCopyLink = SPe.Form.elGetByText(refForm, "i", "Copy link"); if (refCopyLink) { refCopyLink = SPe.Form.elGetParent(refCopyLink, "button"); }
var refEditForm = SPe.Form.elGetByText(refForm, "i", "Edit Form"); if (refEditForm) { refEditForm = SPe.Form.elGetParent(refEditForm, "button"); }
var refCustomize = SPe.Form.elGetByText(document, "i", "PowerApps"); if (refCustomize) { refCustomize = SPe.Form.elGetParent(refCustomize, "button"); }
if (refEditAll) { SPe.hide(refEditAll); }
if (refCopyLink) { SPe.hide(refCopyLink); }
if (refEditForm) { SPe.hide(refEditForm); }
if (refCustomize) { SPe.hide(refCustomize); }

});

// Mode

var mode = !refTitle ? "view" : refTitle.value ? "edit" : "new";

// Fields

refForm.style.maxWidth = "649px";

if (mode === "new" || mode === "edit") {

if (mode === "new") {
	SPe.Query.currentUserProperties(function (user) {
		var name = user.get_displayName();
		var account = user.get_accountName();
		SPe.Form.setField(refTitle, name.substring(0, name.indexOf(" ")) + "'s Request");
		SPe.Form.setField(refRequester, name);
		SPe.Form.setField(refEmail, account.substring(account.lastIndexOf("|") + 1));
	});
}

if (mode === "edit") {
	SPe.Form.elRewrite(refTitle);
	SPe.Form.elRewrite(refRequester);
	SPe.Form.elRewrite(refEmail, SPe.Form.textLinkify(refEmail.value));
}

refNotes.rows = "5";

SPe.Form.divAdd(refStatus, "<hr style='border: 0; border-bottom: 2px solid #0078d4'/>");

// Tabs

var tabs = mode === "new" ? [
	["Contact Information", ["0-1","2-4",7]],
	["Request Details", ["0-1","5-6",7]]
] : [
	["Contact Information", ["0-1","2-4",7,"8-9"]],
	["Request Details", ["0-1","5-6",7,"8-9"]]
];

SPe.Tabs.set = [];

SPe.Tabs.add(refRequester, tabs);

}

if (mode === "view") {

// Sections

var hline = "<hr style='border: 0; border-bottom: 1px solid #0078d4'/>";

SPe.Form.divAdd(refRequester, hline);
SPe.Form.divAdd(refLocation, hline);
SPe.Form.divAdd(refStatus, hline);

}

});};