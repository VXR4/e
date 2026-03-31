gsap.registerPlugin(ScrollTrigger);function generateRandomSlug(length=8){const chars='abcdefghijklmnopqrstuvwxyz0123456789';let result='';for(let i=0;i<length;i++){result+=chars[Math.floor(Math.random()*chars.length)]}
return result}
if(typeof scriptsData!=='undefined'){scriptsData.forEach(item=>{if(!item.slug)item.slug=generateRandomSlug();})}
function tagClassFor(status){if(status==='OUTDATED')return'outdated';if(status==='UPDATED')return'updated';return'unknown'}
function selectTab(name,updateUrl=!0){const tabs=document.querySelectorAll('.tab-content');const btns=document.querySelectorAll('.tab-btn');tabs.forEach(t=>t.classList.remove('active'));btns.forEach(b=>b.classList.remove('active'));const target=document.getElementById('tab-'+name);if(!target)return;const tl=gsap.timeline();tl.to(btns,{scale:0.96,duration:0.12,ease:'power2.out'}).add(()=>{target.classList.add('active')}).to(btns,{scale:1,duration:0.18,ease:'power2.out'});const activeBtn=Array.from(btns).find(b=>b.dataset.tab===name);if(activeBtn)activeBtn.classList.add('active');if(updateUrl){const params=new URLSearchParams(window.location.search);params.set('tab',name);params.delete('script');const u=window.location.protocol+'//'+window.location.host+window.location.pathname+'?'+params.toString();window.history.pushState({},'',u)}
setTimeout(()=>ScrollTrigger.refresh(),100)}
let currentPage=1;const itemsPerPage=6;let currentFilter='';function createSkeleton(){return `
        <div class="skeleton-card rounded-[2.5rem] h-[380px] p-2 flex flex-col group border border-white/5">
            <div class="h-48 bg-white/5 rounded-3xl mb-4 mx-2 mt-2"></div>
            <div class="px-6 pb-6 flex flex-col gap-3 flex-1">
                <div class="h-6 bg-white/5 rounded-full w-3/4"></div>
                <div class="h-4 bg-white/5 rounded-full w-full"></div>
                <div class="h-4 bg-white/5 rounded-full w-1/2 mt-auto"></div>
            </div>
        </div>
    `}
function createScriptCard(item,displayIndex){const thumb=item.youtube?`https://img.youtube.com/vi/${item.youtube}/hqdefault.jpg`:`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000`;const tagCls=tagClassFor(item.status);const card=document.createElement('div');card.className='glass-card rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 cursor-pointer group flex flex-col h-full hover:border-white/15';card.setAttribute('data-id',item.id);card.setAttribute('data-slug',item.slug);card.addEventListener('click',()=>openModal(item));card.innerHTML=`
        <div class="h-52 overflow-hidden relative border-b border-white/5 p-2">
            <div class="w-full h-full rounded-[2rem] overflow-hidden relative bg-black">
                <img src="${thumb}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                <div class="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-bold z-10">
                    #${displayIndex}
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                        <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-6 flex flex-col flex-1 justify-between gap-4">
            <div>
                <h3 class="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">${item.title}</h3>
                <p class="text-gray-400 text-sm line-clamp-2 leading-relaxed">${item.desc}</p>
            </div>
            <div class="flex items-start">
                <span class="tag ${tagCls}">${item.status}</span>
            </div>
        </div>
    `;return card}
function renderScripts(filter='',isLoadMore=!1){const grid=document.getElementById('script-grid');const loadMoreBtn=document.getElementById('load-more-container');if(!grid||typeof scriptsData==='undefined')return;if(!isLoadMore){grid.innerHTML='';currentPage=1;currentFilter=filter}
const skeletons=Array(itemsPerPage).fill(createSkeleton()).join('');const tempContainer=document.createElement('div');tempContainer.innerHTML=skeletons;const skeletonElements=Array.from(tempContainer.children);skeletonElements.forEach(s=>grid.appendChild(s));setTimeout(()=>{skeletonElements.forEach(s=>s.remove());const filtered=scriptsData.sort((a,b)=>b.id-a.id).filter(s=>s.title.toLowerCase().includes(currentFilter.toLowerCase()));const totalItems=filtered.length;const start=isLoadMore?(currentPage-1)*itemsPerPage:0;const end=currentPage*itemsPerPage;const itemsToShow=filtered.slice(start,end);itemsToShow.forEach((item,index)=>{const displayIndex=start+index+1;const card=createScriptCard(item,displayIndex);grid.appendChild(card);gsap.fromTo(card,{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:'power2.out'})});if(end<totalItems){loadMoreBtn?.classList.remove('hidden')}else{loadMoreBtn?.classList.add('hidden')}
ScrollTrigger.refresh()},400)}
function openModal(item,updateUrl=!0){document.getElementById('modal-title').innerText=item.title;const modalTag=document.getElementById('modal-tag');modalTag.innerText=item.status;modalTag.className='tag '+tagClassFor(item.status);document.getElementById('modal-desc').innerText=item.desc;const modalBtn=document.getElementById('modal-btn');modalBtn.classList.remove('disabled','shake-error');if(!item.link||item.link==="#"){modalBtn.href="javascript:void(0)";modalBtn.innerText="NOT AVAILABLE";modalBtn.classList.add('disabled');modalBtn.onclick=(e)=>{e.preventDefault();modalBtn.classList.remove('shake-error');void modalBtn.offsetWidth;modalBtn.classList.add('shake-error');setTimeout(()=>modalBtn.classList.remove('shake-error'),400)}}else{modalBtn.href=item.link;modalBtn.innerText="GET SCRIPT";modalBtn.onclick=null}
const vc=document.getElementById('modal-video-container');vc.innerHTML=item.youtube?`<div class="video-container"><iframe src="https://www.youtube.com/embed/${item.youtube}?autoplay=1" frameborder="0" allowfullscreen></iframe></div>`:`<div class="w-full h-64 flex items-center justify-center text-gray-500 italic text-sm">No video preview available.</div>`;const modal=document.getElementById('script-modal');modal.classList.remove('hidden');modal.classList.add('flex');document.body.style.overflow='hidden';gsap.fromTo('#modal-content',{y:50,scale:0.95,opacity:0},{y:0,scale:1,opacity:1,duration:0.5,ease:'expo.out'});if(updateUrl){const params=new URLSearchParams(window.location.search);params.set('tab','script');params.set('script',item.slug);const u=window.location.protocol+'//'+window.location.host+window.location.pathname+'?'+params.toString();window.history.pushState({},'',u)}}
function closeModal(){const modal=document.getElementById('script-modal');gsap.to('#modal-content',{y:30,scale:0.95,opacity:0,duration:0.3,ease:'power2.in',onComplete:()=>{modal.classList.add('hidden');document.body.style.overflow='auto';document.getElementById('modal-video-container').innerHTML='';const params=new URLSearchParams(window.location.search);params.delete('script');const u=window.location.protocol+'//'+window.location.host+window.location.pathname+(params.toString()?('?'+params.toString()):'');window.history.pushState({},'',u)}})}
function copyCurrentLink(){navigator.clipboard.writeText(window.location.href).then(()=>{const btn=document.getElementById('modal-share');if(btn){const originalText=btn.innerText;btn.innerText="COPIED!";gsap.to(btn,{scale:0.96,duration:0.1,yoyo:!0,repeat:1});setTimeout(()=>{btn.innerText=originalText},2000)}})}
function resolveScriptFromURL(){const params=new URLSearchParams(window.location.search);const sid=params.get('script');if(!sid||typeof scriptsData==='undefined')return;const itm=scriptsData.find(s=>s.slug===sid||String(s.id)===sid);if(itm)openModal(itm,!1);}
window.addEventListener('popstate',()=>{const params=new URLSearchParams(window.location.search);const tab=params.get('tab')||'profile';selectTab(tab,!1);resolveScriptFromURL()});window.onload=()=>{renderScripts();const params=new URLSearchParams(window.location.search);const tab=params.get('tab')||'profile';selectTab(tab,!1);resolveScriptFromURL();const tl=gsap.timeline();tl.to('#loader-text span',{y:0,stagger:0.1,duration:0.8,ease:'power4.out'}).to('#loader-bar',{width:'100%',duration:0.8}).to('#loader',{yPercent:-100,duration:1,ease:'expo.inOut'}).from('#hero-title',{y:80,opacity:1,duration:1.1,ease:'power4.out'},'-=0.5').to('#hero-sub',{opacity:1,y:0,duration:0.8},'-=0.8').to('#main-nav',{opacity:1,y:0,duration:0.8},'-=0.8').to('.reveal-hero-right',{opacity:1,y:0,duration:1,ease:'power4.out'},'-=0.5');document.querySelectorAll('.reveal').forEach(el=>{gsap.to(el,{scrollTrigger:{trigger:el,start:"top 85%"},opacity:1,y:0,duration:1,ease:'power3.out'})});const cursor=document.getElementById('cursor');if(cursor){window.addEventListener('mousemove',e=>{gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:0.1})});document.querySelectorAll('a, button, input, .cursor-pointer').forEach(el=>{el.addEventListener('mouseenter',()=>gsap.to(cursor,{scale:2,duration:0.2}));el.addEventListener('mouseleave',()=>gsap.to(cursor,{scale:1,duration:0.2}))})}
document.querySelectorAll('.tab-btn').forEach(b=>{b.addEventListener('click',()=>selectTab(b.dataset.tab))});const searchInput=document.getElementById('script-search');if(searchInput){let timeout;searchInput.addEventListener('input',e=>{clearTimeout(timeout);timeout=setTimeout(()=>{renderScripts(e.target.value,!1)},300)})}
const loadMoreBtn=document.getElementById('load-more-btn');if(loadMoreBtn){loadMoreBtn.addEventListener('click',()=>{currentPage++;renderScripts(currentFilter,!0)})}
const shareBtn=document.getElementById('modal-share');if(shareBtn)shareBtn.addEventListener('click',copyCurrentLink);}
