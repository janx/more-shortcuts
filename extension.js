const Lang = imports.lang;
const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;

const SHELL_KEYBINDINGS_SCHEMA = 'org.gnome.shell.keybindings';

const KeyBindings = {
  // re-use cycle-windows binding for last workspace.
  // TODO: find out how to create new key binding
  LastWorkspace: 'cycle-windows'
}

let lastWorkspaceIndex = null;

function switchToLastWorkspace() {
  if(lastWorkspaceIndex === null) return;

  let activeWorkspace = global.screen.get_active_workspace();
  let toActivate = global.screen.get_workspace_by_index(lastWorkspaceIndex);

  if (toActivate && activeWorkspace != toActivate) {
    toActivate.activate(global.get_current_time());
  }
}


function workspaceChanged(wm, from, to, direction) {
  lastWorkspaceIndex = from;
}

function bindKeys() {
  Meta.keybindings_set_custom_handler(KeyBindings.LastWorkspace, switchToLastWorkspace);

  //global.display.add_keybinding(KeyBindings.LastWorkspace,
                                //new Gio.Settings({schema: SHELL_KEYBINDINGS_SCHEMA}),
                                //Meta.KeyBindingFlags.NONE,
                                //switchToLastWorkspace);
}

function unbindKeys() {
}

function bindEvents() {
  global.window_manager.connect('switch-workspace', workspaceChanged);
}

function unbindEvents() {
}

function enable() {
  bindKeys();
  bindEvents();
}

function disable() {
  unbindKeys();
  unbindEvents();
}

function init() {
  lastWorkspaceIndex = global.screen.get_active_workspace_index();
}
