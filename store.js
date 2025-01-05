import ElectronStore from 'electron-store';

function createStore(name, defaults) {
  return new ElectronStore({
    configFileMode: 0o600,
    name,
    defaults,
  });
}

// Store for window position
export function createWindowPositionStore() {
  return createStore('dofusdbPosition', {
    x: 0,
    y: 120,
  });
}

// Store for window size
export function createWindowSizeStore() {
  return createStore('dofusdbWindowSize', {
    width: 400,
    height: 500,
  });
}
