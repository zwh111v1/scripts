/*
 * NeroMS MapleStory server emulator written in Java
 * Copyright (C) 2017-2018  Jackson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


var player;
var mobId;
var NeedKill=0;
var KillMisstion = true;
var map;
function init(attachment) {

	player = attachment;
	event.startTimer("kick", 10 * 60 * 1000);
	player.setEvent(event);
}

function mobDied(mob) {

}

function removePlayer(playerId, changeMap) {
	
    event.destroyEvent();
	
}

function playerDisconnected(player) {
	if(player.isQuestStarted(200100)){
		player.forfeitQuest(200100);
	}
    event.destroyEvent();
}

function playerChangedMap(player, destination) {

}

function partyMemberDischarged(party, player) {
    //removePlayer(player.getId(), true);
}

function timerExpired(key) {
    switch (key) {
        case "kick":
			player.setEvent(null);
            player.forfeitQuest(200100);
			player.dropMessage(11,"任務失敗！請重新再來！");
			event.destroyEvent();
            break;
    }
}

function deinit() {
	event.stopTimers();
	let entId = event.getVariable("npc");
    if (entId != null) {
       event.getMap(player.getIntQuestRecordEx(200100,"Map")).destroyTempNpc(entId);
    }
	if(player.isQuestStarted(200100)){
		player.forfeitQuest(200100);
	}
    player.setEvent(null);
	//event.destroyEvent();
}