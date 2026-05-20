import { useReveal } from "../hooks/useReveal";

/**
 * Scroll-reveal wrapper. Adds `is-visible` when in view.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  variant = "up",
  ...rest
}) {
  const [ref, visible] = useReveal();
  const style = delay ? { "--reveal-delay": `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={["reveal", `reveal--${variant}`, visible && "is-visible", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
