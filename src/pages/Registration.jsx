import { Link } from "react-router-dom";

export default function Registration() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <Link
        to="/"
        className="px-5 py-2 font-semibold text-white rounded-lg border border-white/40 hover:bg-white/10 transition-colors"
      >
        ← Back
      </Link>
    </div>
  );
}
