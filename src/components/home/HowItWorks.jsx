import Hanko from "../Hanko.jsx";
import Icon from "./icons.jsx";
import SectionHeading from "./SectionHeading.jsx";

const STEPS = [
	{ tab: "study", icon: "study", title: "homeStep1Title", desc: "homeStep1Desc" },
	{ tab: "quiz", icon: "quiz", title: "homeStep2Title", desc: "homeStep2Desc" },
	{ tab: "reference", icon: "reference", title: "homeStep3Title", desc: "homeStep3Desc" },
	{ tab: "progress", icon: "progress", title: "homeStep4Title", desc: "homeStep4Desc" },
];

// The learn → practice → review → track loop. Each step is a shortcut into
// the matching tab for the currently chosen level.
export default function HowItWorks({ lang, T, onOpen }) {
	return (
		<section id="home-how" aria-labelledby="home-how-title" className="scroll-mt-4">
			<SectionHeading
				id="home-how-title"
				lang={lang}
				title={T("homeHowTitle")}
				sub={T("homeHowSub")}
			/>
			<ol className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{STEPS.map((step, i) => (
					<li key={step.tab}>
						<button
							type="button"
							onClick={() => onOpen(step.tab)}
							className="group h-full w-full text-left rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5 hover:border-shu/50 transition-colors"
						>
							<div className="flex items-center justify-between">
								<Hanko label={`${i + 1}`} tone="shu" size="sm" />
								<Icon name={step.icon} className="w-5 h-5 text-ink-muted dark:text-night-ink-muted group-hover:text-shu dark:group-hover:text-shu-glow" />
							</div>
							<h3 className="font-bengali text-base font-bold text-ink dark:text-night-ink mt-4">
								{T(step.title)}
							</h3>
							<p className="font-bengali text-xs sm:text-[13px] leading-relaxed text-ink-muted dark:text-night-ink-muted mt-1.5">
								{T(step.desc)}
							</p>
						</button>
					</li>
				))}
			</ol>
		</section>
	);
}
