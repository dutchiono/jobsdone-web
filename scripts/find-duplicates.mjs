/**
 * Read-only cross-repository source-blob deduplication audit.
 * Uses Git tree blob SHAs. Identical SHA means byte-identical content.
 * Filters ordinary boilerplate and generated/build files.
 *
 * This is not a dependency or ownership map. No files are modified.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
const token=process.env.GITHUB_TOKEN||''
const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}
if(token)headers.Authorization='Bearer '+token
const inventory=JSON.parse(readFileSync('public/data/repositories.json','utf8')).entries
const skip=/(^|\/)(\.github|node_modules|dist|build|\.next|vendor|coverage|public\/images|images|assets|docs|fixtures|testdata)(\/|$)|(^|\/)(README|LICENSE|NOTICE|CHANGELOG|package-lock|pnpm-lock|yarn.lock|Cargo.lock|poetry.lock|\.gitignore|\.env.example)(\.|$)/i
const isSource=p=>!skip.test(p)&&/\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|sol|html|css|scss|vue|svelte|json|yaml|yml|mdx)$/.test(p)&&!p.endsWith('/tsconfig.json')&&!p.endsWith('/package.json')
let cursor=0
const results=[]
async function runOne(repo){
 const url='https://api.github.com/repos/'+repo.repo+'/git/trees/'+encodeURIComponent(repo.defaultBranch)+'?recursive=1'
 const response=await fetch(url,{headers})
 if(!response.ok)return {repo:repo.repo,error:'HTTP '+response.status}
 const body=await response.json()
 const items=(body.tree||[]).filter(x=>x.type==='blob'&&x.sha&&isSource(x.path)).map(x=>({sha:x.sha,path:x.path}))
 return {repo:repo.repo,truncated:!!body.truncated,files:items,rootSourceCount:items.length}
}
async function worker(){while(cursor<inventory.length){const repo=inventory[cursor++];try{results.push(await runOne(repo))}catch(e){results.push({repo:repo.repo,error:String(e).slice(0,110)})}}}
await Promise.all(Array.from({length:3},()=>worker()))
results.sort((a,b)=>a.repo.localeCompare(b.repo))
const freq=new Map()
for(const r of results)for(const f of r.files||[])freq.set(f.sha,(freq.get(f.sha)||0)+1)
const pairs=[]
for(let a=0;a<results.length;a++){
 const A=results[a];if(!A.files?.length)continue
 const af=new Map(A.files.filter(x=>freq.get(x.sha)<=12).map(x=>[x.sha,x.path]))
 for(let b=a+1;b<results.length;b++){
  const B=results[b];if(!B.files?.length)continue
  const common=[]
  for(const f of B.files)if(af.has(f.sha))common.push({left:af.get(f.sha),right:f.path})
  const pct=common.length/Math.min(A.files.length,B.files.length)
  if(common.length>=5&&pct>=.10)pairs.push({a:A.repo,b:B.repo,sharedSourceFiles:common.length,smallerRepoOverlapPct:Math.round(pct*100),examples:common.slice(0,8)})
 }
}
pairs.sort((a,b)=>b.sharedSourceFiles-a.sharedSourceFiles||b.smallerRepoOverlapPct-a.smallerRepoOverlapPct)
mkdirSync('duplicate-audit-output',{recursive:true})
const report={generatedAt:new Date().toISOString(),scanned:results.length,errors:results.filter(x=>x.error),truncated:results.filter(x=>x.truncated).map(x=>x.repo),candidatePairs:pairs,method:"Byte-identical source blobs across public repos, excluding common documentation/assets/lockfiles. Misses renamed or modified code."}
writeFileSync('duplicate-audit-output/source-duplicates.json',JSON.stringify(report,null,2)+'\n')
writeFileSync('duplicate-audit-output/SUMMARY.md',
 '# Public source duplication audit\n\nScanned '+results.length+' repositories, '+pairs.length+' candidate overlaps. '+report.errors.length+' read failures; '+report.truncated.length+' truncated Git trees.\n\n'
 +'| Repository A | Repository B | Exact shared source files | Overlap of smaller repo |\n| --- | --- | ---: | ---: |\n'
 +pairs.slice(0,50).map(x=>'| '+x.a+' | '+x.b+' | '+x.sharedSourceFiles+' | '+x.smallerRepoOverlapPct+'% |').join('\n')+'\n\n'
 +'**Interpretation:** Git blob matches are definitive for identical files only. They do not prove identical products, canonical ownership, or safe deletion. The JSON includes sample paths. Fork attribution and functional review are required before migration.\n')
console.log(JSON.stringify({scanned:results.length,pairs:pairs.length,errors:report.errors,truncated:report.truncated.length,top:pairs.slice(0,15)},null,2))
