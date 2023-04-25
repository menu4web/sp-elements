SPe.initClaimsView = function () {

"use strict";

SPe.totalCurrency = function (e) {
	var s = e.innerText.substring(0, 1);
	var p = SPe.Form.elGetParent(e, "div", "ms-DetailsRow-fields");
	var t = SPe.Form.elGetByAttribute(p, "div", "data-automation-key", "TotalCost"); t = SPe.Form.elGetByClass(t, "div", "od-FieldRenderer-text");
	var tt = t.innerText;
	var ts = tt.substring(0, 1);
	t.innerText = tt.replace(ts, s);
};

SPe.statusColorCode = function (e) {
	var et = e.innerText;
	var c = SPe.Util.colorCode(et, true);
	if (c) { e.style.color = c };
};

SPe.List.observe({
	"Currency": SPe.totalCurrency,
	"ClaimStatus": SPe.statusColorCode
});

};