/**
 * Wraps digit sequences in .minecraft-nums (smaller size, extra letter-spacing).
 * Use for any text that contains numbers you want styled with the Minecraft font.
 */
export default function MinecraftNumbers({ children, className = "" }) {
  const text = typeof children === "string" ? children : String(children ?? "");
  const parts = text.split(/(\d+)/);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} className="minecraft-nums">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}
