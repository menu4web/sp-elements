SPe.initDashboard = function () {

"use strict";

SPe.Util.when(["Chart"], function () {

var refDashboard = document.getElementById("dashboard");

var retrieveMilestones, onMilestonesQuerySucceeded;

retrieveMilestones = function () { SPe.Query.items("Milestones", "<View><Query><Where></Where><OrderBy><FieldRef Name='Stage' Ascending='True' /></OrderBy></Query></View>", onMilestonesQuerySucceeded); };

onMilestonesQuerySucceeded = function (items) {

var enumerator = items.getEnumerator();
var stages = [];
var pending = {};
var completed = {};

var item, stage, cdate;
while (enumerator.moveNext()) {
	item = enumerator.get_current();
	stage = item.get_item("Stage");
	cdate = item.get_item("CompletionDate");
	if (stages.indexOf(stage) === -1) {
		stages.push(stage);
		pending[stage] = 0;
		completed[stage] = 0;
	}
	if (cdate) { completed[stage] += 1; } else { pending[stage] += 1; }
}

var countsToArray = function (o) {
	var a = [];
	Object.keys(o).forEach(function (k) { a.push(o[k]); });
	return a;
};

var params = {
	type: "horizontalBar",
	data: {
		labels: stages,
		datasets: [
			{
				label: "Completed",
				backgroundColor: "#d1d92a",
				data: countsToArray(completed)
			},
			{
				label: "Pending",
				backgroundColor: "#e88269",
				data: countsToArray(pending)
			}
		]
	},
	options: {
		maintainAspectRatio: false,
		scales: {
			xAxes: [{ stacked: true }],
			yAxes: [{ stacked: true }]
		},
		legend: { position: "right" }
	}
};

var dashboard = new Chart(refDashboard.getContext("2d"), params);

return dashboard;

};

if (refDashboard) { SPe.Query.ready(retrieveMilestones); }

});

};