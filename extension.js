const Lang = imports.lang;
const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function MoreShortcuts() {
  this._settings = Convenience.getSettings();

  this.lastWorkspaceIndex = global.screen.get_active_workspace_index();

  this.on( 'switch-to-workspace-last',
           Lang.bind(this, this.switchToLastWorkspace) );

  global.window_manager.connect( 'switch-workspace', 
                                 Lang.bind(this, this.workspaceChanged) );
}

MoreShortcuts.prototype = {

  _bindings: [],
  _settings: {},

  on: function(key, handler) {
    this._bindings.push(key);

    global.display.add_keybinding(
      key,
      this._settings,
      Meta.KeyBindingFlags.NONE,
      handler
    );
  },

  switchToLastWorkspace: function() {
    var activeWorkspace = global.screen.get_active_workspace();
    var toActivate = global.screen.get_workspace_by_index(this.lastWorkspaceIndex);

    if (toActivate && activeWorkspace != toActivate) {
      toActivate.activate(global.get_current_time());
    }
  },

  workspaceChanged: function(wm, from, to, direction) {
    this.lastWorkspaceIndex = from;
  },

  destroy: function() {
  }

}

function enable() {
  this.moreShortcuts = new MoreShortcuts();
}

function disable() {
  this.moreShortcuts.destroy();
}

function init(meta) {
}
