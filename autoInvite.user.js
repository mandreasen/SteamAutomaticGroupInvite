// ==UserScript==
// @name         Steam Automatic Group Invite
// @version      2.0.1
// @description  This script automatically invites members to your steam group when you load their profile.
// @author       Michael
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/profiles/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL  https://raw.githubusercontent.com/mandreasen/SteamAutomaticGroupInvite/master/autoInvite.user.js
// @updateURL    https://raw.githubusercontent.com/mandreasen/SteamAutomaticGroupInvite/master/autoInvite.user.js
// @grant        none
// ==/UserScript==

$(document).ready(function() {
	// Set the custom URL of the group you want peoplen to be invited to. Do not enter the entire URL.
	// For example: Your group URL is http://steamcommunity.com/groups/steamIsCool, enter steamIsCool in "", replacing customURL.
	sagi.execute("customURL");
});

var sagi = new function() {
	this.urlProtocol = function() {
		return (window.location.protocol == "https:") ? "https" : "http";
	},

	this.execute = function(customURL) {
		var groupURL = this.urlProtocol() + "://steamcommunity.com/groups/" + customURL + "/memberslistxml";

		$.ajax({
			url: groupURL,
			data: {xml:1},
			type: 'GET',
			dataType: 'xml'
		}).done(function(xml) {
			var groupID64 = $(xml).find('groupID64').text();

			if (groupID64.length > 0) {
				sagi.invite(groupID64);
			} else {
				console.log("Failed to find groupID64.");
			}
		}).fail(function() {
			console.log("The request failed or the group custom URL is wrong.");
		});
	},

	this.invite = function(groupID64) {
		var inviteURL = this.urlProtocol() + "://steamcommunity.com/actions/GroupInvite";

		$.ajax({
			url: inviteURL,
			data: {json: 1, type: 'groupInvite', group: groupID64, sessionID: g_sessionID, invitee: g_rgProfileData.steamid},
			type: 'POST',
			dataType: 'json'
		}).done(function(data) {
			if (data.duplicate) {
				console.log("[" + g_rgProfileData.steamid + "] The user are already in the group or have already received an invite.");
			} else {
				console.log("[" + g_rgProfileData.steamid + "] Invite to Join Your Group.");
			}
		}).fail(function() {
			console.log("Error processing your request. Please try again.");
		});
	}
};