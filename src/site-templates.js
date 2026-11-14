// Migrated product concept: dutchiono/ionoi-sites (README, 2026-11-14).
// This is an actual, client-side preview engine, not a claim that checkout, booking,
// domain provisioning or a drag-and-drop editor is implemented.
export const templates = [
 {id:'hvac',industry:'HVAC & trades',business:'Your HVAC Company',eyebrow:'Heating • Cooling • Service',headline:'Comfort you can count on.',desc:'Heating and cooling care from the people next door.',services:['AC repair','Furnace replacement','Maintenance'],accent:'#f69d52',dark:'#1d303c',action:'Request service'},
 {id:'lawn',industry:'Lawn & landscaping',business:'Your Landscaping Company',eyebrow:'Lawn care • Outdoor spaces',headline:'A better-looking yard.',desc:'The dependable local crew for the outdoors.',services:['Lawn mowing','Landscape design','Seasonal cleanup'],accent:'#9be1a5',dark:'#183a2b',action:'Request an estimate'},
 {id:'restaurant',industry:'Restaurants & cafés',business:'Your Neighborhood Café',eyebrow:'Local • Fresh • Made daily',headline:'Your new favorite table.',desc:'Good food, good company, and a reason to come back.',services:['Our menu','Hours & location','Private events'],accent:'#ffd186',dark:'#473126',action:'See the menu'},
 {id:'retail',industry:'Retail & specialty',business:'Your Local Store',eyebrow:'Independent • Thoughtful • Local',headline:'Find something wonderful.',desc:'A neighborhood shop with a little bit of everything you love.',services:['Featured goods','Visit our shop','Contact'],accent:'#e5b7fd',dark:'#343045',action:'Browse products'},
 {id:'bike',industry:'Bike shops',business:'Your Bike Workshop',eyebrow:'Repairs • Builds • Rides',headline:'Get rolling again.',desc:'Friendly service for your everyday ride and next adventure.',services:['Bike repair','Custom builds','Accessories'],accent:'#a9d4f8',dark:'#203443',action:'Book a tune-up'}
];
export const pickTemplate=id=>templates.find(t=>t.id===id)||null;
export function renderPreview(t, name){
 const clean=(v,max=80)=>String(v||'').trim().slice(0,max);
 const escape=s=>clean(s,200).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const business=escape(name)||escape(t.business);
 return '<div class="demo" style="--demo-accent:'+t.accent+';--demo-dark:'+t.dark+'"><div class="demo-head"><strong>'+business+'</strong><span>Services &nbsp; About &nbsp; Contact</span></div><section class="demo-hero"><small>'+escape(t.eyebrow)+'</small><h3>'+escape(t.headline)+'</h3><p>'+escape(t.desc)+'</p><span class="demo-cta">'+escape(t.action)+' ↗</span></section><div class="demo-services">'+t.services.map(x=>'<span>'+escape(x)+'</span>').join('')+'</div><p class="demo-foot">Sample layout only · content and functionality are illustrative</p></div>';
}
