import { replaceInFileSync } from 'replace-in-file';
import fs from 'fs';

// Get the names of the generated files
const files = fs.readdirSync('./dist');
const filesPrefixes = ['pan-', 'circling-', 'grid-', 'render-', 'cutting-', 'rectangling-', 'index-'];
const filesToReplace = files.filter(file => filesPrefixes.some(prefix => file.startsWith(prefix)));

// Replace the paths in the index.html file
replaceInFileSync({
    files: 'dist/index.html',
    from: filesToReplace.map(file => `src="/${file}"`),
    to: filesToReplace.map(file => `type="module" src="/${file}"`)
});