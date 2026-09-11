import Phaser from 'phaser';
import {makeArt} from './art.js';
import {HEIGHT,WATER,rng,PLAYER_SCALE} from './flight.js';
export class Sky extends Phaser.Scene {
 constructor(app){super('Sky');this.app=app;this.entities=new Map();this.effects=[];this.elapsed=0;}
 create(){
   makeArt(this);this.world=this.add.container(0,0);this.back=this.add.graphics();this.world.add(this.back);this.front=this.add.graphics();
   this.playerView=this.add.container(0,0);this.strings=this.add.graphics();this.left=this.add.image(-11,-34,'red').setDisplaySize(27,37);this.right=this.add.image(11,-38,'red').setDisplaySize(27,37);this.body=this.add.image(0,1,'body0').setDisplaySize(43,34);this.playerView.add([this.strings,this.left,this.right,this.body]);this.world.add(this.playerView);this.world.add(this.front);
   this.fishView=this.add.image(0,0,'fish').setDisplaySize(70,53).setVisible(false);this.world.add(this.fishView);
   const random=rng(44);this.stars=Array.from({length:150},()=>({x:random(),y:random()*.86,r:.4+random()*.8,phase:random()*6.28}));
   this.resize();this.scale.on('resize',()=>{this.app.pause();this.resize();});this.app.ready();
 }
 resize(){const w=this.scale.width,h=this.scale.height;this.worldWidth=Math.max(420,w/h*HEIGHT);this.zoom=Math.min(w/this.worldWidth,h/HEIGHT);this.world.setScale(this.zoom).setPosition((w-this.worldWidth*this.zoom)/2,(h-HEIGHT*this.zoom)/2);this.app.resize(this.worldWidth);}
 addEntity(id,key,x,y,w,h){let v=this.entities.get(id);if(!v){v=this.add.image(x,y,key).setDisplaySize(w,h);this.world.addAt(v,1);this.entities.set(id,v);}return v;}
 burst(x,y,color,count=12){for(let i=0;i<count;i++){const a=i/count*Math.PI*2;this.effects.push({x,y,vx:Math.cos(a)*(25+Math.random()*35),vy:Math.sin(a)*50,life:.7,color});}}
 update(_,delta){
   const dt=Math.min(delta/1000,.05);this.elapsed+=dt;this.app.tick(dt);const m=this.app.model,t=this.elapsed,w=this.worldWidth;const menu=this.app.state==='home';
   this.back.clear();const g=this.back;
   g.fillGradientStyle(0x080f24,0x0d152e,0x183959,0x253857,1);g.fillRect(0,-200,w,1040);
   // An understated night sky keeps collectible and hazard silhouettes legible.
   for(const s of this.stars){const x=(s.x*w+m.distance*.06)%w;g.fillStyle(0xb8cae8,.3+.25*Math.sin(t*.7+s.phase));g.fillCircle(x,s.y*HEIGHT,s.r);}
   for(let i=0;i<4;i++){g.fillStyle(0x405a83,.025);g.fillEllipse(w*.67,330,500+i*95,260+i*70);}
   g.fillStyle(0xf5e6ca,.06);g.fillCircle(w*.87,116,38);g.fillStyle(0xf5e6ca,.13);g.fillCircle(w*.87,116,23);g.fillStyle(0xf5e6ca,.7);g.fillCircle(w*.87,116,17);g.fillStyle(0x111d38,1);g.fillCircle(w*.87+8,110,16);
   this.front.clear();const f=this.front;
   for(let layer=0;layer<4;layer++){
     f.fillStyle([0x2b5680,0x234a72,0x183859,0x132b49][layer],1);f.beginPath();
     for(let x=-10;x<=w+10;x+=10){const y=WATER+layer*13+Math.sin(x*.037+t*(1-layer*.08)+layer)*3+Math.sin(x*.013-t*.4)*2;x===-10?f.moveTo(x,y):f.lineTo(x,y);}
     f.lineTo(w+10,HEIGHT+200);f.lineTo(-10,HEIGHT+200);f.closePath();f.fillPath();
     f.lineStyle(.8,0x99c7e5,.23);f.beginPath();for(let x=0;x<=w;x+=7){const y=WATER+layer*13+Math.sin(x*.037+t*(1-layer*.08)+layer)*3+Math.sin(x*.013-t*.4)*2;x===0?f.moveTo(x,y):f.lineTo(x,y);}f.strokePath();
   }
   // Small reflected glints drift across the water, never across the collision area.
   f.lineStyle(1,0xaacde5,.15);for(let i=0;i<22;i++){const x=(i*71+t*8)%w,y=591+(i%4)*10;f.lineBetween(x,y,x+10+Math.sin(t+i)*7,y);}
   const active=new Set();
   for(const s of m.sparks){active.add(s.id);const v=this.addEntity(s.id,'spark',s.x,s.y,42,42);v.setPosition(s.x,s.y).setRotation(Math.sin(t+s.phase)*.15).setAlpha(menu?.35:1).setVisible(s.x>-60);}
   for(const b of m.balloons){active.add(b.id);this.addEntity(b.id,'green',b.x,b.y,26,36).setPosition(b.x,b.y+Math.sin(t*1.8+b.phase)*2).setRotation(Math.sin(t+b.phase)*.06).setVisible(!b.taken&&!b.missed).setAlpha(menu?.65:1);}
   for(const b of m.bubbles){active.add(b.id);this.addEntity(b.id,'bubble',b.x,b.y,48,48).setPosition(b.x,b.y+Math.sin(t)*3).setVisible(!b.taken);}
   for(const[id,v]of this.entities)if(!active.has(id)){v.destroy();this.entities.delete(id);}
   const p=m.player;const heroScale=w<600?2.2:3.25;const heroX=w<600?w*.77:w*.73,heroY=w<600?350:300;
   this.playerView.setPosition(menu?heroX:p.x,menu?heroY+Math.sin(t)*7:p.y).setScale((menu?heroScale:1)*PLAYER_SCALE).setRotation(menu?Math.sin(t*.8)*.04:p.vx*.0009);
   const motion=menu?t*8:(m.flapAge<.25?m.flapAge*24:3);this.body.setTexture(`body${Math.floor(motion)%6}`).setFlipX(!menu&&p.vx>10);
   const sway=Math.sin(t*2)*2+(menu?0:-p.vx*.025);this.left.setPosition(-11+sway,-34+Math.sin(t*2)*1.5);this.right.setPosition(11+sway*.6,-38+Math.sin(t*2+.7)*1.5);
   const key=m.streak>=20?'gold':'red';this.left.setTexture(key);this.right.setTexture(key);
   this.strings.clear().lineStyle(.65,0xefe3d3,.7);this.strings.lineBetween(-11+sway,-20,-2,-9);this.strings.lineBetween(11+sway*.6,-24,4,-9);
   if(this.app.state==='over'){this.playerView.setAlpha(.32);}else this.playerView.setAlpha(1);
   if(m.fish){const ft=m.fish.t;f.lineStyle(1.5,0xa8d7ef,.7);for(let i=0;i<3;i++)f.strokeEllipse(m.fish.x,WATER+3,25+i*18+Math.sin(t*8)*5,5+i*3);this.fishView.setVisible(ft>1).setPosition(m.fish.x,WATER-Math.sin(Math.min(1,(ft-1)) *Math.PI)*48+12).setRotation(-.3);}else this.fishView.setVisible(false);
   this.effects=this.effects.filter(e=>e.life>0);for(const e of this.effects){e.life-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.vy+=60*dt;f.fillStyle(e.color,Math.max(0,e.life/.7));f.fillCircle(e.x,e.y,2);}
 }
}
export function boot(app){return new Phaser.Game({type:Phaser.CANVAS,parent:'stage',width:innerWidth,height:innerHeight,backgroundColor:'#080f24',resolution:Math.min(devicePixelRatio,2),antialias:true,scale:{mode:Phaser.Scale.RESIZE},audio:{noAudio:true},scene:new Sky(app),banner:false});}
