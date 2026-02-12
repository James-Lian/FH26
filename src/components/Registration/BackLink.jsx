import { Link } from "react-router-dom";

export default function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center px-4 py-2 font-semibold text-white rounded-lg border border-white/40 hover:bg-white/10 transition-colors no-underline"
    >
      ← Back
    </Link>
  );
}
