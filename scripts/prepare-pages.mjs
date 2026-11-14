// Rewrite root-absolute links for preview deployment under /jobsdone-web/.
// Production Vite build remains rooted at / and unchanged.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
const prefix='/jobsdone-web'
const roots=['/shared.css','/data/','/src/','/studio/','/templates/','/automation/']
function visit(dir){
 for(const e of readdirSync(dir,{withFileTypes:true})){
  const file=join(dir,e.name)
  if(e.isDirectory())visit(file)
  else if(e.name.endsWith('.html')){
   let text=readFileSync(file,'utf8')
   for(const root of roots)text=text.split(root).join(prefix+root)
   // Only rewrite homepage-specific hrefs; don't rewrite external absolute URLs.
   text=text.replace(/(href|action)="\/(#.*?)?"/g,(_,attr,hash='')=>`${attr}="${prefix}/${hash}"`)
   text=text.replace(/(href)="\/#/g,`$1="${prefix}/#`)
   writeFileSync(file,text)
  }
 }
}
visit('dist')
console.log('Rewrote static preview paths under '+prefix)
