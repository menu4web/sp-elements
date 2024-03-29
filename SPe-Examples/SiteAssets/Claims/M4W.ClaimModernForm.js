SPe.initClaimForm = function () {

"use strict";

// Elements

var refForm = SPe.Form.get();

SPe.Util.when(function () { return SPe.Form.elGetByText(refForm, "label", "Title") && SPe.Form.elGetByText(refForm, "label", "Employee"); }, function () {

var refTitle = SPe.Form.elGetByText(refForm, "input", "Title");
var refEmployee = SPe.Form.elGetByText(refForm, "input", "pickerInput") || SPe.Form.elGetByText(refForm, "label", "Employee");
var refOffice = SPe.Form.elGetByText(refForm, "input", "Office");
var refDepartment = SPe.Form.elGetByText(refForm, "input", "Department");
var refChecklist = SPe.Form.elGetByText(refForm, "label", "Checklist"); refChecklist = SPe.Form.elGetByText(SPe.Form.elGetParent(refChecklist, "div", "clientFormField"), "span", "ReactFieldEditor") || refChecklist;
var refMyInformation = SPe.Form.elGetByText(refForm, "textarea", "My Information") || SPe.Form.elGetParent(SPe.Form.elGetByText(refForm, "label", "My"), "div", "clientFormField");
var refDependent = SPe.Form.elGetByText(refForm, "textarea", "Dependent(s) Information") || SPe.Form.elGetParent(SPe.Form.elGetByText(refForm, "label", "Dependent"), "div", "clientFormField");
var refTotal = SPe.Form.elGetByText(refForm, "input", "Total"); SPe.totalCost = refTotal;
var refTotalDiv = refTotal ? SPe.Form.elGetParent(refTotal, "div") : refTotal;
var refCurrency = SPe.Form.elGetByText(refForm, "label", "Currency");
var refStatus = SPe.Form.elGetByText(refForm, "label", "Status");
var refComment = SPe.Form.elGetByText(refForm, "textarea", "Comment");
var refCommentDiv; if(refComment) { refCommentDiv = SPe.Form.elGetByClass(SPe.Form.elGetParent(refComment, "div", "clientFormField"), "div", "AppendedData"); }

// Mode

var mode = !refTitle ? "view" : refTitle.value ? "edit" : "new";

// Fields

SPe.Form.elGetByClass(refForm, "div", "ReactClientFormFields").style.maxWidth = "752px";

if (mode === "new" || mode === "edit") {

if (mode === "new") {

SPe.Rest.currentUserProperties(function (user) {
	var name = SPe.Util.propertyValue(user, "DisplayName");
	var email = SPe.Util.propertyValue(user, "Email");
	var office = SPe.Util.propertyValue(user, "Office");
	var department = SPe.Util.propertyValue(user, "Department");
	SPe.Form.setField(refTitle, name.substring(0, name.indexOf(" ")) + "'s Claim");
	SPe.Form.setPersonField(refEmployee, email);
	SPe.Form.setField(refOffice, office);
	SPe.Form.setField(refDepartment, department);
});

}

if (mode === "edit") {

SPe.Form.elRewrite(refTitle);
SPe.Form.elRewrite(refEmployee);
SPe.Form.elRewrite(refOffice);
SPe.Form.elRewrite(refDepartment);

}

// Checklist

var infoToggle = function (ref) {
	var vMyself = false, vDependent = false;
	if (ref.id !== "tab_0-0") {
		vMyself = SPe.has(refChecklist.innerHTML, "myself");
		vDependent = SPe.has(refChecklist.innerHTML, "dependent");
	}
	SPe.Form.elVisible(refMyInformation, vMyself);
	SPe.Form.elVisible(refDependent, vDependent);
};

SPe.Form.elMonitor(refChecklist, infoToggle);

// Textareas

SPe.calcAmount = function () {
	var t = 0;
	var elms = document.getElementsByTagName("input");
	var a, i;
	for (i = 0; i < elms.length; i += 1) {
		if (elms[i].className === "ftAmount") {
			a = Number(elms[i].value);
			if (a) { t += a; }
		}
	}
	SPe.Form.preSaveValues();
	SPe.Form.setField(SPe.totalCost, t);
};

var myForm = "<table cellspacing='3' cellpadding='2'><tr><td><span style='font-size: 0.8em'>Reimbursement Type</span></td><td><span style='font-size: 0.8em'>$€ Amount</span></td></tr><tr><td><select class='root-40' onchange='SPe.calcAmount()' style='padding: 3px; width: 150px; border: solid 1px #a6a6a6; background-color: #faf9f8; font-size: 12px' onfocus='SPe.Form.rowDuplicate(this)'><option value=''></option><option value='Membership'>Membership</option><option value='Lesson'>Lesson</option><option value='Program'>Program</option><option value='Other'>Other</option></select></td><td><input onchange='SPe.calcAmount()' type='text' class='ftAmount' style='padding: 4px; border: 0; border-bottom: solid 1px #a6a6a6; background-color: #faf9f8' size='8'></td></tr></table>";

var dpForm = "<table cellspacing='3' cellpadding='2'><tr><td><span style='font-size: 0.8em'>Dependent Name</span></td><td><span style='font-size: 0.8em'>Reimbursement Type</span></td></td><td><span style='font-size: 0.8em'>$€ Amount</span></td></tr><tr><td><input onchange='SPe.calcAmount()' type='text' style='padding: 4px; border: 0; background-color: #faf9f8' size='25' onfocus='SPe.Form.rowDuplicate(this)'></td><td><select class='root-40' onchange='SPe.calcAmount()' style='padding: 3px; width: 150px; border: solid 1px #a6a6a6; background-color: #faf9f8; font-size: 12px' style='width: 130px; font-size: 12px;'><option value=''></option><option value='Membership'>Membership</option><option value='Lesson'>Lesson</option><option value='Program'>Program</option><option value='Other'>Other</option></select></td><td><input onchange='SPe.calcAmount()' class='ftAmount' type='text' style='padding: 4px; border: 0; border-bottom: solid 1px #a6a6a6; background-color: #faf9f8' size='8'></td></tr></table>";

SPe.Form.textareaReplace(refMyInformation, myForm);
SPe.Form.textareaReplace(refDependent, dpForm);

SPe.Form.elGetParent(refMyInformation, "div", "Note-Plain").style.minHeight = "0";
SPe.Form.elGetParent(refDependent, "div", "Note-Plain").style.minHeight = "0";

// Total

refTotal.style.borderBottom = "solid 1px #a6a6a6";
refTotalDiv.style.width = "247px";
refTotalDiv.style.borderWidth = "0px";

// Comments

refComment.rows = "4";

if (refCommentDiv) {
	refCommentDiv.style.fontSize = "12px";
	refCommentDiv.style.color = "#333333";
	refCommentDiv.style.lineHeight = "3px";
	SPe.Form.commentsGroom(refCommentDiv);
}

// Tabs

SPe.Form.divAdd(refStatus, "<hr style='border: 0; border-bottom: 2px solid #0078d4'/>");

var tabs = mode === "new" ? [
	["Employee Information", ["0-1","2-4",10,"12-13"]],
	["Claim Details", ["0-1","5-9",10,"12-13"]]
] : [
	["Employee Information", ["0-1","2-4",10,11,"12-13"]],
	["Claim Details", ["0-1","5-9",10,11,"12-13"]]
];

SPe.Tabs.set = [];

SPe.Tabs.add(refEmployee, tabs, "", infoToggle);

SPe.Tabs.msgMonitor([refEmployee], "tab_0-0");
SPe.Tabs.msgMonitor([refChecklist, refTotal, refCurrency], "tab_0-1");

}

if (mode === "view") {

// Sections

var hline = "<hr style='border: 0; border-bottom: 1px solid #0078d4'/>";

SPe.Form.divAdd(refEmployee, hline);
SPe.Form.divAdd(refChecklist, hline);
SPe.Form.divAdd(refStatus, hline);

SPe.Form.buttonHide("Edit all");

// Information

if (SPe.has(refMyInformation.innerText, "Enter value")) { SPe.hide(refMyInformation); }
if (SPe.has(refDependent.innerText, "Enter value")) { SPe.hide(refDependent); }

}

});

};