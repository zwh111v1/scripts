/*
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

/**
 * Logic for managing an instance map for 2nd job advancement challenges
 * (besides pirates).
 */

let player, map;

function init(attachment) {
	let destination;
	[player, destination] = attachment;

	//create a new instance of the map so we don't have to deal with multiple
	//players in the channel trying to complete the same challenge.
	map = event.makeMap(destination);
	player.changeMap(map);

	player.setEvent(event);
}

function playerDisconnected(player) {
	event.destroyEvent();
}

function playerChangedMap(player, destination) {
	event.destroyEvent();
}

function deinit() {
	player.setEvent(null);

	event.destroyMap(map);
}