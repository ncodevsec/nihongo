import { t } from "../../lib/i18n.js";
import { VERB_GROUP_CATEGORIES } from "../../lib/grammarUtils.js";

// The "segment at the top of the Verb dropdown" for choosing which of
// Group 1 (u-verbs) / Group 2 (ru-verbs) / Group 3 (irregular) to include.
// All three are on by default; unchecking one hides every form of every
// verb in that group from the Verb pool (Dictionary/Te/Ta/Nai alike).
export default function VerbGroupFilter({ value, onChange, lang }) {
	const toggle = (key) => {
		onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
	};
	return (
		<div className="px-3 py-1.5">
			<div className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted mb-1">
				{t(lang, "verbGroupFilterLabel")}
			</div>
			{VERB_GROUP_CATEGORIES.map((g) => (
				<label
					key={g.key}
					className="flex items-center gap-2 py-1 text-sm font-bengali text-ink dark:text-night-ink hover:bg-ai-soft dark:hover:bg-night-line cursor-pointer rounded"
				>
					<input
						type="checkbox"
						checked={value.includes(g.key)}
						onChange={() => toggle(g.key)}
						className="shrink-0"
					/>
					<span className="truncate">{lang === "bn" ? g.bn : g.en}</span>
				</label>
			))}
		</div>
	);
}
