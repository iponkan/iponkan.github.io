const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const TurndownService = require('turndown');

const searchXmlPath = path.join(__dirname, '../search.xml');
const outputDir = path.join(__dirname, '../recovered_md');

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

turndownService.keep(['iframe']);

turndownService.addRule('hexoCodeBlock', {
    filter: function (node) {
        return node.nodeName === 'FIGURE' && node.className.includes('highlight');
    },
    replacement: function (content, node) {
        let lang = node.className.replace('highlight', '').trim() || '';
        if (lang === 'plaintext') {
            lang = '';
        }
        let codeContent = '';
        // Try getting lines
        const lines = node.querySelectorAll('.line');
        if (lines && lines.length > 0) {
            codeContent = Array.from(lines).map(l => l.textContent).join('\n');
        } else {
            const codeTd = node.querySelector('.code');
            if (codeTd) {
                const pre = codeTd.querySelector('pre');
                if (pre) {
                    codeContent = pre.textContent || pre.innerText || '';
                }
            }
        }
        return `\n\n\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;
    }
});

const parser = new xml2js.Parser({ explicitArray: false });

fs.readFile(searchXmlPath, 'utf8', (err, data) => {
    if (err) {
        console.error("Failed to read search.xml:", err);
        return;
    }
    
    parser.parseString(data, (err, result) => {
        if (err) {
            console.error("Failed to parse XML:", err);
            return;
        }

        const entries = result.search.entry;
        const entriesArray = Array.isArray(entries) ? entries : [entries];

        let count = 0;
        entriesArray.forEach(entry => {
            if (!entry) return;
            
            const title = entry.title || 'Untitled';
            const url = entry.url || '';
            let contentHtml = entry.content || '';
            
            let dateStr = '';
            const match = url.match(/\/(\d{4}\/\d{2}\/\d{2})\//);
            if (match) {
                dateStr = match[1].replace(/\//g, '-');
            }

            contentHtml = contentHtml.replace(/<link[^>]*aplayer-secondary-style-marker[^>]*>/g, '');
            contentHtml = contentHtml.replace(/<script[^>]*aplayer-secondary-script-marker[^>]*><\/script>/g, '');
            contentHtml = contentHtml.replace(/<span id="more"><\/span>/gi, '<!-- more -->');
            contentHtml = contentHtml.replace(/<a id="more"><\/a>/gi, '<!-- more -->');
            contentHtml = contentHtml.replace(/<a href="#[^"]*" class="headerlink" title="[^"]*"><\/a>/gi, '');

            let markdown = turndownService.turndown(contentHtml);

            let frontMatter = `---\ntitle: ${title}\n`;
            if (dateStr) {
                frontMatter += `date: ${dateStr}\n`;
            }

            if (entry.categories && entry.categories.category) {
                const cats = Array.isArray(entry.categories.category) ? entry.categories.category : [entry.categories.category];
                frontMatter += `categories:\n`;
                cats.forEach(c => { frontMatter += `  - ${c}\n`; });
            }

            if (entry.tags && entry.tags.tag) {
                const tags = Array.isArray(entry.tags.tag) ? entry.tags.tag : [entry.tags.tag];
                frontMatter += `tags:\n`;
                tags.forEach(t => { frontMatter += `  - ${t}\n`; });
            }
            frontMatter += `---\n\n`;

            const finalContent = frontMatter + markdown;

            let filenameStr = title.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '_');
            if (dateStr) {
                filenameStr = `${dateStr}-${filenameStr}`;
            }
            
            const filename = `${filenameStr}.md`;
            const filepath = path.join(outputDir, filename);

            fs.writeFileSync(filepath, finalContent, 'utf8');
            count++;
        });
        
        console.log(`Successfully recovered ${count} markdown files to: ${outputDir}`);
    });
});
