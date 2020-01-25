/* slava naumenko (c) - https://github.com/menu4web/sp-elements */

if (!window.SPe) {

var SPe = { version: "7.7", Ajax: {}, Cookie: {}, Date: {}, Form: {}, List: {}, Query: {}, Rest: {}, Tabs: {}, Task: {}, Util: {} };

SPe.init = function () {

"use strict";

// Short Forms

SPe.nop = function () { return undefined; };

SPe.has = function (s, c) { return s.indexOf(c) > -1; };

SPe.path = function (path) { return SPe.has(_spPageContextInfo.serverRequestPath, path); };

SPe.hide = function (ref) { ref.style.display = "none"; };

SPe.show = function (ref) { ref.style.display = ""; };

SPe.type = function (val) {
	var m = Object.prototype.toString.call(val).match(/^\[object\s(\S+?)\]$/) || [];
	var t = m[1] || "undefined";
	return t.toLowerCase();
};

// Ajax

SPe.Ajax.object = function () {
	return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
};

SPe.Ajax.get = function (url, callback, callfault) {
	var request = SPe.Ajax.object();
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = function () { SPe.Ajax.data(request, callback, callfault); };
};

SPe.Ajax.post = function (url, parameters, headers, callback, callfault) {
	var request = SPe.Ajax.object();
	request.open("POST", url, true);
	if (!headers) {
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	else {
		Object.keys(headers).forEach(function (property) {
			request.setRequestHeader(property, headers[property]);
		});
	}
	request.send(parameters);
	request.onreadystatechange = function () { SPe.Ajax.data(request, callback, callfault); };
};

SPe.Ajax.data = function (request, callback, failed) {
	callback = callback || SPe.nop;
	failed = failed || SPe.Ajax.error;
	if (request.readyState === 4) {
		var status = request.status;
		if (!status || (status >= 200 && status < 300) || status === 304 || status === 1223) { callback(request.responseText); }
		else { failed(status); }
	}
};

SPe.Ajax.error = function (status) {
	console.warn("Request failed. Status: " + status + ".");
};

// Cookie

SPe.Cookie.set = function (cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
};

SPe.Cookie.get = function (cname) {
	var val;
	var name = cname + "=";
	var ca = document.cookie.split(";");
	var i, c;
	for (i = 0; i < ca.length; i++) {
		c = ca[i].trim();
		if (c.indexOf(name) === 0) {
			val = c.substring(name.length, c.length);
			val = val.replace(/&\s/g, "＆ ");
			break;
		}
	}
	return val;
};

// Date

SPe.Date.masks = {
	shortDate:     "M/d/yyyy",
	shortDateTime: "M/d/yyyy h:mm TT",
	isoDate:       "yyyy-MM-dd",
	isoDateTime:   "yyyy-MM-dd'T'HH:mm:ss"
};

SPe.Date.fromString = function (s, mask) {
	function rep (s) {
		return s.replace(/-/g, "/").replace(/\./g, "/").replace(/T/g, " ");
	}

	function len (s) {
		var l = s.indexOf(" ");
		if (l === -1) { l = s.length; }
		return l;
	}

	function ind (a, s) {
		var p = -1, i;
		for (i = 0; i < a.length; i++) {
			if (SPe.has(a[i],s)) { p = i; break; }
		}
		return p;
	}

	mask = SPe.Date.masks[mask] || mask || SPe.Date.masks.shortDateTime;
	mask = rep(mask);
	var ml = len(mask);
	var mt = mask.substring(ml);
	var ma = mask.substring(0, ml).split("/");
	var my = ind(ma, "y"), mm = ind(ma, "M"), md = ind(ma, "d");

	s = rep(s);
	var l = len(s);
	var t = mt ? s.substring(l) : "";
	var ds = s.substring(0, l).split("/");
	var y = ds[my], m = ds[mm], d = ds[md];

	return new Date(m + "/" + d + "/" + y + t);
};

SPe.Date.compareToToday = function (myd, operator, offset) {
	offset = offset || 0;
	if (SPe.type(myd) === "string") { myd = SPe.Date.fromString(myd); }

	var today = new Date(); today.setDate(today.getDate() + offset);
	function zh (d) { return d.setHours(0,0,0,0); }

	var r = false;
	switch (operator) {
		case "<":
			if (myd < today) { r = true; }
			break;
		case "<=":
			if (zh(myd) <= zh(today)) { r = true; }
			break;
		case "==":
			if (zh(myd) === zh(today)) { r = true; }
			break;
		case ">=":
			if (zh(myd) >= zh(today)) { r = true; }
			break;
		case ">":
			if (myd > today) { r = true; }
			break;
	}

	return r;
};

SPe.Date.format = function (myd, mask, compare) {
	if (SPe.type(myd) === "string") { myd = SPe.Date.fromString(myd); }

	mask = SPe.Date.masks[mask] || mask || SPe.Date.masks.shortDate;

	var d = myd.getDate(),
	M = myd.getMonth() + 1,
	y = myd.getFullYear(),
	H = myd.getHours(),
	m = myd.getMinutes(),
	s = myd.getSeconds();
	var a = H < 12, h = H % 12 || 12;
	var month = myd.toLocaleString("en-US", { month: "long" }).replace(/-/g, " ");
	var ml = month.split(",").length - 1;
	if (ml !== 0) {
		if (ml === 2) { month = month.substring(month.indexOf(",") + 2); }
		month = month.substring(0, month.indexOf(" "));
	}

	var fs = {
		d:    d,
		dd:   SPe.Util.pad(d),
		M:    M,
		MM:   SPe.Util.pad(M),
		MMM:  month.substring(0, 3),
		MMMM: month,
		yy:   y.toString().slice(2),
		yyyy: y,
		h:    h,
		hh:   SPe.Util.pad(h),
		H:    H,
		HH:   SPe.Util.pad(H),
		m:    m,
		mm:   SPe.Util.pad(m),
		s:    s,
		ss:   SPe.Util.pad(s),
		t:    a ? "a"  : "p",
		tt:   a ? "am" : "pm",
		T:    a ? "A"  : "P",
		TT:   a ? "AM" : "PM"
	};

	var fd = mask.replace(/d{1,2}|M{1,4}|y{2,4}|([HhmsTt]){1,2}|"[^"]*"|'[^']*'/g, function ($0) {
		return fs.hasOwnProperty($0) ? fs[$0] : $0.slice(1, $0.length - 1);
	});

	if (compare) {
		if (!SPe.has(compare.toString(), "#")) { compare = "#ff0000"; }
		if (SPe.Date.compareToToday(myd, "<")) { fd = "<font color='" + compare + "'>" + fd + "</font>"; }
	}

	return fd;
};

SPe.Date.addDays = function (myd, days) {
	var newd = new Date(myd);
	return new Date(newd.setDate(newd.getDate() + days));
};

SPe.Date.addBusinessDays = function (myd, days, holidays) {
	holidays = holidays || [];
	var nd, d = 0;
	function addDays (cd) {
		nd = SPe.Date.addDays(cd, 1);
		var nday = nd.getDay();
		if (nday !== 0 && nday !== 6 && !SPe.has(holidays, SPe.Date.format(nd))) { d++; }
		if (d < days) { addDays(nd); }
		return nd;
	}
	return addDays(myd);
};

// Form

SPe.Form.get = function (base) {
	base = base || window;
	var f = base.document.getElementById("part1") || base.document.getElementById("formTbl") || SPe.Form.elGetByClass(document, "div", "od-Panel--md") || SPe.Form.elGetByClass(document, "div", "od-ListForm-fullPage");
	return f;
};

SPe.Form.tblGet = function (el) {
	var t = SPe.Form.elGetByClass(el, "table", "ms-formtable") || SPe.Form.elGetByClass(el, "table");
	return t;
};

SPe.Form.elGet = function (el, tagName, idContains, titleContains) {
	var ctr = null;
	var elms = el.getElementsByTagName(tagName);
	var i;
	for (i = 0; i < elms.length; i++) {
		if (SPe.has(elms[i].id, idContains) && (!titleContains || SPe.has(elms[i].title, titleContains))) {
			ctr = elms[i];
			break;
		}
	}
	return ctr;
};

SPe.Form.elGetByClass = function (el, tagName, classContains) {
	var ctr = null;
	var elms = el.getElementsByTagName(tagName);
	var i;
	for (i = 0; i < elms.length; i++) {
		if (!classContains || SPe.has(elms[i].className, classContains)) {
			ctr = elms[i];
			break;
		}
	}
	return ctr;
};

SPe.Form.elGetByText = function (el, tagName, txtContains) {
	var ctr = null;
	var elms = el.getElementsByTagName(tagName);
	var i;
	for (i = elms.length-1; i >= 0; i--) {
		if (!txtContains || SPe.has(elms[i].parentNode.innerHTML, txtContains)) {
			ctr = elms[i];
			break;
		}
	}
	return ctr;
};

SPe.Form.elGetParent = function (el, tagName, txtContains) {
	var ctr = null;
	tagName = tagName.toLowerCase();
	while (el.parentNode) {
		el = el.parentNode;
		if (el.tagName && el.tagName.toLowerCase() === tagName && (!txtContains || SPe.has(el.parentNode.innerHTML, txtContains))) {
			ctr = el;
			break;
		}
	}
	return ctr;
};

SPe.Form.elVisible = function (ref, display) {
	if (display === undefined || display === true) { display = ""; }
	if (display === false) { display = "none"; }
	var p = SPe.Form.elGetParent(ref, "tr") || SPe.Form.elGetParent(ref, "div", "ReactFieldEditor");
	p.style.display = display;
};

SPe.Form.elHide = function (ref) {
	SPe.Form.elVisible(ref, false);
};

SPe.Form.elShow = function (ref) {
	SPe.Form.elVisible(ref, true);
};

SPe.Form.elMinimize = function (ref) {
	var td = SPe.Form.elGetParent(ref, "td");
	var toggle = document.createElement("div");
	td.insertBefore(toggle, td.firstChild);
	function ctrShow (ref) { toggle.innerHTML = "<a href='#'>&#171; Hide the field</a><br><br>"; SPe.show(ref); }
	function ctrHide (ref) { toggle.innerHTML = "<a href='#'>&#187; Show the field</a>"; SPe.hide(ref); }
	function ctrToggle (ref) { if (ref.style.display === "none") { ctrShow(ref); } else { ctrHide(ref); } }
	toggle.onclick = function () { ctrToggle(ref); };
	ctrHide(ref);
};

SPe.Form.elRewrite = function (ref, rval) {
	var mode;
	if (ref.type === "text") { mode = "text"; }
	if (ref.type === "textarea") { mode = "textarea"; }
	if (ref.type === "select-one") { mode = "select"; }
	if (SPe.has(ref.id, "DateTimeFieldDate")) { mode = "date"; }
	if (SPe.has(ref.id, "ClientPeoplePicker")) { mode = "user"; }
	if (SPe.has(ref.id, "MultiChoiceTable")) { mode = "checkboxes"; }
	if (SPe.has(ref.className, "taxonomy")) { mode = "taxonomy"; }

	var ctr, val = "", input, users, ops, i;
	switch (mode) {
		case "text":
			ctr = ref;
			val = ctr.value;
			break;
		case "textarea":
			ctr = ref;
			val = SPe.Form.textGroom(ctr.value);
			break;
		case "select":
			ctr = ref;
			if (SPe.has(ctr.toString(), "Select")) { val = ctr.options[ctr.selectedIndex].text; }
			break;
		case "date":
			ctr = SPe.Form.elGetParent(ref, "table");
			val = ref.value;
			break;
		case "user":
			ctr = ref.parentNode;
			input = SPe.Form.elGet(ctr, "input", "HiddenInput");
			users = JSON.parse(input.value);
			users.forEach(function (user) {
				val += ", " + user.DisplayText;
			});
			val = val.substring(2);
			break;
		case "checkboxes":
			ctr = ref;
			ops = ctr.getElementsByTagName("span");
			for (i = 0; i < ops.length; i++) {
				if (SPe.has(ops[i].innerHTML.toLowerCase(), "checked")) {
					val += ", " + ops[i].title;
				}
			}
			val = val.substring(2);
			break;
		case "taxonomy":
			ctr = ref;
			input = SPe.Form.elGet(SPe.Form.elGetParent(ctr, "td"), "input", "input");
			val = input.value;
			val = val.substring(0, val.indexOf("|"));
			break;
	}

	if (rval !== undefined) { val = rval; }
	var p = SPe.Form.elGetParent(ctr, "td") || SPe.Form.elGetParent(ctr, "div");
	var fc = p.firstChild; if (fc.nodeName.toLowerCase() === "span") { p.removeChild(fc); }
	SPe.hide(ctr);
	var desc = SPe.Form.elGetByClass(p, "span", "ms-metadata"); if (desc) { SPe.hide(desc); }
	var span = document.createElement("span");
	if (SPe.has(SPe.type(p), "div")) { span.style.padding = "6px 12px 1px 12px"; }
	span.innerHTML = val;
	p.insertBefore(span, p.firstChild);
};

SPe.Form.setField = function (ref, val) {
	var e = document.createEvent("Event");
	e.initEvent("input", true, true);
	ref.value = val;
	ref.dispatchEvent(e);
	ref.focus(); ref.blur();
};

SPe.Form.preSaveTextareas = [];

SPe.Form.textareaReplace = function (ref, cnt) {
	if (!SPe.has(SPe.Form.preSaveTextareas, ref)) {
		SPe.Form.preSaveTextareas.push(ref);
		SPe.hide(ref.parentNode);
		var td = SPe.Form.elGetParent(ref, "td");
		var span = document.createElement("span"); span.innerHTML = cnt.innerHTML; cnt.parentNode.removeChild(cnt);
		var el = td.insertBefore(span, td.firstChild);
		if (ref.value) {
			if (SPe.has(el.innerHTML, "rowDuplicate")) {
				var vals = ref.value.split("\n");
				var cref = SPe.Form.elGetByText(el, "input") || SPe.Form.elGetByText(el, "select");
				var r;
				for (r = 0; r < vals.length; r++) { SPe.Form.rowDuplicate(cref, vals.length); }
			}
			SPe.Form.textareaValues(ref);
		}
		window.PreSaveAction = window.PreSaveAction || SPe.Form.preSaveValues;
	}
};

SPe.Form.textareaValues = function (ref) {
	function people (ref, val) {
		var i, users = val.split(",");
		for (i = 0; i < users.length; i++) {
			SPe.Form.userSet(SPe.Form.elGet(ref, "div", "TopSpan"), users[i], false);
		}
	}
	if (ref.value) {
		var vals = ref.value.split("\n");
		var n = 0;
		var ctd = SPe.Form.elGetParent(ref, "td");
		var table = SPe.Form.elGetByClass(ctd, "table");
		var r, tr, rhtml, d, td, v, cref, isdiv;
		for (r = 0; r < table.rows.length; r++) {
			tr = table.rows[r];
			rhtml = tr.innerHTML;
			if (vals[n] && (SPe.has(rhtml, "input") || SPe.has(rhtml, "select"))) {
				v = vals[n].split(";");
				n++;
				for (d = 0; d < tr.cells.length; d++) {
					td = tr.cells[d];
					cref = SPe.Form.elGetByText(td, "input") || SPe.Form.elGetByText(td, "select") || SPe.Form.elGetByText(td, "div");
					if (cref) {
						isdiv = SPe.type(cref) === "htmldivelement";
						if (isdiv || SPe.has(cref.className, "peoplepicker")) {
							if (!isdiv) { cref = SPe.Form.elGetParent(cref, "div"); }
							setTimeout(people.bind(null, cref, v[d]), 400);
						}
						else {
							cref.value = v[d];
						}
					}
				}
			}
		}
	}
};

SPe.Form.preSaveValues = function () {
	function emails (users) {
		var e = "";
		if (users) {
			JSON.parse(users).forEach(function (user) {
				e += "," + user.EntityData.Email;
			});
			e = e.substring(1);
		}
		return e;
	}
	SPe.Form.preSaveTextareas.forEach(function (ref) {
		var ctd = SPe.Form.elGetParent(ref, "td");
		var r, tr, rhtml, d, td, cref;
		var v, users, value = "";
		var table = SPe.Form.elGetByClass(ctd, "table");
		for (r = 0; r < table.rows.length; r++) {
			tr = table.rows[r];
			rhtml = tr.innerHTML;
			if (SPe.has(rhtml, "input") || SPe.has(rhtml, "select")) {
				value += "\n";
				for (d = 0; d < tr.cells.length; d++) {
					td = tr.cells[d];
					cref = SPe.Form.elGetByText(td, "input") || SPe.Form.elGetByText(td, "select");
					if (cref) {
						if (SPe.has(cref.className, "peoplepicker")) {
							v = emails(SPe.Form.elGet(SPe.Form.elGetParent(cref, "div"), "input", "HiddenInput").value);
						}
						else { v = cref.value.trim().replace(";", ","); }
						value += v + ";";
					}
				}
			}
		}
		value = value.replace(/\n;+/g, "");
		if (value) {
			value = value.substring(1);
			ref.value = value;
		}
	});
	return true;
};

SPe.Form.rowDuplicate = function (ref, limit) {
	limit = limit || 5;
	var table = SPe.Form.elGetParent(ref, "table");
	var tr = SPe.Form.elGetParent(ref, "tr");
	if (table.rows.length <= limit) {
		var r = table.insertRow(-1);
		r.innerHTML = tr.innerHTML;
	}
};

SPe.Form.choicesGroom = function (ref) {
	ref.style.width = "100%";
	var r, span, input, label;
	for (r = 0; r < ref.rows.length; r++) {
		span = ref.rows[r].cells[0].childNodes[0];
		input = span.childNodes[0];
		label = span.childNodes[1];
		input.style.cssFloat = "left";
		input.style.marginRight = "5px";
		label.style.display = "block";
	}
};

SPe.Form.optionsSave = function (ref) {
	var o = [];
	var k;
	for (k = 0; k < ref.length; k++) {
		if (ref[k].value) {
			o.push({ text: ref[k].text, value: ref[k].value, selected: ref[k].selected });
		}
	}
	return o;
};

SPe.Form.optionsShow = function (ref, items, firstblank) {
	var ops = SPe.Form.optionsSave(ref);
	ref.length = 0;
	var o;
	if (firstblank) {
		o = document.createElement("option"); o.value = ""; o.text = "";
		ref.add(o);
	}
	ops.forEach(function (op, i) {
		if (!items || SPe.has(items, op.value) || SPe.has(items, i)) {
			o = document.createElement("option"); o.value = op.value; o.text = op.text;
			ref.add(o);
			if (op.selected && !firstblank) { ref.options[ref.length - 1].selected = true; }
		}
	});
};

SPe.Form.rowsVisible = function (table, rows, display) {
	if (display === undefined || display === true) { display = ""; }
	if (display === false) { display = "none"; }
	rows = SPe.Util.rangeToArray(rows);
	var r;
	for (r = 0; r < table.rows.length; r++) {
		if (SPe.has(rows, r)) {
			table.rows[r].style.display = display;
		}
	}
};

SPe.Form.headerAdd = function (table, html, hideOnDialog) {
	if (hideOnDialog === undefined) { hideOnDialog = true; }

	table.style.marginTop = "0";
	var row = table.insertRow(0);
	row.className = "form-header";
	var hide = ""; if (hideOnDialog) { hide = "<style>.ms-dialog .form-header { display: none }</style>"; }

	var c = row.insertCell(0);
	c.colSpan = table.rows[1].cells.length;
	c.style.paddingBottom = "14px";
	c.innerHTML = hide + "<div class='ms-rteFontSize-4'></div>";

	var header = SPe.Form.elGetByClass(c, "div", "ms-rteFontSize-4");
	if (html) { header.innerHTML = html; }
	return header;
};

SPe.Form.rowAdd = function (ref, html, bgColor) {
	var refRow = SPe.Form.elGetParent(ref, "tr");
	var table = refRow.parentNode;
	var row = table.insertRow(refRow.rowIndex);
	var c = row.insertCell(0);
	c.colSpan = 2;
	if (bgColor) { c.style.backgroundColor = bgColor; }
	c.innerHTML = html;
	return c;
};

SPe.Form.divAdd = function (ref, html, bgColor) {
	var home = SPe.Form.elGetParent(ref, "div", "ReactClientFormFields");
	var div = document.createElement("div");
	if (bgColor) { div.style.backgroundColor = bgColor; }
	div.innerHTML = html;
	home.insertBefore(div, SPe.Form.elGetParent(ref, "div", "clientFormField"));
	return div;
};

SPe.Form.selectSet = function (ref, val) {
	var i;
	for (i = 0; i < 100; i++) {
		if (ref.options[i].value === val) {
			ref.options[i].selected = true;
			break;
		}
	}
};

SPe.Form.taxonomySet = function (ref, val) {
	var vtxt = val.Label || val.get_label(); var vid = val.TermGuid || val.get_termGuid();
	var td = SPe.Form.elGetParent(ref, "td");
	var input = SPe.Form.elGet(td, "input", "input") || SPe.Form.elGet(td, "input", "ctl");
	var div = SPe.Form.elGet(td, "div", "editableRegion");
	div.innerHTML = "<span class='valid-text' title=''>" + vtxt + "</span>;&nbsp;<span id='ms-rterangecursor-start'></span><span id='ms-rterangecursor-end'></span>";
	input.value = vtxt + "|" + vid;
};

SPe.Form.taxonomyEmpty = function (ref) {
	var td = SPe.Form.elGetParent(ref, "td");
	var input = SPe.Form.elGet(td, "input", "input") || SPe.Form.elGet(td, "input", "ctl");
	var div = SPe.Form.elGet(td, "div", "editableRegion");
	div.innerHTML = "";
	input.value = "";
};

SPe.Form.taxonomyMonitor = function (ref, callback) {
	var td = SPe.Form.elGetParent(ref, "td");
	var input = SPe.Form.elGet(td, "input", "input") || SPe.Form.elGet(td, "input", "ctl");
	var div = SPe.Form.elGet(td, "div", "editableRegion");
	var old = input.value;
	SPe.Form.elMonitor(div, function () {
		var val = input.value;
		if (val && !SPe.has(val, "-0000-0000-0000-") && val !== old) {
			old = val;
			callback(val);
		}
	});
};

SPe.Form.textLinkify = function (originalText) {
	var replacedText = "";
	if (originalText) {
		var exp = /([^"])((http|https|ftp|file):\/\/[A-Z0-9_\-+#\/.]+[A-Z0-9_\-+&@#\/%?=~|!:,;]+)/gi;
		var exp2 = /([^\/])(www\.[A-Z0-9_\-+#\/.]+[A-Z0-9_\-+&@#\/%?=~|!:,;]+)/gi;
		var exp3 = /([A-Z0-9_\'\-.]+@[A-Z0-9_\-.]+\.[A-Z]{2,4})/gi;
		replacedText = originalText.replace(exp, "$1<a href=$2>$2</a>");
		replacedText = replacedText.replace(exp2, "$1<a href=http://$2>$2</a>");
		replacedText = replacedText.replace(exp3, "<a href=mailto:$1>$1</a>");
	}
	return replacedText;
};

SPe.Form.textBreakify = function (originalText) {
	var replacedText = "";
	if (originalText) {
		replacedText = originalText.replace(/(?:\r\n|\r|\n)/g, "<br> ");
	}
	return replacedText;
};

SPe.Form.textBreaksClean = function (originalText) {
	var replacedText = "";
	if (originalText) {
		replacedText = originalText.replace(/(<br>\s+)/gi, "<br>");
		replacedText = replacedText.replace(/(<br><br>(<br>)+)/gi, "<br><br>");
	}
	return replacedText;
};

SPe.Form.textGroom = function (txt) {
	return SPe.Form.textBreaksClean(SPe.Form.textLinkify(SPe.Form.textBreakify(txt)));
};

SPe.Form.commentsGroom = function (ref, style) {
	style = style || "border-top: 1px solid #c6c6c6;";
	if (ref.parentNode.id !== "SPFieldNote" && ref.parentNode.parentNode.id !== "SPFieldNote") {
		var div = document.createElement("div"); div.innerHTML = "<br>";
		ref.insertBefore(div, ref.firstChild);
	}
	var divHtml = ref.innerHTML;
	var newHtml = divHtml.replace(/>\):/g, ">):<div style='" + style + "'><br></div>");
	ref.innerHTML = SPe.Form.textGroom(newHtml);
};

SPe.Form.userSet = function (ref, user, init) {
	if (init === undefined) { init = true; }
	var td = SPe.Form.elGetParent(ref, "td");
	var field = SPe.Form.elGet(td, "div", "UserField");
	if (field) {
		var fhtml = field.innerHTML.toLowerCase();
		if (!init || fhtml === "" || fhtml === "&nbsp;") {
			field.innerHTML = user;
			SPe.Form.elGet(td, "a", "checkNames").click();
		}
	}
	else {
		var input = SPe.Form.elGet(td, "input", "HiddenInput");
		if (!init || (input && input.value === "")) {
			var editor = SPe.Form.elGet(td, "input", "EditorInput");
			editor.value = user;
			var base = window;
			if (!base.SPClientPeoplePicker) {
				var f;
				for (f = 0; f < window.frames.length; f++) {
					if (window.frames[f].SPClientPeoplePicker) {
						base = window.frames[f];
						break;
					}
				}
			}
			var div = SPe.Form.elGet(td, "div", "ClientPeoplePicker") || SPe.Form.elGet(td, "div", "TopSpan");
			var peoplePicker = base.SPClientPeoplePicker.SPClientPeoplePickerDict[div.id];
			peoplePicker.AddUnresolvedUserFromEditor(true);
		}
	}
};

SPe.Form.userEmpty = function (ref) {
	var td = SPe.Form.elGetParent(ref, "td");
	var field = SPe.Form.elGet(td, "div", "UserField");
	if (field) {
		field.innerHTML = "";
	}
	else {
		var input = SPe.Form.elGet(td, "input", "HiddenInput");
		var div = SPe.Form.elGet(td, "div", "ClientPeoplePicker") || SPe.Form.elGet(td, "div", "TopSpan");
		var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[div.id];
		var users = peoplePicker.GetAllUserInfo();
		users.forEach(function (user) {
			peoplePicker.DeleteProcessedUser(users[user]);
		});
		input.value = "";
	}
};

SPe.Form.userMonitor = function (ref, callback) {
	var td = SPe.Form.elGetParent(ref, "td");
	var field = SPe.Form.elGet(td, "div", "UserField");
	var input, div, error;
	if (field) {
		input = SPe.Form.elGet(td, "input", "hiddenSpanData");
		div = field;
		error = SPe.Form.elGet(td, "span", "errorLabel");
	}
	else {
		input = SPe.Form.elGet(td, "input", "HiddenInput");
		div = SPe.Form.elGet(td, "div", "ClientPeoplePicker");
	}

	var logins = function (inp) {
		var vals = "";
		if (inp && inp !== "&#160;" && !SPe.has(inp, "&nbsp;")) {
			var login;

			if (SPe.has(inp, "spani")) {
				if (!error.innerHTML) {
					var span = document.createElement("span");
					span.innerHTML = inp;
					var elms = span.getElementsByTagName("span");
					var i;
					for (i = 0; i < elms.length; i++) {
						login = elms[i].title;
						if (login) { vals += ";" + login; }
					}
				}
			}

			if (SPe.has(inp, "[")) {
				error = SPe.Form.elGetByClass(td, "span", "errorMsg");
				if (!error) {
					var users = JSON.parse(inp);
					users.forEach(function (user) {
						login = SPe.Util.propertyValue(user, "Description");
						if (login) { vals += ";" + login; }
					});
				}
			}

			vals = vals.substring(1);
		}
		return vals;
	};

	var old = logins(input.value);
	SPe.Form.elMonitor(div, function () {
		var val = logins(input.value);
		if (val && val !== old) {
			old = val;
			callback(val);
		}
	});
};

SPe.Form.dialogHandler = function (f) {
	var div = SPe.Form.elGet(document, "div", "s4-workspace");
	if (div) { div.style.overflow = "hidden"; }
	if (f) { f(); }
	SP.SOD.executeOrDelayUntilScriptLoaded(function () {
		var dlg = SP.UI.ModalDialog.get_childDialog();
		if (dlg) { dlg.autoSize(); }
	}, "SP.UI.Dialog.js");
};

SPe.Form.dialogRefreshPage = function (result) {
	SP.UI.ModalDialog.RefreshPage(result);
};

SPe.Form.paramGet = function (name) {
	var url = document.URL;
	var rval = null;
	if (SPe.has(url, "?") && SPe.has(url, name + "=")) {
		var urlParams = url.split("?")[1].split("&");
		var i, param;
		for (i = 0; i < urlParams.length; i++) {
			param = urlParams[i].split("=");
			if (param[0] === name) { rval = decodeURIComponent(param[1]); }
		}
	}
	return rval;
};

SPe.Form.paramRemove = function (name) {
	var url = document.URL;
	var rval = url;
	if (SPe.has(url, "?") && SPe.has(url, name + "=")) {
		rval = url.split("?")[0];
		var params = url.split("?")[1].split("&");
		var i, param;
		for (i = params.length - 1; i >= 0; i--) {
			param = params[i].split("=")[0];
			if (param === name) { params.splice(i, 1); }
		}
		if (params.length) { rval += "?" + params.join("&"); }
	}
	return rval;
};

SPe.Form.preSaveFields = [];

SPe.Form.elValidate = function (ref) {
	if (!SPe.has(SPe.Form.preSaveFields, ref)) {
		SPe.Form.preSaveFields.push(ref);
		var accent = SPe.Form.elGetParent(ref, "tr").cells[0].childNodes[0];
		if (!SPe.has(ref.title, "Required")) { ref.title += " Required Field"; }
		if (!SPe.has(accent.innerHTML, "required")) { accent.innerHTML += "<span title='This is a required field.' class='ms-accentText'> *</span>"; }
		window.PreSaveAction = window.PreSaveAction || SPe.Form.preSaveValidation;
	}
};

SPe.Form.preSaveValidation = function () {
	var rval = true;
	SPe.Form.preSaveFields.forEach(function (ref) {
		var refError, span;
		refError = SPe.Form.elGetByClass(ref.parentNode, "span", "ms-formvalidation");
		if (!ref.value) {
			if (!refError) {
				span = document.createElement("span");
				span.innerHTML = "<span class='ms-formvalidation ms-csrformvalidation'><span role='alert'>You can't leave this blank.<br></span></span>";
				ref.parentNode.appendChild(span);
			}
			else {
				SPe.show(refError.parentNode);
			}
			rval = false;
		}
		else {
			if (refError) { SPe.hide(refError.parentNode); }
		}
	});
	return rval;
};

SPe.Form.elMonitor = function (ref, callback) {
	ref.addEventListener("DOMSubtreeModified", callback, false);
};

SPe.Form.callout = function (options) {
	SP.SOD.registerSod("Callout.js", "/_layouts/15/Callout.js");
	SP.SOD.loadMultiple(["Callout.js"], function () {
		CalloutManager.createNew(options);
	});
};

SPe.Form.datePicker = function (id) {
	SP.SOD.registerSod("Datepicker.js", "/_layouts/15/Datepicker.js");
	SP.SOD.loadMultiple(["Datepicker.js"], function () {
		var did = id + "_" ;
		document.getElementById(id).innerHTML = "<table id='" + did + "TopTable' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td class='ms-dtinput'><label style='display: none'>Date Picker</label><input title='Date Picker' class='ms-input' id='" + did + "' type='text' maxlength='45' value='' autopostback='0'></td><td class='ms-dtinput'><a role='button' onclick=\"clickDatePicker('" + did + "', '/_layouts/15/iframe.aspx?date=', '', event); return false;\" href='#'><img id='" + did + "DatePickerImage' alt='Select a date from the calendar.' src='/_layouts/15/images/calendar_25.gif?rev=23' border='0'></a></td><td><iframe id='" + did + "DatePickerFrame' src='/_layouts/15/iframe.aspx?date=' frameborder='0' scrolling='no' style='left: 0; top: -999px; width: 200px; height: 236px; display: none; position: absolute; z-index: 101;'></iframe></td></tr></tbody></table>";
	});
};

SPe.Form.taxonomyPicker = function (id, sspid, tid, options) {
	options = options || {
		IsMulti: true,
		AllowFillIn: false,
		IsSpanTermSets: false,
		IsSpanTermStores: false,
		IsIgnoreFormatting: false,
		IsIncludeDeprecated: false,
		IsIncludeUnavailable: false,
		IsIncludeTermSetName: false,
		IsAddTerms: false,
		IsIncludePathData: false,
		IsUseCommaAsDelimiter: false,
		Disable: false,
		ExcludeKeyword: false,
		JavascriptOnValidation: "",
		DisplayPickerButton: true,
		Lcid: 1033
	};
	var iid = id + "_input", pid = id + "_picker";
	document.getElementById(id).innerHTML = "<link rel='stylesheet' type='text/css' href='_layouts/15/1033/styles/WebTaggingUI.css' /><input name='" + iid + "' type='hidden' id='" + iid + "' /><div id='" + pid + "' class='ms-taxonomy ms-taxonomy-height ms-taxonomy-width'></div>";
	SP.SOD.registerSod("SP.Taxonomy.js", "/_layouts/15/SP.Taxonomy.js");
	SP.SOD.registerSod("SP.UI.Rte.js", "/_layouts/15/SP.UI.Rte.js");
	SP.SOD.registerSod("ScriptForWebTaggingUI.js", "/_layouts/15/ScriptForWebTaggingUI.js");
	SP.SOD.registerSod("ScriptResources.resx", "/_layouts/15/ScriptResx.ashx?culture=en-us&name=ScriptResources");
	SP.SOD.loadMultiple(["SP.js"], function () {
		SP.SOD.loadMultiple(["SP.Taxonomy.js", "SP.UI.Rte.js", "ScriptResources.resx"], function () {
			var t = document.getElementById(pid);
			var aid = "00000000-0000-0000-0000-000000000000";
			t.InputFieldId = iid;
			t.SspId = sspid;
			t.TermSetId = tid;
			t.AnchorId = aid;
			t.FieldName = "";
			t.FieldId = aid;
			t.WebServiceUrl = _spPageContextInfo.webServerRelativeUrl + "\u002f_vti_bin\u002fTaxonomyInternalService.json";
			SPe.Util.augment(t, options);
			SP.SOD.executeFunc("ScriptForWebTaggingUI.js", "Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.taggingLoad", function () { Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.resetEventsRegistered(); });
			SP.SOD.executeFunc("ScriptForWebTaggingUI.js", "Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.onLoad", function () { Microsoft.SharePoint.Taxonomy.ScriptForWebTaggingUI.onLoad(t.id); });
		});
	});
};

SPe.Form.peoplePicker = function (id, options) {
	options = options || {
		PrincipalAccountType: "User,DL,SecGroup,SPGroup",
		SearchPrincipalSource: 15,
		ResolvePrincipalSource: 15,
		AllowMultipleValues: true,
		MaximumEntitySuggestions: 50,
		Width: "383px"
	};
	SP.SOD.registerSod("ClientTemplates.js", "/_layouts/15/ClientTemplates.js");
	SP.SOD.registerSod("ClientForms.js", "/_layouts/15/ClientForms.js");
	SP.SOD.registerSod("ClientPeoplePicker.js", "/_layouts/15/ClientPeoplePicker.js");
	SP.SOD.registerSod("AutoFill.js", "/_layouts/15/AutoFill.js");
	SP.SOD.loadMultiple(["ClientTemplates.js", "ClientForms.js", "ClientPeoplePicker.js", "AutoFill.js"], function () {
		SPClientPeoplePicker_InitStandaloneControlWrapper(id, null, options);
	});
};

SPe.Form.peoplePickerValues = function (users) {
	var people = [];
	var i;
	for (i = 0; i < users.length; i++) {
		people.push(SP.FieldUserValue.fromUser(users[i].Key));
	}
	return people;
};

SPe.Form.lookupValues = function (objs) {
	var vals = "";
	if (objs) {
		var os = []; if (objs.length) { os = objs; } else { os[0] = objs; }
		var i;
		for (i = 0; i < os.length; i++) {
			vals += ", " + os[i].get_lookupValue();
		}
		vals = vals.substring(2);
	}
	return vals;
};

SPe.Form.ready = function (callback) {
	var base = window;
	if (!SPe.Form.get(base)) {
		var f;
		for (f = 0; f < window.frames.length; f++) {
			if (SPe.Form.get(window.frames[f])) {
				base = window.frames[f];
				break;
			}
		}
	}
	base.addEventListener("load", function () { SPe.Query.ready(callback); }, false);
};

SPe.Form.hide = function (lookup) {
	SPe.Util.when(lookup, function () { var ref = lookup(); SPe.hide(ref); });
};

SPe.Form.observe = function (callback) {
	function getDiv () { return document.querySelector("div.od-OverlayHost"); }
	SPe.Util.when(getDiv, function () {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (m) {
				if (SPe.has(m.target.className, "od-ListForm-topBar")) {
					SPe.Util.wait(function formLoading () { callback(); });
				}
			});
		});
		observer.observe(getDiv(), { attributes: false, childList: true, subtree: true });
	});
};

// List

SPe.List.listen = true;

SPe.List.customizer = function (cols) { if (SPe.List.listen) { SPe.Util.wait(function customizer () {
	SPe.List.listen = false;

	var hds = [], hfs = {};
	function headers (c, col) { if (SPe.has(c.innerText, col)) { var ci = c.getAttribute("aria-colindex"); hds.push(ci); hfs[ci] = cols[col]; } }
	var h = document.querySelector("div.ms-DetailsHeader");
	if (h) {
		var cs = h.querySelectorAll("div.ms-DetailsHeader-cell");
		var i, col;
		for (i = 0; i < cs.length; i++) {
			for (col in cols) {
				if (cols.hasOwnProperty(col)) { headers(cs[i], col); }
			}
		}
	}

	function echange (e, hf) { e.addEventListener("DOMCharacterDataModified", function () { hf(e); }); }
	var l = document.querySelector("div.ms-List");
	if (l) {
		var elms = l.querySelectorAll("div.ms-DetailsRow-cell");
		var d, e, j, di, hf;
		for (j = 0; j < elms.length; j++) {
			d = elms[j];
			di = d.getAttribute("aria-colindex");
			if (SPe.has(hds, di)) {
				e = d.querySelector("div.od-FieldRenderer-text");
				hf = hfs[di];
				hf(e); echange(e, hf);
			}
		}
	}

	SPe.List.listen = true;
}, 50); } };

SPe.List.listener = function (cols) {
	function getDiv () { return document.querySelector("div.od-ItemContent-list"); }
	SPe.Util.when(getDiv, function () {
		SPe.List.customizer(cols);
		getDiv().addEventListener("DOMNodeInserted", function () { SPe.List.customizer(cols); });
	});
};

// Query

SPe.Query.ready = function (callback) {
	SP.SOD.executeOrDelayUntilScriptLoaded(callback, "SP.js");
};

SPe.Query.failed = function (sender, args) {
	console.warn("Query failed. " + sender.get_webRequest().get_url() + ". " + args.get_message());
};

SPe.Query.context = function () {
	return SP.ClientContext.get_current();
};

SPe.Query.items = function (list, caml, callback) {
	var context = SPe.Query.context();
	var query = new SP.CamlQuery(); query.set_viewXml(caml);
	var items = context.get_web().get_lists().getByTitle(list).getItems(query);
	context.load(items);
	context.executeQueryAsync(function () { callback(items); }, SPe.Query.failed);
};

SPe.Query.succeeded = function (items, callback) {
	var enumerator = items.getEnumerator();
	var item;
	while (enumerator.moveNext()) {
		item = enumerator.get_current().get_fieldValues();
		callback(item);
	}
};

SPe.Query.forEach = function (list, caml, callback) {
	SPe.Query.items(list, caml, function (items) { SPe.Query.succeeded(items, callback); });
};

SPe.Query.itemById = function (list, itemId, callback) {
	var context = SPe.Query.context();
	var item = context.get_web().get_lists().getByTitle(list).getItemById(itemId);
	context.load(item);
	context.executeQueryAsync(function () { callback(item); }, SPe.Query.failed);
};

SPe.Query.currentUserInit = function (ref) {
	var context = SPe.Query.context();
	var currentUser = context.get_web().get_currentUser();
	context.load(currentUser);
	context.executeQueryAsync(function () { SPe.Form.userSet(ref, currentUser.get_loginName(), true); }, SPe.Query.failed);
};

SPe.Query.currentUser = function (callback) {
	var context = SPe.Query.context();
	var currentUser = context.get_web().get_currentUser();
	context.load(currentUser);
	context.executeQueryAsync(function () { callback(currentUser); }, SPe.Query.failed);
};

SPe.Query.userById = function (userId, callback) {
	var context = SPe.Query.context();
	var user = context.get_web().get_siteUsers().getById(userId);
	context.load(user);
	context.executeQueryAsync(function () { callback(user); }, SPe.Query.failed);
};

SPe.Query.userProfile = function (mode, userLogin, callback) {
	SP.SOD.registerSod("SP.UserProfiles.js", "/_layouts/15/SP.UserProfiles.js");
	SP.SOD.registerSodDep("SP.UserProfiles.js", "SP.Runtime.js");
	SP.SOD.loadMultiple(["SP.UserProfiles.js", "SP.Runtime.js"], function () {
		var context = SPe.Query.context();
		var peopleManager = new SP.UserProfiles.PeopleManager(context);
		var properties;
		switch (mode) {
			case "user":
				properties = peopleManager.getPropertiesFor(userLogin);
				break;
			case "current":
				properties = peopleManager.getMyProperties();
				break;
		}
		context.load(properties);
		context.executeQueryAsync(function () { callback(properties); }, SPe.Query.failed);
	});
};

SPe.Query.userProperties = function (userLogin, callback) {
	SPe.Query.userProfile("user", userLogin, callback);
};

SPe.Query.currentUserProperties = function (callback) {
	SPe.Query.userProfile("current", "", callback);
};

SPe.Query.userMembership = function (user, group) {
	var isInGroup = false;
	var groupUsers = group.get_users();
	var groupEnumerator = groupUsers.getEnumerator();
	var groupUser;
	while (groupEnumerator.moveNext()) {
		groupUser = groupEnumerator.get_current();
		if (groupUser.get_id() === user.get_id()) {
			isInGroup = true;
			break;
		}
	}
	return isInGroup;
};

SPe.Query.userGroup = function (mode, userLogin, groupName, callback) {
	var context = SPe.Query.context();
	var user;
	switch (mode) {
		case "user":
			user = context.get_web().get_siteUsers().getByLoginName(userLogin);
			break;
		case "current":
			user = context.get_web().get_currentUser();
			break;
	}
	context.load(user);
	var allGroups = context.get_web().get_siteGroups(); context.load(allGroups);
	var group = allGroups.getByName(groupName); context.load(group);
	var groupUsers = group.get_users(); context.load(groupUsers);
	context.executeQueryAsync(function () { callback(SPe.Query.userMembership(user, group)); }, SPe.Query.failed);
};

SPe.Query.userInGroup = function (userLogin, groupName, callback) {
	SPe.Query.userGroup("user", userLogin, groupName, callback);
};

SPe.Query.currentUserInGroup = function (groupName, callback) {
	SPe.Query.userGroup("current", "", groupName, callback);
};

// Rest

SPe.Rest.headers = function (options) {
	var headers = {};

	if (!options || SPe.has(options, "json")) {
		var json = "application/json;odata=verbose";
		headers["Accept"] = json;
		headers["Content-Type"] = json;
	}

	if (!options || SPe.has(options, "digest")) {
		headers["X-RequestDigest"] = document.getElementById("__REQUESTDIGEST").value;
	}

	return headers;
};

SPe.Rest.currentUserProperties = function (callback) {
	var url = "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";
	SPe.Ajax.post(url, "", SPe.Rest.headers(), callback);
};

SPe.Rest.createFolder = function (folder, callback) {
	var context = SPe.Query.context();
	var url = context.get_url() + "/_api/web/Folders";
	var parameters = JSON.stringify({ "__metadata": { "type": "SP.Folder" }, "ServerRelativeUrl": folder });
	SPe.Ajax.post(url, parameters, SPe.Rest.headers(), callback);
};

SPe.Rest.addAttachments = function (listName, itemId, files, callback) {
	var i = 0;
	function addAttachment () {
		if (files[i]) {
			var fileSource = files[i][0];
			var fileData = files[i][1];
			var fileName = fileSource.substring(fileSource.lastIndexOf("/")) || fileSource;
			var context = SPe.Query.context();
			var url = context.get_url() + "/_api/web/lists/getbytitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles/add(FileName='" + fileName + "')";
			SPe.Ajax.post(url, fileData, SPe.Rest.headers("digest"), function () { i++; addAttachment(); });
		}
		else {
			callback();
		}
	}
	addAttachment();
};

// Tabs

SPe.Tabs.set = [];

SPe.Tabs.add = function (ref, cells, style, callback) {
	callback = callback || function () { SPe.Form.dialogHandler(); };

	var index = SPe.Tabs.set.push({}) - 1;

	var set = SPe.Tabs.set[index];
	var home = SPe.Form.elGetParent(ref, "table", "ms-formtable") || SPe.Form.elGetParent(ref, "div", "ReactClientFormFields");
	set.home = home;
	set.t  = SPe.has(SPe.type(home), "table");
	set.cells = cells;
	set.callback = callback;
	var dstyle = set.t ? {
		table: "border-spacing: 0 7px",
		td: "cursor: pointer; font-size: 110%; font-weight: bold; color: #5d5b5e; padding: 5px 20px; border-bottom: 1px solid transparent; border-top: 3px solid transparent; white-space: nowrap",
		bg: "#f2f2f2",
		color: "#508ee6",
		div: "width: 4px"
	} : {
		table: "border-spacing: 0 12px",
		td: "cursor: pointer; font-size: 100%; color: #333333; padding: 4px 18px; border-bottom: 1px solid transparent; border-top: 3px solid transparent; white-space: nowrap",
		bg: "#f4f4f4",
		color: "#0078d4",
		div: "width: 4px"
	};
	set.style = style || dstyle;

	var html = SPe.Tabs.render(index);
	if (set.t) {
		SPe.Form.rowAdd(ref, html);
	}
	else {
		SPe.Form.divAdd(ref, html);
	}
	SPe.Tabs.listen(index);

	var table = SPe.Form.elGet(home, "table", "tabs_" + index);
	var tds = table.rows[0].cells;
	tds[tds.length - 1].style.width = "90%";
	SPe.Tabs.click(tds[1]);
};

SPe.Tabs.render = function (index) {
	var set = SPe.Tabs.set[index];
	var cstyle = set.style;

	var t = "";
	t += "<table id='tabs_" + index + "' cellspacing='0' cellpadding='0' width='100%' style='" + cstyle.table + "'><tbody><tr>";
	t += "<td style='border-bottom: 1px solid " + cstyle.color + "'><div style='" + cstyle.div + "'></div>";

	set.cells.forEach(function (cell, c) {
		var tid;
		tid = "tab_" + index + "-" + c;
		t += "<td id='"+ tid + "' style='" + cstyle.td + "'>" + cell[0] + "</td>";
		t += "<td style='border-bottom: 1px solid " + cstyle.color + "'><div style='" + cstyle.div + "'></div>";
	});

	t += "</tr></tbody></table>";

	return t;
};

SPe.Tabs.listen = function (index) {
	var ti = "tabs_" + index;
	var tt = document.getElementById(ti) || document.getElementById("formFrame").contentWindow.document.getElementById(ti);
	var tds = tt.getElementsByTagName("td");
	function tclick (td) { td.addEventListener("click", function () { SPe.Tabs.click(this); }); }
	var i, td;
	for (i = 0; i < tds.length; i++) {
		td = tds[i];
		if (td.id) { tclick(td); }
	}
};

SPe.Tabs.click = function (ref) {
	var tid = ref.id;
	var index = tid.substring(tid.indexOf("_") + 1, tid.indexOf("-"));
	var tabi = tid.substring(tid.indexOf("-") + 1);

	var set = SPe.Tabs.set[index];
	var bg = set.style.bg;
	var color = set.style.color;
	var bt = "transparent";
	var bs = "1px solid " + color;
	var bn = "none";

	var tds = SPe.Form.elGetParent(ref, "table").rows[0].cells;

	var i, td;
	for (i = 0; i < tds.length; i++) {
		td = tds[i];
		if (SPe.has(td.id, "tab")) {
			if (td.id === tid) {
				td.style.backgroundColor = bt;
				td.style.borderTopColor = color;
				td.style.borderLeft = bs;
				td.style.borderRight = bs;
				td.style.borderBottom = bn;
			}
			else {
				td.style.backgroundColor = bg;
				td.style.borderTopColor = bt;
				td.style.borderLeft = bn;
				td.style.borderRight = bn;
				td.style.borderBottom = bs;
			}
		}
	}

	var trows = SPe.Util.rangeToArray(set.cells[tabi][1]);
	var brows = set.t ? set.home.rows : set.home.children;

	var t;
	for (t = 0; t < brows.length; t++) {
		if (brows[t]) {
			if (SPe.has(trows, t)) {
				SPe.show(brows[t]);
			}
			else {
				SPe.hide(brows[t]);
			}
		}
	}

	set.callback(ref);
};

SPe.Tabs.go = true;

SPe.Tabs.msgMonitor = function (refs, tid) {
	refs.forEach(function (ref) {
		var p = SPe.Form.elGetParent(ref, "td");
		SPe.Form.elMonitor(p, function () {
			if (SPe.has(p.innerHTML, "blank")) {
				if (SPe.Tabs.go) {
					SPe.Tabs.go = false;
					SPe.Tabs.click(SPe.Form.elGet(SPe.Form.elGetParent(ref, "table"), "td", tid));
					setTimeout(function () { SPe.Tabs.go = true; }, 50);
				}
			}
		});
	});
};

// Task

SPe.Task.outcome = function (outcome) {
	SPe.Task.refTaskOutcome.value = outcome;
	SPe.Task.refStatus.value = "Completed";
};

SPe.Task.groom = function () {
	var refForm = SPe.Form.get();
	SPe.Task.refStatus = SPe.Form.elGet(refForm, "select", "DropDownChoice", "Status");
	SPe.Task.refTaskOutcome = SPe.Form.elGet(refForm, "select", "DropDownChoice", "Task Outcome");

	if (SPe.Task.refStatus.value === "Completed") {
		SPe.Form.elRewrite(SPe.Task.refTaskOutcome);
		SPe.Form.elRewrite(SPe.Task.refStatus);
		var refCommentsText = SPe.Form.elGet(refForm, "textarea", "TextField", "Comments"); if (refCommentsText) { SPe.Form.elRewrite(refCommentsText); }

		var elms = refForm.getElementsByTagName("input");
		var i;
		for (i = 0; i < elms.length; i++) {
			if (elms[i].type === "button" && !elms[i].name) {
				SPe.hide(elms[i]);
			}
		}
	}
	else {
		SPe.Form.elHide(SPe.Task.refTaskOutcome);
		SPe.Form.elHide(SPe.Task.refStatus);
	}

	var refRelatedItems = SPe.Form.elGet(refForm, "div", "MainPanel");
	var td = refRelatedItems.parentNode;
	SPe.hide(td);
	SPe.Form.elMonitor(refRelatedItems, function () {
		var refAddRelatedItems = SPe.Form.elGet(td, "a", "add_related_items"); if (refAddRelatedItems) { SPe.hide(refAddRelatedItems.parentNode); }
		var refRemoveRelatedItems = SPe.Form.elGet(td, "a", "item_remove"); if (refRemoveRelatedItems) { SPe.hide(refRemoveRelatedItems.parentNode); }
		SPe.show(td);
	});
};

// Util

SPe.Util.augment = function (o, a) {
	Object.keys(a).forEach(function (k) {
		o[k] = a[k];
	});
};

SPe.Util.round = function (n, d) {
	if (d === undefined) { d = 2; }
	var r = Number(Math.round(n + "e" + d) + "e-" + d);
	return r;
};

SPe.Util.pad = function (n, len, c) {
	len = len || 2;
	c = c || "0";
	var x = n.toString();
	while (x.length < len) { x = c + x; }
	return x;
};

SPe.Util.rangeToArray = function (vals) {
	var array = [];
	vals.forEach(function (val) {
		var ind, r, start, end;
		ind = val.toString().indexOf("-");
		if (ind === -1) {
			array.push(parseInt(val));
		}
		else {
			start = parseInt(val.substring(0, ind));
			end = parseInt(val.substring(ind + 1));
			for (r = start; r <= end; r++) {
				array.push(r);
			}
		}
	});
	return array;
};

SPe.Util.collectionToArray = function (col) {
	var array = [];
	var i;
	for (i = 0; i < col.get_count(); i++) {
		array.push(col.itemAt(i));
	}
	return array;
};

SPe.Util.sort = function (array, by, asc) {
	var sorted;
	var d1 = 1, d2 = -1; if (asc) { d1 = -1; d2 = 1; }
	function compare (a, b) {
		var r = 0;
		var va = SPe.Util.propertyValue(a, by);
		var vb = SPe.Util.propertyValue(b, by);
		if (va < vb) { r = d1; }
		if (va > vb) { r = d2; }
		return r;
	}
	sorted = array.sort(compare);
	return sorted;
};

SPe.Util.flip = function (obj, pref) {
	var f = {};
	pref = pref || "";
	Object.keys(obj).forEach(function (k) {
		f[pref + obj[k]] = k;
	});
	return f;
};

SPe.Util.clone = function (obj) {
	var c;
	if (SPe.type(obj) === "array") {
		c = obj.slice();
	}
	else {
		c = {};
		Object.keys(obj).forEach(function (k) {
			var o = obj[k];
			c[k] = SPe.type(o) === "object" ? SPe.Util.clone(o) : o;
		});
	}
	return c;
};

SPe.Util.propertyValue = function (obj, key) {
	var val = null;
	function getValue (obj, key) {
		var k, o;
		for (k in obj) {
			if (obj.hasOwnProperty(k)) {
				o = obj[k];
				if (SPe.type(o) === "object") {
					if (!val && !o.get_web) { getValue(o, key); }
				}
				else {
					if (obj.Key === key || k === key) {
						val = obj.Value || o;
						break;
					}
				}
			}
		}
		return val;
	}
	return getValue (obj, key);
};

SPe.Util.xmlParse = function (xml) {
	xml = xml.replace(/&\s/g, "＆ ");
	var xobj;
	if (window.DOMParser) {
		var parser = new DOMParser();
		xobj = parser.parseFromString(xml, "text/xml");
	}
	else {
		xobj = new ActiveXObject("Microsoft.XMLDOM");
		xobj.async = false;
		xobj.loadXML(xml);
	}
	return xobj;
};

SPe.Util.tagContent = function (xobj, tag) {
	var val = null;
	var t = xobj.getElementsByTagName(tag);
	if (!t.length) { t = xobj.getElementsByTagName("d:" + tag); }
	if (t.length) { val = t[0].textContent; }
	return val;
};

SPe.Util.xmlProperties = function (xml) {
	var j = [];
	var xobj = SPe.Util.xmlParse(xml).getElementsByTagName("content");
	var i, item, c, chld, p, prop;
	for (i = 0; i < xobj.length; i++) {
		j[i] = {};
		item = xobj[i];
		for (c = 0; c < item.childNodes.length; c++) {
			chld = item.childNodes[c];
			if (SPe.has(chld.nodeName, "properties")) {
				for (p = 0; p < chld.childNodes.length; p++) {
					prop = chld.childNodes[p];
					if (prop.nodeType === 1) {
						j[i][prop.localName] = prop.textContent;
					}
				}
			}
		}
	}
	return j;
};

SPe.Util.functionName = function (f) {
	var n = f.toString();
	n = n.substr(9);
	n = n.substr(0, n.indexOf("(")).trim();
	return n;
};

SPe.Util.timeout = [];

SPe.Util.wait = function (callback, ms) {
	ms = ms || 191;
	var f = SPe.Util.functionName(callback) || "no-name";
	clearTimeout(SPe.Util.timeout[f]);
	SPe.Util.timeout[f] = setTimeout(callback, ms);
};

SPe.Util.when = function (lookup, callback) {
	var c = 0;
	function check () { setTimeout(function () {
		var ready = true;
		if (SPe.type(lookup) === "array") {
			var i, s, j, v;
			for (i = 0; i < lookup.length; i++) {
				s = lookup[i].split(".");
				for (j = 0; j < s.length; j++) {
					v = !j ? window[s[j]] : v[s[j]];
				}
				if (v === undefined) { ready = false; break; }
			}
		}
		else {
			if (!lookup()) { ready = false; }
		}
		if (ready) { callback(); } else { if(c < 99) { c++; check(); } }
	}, 77); }
	check();
};

SPe.Util.do = function (fname) {
	SPe.Util.when([fname], function () {
		var s = fname.split(".");
		var i, f;
		for (i = 0; i < s.length; i++) {
			f = !i ? window[s[i]] : f[s[i]];
		}
		f();
	});
};

SPe.Util.htmlDecode = function (html) {
	var t = document.createElement("textarea");
	t.innerHTML = html;
	return t.value;
};

SPe.Util.urlDecode = function (url) {
	url = url.replace(/\\u002f/gi, "/");
	url = url.replace(/\\u0025/gi, "%");
	url = url.replace(/\\u0026/gi, "&");
	return url;
};

SPe.Util.navigateUrl = function (html) {
	var url = html.substring(html.indexOf("navigateParent(") + 16);
	url = url.substring(0, url.indexOf(");") - 1);
	return SPe.Util.urlDecode(url);
};

SPe.Util.csv = function (filename, data) {
	function processRow (data) {
		var row = "", j, d, cval, cell;
		for (j = 0; j < data.length; j++) {
			d = data[j];
			cval = !d && d !== 0 ? "" : SPe.type(d) === "date" ? d.toLocaleString() : d.toString();
			cell = cval.replace(/"/g, "\"\""); if (cell.search(/("|,|\n)/g) > -1) { cell = "\"" + cell + "\""; }
			row += "," + cell;
		}
		return row.substring(1) + "\n";
	}

	var csv = "", i;
	for (i = 0; i < data.length; i++) {
		csv += processRow(data[i]);
	}

	var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	if (navigator.msSaveBlob) { navigator.msSaveBlob(blob, filename); }
	else {
		var tmp = document.createElement("a");
		var url = URL.createObjectURL(blob);
		tmp.setAttribute("href", url);
		tmp.setAttribute("download", filename);
		tmp.style.visibility = "hidden";
		document.body.appendChild(tmp);
		tmp.click();
		document.body.removeChild(tmp);
	}
};

SPe.Util.toTitleCase = function (str) {
	return str.replace(/\b\w+/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

SPe.Util.enter = function (f) {
	document.onkeydown = function (e) {
		e = e || window.event;
		var c = e.which || e.keyCode;
		if (c === 13) { f(); }
	};
};

SPe.Util.load = function (r) {
	function loadCss (l) {
		var lnk = document.createElement("link");
		lnk.rel = "stylesheet";
		lnk.type = "text/css";
		lnk.href = l;
		document.head.appendChild(lnk);
	}

	function loadScript (l) {
		var scr = document.createElement("script");
		scr.type = "text/javascript";
		scr.src = l;
		document.body.appendChild(scr);
	}

	r.forEach(function (l) {
		if (SPe.has(l.toLowerCase(), ".css")) { loadCss(l); } else { loadScript(l); }
	});
};

SPe.Util.colorCode = function (cs) {
	var cc;
	function s (c) { return SPe.has(cs, c); }
	if (s("Submitted")) { cc = "#007497"; }
	if (s("Verified")) { cc = "#6b399d"; }
	if (s("Approved") || s("Succeeded")) { cc = "#249324"; }
	if (s("Rejected") || s("Failed")) { cc = "#e60000"; }
	if (s("Returned") || s("Partially")) { cc = "#bf0000"; }
	if (s("Completed") || s("Executed") || s("Closed")) { cc = "#476d4c"; }
	if (s("Draft") || s("Cancelled") || s("Deferred")) { cc = "#8c8c8c"; }
	if (cc) { cs = "<span style='color: " + cc + "'>" + cs + "</span>"; }
	return cs;
};

};

// Init

SPe.init();

}