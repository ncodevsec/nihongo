// Every md/<id>.md file, keyed by rule id ("4-1", "26-3", …), as raw text.
const files = import.meta.glob("./md/*.md", { query: "?raw", import: "default", eager: true });

const DESCRIPTIONS = {};
for (const [path, text] of Object.entries(files)) {
	DESCRIPTIONS[path.replace(/^.*\/(.+)\.md$/, "$1")] = text;
}

export const getGrammarDescription = (id) => DESCRIPTIONS[id] || "";
