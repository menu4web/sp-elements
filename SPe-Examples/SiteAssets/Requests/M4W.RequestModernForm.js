SPe.initForm = function () {

"use strict";

// Elements

var refForm = SPe.Form.get();

SPe.Util.when(function () { return !(!SPe.Form.elGetByText(refForm, "label", "Title") || !SPe.Form.elGetByText(refForm, "label", "Requester")); }, function () {

var refTitle = SPe.Form.elGetByText(refForm, "input", "Title");
var refRequester = SPe.Form.elGetByText(refForm, "input", "Requester") || SPe.Form.elGetByText(refForm, "label", "Requester");
var refEmail = SPe.Form.elGetByText(refForm, "input", "E-mail");
var refNotes = SPe.Form.elGetByText(refForm, "textarea", "Notes");
var refLocation = SPe.Form.elGetByText(refForm, "label", "Location");
var refStatus = SPe.Form.elGetByText(refForm, "label", "Status");

// Buttons

function hideButton (btn) {
	SPe.Form.hide(function () {
		var ref = SPe.Form.elGetByText(document, "i", btn);
		if (ref) { ref = SPe.Form.elGetParent(ref, "button"); }
		return ref;
	});
}

hideButton("PowerApps");
hideButton("Edit Form");
hideButton("Show/hide columns");


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

hideButton("Edit all");

}

});

};