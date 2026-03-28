import TeamMember from "./TeamMember";

export default function TeamDepartment({ teamSector }) {
  if (!teamSector) return null;

  return (
    <div className="my-8 flex w-full justify-center">
      <div className="flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="w-full shrink-0 rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-950/50 via-purple-950/40 to-black/80 p-6 lg:w-[min(22rem,100%)]">
          <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-fuchsia-300 to-purple-300">
            {teamSector.sectorName}
          </h2>
          {teamSector.description ? (
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {teamSector.description}
            </p>
          ) : null}
        </div>
        <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(teamSector.teamMembers || []).map((m) => (
            <TeamMember key={`${teamSector.sectorName}-${m.email}-${m.name}`} member={m} />
          ))}
        </ul>
      </div>
    </div>
  );
}
