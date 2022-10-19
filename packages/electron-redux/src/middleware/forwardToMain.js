import { ipcRenderer } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToMain = store => next => (action) => {
  // eslint-disable-line no-unused-vars
  if (!validateAction(action)) return next(action);

  const scope = action.meta ? action.meta.scope : undefined;
  if (scope === 'synchronous-remote') {
    const contents = require('@electron/remote').getCurrentWebContents();
    if (contents) {
      action.meta.fromScopeId = contents.id;
    }
  }

  if (
    action.type.substr(0, 2) !== '@@' &&
    action.type.substr(0, 10) !== 'redux-form' &&
    (!action.meta || !scope || scope !== 'local')
  ) {
    ipcRenderer.send('redux-action', action);

    // stop action in-flight unless synchronous-remote
    // eslint-disable-next-line consistent-return
    if (scope !== 'synchronous-remote') {
      return;
    }
  }

  // eslint-disable-next-line consistent-return
  return next(action);
};

export default forwardToMain;
