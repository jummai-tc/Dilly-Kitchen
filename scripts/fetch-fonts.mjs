/**
 * Downloads the Latin subsets of Inter and Fraunces from Google Fonts into
 * public/fonts/, and prints the matching @font-face rules for src/index.css.
 *
 *   node scripts/fetch-fonts.mjs
 *
 * The site self-hosts its fonts, so this only needs re-running to update them.
 */
import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

const SOURCES = [
  ['Inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap'],
  ['Fraunces', 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap'],
]

const outDir = path.resolve(import.meta.dirname, '../public/fonts')
fs.mkdirSync(outDir, { recursive: true })

const rules = []
for (const [family, url] of SOURCES) {
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text()
  // Keep only the Latin subsets — the site is English-language.
  const blocks = css.split('/*').filter((b) => /^\s*(latin|latin-ext)\s*\*\//.test(b))
  for (const block of blocks) {
    const subset = block.match(/^\s*(latin-ext|latin)\s*\*\//)[1]
    const src = block.match(/url\((https:[^)]+)\)/)[1]
    const range = block.match(/unicode-range:\s*([^;]+);/)[1]
    const weight = block.match(/font-weight:\s*([^;]+);/)[1]
    const file = `${family.toLowerCase()}-${subset}.woff2`

    const buf = Buffer.from(await (await fetch(src, { headers: { 'User-Agent': UA } })).arrayBuffer())
    fs.writeFileSync(path.join(outDir, file), buf)
    console.log(`saved ${file} (${(buf.length / 1024).toFixed(0)} KB)`)

    rules.push(
      `@font-face {\n  font-family: '${family}';\n  font-style: normal;\n` +
        `  font-weight: ${weight};\n  font-display: swap;\n` +
        `  src: url('/fonts/${file}') format('woff2');\n  unicode-range: ${range};\n}`,
    )
  }
}

console.log('\n--- paste into src/index.css ---\n')
console.log(rules.join('\n'))
