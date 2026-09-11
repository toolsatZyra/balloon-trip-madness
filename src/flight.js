export const STEP = 1 / 120;
export const HEIGHT = 640;
export const WATER = 578;
export const PLAYER_SCALE = 1.1;
export const SPARK_TOP = 70, SPARK_BOTTOM = WATER-16;
// Reflect overshoot too, so a long frame cannot pin a spark against an edge.
export function bounce(position,velocity,low,high){while(position<low||position>high){if(position<low){position=2*low-position;velocity=Math.abs(velocity);}if(position>high){position=2*high-position;velocity=-Math.abs(velocity);}}return[position,velocity];}
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function rng(seed) { return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function circles(player) {
  return [{x:player.x,y:player.y,r:12*PLAYER_SCALE}, {x:player.x-11*PLAYER_SCALE,y:player.y-34*PLAYER_SCALE,r:12*PLAYER_SCALE}, {x:player.x+11*PLAYER_SCALE,y:player.y-38*PLAYER_SCALE,r:12*PLAYER_SCALE}];
}
export class Flight {
  constructor(seed = 1, width = 1000) { this.width = width; this.reset(seed); }
  reset(seed = this.seed) {
    this.seed = seed >>> 0; this.random = rng(this.seed); this.time = 0; this.distance = 0; this.score = 0; this.collected = 0; this.streak = 0; this.bestStreak = 0;
    this.player = {x:this.width*.72,y:300,vx:0,vy:0}; this.alive = true; this.reason = ''; this.freeze = 0; this.flapCooldown = 0; this.flapAge = 1;
    this.sparks = []; this.balloons = []; this.bubbles = []; this.columns = []; this.id = 0; this.lowTime = 0; this.fish = null; this.nextColumn = 0; this.lastSafeY = 310;this.sparkSpeed=1;this.sparkSpawn=0;
    // Calm first screen; the course arrives from the left, like Balloon Trip.
    for (let i=0;i<8;i++) this.addColumn(this.width*.28-i*180);
  }
  get level() { return 1 + Math.floor(this.time/15); }
  get targetSparkSpeed(){return Math.min(2.2,1.08**(this.level-1));}
  get maxRoaming(){return Math.min(22,Math.max(9,Math.round(this.width/100)+5)+Math.floor((this.level-1)/3));}
  get scrollSpeed() { return Math.min(94, 52+Math.floor(this.distance/1400)*6); }
  releaseSpark(spark){const a=.55+this.random()*.8,speed=55+this.random()*20;spark.vx=Math.cos(a)*speed*(this.random()<.5?-1:1);spark.vy=Math.sin(a)*speed*(this.random()<.5?-1:1);spark.roaming=true;spark.x=clamp(spark.x,14,this.width-14);spark.y=clamp(spark.y,SPARK_TOP,SPARK_BOTTOM);}
  moveSparks(dt,scroll){
    this.sparkSpeed+=(this.targetSparkSpeed-this.sparkSpeed)*(1-Math.exp(-dt*2));
    let roaming=this.sparks.filter(s=>s.roaming).length;
    for(const spark of this.sparks){
      if(!spark.roaming){spark.baseX+=scroll;spark.x=spark.baseX;spark.y=spark.baseY;
        if(this.time>=8&&spark.x>=14&&spark.x<=this.width-14){if(roaming<this.maxRoaming){this.releaseSpark(spark);roaming++;}else spark.expired=true;}
      }
      if(spark.roaming){[spark.x,spark.vx]=bounce(spark.x+spark.vx*this.sparkSpeed*dt,spark.vx,14,this.width-14);[spark.y,spark.vy]=bounce(spark.y+spark.vy*this.sparkSpeed*dt,spark.vy,SPARK_TOP,SPARK_BOTTOM);}
    }
    this.sparkSpawn+=dt;
    if(this.time>=8&&this.sparkSpawn>=2.5&&roaming<this.maxRoaming){
      this.sparkSpawn=0;const s={id:this.id++,x:14,y:SPARK_TOP+this.random()*(SPARK_BOTTOM-SPARK_TOP),r:7,phase:this.random()*6.28};
      // New sparks enter at an edge, away from the player; no surprise spawns on top of them.
      if(Math.hypot(s.x-this.player.x,s.y-this.player.y)<150)s.x=this.width-14;
      this.releaseSpark(s);s.vx=s.x<this.width/2?Math.abs(s.vx):-Math.abs(s.vx);this.sparks.push(s);
    }
    this.sparks=this.sparks.filter(s=>!s.expired&&(s.roaming||s.x<this.width+100));
  }
  flap() {
    if (!this.alive || this.flapCooldown > 0) return false;
    this.player.vy = Math.max(-172, this.player.vy-70); this.flapCooldown = .13; this.flapAge = 0; return true;
  }
  addColumn(x) {
    const index=this.nextColumn++, random=this.random;
    const safeY = index<2 ? 310 : clamp(this.lastSafeY+(random()-.5)*150,180,440);
    this.lastSafeY=safeY; this.columns.push({x,safeY,index});
    const count=Math.min(6,3+Math.floor(index/12));
    for(let j=0;j<count&&this.time<8;j++) {
      const baseY=85+j*(430/(count-1))+(random()-.5)*24;
      if (Math.abs(baseY-safeY)<109) continue;
      const baseX=x+(random()-.5)*34;
      this.sparks.push({id:this.id++,baseX,baseY,x:baseX,y:baseY,r:7,phase:random()*Math.PI*2});
    }
    this.balloons.push({id:this.id++,x:x-48,y:safeY-12,phase:random()*6.28,taken:false,missed:false});
    if (index>0 && index%8===0) this.bubbles.push({id:this.id++,x:x+48,y:clamp(safeY+65,160,470),taken:false});
  }
  die(reason) { this.alive=false; this.reason=reason; return {type:'hit',reason,x:this.player.x,y:this.player.y}; }
  step(dt, axis=0, lift=false) {
    if(!this.alive) return [];
    const events=[],oldLevel=this.level; this.time+=dt;if(this.level!==oldLevel)events.push({type:'level',level:this.level}); this.flapAge+=dt; this.flapCooldown=Math.max(0,this.flapCooldown-dt);
    if(lift && this.flapCooldown===0 && this.flap()) events.push({type:'flap'});
    const p=this.player;
    // Input changes velocity. Reversing input brakes before changing direction.
    p.vx=clamp(p.vx+clamp(axis,-1,1)*255*dt,-165,165)*Math.exp(-.32*dt);
    p.vy=clamp(p.vy+145*dt,-172,205);
    p.x+=p.vx*dt; p.y+=p.vy*dt;
    const edge=26*PLAYER_SCALE;
    if(p.x<edge) {p.x=edge;p.vx=Math.max(0,p.vx);} if(p.x>this.width-edge) {p.x=this.width-edge;p.vx=Math.min(0,p.vx);}
    if(p.y<76+(PLAYER_SCALE-1)*50) {p.y=76+(PLAYER_SCALE-1)*50;p.vy=Math.max(0,p.vy);}
    const scroll=this.freeze>0?0:this.scrollSpeed*dt; this.freeze=Math.max(0,this.freeze-dt); this.distance+=scroll;
    for(const column of this.columns) column.x+=scroll;
    this.moveSparks(dt,scroll);
    for(const b of [...this.balloons,...this.bubbles]) b.x+=scroll;
    if(p.y+14*PLAYER_SCALE>WATER) return [this.die('The sea caught you.')];
    if(this.sparks.some(s=>circles(p).some(c=>Math.hypot(c.x-s.x,c.y-s.y)<c.r+s.r))) return [this.die('A spark popped your balloons.')];
    // Fish warning is tied to lingering near the surface, with time to escape.
    this.lowTime=p.y>WATER-64?this.lowTime+dt:0;
    if(this.lowTime>.55 && !this.fish) {this.fish={x:p.x,t:0};events.push({type:'fish-warning'});}
    if(this.fish) {
      this.fish.t+=dt;
      if(this.fish.t>1 && this.fish.t<1.55 && Math.abs(p.x-this.fish.x)<29 && p.y>WATER-76) return [this.die('The fish found you.')];
      if(this.fish.t>2) {this.fish=null;this.lowTime=0;}
    }
    this.score+=scroll>0?dt*20:0;
    for(const b of this.balloons) {
      if(!b.taken&&!b.missed&&Math.hypot(b.x-p.x,b.y-(p.y-18))<35) {
        b.taken=true;this.collected++;this.streak++;this.bestStreak=Math.max(this.bestStreak,this.streak);
        const bonus=this.streak%20===0?1000:0;this.score+=100+bonus;events.push({type:'balloon',x:b.x,y:b.y,bonus});
      }
      if(!b.taken&&!b.missed&&b.x>this.width+24) {b.missed=true;this.streak=0;}
    }
    for(const b of this.bubbles) if(!b.taken&&Math.hypot(b.x-p.x,b.y-p.y)<35) {b.taken=true;this.freeze=3;this.score+=200;events.push({type:'bubble',x:b.x,y:b.y});}
    this.balloons=this.balloons.filter(b=>b.x<this.width+100);
    this.bubbles=this.bubbles.filter(b=>b.x<this.width+100);
    this.columns=this.columns.filter(c=>c.x<this.width+220);
    while(this.columns.at(-1).x>-360) this.addColumn(this.columns.at(-1).x-180);
    return events;
  }
}
