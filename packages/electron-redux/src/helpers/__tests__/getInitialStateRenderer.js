import getInitialStateRenderer from '../getInitialStateRenderer';

jest.unmock('../getInitialStateRenderer');

describe('getInitialStateRenderer', () => {
  it('should return the initial state', () => {
    const state = { foo: 456 };
    require('@electron/remote').getGlobal.mockImplementation(() => () => JSON.stringify(state));

    expect(getInitialStateRenderer()).toEqual(state);
  });
});
