// Small inline icon set for the Home page — same stroke style as the nav
// icons in Sidebar/TabBar (24x24, 1.8 stroke, round caps), so nothing new
// has to be fetched and every icon inherits currentColor.
const PATHS = {
	home: (
		<>
			<path d="M3 10.5L12 3l9 7.5" />
			<path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5" />
		</>
	),
	flame: (
		<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 002.5 2.5z" />
	),
	checkCircle: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M8.5 12.5l2.5 2.5 4.5-5" />
		</>
	),
	target: (
		<>
			<circle cx="12" cy="12" r="9" />
			<circle cx="12" cy="12" r="5" />
			<circle cx="12" cy="12" r="1" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</>
	),
	study: (
		<path d="M4 5.5a2 2 0 012-2h4.5v13H6a2 2 0 00-2 2v-13zM20 5.5a2 2 0 00-2-2h-4.5v13H18a2 2 0 012 2v-13z" />
	),
	quiz: <path d="M9 11l2 2 4-4M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />,
	reference: <path d="M4 6h16M4 12h16M4 18h10" />,
	progress: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />,
	arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
	chevronDown: <polyline points="6 9 12 15 18 9" />,
	check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
	globe: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
		</>
	),
	type: <path d="M4 7V5h16v2M12 5v14M9 19h6" />,
	repeat: (
		<>
			<polyline points="17 1 21 5 17 9" />
			<path d="M3 11V9a4 4 0 014-4h14" />
			<polyline points="7 23 3 19 7 15" />
			<path d="M21 13v2a4 4 0 01-4 4H3" />
		</>
	),
	timer: (
		<>
			<circle cx="12" cy="13" r="8" />
			<path d="M12 9v4l2 2M9 2h6" />
		</>
	),
	star: (
		<path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z" />
	),
	activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
	phone: (
		<>
			<rect x="7" y="2" width="10" height="20" rx="2" />
			<path d="M11 18h2" />
		</>
	),
	moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
	sun: (
		<>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
		</>
	),
	archive: (
		<>
			<rect x="3" y="4" width="18" height="4" rx="1" />
			<path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4" />
		</>
	),
	refresh: <path d="M20 12a8 8 0 10-2.3 5.7M20 5v5h-5" />,
	download: <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />,
};

export default function Icon({ name, className = "w-4 h-4", strokeWidth = 1.8 }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${className} shrink-0`}
			aria-hidden="true"
		>
			{PATHS[name]}
		</svg>
	);
}
