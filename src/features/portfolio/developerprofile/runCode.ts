export type RunResult =
    | { ok: true; lines: string[]; ms: number }
    | { ok: false; error: string };

/** Pretty-prints a value the way a console would: keys unquoted, strings double-quoted, arrays inline. */
function inspect(value: unknown, indent = 0): string {
    if (typeof value === 'string') return JSON.stringify(value);

    if (Array.isArray(value)) {
        return `[${value.map((item) => inspect(item, indent)).join(', ')}]`;
    }

    if (value && typeof value === 'object') {
        const entries = Object.entries(value);
        if (entries.length === 0) return '{}';

        const pad = ' '.repeat(indent);
        const body = entries
            .map(([key, val]) => `${pad}  ${key}: ${inspect(val, indent + 2)}`)
            .join(',\n');
        return `{\n${body}\n${pad}}`;
    }

    return String(value);
}

/**
 * Really executes `source` in the browser, then evaluates `entry` and returns what it produced.
 * Only ever called with the static code from profile.data.ts, never with user input.
 */
export function runCode(source: string, entry: string): RunResult {
    try {
        const run = new Function(`"use strict";\n${source}\nreturn ${entry};`);

        const start = performance.now();
        const value = run();
        const ms = performance.now() - start;

        return { ok: true, lines: inspect(value).split('\n'), ms };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        };
    }
}
