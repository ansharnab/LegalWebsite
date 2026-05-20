import { useState } from "react";
import { REMOTE_IMAGES } from "../data/mediaDefaults";

const FALLBACKS = {
  portrait: REMOTE_IMAGES.heroPortrait,
  heroBg: REMOTE_IMAGES.heroBg,
  practice: REMOTE_IMAGES.practice.insolvency,
};

export default function Image({ src, alt = "", className = "", variant = "portrait", priority = false }) {
  const [failed, setFailed] = useState(false);
  const url = failed || !src ? FALLBACKS[variant] || FALLBACKS.portrait : src;

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
