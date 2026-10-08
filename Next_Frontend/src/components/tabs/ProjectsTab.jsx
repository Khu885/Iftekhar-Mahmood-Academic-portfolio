export default function ProjectsTab({ projects = [], loading, error }) {
  if (loading) {
    return <p className="text-sm text-gray-500">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight mb-2">
          Projects
        </h1>
        <p className="text-[14.5px] text-gray-600 leading-relaxed">
          Ongoing and historical research programs in translational pharmacokinetics,
          pediatric dose calculation algorithms, and biologics disposition.
        </p>
      </div>

      <div id="projects-items-container" className="space-y-6 pt-2">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase text-gray-500 tracking-wider">
                {proj.category || ""}
              </span>
              {proj.status && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                  {proj.status}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 leading-snug">
              {proj.title}
            </h3>

            <p className="text-[14px] text-gray-600 leading-relaxed">
              {proj.description}
            </p>

            {proj.highlights && proj.highlights.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Key Contributions
                </span>
                <ul className="space-y-1 text-xs text-gray-600">
                  {proj.highlights.map((h, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">&bull;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
