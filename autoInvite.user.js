// ==UserScript==
// @name         Steam Automatic Group Invite
// @namespace    www.mandreasen.com
// @version      1.0.0
// @description  This script do it easy for you, when you like to invite some people to your Steam group.
// @author       Michael
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/profiles/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL  https://raw.githubusercontent.com/mandreasen/SteamAutomaticGroupInvite/master/autoInvite.user.js
// @updateURL    https://raw.githubusercontent.com/mandreasen/SteamAutomaticGroupInvite/master/autoInvite.user.js
// @grant        none
// ==/UserScript==

// Set the group custom URL you want people to be invited to. (NOT THE FULL URL ONLY CUSTOM URL)
var steam_group_custom_url = "customURL";

function InviteUserToSteamGroup(group_id)
{
	var params = {
		json: 1,
		type: 'groupInvite',
		group: group_id,
		sessionID: g_sessionID,
		invitee: g_rgProfileData.steamid
	};

	$.ajax({
		url: 'http://steamcommunity.com/actions/GroupInvite',
		data: params,
		type: 'POST',
		dataType: 'json'
	}).done(function(data) {
		if (data.duplicate) {
			console.log('[' + g_rgProfileData.steamid + '] The user are already in the group or have already received invites.');
		} else {
			console.log('[' + g_rgProfileData.steamid + '] Invite to Join Your Group.');
		}
	}).fail(function() {
		console.log('Error processing your request. Please try again.');
	});
}

function GetGroupData(steam_group_custom_url)
{
	return $.ajax({
		url: 'http://steamcommunity.com/groups/' + steam_group_custom_url + '/memberslistxml',
		data: { xml:1 },
		type: 'GET',
		dataType: 'xml'
	}).done(function(xml) {
		InviteUserToSteamGroup($(xml).find('groupID64').text());
	}).fail(function() {
		console.log('The request failed or the group custom URL is wrong.');
	});
}

// Start invite process
GetGroupData(steam_group_custom_url);