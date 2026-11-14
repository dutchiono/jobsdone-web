#!/usr/bin/env node
/**
 * Read-only source audit of PUBLIC repositories associated with Miono.
 * Runtime: Node.js >=20, GitHub Actions GITHUB_TOKEN (no production secrets).
 * Data is generated, not hand-classified. A root manifest/README is NOT a guarantee of functionality.
 */
import { mkdir, writeFile } from 'node:fs/promises';
const token=process.env.GITHUB_TOKEN||'';
const H={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
if(token)H.Authorization='Bearer '+token;
const api=async path=>{
 const url='https://api.github.com'+path;
 for(let i=0;i<3;i++){
  const res=await fetch(url,{headers:H});
  if(res.status===404)return null;
  if((res.status===429||res.status>=500)&&i<2){await new Promise(r=>setTimeout(r,500*(i+1)));continue}
  if(!res.ok)throw Error(res.status+' '+res.statusText+' '+path);
  return res.json();
 }
};
async function collect(path){
 let out=[];
 for(let p=1;p<=20;p++){const chunk=await api(path+(path.includes('?')?'&':'?')+'per_page=100&page='+p);if(!Array.isArray(chunk))break;out=out.concat(chunk);if(chunk.length<100)break}
 return out.filter(x=>x.visibility==='public'||x.private===false);
}
function lane(name){
 const s=name.toLowerCase();
 if(/jobsdone|jacob|ionoi-sites|billing-system|customer-experience|marketplace-integrated|content-integrated/.test(s))return 'business';
 if(/bushleague|dotcache|cache-bar|cloud|deploy|monitor|gateway|database-architect|hosting|frontendy/.test(s))return 'infrastructure';
 if(/bot-foundry|agent|plugin-|eliza|milady|fey|openclaw|claw|architect|skills|headroom|gitclaw|llm|ai-/.test(s))return 'agents-devtools';
 if(/game|icecream|tavern|trivia|kite|digipet|family|pumpkin|hyperscape|mirrorstage/.test(s))return 'interactive';
 if(/crypto|sol|bankr|bnkr|feather|market|bet|dex|token|mafia|coverage|trading/.test(s))return 'markets-web3';
 return 'uncategorized';
}
const sourceFiles=['package.json','pyproject.toml','requirements.txt','Cargo.toml','go.mod','Gemfile','pubspec.yaml','composer.json'];
const indicators=['src','app','apps','packages','pages','server','backend','frontend','web','index.html','Dockerfile'];
const compactString=v=>String(v||'').trim().replace(/\s+/g,' ').slice(0,250);
async function inspect(x){
 const owner=x.owner.login,repo=x.name,base='/repos/'+encodeURIComponent(owner)+'/'+encodeURIComponent(repo);
 const result={repo:x.full_name,url:x.html_url,owner,fork:x.fork,archived:x.archived,branch:x.default_branch,
  sizeKiB:x.size,pushedAt:x.pushed_at,language:x.language,license:x.license?.spdx_id||null,homepage:x.homepage||null,
  description:compactString(x.description),category:lane(repo),sourceInspection:'root-plus-readme',rootFiles:[],
  manifests:[],sourceIndicators:[],readme:false,readmeTitle:null,signals:[],errors:[]};
 try{
  const root=await api(base+'/contents');
  if(Array.isArray(root)){
   result.rootFiles=root.map(f=>f.name);
   result.manifests=sourceFiles.filter(n=>result.rootFiles.includes(n));
   result.sourceIndicators=indicators.filter(n=>result.rootFiles.includes(n));
  }
 }catch(e){result.errors.push('root: '+String(e.message).slice(0,120))}
 try{
  const readme=await api(base+'/readme');
  if(readme?.content){
   const plain=Buffer.from(readme.content.replace(/\s/g,''),'base64').toString('utf8').slice(0,20000);
   result.readme=true;
   result.readmeTitle=compactString(plain.match(/^#\s+(.+)$/m)?.[1]);
   if(/(not deployed|not yet deployed|does not trade|not implemented|coming soon|work in progress|planned|todo)/i.test(plain))result.signals.push('README discusses incomplete/planned work');
   if(/(docker compose|npm run build|cargo build|pytest|vitest|bun run|go test)/i.test(plain))result.signals.push('README contains run/build/test instructions');
   if(/(deployed|production|live site|live:|https:\/\/[^\s)]+)/i.test(plain))result.signals.push('README includes deployment/URL claims; unverified');
  }
 }catch(e){result.errors.push('readme: '+String(e.message).slice(0,120))}
 if(!result.manifests.length&&!result.sourceIndicators.length)result.signals.push('No conventional app manifest/source entry at repo root');
 if(x.fork)result.signals.push('Fork: separate upstream code from original contributions');
 return result;
}
function csvCell(v){const s=Array.isArray(v)?v.join('; '):v??'';return '"'+String(s).replaceAll('"','""')+'"'}
const [personal,org]=await Promise.all([collect('/users/dutchiono/repos'),collect('/orgs/milady-ai/repos')]);
const records=[...new Map([...personal,...org].map(x=>[x.full_name,x])).values()].sort((a,b)=>a.full_name.localeCompare(b.full_name));
const rows=[];
let cursor=0;
async function worker(){while(cursor<records.length){const item=records[cursor++];rows.push(await inspect(item));}}
await Promise.all(Array.from({length:4},worker));
rows.sort((a,b)=>a.repo.localeCompare(b.repo));
const aggregate={scanned:rows.length,readme:rows.filter(x=>x.readme).length,withManifest:rows.filter(x=>x.manifests.length).length,
 noConventionalRootSource:rows.filter(x=>!x.manifests.length&&!x.sourceIndicators.length).length,
 forkCount:rows.filter(x=>x.fork).length,withErrors:rows.filter(x=>x.errors.length).length,
 byCategory:Object.fromEntries([...new Set(rows.map(x=>x.category))].map(c=>[c,rows.filter(x=>x.category===c).length]))};
const keys=['repo','url','owner','category','fork','archived','language','license','pushedAt','readmeTitle','manifests','sourceIndicators','signals','errors'];
const csv=[keys.map(csvCell).join(','),...rows.map(x=>keys.map(k=>csvCell(x[k])).join(','))].join('\n')+'\n';
await mkdir('.audit-output',{recursive:true});
await writeFile('.audit-output/public-source-audit.json',JSON.stringify({schema:'miono.public-source-audit.v1',generatedAt:new Date().toISOString(),aggregate,rows},null,2)+'\n');
await writeFile('.audit-output/public-source-audit.csv',csv);
await writeFile('.audit-output/SUMMARY.md',`# Public GitHub source-level scan\n\n- Repositories: ${aggregate.scanned}\n- README detected: ${aggregate.readme}\n- Root app manifest detected: ${aggregate.withManifest}\n- No conventional root source: ${aggregate.noConventionalRootSource}\n- Forks: ${aggregate.forkCount}\n- Read errors: ${aggregate.withErrors}\n\nSource inspection is limited to root listings and README text. No execution, dependency resolution, security assessment, or individual-contribution verification was performed.\n`);
console.log(JSON.stringify(aggregate,null,2));
