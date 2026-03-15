/* ===================================
   Owlia Content Loader
   Loads data from defaults (window.__OWLIA_*)
   with localStorage overrides from admin editor
   =================================== */
var OwliaContent = {
  apps: null,
  site: null,

  init: function () {
    this.apps = this._load('apps', window.__OWLIA_APPS || []);
    this.site = this._load('site', window.__OWLIA_SITE || {});
  },

  _load: function (key, defaultData) {
    var stored = localStorage.getItem('owlia_cms_' + key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        /* corrupt data — fall back to default */
      }
    }
    return defaultData;
  },

  save: function (key, data) {
    localStorage.setItem('owlia_cms_' + key, JSON.stringify(data));
  },

  reset: function (key) {
    localStorage.removeItem('owlia_cms_' + key);
  },

  hasOverride: function (key) {
    return localStorage.getItem('owlia_cms_' + key) !== null;
  }
};
