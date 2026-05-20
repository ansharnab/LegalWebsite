import { useState } from "react";
import axios from "axios";
import { authHeaders } from "./api";

export default function SettingsPanel({ content, onUpdate }) {
  const [settings, setSettings] = useState(content.settings || {});
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const next = { ...content, settings };
    await axios.put("/api/content", next, { headers: authHeaders() });
    onUpdate(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: "logoText", label: "Logo text" },
    { key: "logoAccent", label: "Logo accent" },
    { key: "logoImage", label: "Logo image URL", placeholder: "/images/brand-mark.svg" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address", textarea: true },
    { key: "footerTagline", label: "Footer tagline", textarea: true },
  ];

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Site Settings</h2>
        <button type="button" className="btn btn--primary" onClick={save}>
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
      <p className="admin-hint">
        For page sections, practice areas, and testimonials use Page Builder → Site Content.
      </p>
      <div className="settings-grid">
        {fields.map((f) => (
          <div key={f.key} className="form-group">
            <label>{f.label}</label>
            {f.textarea ? (
              <textarea
                rows={3}
                value={settings[f.key] || ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            ) : (
              <input
                value={settings[f.key] || ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
