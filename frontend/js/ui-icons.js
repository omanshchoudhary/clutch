(function () {
  const uiIconMap = Object.freeze({
    "theme-dark": { glyph: "dark_mode", className: "icon-theme-dark" },
    "theme-light": { glyph: "light_mode", className: "icon-theme-light" },
    "tab-add-file": { glyph: "add", className: "icon-add-file" },
    "tab-close": { glyph: "close", className: "icon-close" },
    "sidebar-add-file": { glyph: "note_add", className: "icon-add-file" },
    "sidebar-add-folder": { glyph: "create_new_folder", className: "icon-add-folder" },
    "folder-add-file": { glyph: "note_add", className: "icon-folder-add-file" },
    "folder-add-folder": { glyph: "create_new_folder", className: "icon-folder-add-folder" },
    folder: { glyph: "folder", className: "icon-folder" },
    "folder-expand": { glyph: "expand_more", className: "icon-folder-expand" },
    "folder-collapse": { glyph: "chevron_right", className: "icon-folder-collapse" },
    "action-rename": { glyph: "edit", className: "icon-rename" },
    "action-delete": { glyph: "delete", className: "icon-delete" },
    "action-duplicate": { glyph: "content_copy", className: "icon-duplicate" },
    "action-close": { glyph: "close", className: "icon-close" },
    "action-delete-others": { glyph: "delete_sweep", className: "icon-delete-others" },
    fallback: { glyph: "help", className: "icon-fallback" },
  });

  function getIcon(iconName) {
    return uiIconMap[iconName] || uiIconMap.fallback;
  }

  function buildClasses(iconName, extraClass = "") {
    const icon = getIcon(iconName);
    const classes = ["material-symbols-outlined", "ui-icon", icon.className];
    if (extraClass) classes.push(extraClass);
    return classes.join(" ");
  }

  function render(iconName, extraClass = "") {
    const icon = getIcon(iconName);
    return `<span class="${buildClasses(iconName, extraClass)}" aria-hidden="true">${icon.glyph}</span>`;
  }

  function hydrate(root = document) {
    const iconSlots = root.querySelectorAll("[data-ui-icon]");
    iconSlots.forEach((slot) => {
      const iconName = slot.getAttribute("data-ui-icon");
      const extraClass = slot.getAttribute("data-ui-icon-class") || "";
      const icon = getIcon(iconName);
      slot.className = buildClasses(iconName, extraClass);
      slot.textContent = icon.glyph;
      if (!slot.hasAttribute("aria-hidden") && !slot.hasAttribute("aria-label")) {
        slot.setAttribute("aria-hidden", "true");
      }
    });
  }

  window.uiIconMap = uiIconMap;
  window.UIIcons = Object.freeze({
    getIcon,
    render,
    hydrate,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => hydrate(document));
  } else {
    hydrate(document);
  }
})();
