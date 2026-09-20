import Icon from "./icons.jsx";

export default function CtaBand({ lang, T, onStart }) {
	const headFont = lang === "bn" ? "font-bengali" : "font-mincho";
	return (
		<section className="relative overflow-hidden rounded-xl bg-shu text-washi px-5 py-8 sm:px-10 sm:py-10 shadow-card-lg dark:shadow-none">
			<span
				aria-hidden="true"
				lang="ja"
				className="pointer-events-none select-none absolute -right-2 -bottom-8 font-mincho font-bold text-[9rem] sm:text-[12rem] leading-none text-washi/10"
			>
				始め
			</span>
			<div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
				<div className="max-w-xl">
					<h2 className={`${headFont} text-2xl sm:text-3xl font-bold leading-snug`}>{T("homeCtaTitle")}</h2>
					<p className="font-bengali text-sm sm:text-base mt-2 text-washi/85">{T("homeCtaSub")}</p>
				</div>
				<button
					type="button"
					onClick={onStart}
					className="group shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-washi px-6 py-3 font-bengali text-sm sm:text-base font-semibold text-shu hover:bg-white"
				>
					{T("homeStartCta")}
					<Icon name="arrowRight" className="w-5 h-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
				</button>
			</div>
		</section>
	);
}
