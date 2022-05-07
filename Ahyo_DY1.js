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
 * 釣魚
 *
 * @author jl  3153429
 */

let time = 1 * 15 * 1000;
function init(attachment) {
	
	var players = Array();

    event.setVariable("players", players);
	
	event.broadcastPlayerNotice(22,"[公會釣魚]：釣魚已開啟！");
	
	event.startTimer("PD", time);
}


function timerExpired(key) {
    switch (key) {
        case "PD":
			players = event.getVariable("players");
			if(players.length > 0){
				for (let i = 0; i < players.length; i++) {
					try{
						if(null != players[i]){
							//event.broadcastPlayerNotice(22,"玩家實例："+players[i]+" 玩家名:"+players[i].getName());
							//players[i].modifyCashShopCurrency(1,2);
							players[i].modifyCashShopCurrency(2,0);//用於觸發error
							//players[i].dropMessage(2,"[釣魚獎勵] : 獲得點券2！");
							players[i].runScript("公會釣魚獎勵")
						}
					}catch(e){
						
						var ppp = players.splice(i,1);
						//event.broadcastPlayerNotice(22,e+"刪除"+ppp);
					}
				}
			}
			event.startTimer("PD", time);
            break;
    }
}
