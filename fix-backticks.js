const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('\\`')) {
    console.log('Fixing:', file);
    // Be careful, this replaces all \` with `
    // Check if there are legitimate usages of \` like in markdown strings, but in this codebase it's likely from the bot escaping.
    content = content.replace(/\\`/g, '`');
    // Also replace \${ with ${
    content = content.replace(/\\\${/g, '${');
    fs.writeFileSync(file, content, 'utf8');
  }
}
