import Player from '../../src/structs/player';
import createMember from '../fixtures/createMember';
import * as PlayerSelector from '../../src/selectors/player-selector';
import Roles from '../../src/roles';

const testPlayers = new Map<string, Player>();
beforeEach(() => {
  for (let i = 0; i < 8; i += 1) {
    const member = createMember(i.toString(), `Test User ${i}`, `#000${i}`);
    const player = new Player(member);

    if (i >= 5) { player.assignRole(Roles.Werewolf); }

    // Kill a couple of these players.
    if (player.id === '1') { player.alive = false; } // Dead Villager
    if (player.id === '5') { player.alive = false; } // Dead Werewolf

    testPlayers.set(player.id, player);
  }
});

describe('getAllLivingWerewolves(players)', () => {
  test('return all living werewolf players', () => {
    const livingWerewolves = PlayerSelector.getAllLivingWerewolves(testPlayers);

    expect(livingWerewolves.length).toBe(2);
  });
});

describe('getAllLivingVillagers(players)', () => {
  test('return all living villager players', () => {
    const livingVillagers = PlayerSelector.getAllLivingVillagers(testPlayers);

    expect(livingVillagers.length).toBe(4);
  });
});
