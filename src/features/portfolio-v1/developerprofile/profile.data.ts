export type TokenKind = 'keyword' | 'class' | 'prop' | 'fn' | 'string' | 'punct' | 'plain';
export type Token = [kind: TokenKind, text: string];

const sp = (n: number): Token => ['plain', ' '.repeat(n)];

/** The code shown in the editor, one array of tokens per line (the token kind decides the colour). */
export const CODE_LINES: Token[][] = [
    [['keyword', 'class'], ['plain', ' '], ['class', 'Developer'], ['plain', ' '], ['punct', '{']],
    [sp(4), ['prop', 'name'], ['plain', ' '], ['punct', '='], ['plain', ' '], ['string', '"Sachin Mishra Soni"'], ['punct', ';']],
    [sp(4), ['prop', 'role'], ['plain', ' '], ['punct', '='], ['plain', ' '], ['string', '"Full Stack Developer"'], ['punct', ';']],
    [],
    [sp(4), ['fn', 'build'], ['punct', '() {']],
    [sp(8), ['keyword', 'return'], ['plain', ' '], ['punct', '{']],
    [sp(12), ['prop', 'frontend'], ['punct', ': ['], ['string', '"React"'], ['punct', ', '], ['string', '"Next.js"'], ['punct', '],']],
    [sp(12), ['prop', 'backend'], ['punct', ': ['], ['string', '"Node.js"'], ['punct', ', '], ['string', '"Express"'], ['punct', '],']],
    [sp(12), ['prop', 'database'], ['punct', ': ['], ['string', '"MongoDB"'], ['punct', ', '], ['string', '"MySQL"'], ['punct', '],']],
    [sp(12), ['prop', 'mindset'], ['punct', ': '], ['string', '"Always Learning"']],
    [sp(8), ['punct', '};']],
    [sp(4), ['punct', '}']],
    [['punct', '}']],
];

/** Plain-text version of the code, used by the Copy button. */
export const CODE_TEXT = CODE_LINES.map((line) => line.map(([, text]) => text).join('')).join('\n');

/** Shown as the typed command in the output panel. */
export const RUN_COMMAND = '> developer.build()';

/** The expression Run actually evaluates after the code above has been defined. */
export const RUN_ENTRY = 'new Developer().build()';
