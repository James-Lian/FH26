import { useEffect, useState } from "react";

const DEFAULT_PHOTO = "/images/Team/default.jpg";

function IconMail() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 75.294 75.294" aria-hidden>
      <path
        fill="currentColor"
        d="M66.097,12.089h-56.9C4.126,12.089,0,16.215,0,21.286v32.722c0,5.071,4.126,9.197,9.197,9.197h56.9
	c5.071,0,9.197-4.126,9.197-9.197V21.287C75.295,16.215,71.169,12.089,66.097,12.089z M61.603,18.089L37.647,33.523L13.691,18.089
	H61.603z M66.097,57.206h-56.9C7.434,57.206,6,55.771,6,54.009V21.457l29.796,19.16c0.04,0.025,0.083,0.042,0.124,0.065
	c0.043,0.024,0.087,0.047,0.131,0.069c0.231,0.119,0.469,0.215,0.712,0.278c0.025,0.007,0.05,0.01,0.075,0.016
	c0.267,0.063,0.537,0.102,0.807,0.102c0.001,0,0.002,0,0.002,0c0.002,0,0.003,0,0.004,0c0.27,0,0.54-0.038,0.807-0.102
	c0.025-0.006,0.05-0.009,0.075-0.016c0.243-0.063,0.48-0.159,0.712-0.278c0.044-0.022,0.088-0.045,0.131-0.069
	c0.041-0.023,0.084-0.04,0.124-0.065l29.796-19.16v32.551C69.295,55.771,67.86,57.206,66.097,57.206z"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 1024 1024" aria-hidden>
      <path
        fill="currentColor"
        d="M512 85.333333c-115.882667 0-130.389333 0.512-175.914667 2.56-45.397333 2.090667-76.416 9.301333-103.552 19.84a209.109333 209.109333 0 0 0-75.605333 49.194667A209.152 209.152 0 0 0 107.733333 232.533333c-10.538667 27.136-17.749333 58.154667-19.84 103.552C85.802667 381.610667 85.333333 396.117333 85.333333 512s0.469333 130.389333 2.56 175.914667c2.090667 45.397333 9.301333 76.416 19.84 103.552a209.194667 209.194667 0 0 0 49.194667 75.605333 209.194667 209.194667 0 0 0 75.605333 49.194667c27.136 10.538667 58.154667 17.749333 103.552 19.84 45.525333 2.048 60.032 2.56 175.914667 2.56s130.389333-0.512 175.914667-2.56c45.397333-2.090667 76.416-9.301333 103.552-19.84a209.152 209.152 0 0 0 75.605333-49.194667 209.152 209.152 0 0 0 49.194667-75.605333c10.538667-27.136 17.749333-58.154667 19.84-103.552 2.048-45.525333 2.56-60.032 2.56-175.914667s-0.512-130.389333-2.56-175.914667c-2.090667-45.397333-9.301333-76.416-19.84-103.552a209.152 209.152 0 0 0-49.194667-75.605333 209.109333 209.109333 0 0 0-75.605333-49.194667c-27.136-10.538667-58.154667-17.749333-103.552-19.84C642.389333 85.845333 627.882667 85.333333 512 85.333333m0 76.885334c113.92 0 127.402667 0.426667 172.373333 2.474666 41.642667 1.92 64.213333 8.832 79.274667 14.677334 19.882667 7.765333 34.133333 17.024 49.066667 31.914666 14.933333 14.933333 24.149333 29.184 31.914666 49.066667 5.802667 15.061333 12.8 37.632 14.677334 79.232 2.048 45.013333 2.474667 58.453333 2.474666 172.416 0 113.92-0.426667 127.402667-2.474666 172.373333-1.92 41.642667-8.874667 64.213333-14.677334 79.274667a132.266667 132.266667 0 0 1-31.914666 49.066667c-14.933333 14.933333-29.184 24.149333-49.066667 31.914666-15.061333 5.802667-37.632 12.8-79.232 14.677334-44.970667 2.048-58.453333 2.474667-172.416 2.474666-113.92 0-127.445333-0.426667-172.373333-2.474666-41.642667-1.92-64.213333-8.874667-79.274667-14.677334a132.181333 132.181333 0 0 1-49.066667-31.914666 132.181333 132.181333 0 0 1-31.914666-49.066667c-5.845333-15.061333-12.8-37.632-14.677334-79.232-2.048-45.013333-2.474667-58.453333-2.474666-172.416 0-113.92 0.426667-127.402667 2.474666-172.373333 1.92-41.642667 8.832-64.213333 14.677334-79.274667 7.765333-19.882667 17.024-34.133333 31.914666-49.066667 14.933333-14.933333 29.184-24.149333 49.066667-31.914666 15.061333-5.845333 37.632-12.8 79.232-14.677334 45.013333-2.048 58.453333-2.474667 172.416-2.474666m0 491.989333a142.208 142.208 0 1 1 0-284.416 142.208 142.208 0 0 1 0 284.416m0-361.301333a219.093333 219.093333 0 1 0 0 438.186666 219.093333 219.093333 0 0 0 0-438.186666m278.954667-8.661334a51.2 51.2 0 1 1-102.4 0 51.2 51.2 0 0 1 102.4 0"
      />
    </svg>
  );
}

function slugifyPhotoName(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveInstagramUrl(member) {
  const url = String(member.instagramUrl ?? "").trim();
  if (url && /^https?:\/\//i.test(url)) return url;

  const ig = String(member.instagram ?? "").trim();
  if (!ig) return null;
  const handle = ig.replace(/^@/, "");
  if (!handle || /\s/.test(handle)) return null;
  return `https://instagram.com/${handle}`;
}

function displayInstagramLabel(member) {
  const url = String(member.instagramUrl ?? "").trim();
  if (url && /^https?:\/\//i.test(url)) {
    try {
      const path = new URL(url).pathname.replace(/\/$/, "");
      const seg = path.split("/").filter(Boolean).pop();
      return seg ? `@${seg}` : "Instagram";
    } catch {
      return "Instagram";
    }
  }
  const ig = String(member.instagram ?? "").trim();
  return ig ? (ig.startsWith("@") ? ig : `@${ig}`) : "";
}

export default function TeamMember({ member }) {
  const igHref = resolveInstagramUrl(member);
  const igLabel = displayInstagramLabel(member);

  const photoSlug = member.photoSlug || slugifyPhotoName(member.name);
  const initialSrc =
    member.imagePath ||
    (photoSlug ? `/images/Team/${photoSlug}.jpg` : DEFAULT_PHOTO);

  const [imgSrc, setImgSrc] = useState(initialSrc);

  useEffect(() => {
    setImgSrc(initialSrc);
  }, [initialSrc]);

  const role = String(member.roleTier || "member").toLowerCase();

  const avatarInner = (
    <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
      <img
        src={imgSrc}
        alt=""
        className="h-full w-full object-cover"
        onError={() => {
          setImgSrc((prev) => {
            if (prev === DEFAULT_PHOTO) return prev;
            if (/\.jpe?g$/i.test(prev)) {
              return prev.replace(/\.jpe?g$/i, ".png");
            }
            return DEFAULT_PHOTO;
          });
        }}
      />
    </div>
  );

  const avatarShell =
    role === "sectorDirector" ? (
      <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full p-[3px] shadow-[0_0_32px_rgba(251,191,36,0.5),0_0_48px_rgba(217,70,239,0.35)] sm:h-[5rem] sm:w-[5rem] bg-gradient-to-br from-amber-200 via-fuchsia-400 to-cyan-300">
        {avatarInner}
      </div>
    ) : role === "assistantDirector" ? (
      <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full p-[3px] shadow-[0_0_28px_rgba(244,114,182,0.45),0_0_40px_rgba(192,132,252,0.35)] sm:h-[5rem] sm:w-[5rem] bg-gradient-to-br from-rose-200 via-fuchsia-500 to-violet-400">
        {avatarInner}
      </div>
    ) : (
      <div
        className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 ring-2 sm:h-[5rem] sm:w-[5rem] ${
          role === "lead"
            ? "border-sky-400/80 ring-sky-400/50 shadow-[0_0_22px_rgba(56,189,248,0.35)]"
            : role === "assistant"
              ? "border-rose-500/70 ring-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
              : "border-fuchsia-500/40 ring-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.25)]"
        }`}
      >
        {avatarInner}
      </div>
    );

  return (
    <li className="group rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950/40 via-black/50 to-purple-950/30 p-4 shadow-[0_0_24px_-8px_rgba(217,70,239,0.35)] transition hover:border-fuchsia-400/35">
      <div className="flex gap-4">
        <div className="shrink-0">{avatarShell}</div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-fuchsia-100">{member.name}</div>
          {member.position ? (
            <div className="text-sm text-fuchsia-200/70">{member.position}</div>
          ) : null}
          <p className="mt-1 break-all text-sm text-fuchsia-300/80">{member.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <a
              href={`mailto:${member.email}`}
              className="m-1 inline-flex rounded p-0.5 text-white transition duration-500 ease-in-out hover:text-red-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-fuchsia-400/80"
              aria-label={`Email ${member.name} at ${member.email}`}
            >
              <IconMail />
            </a>
            {igHref ? (
              <a
                href={igHref}
                target="_blank"
                rel="noopener noreferrer"
                className="m-1 inline-flex rounded p-0.5 text-white transition duration-500 ease-in-out hover:text-pink-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-fuchsia-400/80"
                aria-label={
                  igLabel
                    ? `Instagram: ${igLabel} (${member.name})`
                    : `Instagram (${member.name})`
                }
              >
                <IconInstagram />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
