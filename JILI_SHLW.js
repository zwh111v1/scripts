/*
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

/**
 * ROLL
 *
 * @author CC  jili
 */

let EXIT_MAP = 993016000;
let START_MAP = 865000400;
let time = 15 * 60 * 1000;
let PQLog = "shlw2019";
let maxHp = 499999999999;
let DEATH_COUNT = 2;//復活次數

let party;
let members = Array();
let endTime;
let membersLength;
let map;
let player;

let boss = [9390804,9390859];
let timec = 0;

function init(attachment) {
    party = attachment;
    members.push(party);
    event.setVariable("members", members);
	
    map = event.getMap(START_MAP);
	map.clearMobs();
	
	let ran = Math.floor(Math.random() *2);
	let mob = map.makeMob(boss[ran]);
	mob.changeBaseHp(maxHp);
    map.spawnMob(mob, 600, 400);
	
    event.startTimer("endTime", time);
    endTime = new Date().getTime() + time;
	
    party.changeMap(START_MAP);
	membersLength = members.length;
	
    for (let i = 0; i < members.length; i++) {
		player = members[i];
        members[i].setEvent(event);
        members[i].addPQLog(PQLog);
		members[i].setDeathCount(DEATH_COUNT);
    }
	setEventValue(PQLog,1);
	map.blowWeather(5120000,"你有"+(time/60/1000)+"分鐘進行挑戰，每隔1分鐘會提示時間");
    event.startTimer("lockTime", 1 * 60 * 1000);
}

function removePlayer(playerId, changeMap) {
    if (true) {
        for (let i = 0; i < members.length; i++) {
            members[i].setEvent(null);
            if (changeMap || members[i].getId() != playerId)
                members[i].changeMap(EXIT_MAP, "st00");
        }
        event.destroyEvent();
    } else {
        for (let i = 0; i < members.length; i++) {
            if (members[i].getId() == playerId) {
                members[i].setEvent(null);
                if (changeMap)
                    members[i].changeMap(EXIT_MAP, "st00");
                members.splice(i, 1);
                break;
            }
        }
    }
}

function mobDied(mob) {
	if(map.getEventMobCount() < 1){
		for (let ee = 0; ee < members.length; ee++) {
			members[ee].showSystemMessage("【深海龍王】：挑戰成功！");
			members[ee].runScript("深海龍王獎勵");
		}
	}
	
}


function playerDisconnected(player) {
    removePlayer(player.getId(), false);
}

function playerChangedMap(player, destination) {
       if(destination.getId() == START_MAP){
			player.showTimer((endTime - new Date().getTime()) / 1000);
			player.showDeathCount();
	   }else{
			removePlayer(player.getId(), false);
	   }
}

function partyMemberDischarged(party, player) {
}

function timerExpired(key) {
    switch (key) {
        case "endTime":
            removePlayer(player.getId(), true);
            break;
		case "lockTime":
			timec ++;
			map.blowWeather(5120000,"你還有"+(time/60/1000 - timec * 1)+"分鐘進行挑戰，每隔1分鐘會提示時間");
			break;
    }
}

function deinit() {
        for (let i = 0; i < members.length; i++) {
                members[i].setEvent(null);
                members[i].setDeathCount(-1);
        }
}


//flag = true 查總的不重置
//flag = false 查當天的
function getEventValue(event1,flag){
	var charInfo = getCharInfo();
	if(flag){
		var sql = "select sum(value) as numbe from zz_xr_event where accounts_id = "+parseInt(charInfo.accounts_id)+" and event = '"+event1+"' and world ="+parseInt(charInfo.world)+" "; 
	}else{
		var sql = "select sum(value) as numbe from zz_xr_event where accounts_id = "+parseInt(charInfo.accounts_id)+" and event = '"+event1+"' and world ="+parseInt(charInfo.world)+" AND DATE_FORMAT(time, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') "; 
	}
	var resultList = player.customSqlResult(sql);
	var count=0;
	for (var i = 0; i < resultList.size(); i++) {
		var result = resultList.get(i);
		if (result == null) {
			break;
		}
		count = result.get("numbe");
		if(count ==null){
			count = 0;
		}
	}
	return parseInt(count);
}

function setEventValue(event1,value1){
	var charInfo = getCharInfo();
	var sql = "insert into zz_xr_event(accounts_id, world, `event`,`value`,time) values("+charInfo.accounts_id+","+charInfo.world+",'"+event1+"',"+value1+",now())";
	player.customSqlInsert(sql);
}

function getCharInfo(){
	var sql = "select accounts_id,world from characters where id = "+player.getId()+"";
	var resultList = player.customSqlResult(sql);
	var charInfo={};
	for (var i = 0; i < resultList.size(); i++) {
		var result = resultList.get(i);
		if (result == null) {
			break;
		}
		charInfo.accounts_id = result.get("accounts_id");
		charInfo.world = result.get("world");
	}
	return charInfo;
}
