const fs = require('fs');
const path = require('path');

function replaceFile(file, from, to) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(from, to);
  fs.writeFileSync(file, content, 'utf8');
}

// CodeBlock
replaceFile('src/components/mdx/CodeBlock.tsx', /`language-\${language}`/, '"language-" + language');

// learn/actions/index.ts
replaceFile('src/features/learn/actions/index.ts', /`Completed lesson: \${lesson.title}`/, '"Completed lesson: " + lesson.title');
replaceFile('src/features/learn/actions/index.ts', /`\/learn\/\${params.module}\/\${l.slug}`/g, '"/learn/" + params.module + "/" + l.slug');

// xp.ts
replaceFile('src/lib/xp.ts', /`Awarded \${amount} XP. Reason: \${reason}`/, '"Awarded " + amount + " XP. Reason: " + reason');
replaceFile('src/lib/xp.ts', /`Streak updated to \${user.streak} days.`/, '"Streak updated to " + user.streak + " days."');

// seed.ts
let seedContent = fs.readFileSync('src/scripts/seed.ts', 'utf8');
// Fix the broken string template in seed.ts
seedContent = seedContent.replace(/The `SELECT` statement/g, 'The SELECT statement');
seedContent = seedContent.replace(/Use `AS` to rename/g, 'Use AS to rename');
seedContent = seedContent.replace(/combine conditions using `AND`, `OR`, and `NOT`./g, 'combine conditions using AND, OR, and NOT.');
seedContent = seedContent.replace(/`DROP` vs `TRUNCATE`/g, 'DROP vs TRUNCATE');
fs.writeFileSync('src/scripts/seed.ts', seedContent, 'utf8');

console.log('Fixed TS files!');
