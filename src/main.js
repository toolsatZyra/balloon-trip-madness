import './style.css';
import './game-counter.css';
import './high-score.css';
import './game-counter.js';
import { beginScoreRun, resizeScoreRun, completeScoreRun, refreshHighScore } from './high-score.js';
import {Flight,STEP} from './flight.js';
import {boot} from './scene.js';
const $=id=>document.getElementById(id),seed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
const inputs={keys:new Set(),pointers:new Map(),tap:false};
let best=0;try{best=Math.max(0,Number(localStorage.getItem('balloon-fight.best'))||0);}catch{}
$('best').textContent=String(best).padStart(6,'0');
let sound=false,context,noticeTimer;const clearInput=()=>{inputs.keys.clear();inputs.pointers.clear();inputs.tap=false;document.querySelectorAll('#touch button').forEach(b=>b.classList.remove('active'));};
function tone(f,d=.09){if(!sound)return;context??=new AudioContext();context.resume();const o=context.createOscillator(),gain=context.createGain();o.type='sine';o.frequency.setValueAtTime(f,context.currentTime);o.frequency.exponentialRampToValueAtTime(f*1.3,context.currentTime+d);gain.gain.setValueAtTime(.035,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+d);o.connect(gain);gain.connect(context.destination);o.start();o.stop(context.currentTime+d);}
function notice(text){$('notice').textContent=text;$('notice').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').classList.remove('visible'),2400);}
function panel(kind){clearInput();$('panel').hidden=false;$('instructions').hidden=kind!=='help';$('result-stats').hidden=kind!=='over';$('same').hidden=kind!=='over';$('back').hidden=kind==='help'||kind==='credits';
 $('panel-kicker').textContent={pause:'TAKE A BREATHER',over:'THERE’S ALWAYS ANOTHER SKY',help:'A LITTLE REFRESHER',credits:'BALLOON FIGHT · BALLOON TRIP'}[kind];
 $('panel-title').textContent={pause:'Drift can wait.',over:'One more flight?',help:'Find your float.',credits:'Back in the air.'}[kind];
 $('panel-description').textContent=kind==='over'?app.model.reason:kind==='credits'?'An independent fan recreation of Nintendo’s Balloon Trip mode, with newly drawn artwork and a rebuilt flight simulation. Original game and character: Nintendo. This is not an official Nintendo release.':kind==='pause'?'Your flight is right where you left it.':'';
 $('continue').textContent=kind==='pause'?'Resume flight →':kind==='over'?'A new sky →':'Got it';app.panelKind=kind;$('continue').focus();
}
const app={state:'home',model:new Flight(seed()),acc:0,width:1000,qa:false,
 ready(){this.scene=this.game.scene.getScene('Sky');$('start').disabled=false;$('start').innerHTML='Back in the air <span>→</span>';},
 resize(width){this.width=width;resizeScoreRun(width);const ratio=width/this.model.width;this.model.width=width;this.model.player.x=Math.min(width-26,this.model.player.x*ratio);if(this.state==='home')this.model.reset(this.model.seed);},
 start(same=false){clearInput();this.model=new Flight(same?this.model.seed:seed(),this.width);beginScoreRun(this.model,'trip',this.width);this.state='playing';this.acc=0;$('home').hidden=true;$('panel').hidden=true;$('hud').hidden=false;$('pause').hidden=false;$('touch').hidden=false;document.querySelector('footer').hidden=true;this.model.flap();notice('← → to steer · Space or ↑ to flap');document.activeElement?.blur();},
 pause(){if(this.state!=='playing')return;this.state='paused';this.acc=0;panel('pause');},
 home(){this.qa=false;this.state='home';clearInput();$('panel').hidden=true;$('home').hidden=false;$('hud').hidden=true;$('pause').hidden=true;$('touch').hidden=true;document.querySelector('footer').hidden=false;this.model.reset(seed());refreshHighScore();$('start').focus();},
 tick(dt){
  if(this.state==='playing'){
   this.acc+=dt;let axis=Number(inputs.keys.has('ArrowRight')||inputs.keys.has('KeyD')||[...inputs.pointers.values()].includes('right'))-Number(inputs.keys.has('ArrowLeft')||inputs.keys.has('KeyA')||[...inputs.pointers.values()].includes('left'));
   let lift=inputs.keys.has('KeyX')||[...inputs.pointers.values()].includes('lift');
   if(inputs.tap){if(this.model.flap())tone(250,.045);inputs.tap=false;}
   while(this.acc>=STEP&&this.model.alive){
    if(this.qa){const p=this.model.player;const next=this.model.columns.filter(c=>c.x<p.x+55).sort((a,b)=>b.x-a.x)[0];const target=next?next.safeY:310;axis=p.x<this.width*.70?.12:p.x>this.width*.74?-.12:0;lift=p.y>target+8&&p.vy>-35;}
    for(const e of this.model.step(STEP,axis,lift)){
     if(e.type==='balloon'){this.scene.burst(e.x,e.y,0x9aefbe);tone(600);if(e.bonus)notice('PERFECT 20 · +1,000');}
     if(e.type==='bubble'){this.scene.burst(e.x,e.y,0xb9e8ff);tone(900,.2);notice('A little breathing room · scrolling paused');}
     if(e.type==='flap')tone(230,.045);
     if(e.type==='level')notice('Level '+e.level+' · the sparks are picking up speed');
     if(e.type==='fish-warning')notice('Something’s stirring below…');
     if(e.type==='hit'){this.scene.burst(e.x,e.y-25,0xff8992,25);tone(100,.25);this.over();}
    }
    this.acc-=STEP;
   }
   if(this.qa&&this.model.time>=35){this.qa=false;this.pause();}
  }
  $('score').textContent=String(Math.floor(this.model.score)).padStart(6,'0');$('collected').textContent=String(this.model.collected).padStart(2,'0');$('chain').innerHTML=`${this.model.streak%20} <span>/ 20</span>`;$('chain-fill').style.width=`${this.model.streak%20/20*100}%`;
  document.getElementById('flight-level').textContent=this.model.level;
  if(import.meta.env.DEV){$('metrics').textContent=JSON.stringify({state:this.state,seed:this.model.seed,time:+this.model.time.toFixed(2),player:this.model.player,score:Math.floor(this.model.score),collected:this.model.collected,sparks:this.model.sparks.length,level:this.model.level,sparkSpeed:this.model.sparkSpeed,roaming:this.model.sparks.filter(s=>s.roaming).length,starPositions:this.model.sparks.filter(s=>s.roaming).slice(0,3).map(s=>({x:s.x,y:s.y,vx:s.vx,vy:s.vy})),sound,frameMs:Math.round(dt*1000)});}
 },
 over(){completeScoreRun();this.qa=false;this.state='over';const score=Math.floor(this.model.score);best=Math.max(best,score);try{localStorage.setItem('balloon-fight.best',String(best));}catch{}$('best').textContent=String(best).padStart(6,'0');$('final-score').textContent=score.toLocaleString();$('final-balloons').textContent=this.model.collected;$('final-chain').textContent=this.model.bestStreak;$('pause').hidden=true;$('touch').hidden=true;panel('over');}
};
$('start').onclick=()=>app.start();$('pause').onclick=()=>app.pause();$('back').onclick=()=>app.home();$('same').onclick=()=>app.start(true);
$('continue').onclick=()=>{if(app.panelKind==='over')app.start();else if(app.panelKind==='pause'){app.state='playing';$('panel').hidden=true;clearInput();document.activeElement?.blur();}else{$('panel').hidden=true;$('start').focus();}};
$('how').onclick=()=>panel('help');$('credits').onclick=()=>panel('credits');$('sound').onclick=()=>{sound=!sound;$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');document.querySelector('.sound-slash').hidden=sound;if(sound)tone(440);};
window.addEventListener('keydown',e=>{
 if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW','KeyZ','KeyX','KeyP','Escape'].includes(e.code)){
  if(e.target instanceof HTMLButtonElement&&(e.code==='Space'||e.code==='Enter'))return;e.preventDefault();
  if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat){if(app.state==='playing')app.pause();else if(app.state==='paused')$('continue').click();return;}
  if(app.state==='playing'){inputs.keys.add(e.code);if(!e.repeat&&['Space','ArrowUp','KeyW','KeyZ'].includes(e.code))inputs.tap=true;}
 }
});
window.addEventListener('keyup',e=>inputs.keys.delete(e.code));window.addEventListener('blur',()=>{clearInput();app.pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();app.pause();}});
for(const b of document.querySelectorAll('#touch button')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);inputs.pointers.set(e.pointerId,b.dataset.action);b.classList.add('active');});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{inputs.pointers.delete(e.pointerId);b.classList.remove('active');});}
app.game=boot(app);
if(import.meta.env.DEV&&new URLSearchParams(location.search).has('verify')){const box=document.createElement('div');box.className='qa-buttons';for(const [text,fn]of [['35-second flight check',()=>{app.start(true);app.qa=true;}],['Release pilot',()=>{app.qa=false;}],['Brake check',()=>{app.start(true);app.model.player.vx=130;inputs.keys.add('ArrowLeft');}]]){const b=document.createElement('button');b.textContent=text;b.onclick=fn;box.append(b);}document.body.append(box);}
