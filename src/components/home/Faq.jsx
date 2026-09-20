import { useState } from "react";
import Icon from "./icons.jsx";
import SectionHeading from "./SectionHeading.jsx";

const COUNT = 6;

export default function Faq({ lang, T }) {
	const [open, setOpen] = useState(0);

	return (
		<section aria-labelledby="home-faq" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
			<div>
				<SectionHeading id="home-faq" lang={lang} title={T("homeFaqTitle")} sub={T("homeFaqSub")} />
				<span
					aria-hidden="true"
					lang="ja"
					className="hidden lg:block font-mincho text-8xl font-bold leading-none text-shu/[0.10] dark:text-shu-glow/[0.12] select-none"
				>
					問
				</span>
			</div>
			<div className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper divide-y divide-ai-line dark:divide-night-line overflow-hidden">
				{Array.from({ length: COUNT }, (_, i) => {
					const n = i + 1;
					const isOpen = open === i;
					return (
						<div key={n}>
							<h3>
								<button
									type="button"
									id={`home-faq-q${n}`}
									aria-expanded={isOpen}
									aria-controls={`home-faq-a${n}`}
									onClick={() => setOpen(isOpen ? -1 : i)}
									className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5 text-left font-bengali text-sm font-semibold text-ink dark:text-night-ink hover:bg-shu-soft/50 dark:hover:bg-night"
								>
									<span>{T(`homeFaq${n}Q`)}</span>
									<Icon
										name="chevronDown"
										className={`w-4 h-4 text-ink-muted dark:text-night-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
									/>
								</button>
							</h3>
							<div
								id={`home-faq-a${n}`}
								role="region"
								aria-labelledby={`home-faq-q${n}`}
								hidden={!isOpen}
								className="px-4 sm:px-5 pb-4 -mt-1 font-bengali text-[13px] leading-relaxed text-ink-muted dark:text-night-ink-muted"
							>
								{T(`homeFaq${n}A`)}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
