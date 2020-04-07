import * as Discord from 'discord.js';
import Manager from '../src/manager';

let testClient: Discord.Client;
beforeEach(() => {
  testClient = {
    user: {
      username: 'Hello',
      setPresence: jest.fn(),
    },
  } as unknown as Discord.Client;
});

describe('initialize()', () => {
  test('Should return the all clear message if client user is not null', (done) => {
    // Attempt to initialize the state.
    Manager.initialize(testClient)
      .then(() => done());
  });
  test('Should return an error if client user is null', (done) => {
    // Attempt to initialize the state.
    testClient.user = null;

    Manager.initialize(testClient)
      .then(() => {
        fail('Initialized with null client user.');
        done();
      })
      .catch((_) => done());
  });
});
