import Icon from "./icons.jsx";
import SectionHeading from "./SectionHeading.jsx";

const FEATURES = [
	{ icon: "globe", n: 1 },
	{ icon: "type", n: 2 },
	{ icon: "repeat", n: 3 },
	{ icon: "timer", n: 4 },
	{ icon: "star", n: 5 },
	{ icon: "activity", n: 6 },
	{ icon: "phone", n: 7 },
	{ icon: "moon", n: 8 },
	{ icon: "archive", n: 9 },
];

export default function Features({ lang, T }) {
	return (
		<section aria-labelledby="home-features">
			<SectionHeading
				id="home-features"
				lang={lang}
				title={T("homeFeaturesTitle")}
				sub={T("homeFeaturesSub")}
			/>
			<ul className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map((f) => (
					<li
						key={f.n}
						className="flex gap-3.5 rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper p-4"
					>
						<span className="shrink-0 w-10 h-10 rounded-lg bg-shu-soft dark:bg-night border border-ai-line dark:border-night-line flex items-center justify-center text-shu dark:text-shu-glow">
							<Icon name={f.icon} className="w-5 h-5" />
						</span>
						<div className="min-w-0">
							<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink leading-snug">
								{T(`homeFeat${f.n}Title`)}
							</h3>
							<p className="font-bengali text-xs leading-relaxed text-ink-muted dark:text-night-ink-muted mt-1">
								{T(`homeFeat${f.n}Desc`)}
							</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
