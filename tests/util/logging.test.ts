/* eslint-disable no-console */
import * as Logging from '../../src/util/logging';

const testMessage = 'Hello, world!';
beforeEach(() => {
  global.console = {
    // Fill out the remaining members with the default members.
    ...global.console,

    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

describe('Test formatted logging scripts.', () => {
  test('Should print a message with a white block prefix stating, `INF`', () => {
    Logging.log(testMessage);
    expect(console.log).toBeCalled();
  });
  test('Should print a warning message with a yellow block prefix stating, `WRN`', () => {
    Logging.warn(testMessage);
    expect(console.warn).toBeCalled();
  });
  test('Should print a error message with a red block prefix stating, `ERR`', () => {
    Logging.error(testMessage);
    expect(console.error).toBeCalled();
  });
});
