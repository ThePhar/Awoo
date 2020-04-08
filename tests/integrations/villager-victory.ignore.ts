import Game from '../../src/structs/game';
import createMember from '../fixtures/createMember';
import createTextChannel from '../fixtures/createTextChannel';
import Phase from '../../src/structs/phase';
import Command from '../../src/structs/command';
import Roles from '../../src/roles';
import Player from '../../src/structs/player';
import aggregate from '../../src/util/aggregate';

describe('INTEGRATION - A Villager Test Game', () => {
  test('Test Game', () => {
    // Initialize a game.
    const game = new Game(createTextChannel());

    // Initialize the members apart of this game.
    const mPhar = createMember('0', 'Phar');
    const mCainsith = createMember('1', 'cainsith');
    const mStealthFox = createMember('2', 'StealthFoxy');
    const mSinsorium = createMember('3', 'Sinsorium');
    const mCanadian = createMember('4', 'TheCanadian');
    const mMika = createMember('5', 'Lauren (Mika Mi)');

    // Join the game.
    const pPhar = game.addPlayer(mPhar);
    const pCainsith = game.addPlayer(mCainsith);
    const pStealthFox = game.addPlayer(mStealthFox);
    const pSinsorium = game.addPlayer(mSinsorium);
    const pCanadian = game.addPlayer(mCanadian);
    const pMika = game.addPlayer(mMika);

    // Initialize the game and player roles.
    pCainsith.assignRole(Roles.Seer);
    pSinsorium.assignRole(Roles.Werewolf);
    game.active = true;

    // ---------- [ NIGHT 1 ] ----------------------------------------
    // Start the first night.
    game.startNightPhase();

    // Cainsith targets a player for inspection.
    pCainsith.role.action(Command.parse('!target canadian', game) as Command);
    // Sinsorium tries to target, but fails.
    pSinsorium.role.action(Command.parse('!target Phar', game) as Command);

    // ---------- [ DAY 1 ] ------------------------------------------
    // Start the first day.
    game.startDayPhase();

    // No player is eliminated.
    expect(aggregate(game.players).alive.length).toBe(6);

    // Cainsith receives his check.
    if (pCainsith.role instanceof Roles.Seer) {
      const check = pCainsith.role.inspected.get(pCanadian.id) as Player;
      expect(check.id).toBe(pCanadian.id);
    }

    // Players make accusations.
    game.accuse(pSinsorium, pPhar);
    game.accuse(pCainsith, pPhar);
    game.accuse(pMika, pPhar);
    game.accuse(pStealthFox, pSinsorium);
    game.accuse(pPhar, pSinsorium);

    // ---------- [ NIGHT 2 ] ----------------------------------------
    // Start the second night.
    game.startNightPhase();

    // Phar is eliminated by lynching.
    expect(pPhar.alive).toBe(false);
    expect(aggregate(game.players).alive.length).toBe(5);

    // Mika attempts to target someone, but nothing happens as they aren't a werewolf.
    pMika.role.action(Command.parse('!target cain', game) as Command);
    // Cainsith targets a player for inspection.
    pCainsith.role.action(Command.parse('!target sin', game) as Command);
    // Sinsorium targets a player for elimination.
    pSinsorium.role.action(Command.parse('!target StealthFox', game) as Command);

    // ---------- [ DAY 2 ] ------------------------------------------
    // Start the second day.
    game.startDayPhase();

    // StealthFox is eliminated by werewolves.
    expect(pStealthFox.alive).toBe(false);
    expect(aggregate(game.players).alive.length).toBe(4);

    // Cainsith receives his check.
    if (pCainsith.role instanceof Roles.Seer) {
      const check = pCainsith.role.inspected.get(pSinsorium.id) as Player;
      expect(check.id).toBe(pSinsorium.id);
    }

    // Players make accusations.
    game.accuse(pCainsith, pSinsorium);
    game.accuse(pSinsorium, pStealthFox); // Fails, StealthFox is dead.
    game.accuse(pSinsorium, pCainsith);
    game.accuse(pMika, pCainsith);
    game.accuse(pCanadian, pSinsorium);

    // ---------- [ NIGHT 3 ] ----------------------------------------
    // Start the third night.
    game.startNightPhase();

    // Nobody is eliminated by lynching.
    expect(aggregate(game.players).alive.length).toBe(4);

    // Cainsith targets a player for inspection.
    pCainsith.role.action(Command.parse('!target mika', game) as Command);
    // Sinsorium targets a player for elimination.
    pSinsorium.role.action(Command.parse('!target Canadian', game) as Command);
    // Sinsorium changes their target to another player for elimination.
    pSinsorium.role.action(Command.parse('!target cainsith', game) as Command);

    // ---------- [ DAY 3 ] ------------------------------------------
    // Start the third day.
    game.startDayPhase();

    // Cainsith is eliminated by werewolves.
    expect(pCainsith.alive).toBe(false);
    expect(aggregate(game.players).alive.length).toBe(3);

    // Cainsith does not receive his check, since he died.
    if (pCainsith.role instanceof Roles.Seer) {
      const check = pCainsith.role.inspected.get(pMika.id) as Player;
      expect(check.id).toBeUndefined();
    }

    // Dead players attempt to accuse and mess game up.
    game.accuse(pPhar, pCanadian); // Fails, he's dead!
    game.accuse(pCainsith, pCanadian); // Fails, he's dead!

    // Players make accusations.
    game.accuse(pMika, pCanadian);
    game.accuse(pMika, pSinsorium); // Changes their mind.
    game.accuse(pCanadian, pSinsorium);
    game.accuse(pSinsorium, pCanadian);

    // ---------- [ NIGHT 4 ] ----------------------------------------
    // Start the forth night.
    game.startNightPhase();

    // Sinsorium is eliminated by lynching.
    expect(pSinsorium.alive).toBe(false);
    expect(aggregate(game.players).alive.length).toBe(2);

    // Game is finished and victory is announced.
    expect(pPhar.alive).toBe(false);
    expect(pCainsith.alive).toBe(false);
    expect(pStealthFox.alive).toBe(false);
    expect(pSinsorium.alive).toBe(false);
    expect(pCanadian.alive).toBe(true);
    expect(pMika.alive).toBe(true);

    expect(game.day).toBe(4);
    expect(game.phase).toBe(Phase.Night);
    expect(game.active).toBe(false);
  });
});
