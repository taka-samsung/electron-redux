import { webContents } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToRenderer = () => next => (action) => {
  const scope = action.meta ? action.meta.scope : undefined;
  if (!validateAction(action)) return next(action);
  if (scope === 'local') return next(action);

  const fromScopeId = action.meta ? action.meta.fromScopeId : undefined;
  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const allWebContents = webContents.getAllWebContents();

  for (const contents of allWebContents) {
    if (
      fromScopeId !== undefined &&
      scope === 'synchronous-remote' &&
      contents.id === fromScopeId
    ) {
      continue;
    }
    contents.send('redux-action', rendererAction);
  }

  return next(action);
};

export default forwardToRenderer;
