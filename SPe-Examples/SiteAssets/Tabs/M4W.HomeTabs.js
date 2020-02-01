SPe.initTabs = function () {

"use strict";

var refTabs = document.getElementById("homeTabs");

if (refTabs && !refTabs.innerHTML) {

var color = "#d0d0d0";
var style = {
	table: "border-collapse: separate",
	td: "cursor: pointer; vertical-align: text-top; border-bottom: 1px solid transparent; border-top: 1px solid transparent",
	bg: "#f2f2f2",
	color: color,
	div: "width: 7px"
};

var listTitle, listQuery, loadTabs, onTabsQuerySucceeded;

listTitle = "Tabs";
listQuery = "<View><Query><Where></Where><OrderBy><FieldRef Name='Ord' Ascending='True'/></OrderBy><ViewFields><FieldRef Name='Title'/><FieldRef Name='Header'/><FieldRef Name='Body'/></ViewFields></Query><RowLimit>4</RowLimit></View>";

loadTabs = function () { SPe.Query.items(listTitle, listQuery, onTabsQuerySucceeded); };

onTabsQuerySucceeded = function (items) {
	var enumerator = items.getEnumerator();
	var table = refTabs;
	table.style.borderBottom = "1px solid " + color;
	var i = 0; var tabs = [];
	var item, header, body, r, c;
	while (enumerator.moveNext()) {
		item = enumerator.get_current();
		header = item.get_item("Header");
		body = item.get_item("Body");

		r = table.insertRow(i);
		c = r.insertCell(0);
		c.colSpan = 2;
		c.style.borderLeft = "1px solid " + color;
		c.style.borderRight = "1px solid " + color;
		c.innerHTML = body;

		i ++;
		tabs[i] = [header, [0, i]];
	}

	SPe.Tabs.add(table.rows[0].cells[0], tabs, style);

	SPe.initNews();
};

SPe.Query.ready(loadTabs);

}

};

SPe.initNews = function () {

"use strict";

var newsEmployee = document.getElementById("newsEmployee");
var newsBusiness = document.getElementById("newsBusiness");

var listTitle, newsQuery, loadNews, onNewsQuerySucceeded, writeNews;

listTitle = "News";
newsQuery = "<View><Query><Where></Where><ViewFields><FieldRef Name='URL'/><FieldRef Name='Category'/></ViewFields><OrderBy><FieldRef Name='PostDate' Ascending='False'/></OrderBy></Query><RowLimit>20</RowLimit></View>";

loadNews = function () { SPe.Query.items(listTitle, newsQuery, onNewsQuerySucceeded); };

onNewsQuerySucceeded = function (items) {
	var enumerator = items.getEnumerator();
	var item, date, url, category;
	while (enumerator.moveNext()) {
		item = enumerator.get_current();
		date = item.get_item("PostDate");
		url = item.get_item("URL");
		category = item.get_item("Category");

		writeNews(date, url, category);
	}
};

writeNews = function (date, url, category) {
	var table;
	if(category === "Employee News") { table = newsEmployee; }
	if(category === "Business Updates") { table = newsBusiness; }

	var r = table.insertRow(table.rows.length);
	r.style.verticalAlign = "text-top";
	var c1 = r.insertCell(0);
	var c2 = r.insertCell(1);
	var c3 = r.insertCell(2);
	var c4 = r.insertCell(3);

	c1.innerHTML = "&#160;";
	c2.innerHTML = SPe.Date.format(date);
	c3.innerHTML = "&#160;";
	c4.innerHTML = "<a href='" + url.get_url() + "'>" + url.get_description() + "</a>";
};

SPe.Query.ready(loadNews);

};