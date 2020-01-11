SPe.initSlidesFlag = false;

SPe.initSlides = function () { SPe.Util.when(["jQuery", "$.fn.responsiveSlides"], function () {

"use strict";

if (!SPe.initSlidesFlag) {

SPe.initSlidesFlag = true;

var refSlider = document.getElementById("slider");

var listTitle, listQuery, loadSlides, onSlidesQuerySucceeded;

listTitle = "Slides";
listQuery = "<View><Query><Where><Eq><FieldRef Name='Slideshow' /><Value Type='Integer'>1</Value></Eq></Where><ViewFields><FieldRef Name='FileRef'/><FieldRef Name='Link'/><FieldRef Name='Title'/><FieldRef Name='Link'/><FieldRef Name='Body'/></ViewFields><OrderBy><FieldRef Name='Modified' Ascending='False'/></OrderBy></Query></View>";

loadSlides = function () { SPe.Query.items(listTitle, listQuery, onSlidesQuerySucceeded); };

onSlidesQuerySucceeded = function (items) {
	var enumerator = items.getEnumerator();
	var item, src, lnk, txt;
	var ls = "";
	while (enumerator.moveNext()) {
		item = enumerator.get_current();
		src = item.get_item("FileRef");
		lnk = item.get_item("Link").get_url();
		txt = item.get_item("Title");
		ls += "<li><a href='" + lnk + "'><img src='" + src + "' alt='" + txt + "' title='" + txt + "'></a></li>";
	}

	refSlider.innerHTML = ls;

	$(function () {
		$("#slider").responsiveSlides({
			auto: true,
			pager: true,
			speed: 1000,
			timeout: 7000,
			maxwidth: 1024
		});

		SPe.initSlidesFlag = false;
	});
};

SPe.Query.ready(loadSlides);

}

});};