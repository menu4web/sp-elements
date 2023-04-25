SPe.initRequestsView = function () {

"use strict";

SPe.emailLinkify = function (e) {
	var p = e.parentNode;
	var a;
	if (SPe.has(SPe.type(p), "div")) {
		a = document.createElement("a");
		e.parentNode.insertBefore(a, e);
		a.appendChild(e);
	}
	else {
		a = p;
	}

	var em = e.innerText;
	if (!SPe.has(a.href, em)) {
		a.href = "mailto:" + em;
	}
};

SPe.statusColor = function (e) {
	var et = e.innerText;
	var ec = "#ff0000";
	if (et === "New") { ec = "#0000ff"; }
	if (et === "Completed") { ec = "#03925e"; }
	if (e.style.color !== ec) {
		e.style.borderLeft = "3px solid " + ec;
		e.style.paddingLeft = "8px";
		e.style.color = ec;
	}
};

SPe.List.observe({
	"Email": SPe.emailLinkify,
	"Status": SPe.statusColor
});

};