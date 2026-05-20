import Header from "../site/Header";

export default function PreviewChrome({
  device = "desktop",
  settings = {},
  isSelected = false,
  onSelect,
}) {
  return (
    <div
      className={`ve-chrome-block${isSelected ? " is-selected" : ""}`}
      data-ve-chrome="header"
    >
      <div className="ve-chrome-block__bar" aria-hidden="true">
        <span className="ve-block__label">Site header (matches live site)</span>
        <button
          type="button"
          className="ve-chrome-block__edit"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.("brand");
          }}
        >
          Edit
        </button>
      </div>

      <div
        className={`ve-preview-chrome ve-preview-chrome--${device}${isSelected ? " ve-preview-chrome--editing" : ""}`}
        onClick={(e) => {
          if (e.target.closest(".nav-toggle, .nav-menu, .nav-drawer, .nav-backdrop, a, button")) return;
          if (!isSelected) onSelect?.();
        }}
      >
        <div className="ve-preview-chrome__live-header" data-preview-device={device}>
          <Header settings={settings} previewDevice={device} />
        </div>
      </div>
    </div>
  );
}
