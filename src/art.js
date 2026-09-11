// Hand-drawn, high-resolution vector artwork; no ROM graphics or sprite rips.
const TAU=Math.PI*2;
function ellipse(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
function path(c,points,fill){c.fillStyle=fill;c.beginPath();points(c);c.fill();}
function texture(scene,key,w,h,draw){const canvas=document.createElement('canvas');canvas.width=w*4;canvas.height=h*4;const c=canvas.getContext('2d');c.scale(4,4);draw(c);scene.textures.addCanvas(key,canvas);}
export function makeArt(scene){
 for(const [name,base,light,dark] of [['red','#f34a66','#ffb5b1','#a62148'],['green','#79dab0','#e4ffe0','#25757a'],['gold','#f4b95f','#fff2bf','#b96b46']]) texture(scene,name,48,66,c=>{
   const g=c.createRadialGradient(16,14,2,26,29,27);g.addColorStop(0,light);g.addColorStop(.45,base);g.addColorStop(1,dark);
   ellipse(c,24,27,20,25,g);path(c,p=>{p.moveTo(23,51);p.lineTo(19,56);p.quadraticCurveTo(24,54,28,56);p.lineTo(25,51);},dark);
   c.strokeStyle='#fff9';c.lineWidth=2.3;c.lineCap='round';c.beginPath();c.ellipse(22,25,13,18,-.1,3.5,4.7);c.stroke();
   c.strokeStyle='#e1e5e19a';c.lineWidth=.65;c.beginPath();c.moveTo(24,55);c.bezierCurveTo(19,59,29,61,24,66);c.stroke();
 });
 for(let frame=0;frame<6;frame++) texture(scene,`body${frame}`,64,50,c=>{
   c.translate(32,21);const flap=Math.sin(frame/6*TAU);
   // Blue overalls, ivory sleeves, red cap and shoes retain the NES silhouette.
   c.save();c.translate(-10,3);c.rotate(-.55-flap*.55);ellipse(c,-4,0,9,4,'#f4dcc0');ellipse(c,-11,-1,4,4,'#ffcd9d');c.restore();
   ellipse(c,0,8,12,12,'#4c67b5');ellipse(c,3,7,9,10,'#667fd0');
   c.save();c.translate(-5,17);c.rotate(.2+flap*.15);ellipse(c,-2,2,4.5,6,'#304b91');ellipse(c,-4,7,7,4,'#ef6372');c.restore();
   c.save();c.translate(7,17);c.rotate(-.3-flap*.15);ellipse(c,0,2,4.5,6,'#405daa');ellipse(c,-2,7,7,4,'#ff8b8c');c.restore();
   ellipse(c,-2,-5,11,12,'#ffe0af');ellipse(c,-11,-4,4,3.5,'#ffd09c');
   path(c,p=>{p.moveTo(-13,-8);p.bezierCurveTo(-15,-28,14,-27,13,-5);p.lineTo(8,-4);p.lineTo(7,-12);p.quadraticCurveTo(-1,-15,-13,-8);},'#d83d5e');
   path(c,p=>{p.moveTo(-12,-11);p.bezierCurveTo(-9,-23,7,-24,10,-12);p.quadraticCurveTo(-1,-17,-12,-11);},'#f47887');
   ellipse(c,-11,-10,7,2.5,'#fa8291');ellipse(c,-8,-6,1.4,2.1,'#202c4b');ellipse(c,-5,-1,2.8,1.7,'#f3ab94');
   c.strokeStyle='#c78e76';c.lineWidth=.9;c.beginPath();c.arc(-8,-1,4,.2,1.2);c.stroke();
   c.strokeStyle='#f0cbad';c.lineWidth=2;c.beginPath();c.moveTo(9,-8);c.lineTo(6,4);c.stroke();
   c.save();c.translate(8,4);c.rotate(.4+flap*.7);ellipse(c,5,0,8,4,'#fff1cf');ellipse(c,12,-1,4,4,'#ffdaa8');c.restore();
   ellipse(c,0,5,1,1,'#efc77a');
 });
 texture(scene,'spark',80,80,c=>{
   const g=c.createRadialGradient(40,40,0,40,40,40);g.addColorStop(0,'#cfc7ff88');g.addColorStop(.4,'#8582ff32');g.addColorStop(1,'#817dff00');ellipse(c,40,40,40,40,g);
   path(c,p=>{for(let i=0;i<16;i++){const a=i*TAU/16;const r=i%2?5:(i%4?13:18);const x=40+Math.cos(a)*r,y=40+Math.sin(a)*r;i?p.lineTo(x,y):p.moveTo(x,y);}p.closePath();},'#b8b2ff');
   path(c,p=>{p.moveTo(40,29);p.lineTo(43,37);p.lineTo(51,40);p.lineTo(43,43);p.lineTo(40,51);p.lineTo(37,43);p.lineTo(29,40);p.lineTo(37,37);},'#fff9e5');
 });
 texture(scene,'bubble',80,80,c=>{const g=c.createRadialGradient(32,25,1,40,40,28);g.addColorStop(0,'#c2f3ff04');g.addColorStop(.78,'#9bd5ff10');g.addColorStop(1,'#b5dcff88');ellipse(c,40,40,27,27,g);c.strokeStyle='#b9f7ffb0';c.lineWidth=1;c.beginPath();c.arc(40,40,27,0,TAU);c.stroke();c.strokeStyle='#fffbe2';c.lineWidth=3;c.lineCap='round';c.beginPath();c.arc(40,40,21,3.6,4.5);c.stroke();c.strokeStyle='#ffa9d8';c.lineWidth=1.3;c.beginPath();c.arc(40,40,24,.1,1.2);c.stroke();});
 texture(scene,'fish',100,75,c=>{path(c,p=>{p.moveTo(15,40);p.lineTo(2,24);p.lineTo(4,59);p.lineTo(18,48);},'#446f9f');ellipse(c,51,42,35,24,'#74a1c2');path(c,p=>{p.moveTo(59,19);p.lineTo(74,30);p.lineTo(88,19);p.lineTo(80,51);p.lineTo(66,38);},'#152c49');ellipse(c,57,26,7,7,'#fff1d1');ellipse(c,58,25,3,4,'#142038');path(c,p=>{p.moveTo(31,23);p.lineTo(37,4);p.lineTo(57,20);},'#5782aa');});
}
