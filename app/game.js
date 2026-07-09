'use strict';
(() => {

// =========================================================
//  STATIC DATA
// =========================================================
const LANGS = [
  { id:'trad-canto', label:'繁體中文 (粵語)', written:'traditional', voice:'zh-HK' },
  { id:'trad-mando', label:'繁體中文 (國語)', written:'traditional', voice:'zh-TW' },
  { id:'simp-mando', label:'简体中文',        written:'simplified',  voice:'zh-CN' },
  { id:'english',    label:'English',         written:'english',     voice:'en-US' }
];
const STROKES = [
  { id:'heng', t:{traditional:'橫',simplified:'横',english:'Horizontal'}, py:'héng', path:[[18,48],[82,52]] },
  { id:'shu',  t:{traditional:'豎',simplified:'竖',english:'Vertical'},   py:'shù',  path:[[50,16],[52,84]] },
  { id:'dian', t:{traditional:'點',simplified:'点',english:'Dot'},        py:'diǎn', path:[[43,38],[58,55]] },
  { id:'pie',  t:{traditional:'撇',simplified:'撇',english:'Left-falling'},py:'piě', path:[[68,22],[30,78]] },
  { id:'na',   t:{traditional:'捺',simplified:'捺',english:'Right-falling'},py:'nà', path:[[34,24],[70,76]] },
  { id:'ti',   t:{traditional:'提',simplified:'提',english:'Rising'},     py:'tí',   path:[[28,74],[72,40]] },
  { id:'gou',  t:{traditional:'鉤',simplified:'钩',english:'Hook'},       py:'gōu',  path:[[52,18],[52,68],[36,60]] },
  { id:'zhe',  t:{traditional:'折',simplified:'折',english:'Bend'},       py:'zhé',  path:[[28,30],[72,28],[70,74]] }
];
const LEVELS = {
  1:{ name:{traditional:'基礎訓練',simplified:'基础训练',english:'Foundation Training'} },
  2:{ name:{traditional:'對戰演武',simplified:'对战演武',english:'Sparring Match'} },
  3:{ name:{traditional:'筆順修煉',simplified:'笔顺修炼',english:'Sequence Training'} },
  4:{ name:{traditional:'終極對決',simplified:'终极对决',english:'Character Combat'} }
};
const LABELS = {
  title:{traditional:'《筆畫功夫》',simplified:'《笔画功夫》',english:'Stroke Kung Fu'},
  soundOn:{traditional:'音效',simplified:'音效',english:'Sound'},
  pause:{traditional:'暫停',simplified:'暂停',english:'Paused'},
  pauseHint:{traditional:'切換語言不會重置進度',simplified:'切换语言不会重置进度',english:'Switching language keeps your progress'},
  resume:{traditional:'繼續遊戲',simplified:'继续游戏',english:'Resume'},
  home:{traditional:'回到主頁',simplified:'回到主页',english:'Back to Home'},
  proceed:{traditional:'前往下一關',simplified:'前往下一关',english:'Proceed'},
  retry:{traditional:'重新挑戰',simplified:'重新挑战',english:'Retry'},
  victory:{traditional:'勝利！',simplified:'胜利！',english:'Victory!'},
  keep:{traditional:'再接再厲！',simplified:'再接再厉！',english:'Keep Training!'},
  keepSub:{traditional:'失敗也是修煉的一部分',simplified:'失败也是修炼的一部分',english:'Losing is part of training'},
  strokeWord:{traditional:'筆畫',simplified:'笔画',english:'Stroke'},
  guided:{traditional:'跟著虛線描繪',simplified:'跟着虚线描绘',english:'Trace the dotted path'},
  free:{traditional:'現在自己寫一次',simplified:'现在自己写一次',english:'Now write it yourself'},
  avatar:{traditional:'我方',simplified:'我方',english:'You'},
  master:{traditional:'對手',simplified:'对手',english:'Rival'},
  grandmaster:{traditional:'宗師',simplified:'宗师',english:'Grandmaster'},
  charWord:{traditional:'字',simplified:'字',english:'Char'},
  strokeOrder:{traditional:'筆順',simplified:'笔顺',english:'Order'},
  l3Guide:{traditional:'依筆順描繪每一筆',simplified:'依笔顺描绘每一笔',english:'Trace each stroke in order'},
  writePrompt:{traditional:'寫出',simplified:'写出',english:'Write'},
  l4Guide:{traditional:'寫完整個字即可出招',simplified:'写完整个字即可出招',english:'Finish the character to strike'},
  l2Guide:{traditional:'寫出筆畫即可出招',simplified:'写出笔画即可出招',english:'Write the stroke to strike'},
  complete:{traditional:'完成',simplified:'完成',english:'Complete'},
  locked2:{traditional:'通過第一關解鎖',simplified:'通过第一关解锁',english:'Clear Level 1'},
  locked3:{traditional:'通過第二關解鎖',simplified:'通过第二关解锁',english:'Clear Level 2'},
  locked4:{traditional:'通過第三關解鎖',simplified:'通过第三关解锁',english:'Clear Level 3'},
  soon:{traditional:'即將推出',simplified:'即将推出',english:'Coming Soon'},
  rotate:{traditional:'橫向遊玩體驗更佳',simplified:'横向游玩体验更佳',english:'Rotate for the best experience'},
  trophy:{traditional:'全部完成！',simplified:'全部完成！',english:'All Complete!'}
};
const CN = ['一','二','三','四'];
// Multi-stroke characters with strokes listed in correct stroke order (筆順)
const CHARS_L3 = [
  { t:{traditional:'二',simplified:'二'}, py:'èr',  en:'two',   strokes:[ [[26,38],[74,38]], [[20,66],[80,66]] ] },
  { t:{traditional:'十',simplified:'十'}, py:'shí', en:'ten',   strokes:[ [[20,46],[80,46]], [[50,18],[50,84]] ] },
  { t:{traditional:'三',simplified:'三'}, py:'sān', en:'three', strokes:[ [[28,28],[72,28]], [[24,50],[76,50]], [[18,72],[82,72]] ] },
  { t:{traditional:'土',simplified:'土'}, py:'tǔ',  en:'earth', strokes:[ [[34,34],[66,34]], [[50,16],[50,72]], [[20,72],[80,72]] ] },
  { t:{traditional:'王',simplified:'王'}, py:'wáng',en:'king',  strokes:[ [[28,28],[72,28]], [[32,50],[68,50]], [[50,28],[50,76]], [[22,76],[78,76]] ] }
];
const CHARS_L4 = [
  { t:{traditional:'人',simplified:'人'}, py:'rén', en:'person',strokes:[ [[52,22],[26,82]], [[50,34],[80,82]] ] },
  { t:{traditional:'大',simplified:'大'}, py:'dà',  en:'big',   strokes:[ [[22,40],[78,40]], [[50,24],[22,82]], [[50,48],[80,82]] ] },
  { t:{traditional:'工',simplified:'工'}, py:'gōng',en:'work',  strokes:[ [[30,30],[70,30]], [[50,30],[50,70]], [[24,70],[76,70]] ] },
  { t:{traditional:'土',simplified:'土'}, py:'tǔ',  en:'earth', strokes:[ [[34,34],[66,34]], [[50,16],[50,72]], [[20,72],[80,72]] ] },
  { t:{traditional:'王',simplified:'王'}, py:'wáng',en:'king',  strokes:[ [[28,28],[72,28]], [[32,50],[68,50]], [[50,28],[50,76]], [[22,76],[78,76]] ] },
  { t:{traditional:'木',simplified:'木'}, py:'mù',  en:'wood',  strokes:[ [[22,42],[78,42]], [[50,20],[50,84]], [[48,46],[22,82]], [[52,46],[80,82]] ] }
];

const ASSET = (name) => `assets/${name}`;

const ASSETS = [
  'Home_background.jpg','Character.png',
  'Home_level_1_button.png','Home_level_2_button.png','Home_level_3_button.png','Home_level_4_button.png',
  'Level_1_Background.jpg','Level_2_Background.png','Level_3_Background.jpg','Level_4_Background.png',
  'WoodenDummy.png',
  'Character_Stand.png','Character_Attack.png','Character_Block.png',
  'Character_Winning_1.png','Character_Winning_2.png','Character_Lose.png',
  'Boss_Stand.png','Boss_Attack.png','Boss_Block.png',
  'Monk_Stand.png','Monk_Punch.png','Monk_Block.png'
];

// =========================================================
//  GAME
// =========================================================
class Game {
  constructor(){
    this.state = {
      screen:'home', paused:false, langId:'trad-mando', muted:false, showRotate:false, langMenuOpen:false,
      loading:true, loadProgress:0,
      levelsWon:[],
      strokeIndex:0, phase:'guided',
      charIndex:0, charStrokeIndex:0,
      avatarHP:20, opponentHP:20, promptStrokeId:null,
      avatarAnim:'', opponentAnim:'', dummyAnim:'', hurt:0, blocking:false, attacking:false, bossAttacking:false, bossBlocking:false,
      winLevel:1, defeatLevel:2, justUnlocked:0
    };
    this.parentMetrics = {levels:{},strokes:{}};
    this.avatarMax = 20; this.oppMax = 20;
    this.userPoints = [];
    this.cacheDom();
    this.bindEvents();
    this.loadSave();
    this.setupOrientationWatch();
    this.renderHomeTiles();
    this.renderLangUI();
    this.updateSoundButtons();
    this.preloadAssets();
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }

  // =========================================================
  //  DOM CACHE
  // =========================================================
  cacheDom(){
    const $ = (id) => document.getElementById(id);
    this.dom = {
      screens: {
        loading: $('screen-loading'), home: $('screen-home'),
        level1: $('screen-level1'), level2: $('screen-level2'), level3: $('screen-level3'), level4: $('screen-level4'),
        win: $('screen-win'), defeat: $('screen-defeat')
      },
      loadBar: $('loadBar'), loadPct: $('loadPct'),
      btnMute: $('btnMute'), btnLang: $('btnLang'), langCurrentLabel: $('langCurrentLabel'),
      langChevron: $('langChevron'), langMenu: $('langMenu'), homeTiles: $('homeTiles'),
      rotateBanner: $('rotateBanner'), rotateText: $('rotateText'),
      overlayPause: $('overlay-pause'), pauseTitle: $('pauseTitle'), pauseHint: $('pauseHint'),
      pauseLangGrid: $('pauseLangGrid'), btnResume: $('btnResume'), btnPauseHome: $('btnPauseHome'),
      winImg: $('winImg'), winTitle: $('winTitle'), winSub: $('winSub'),
      btnProceed: $('btnProceed'), btnWinHome: $('btnWinHome'), winConfetti: $('winConfetti'),
      defeatTitle: $('defeatTitle'), defeatSub: $('defeatSub'), btnRetry: $('btnRetry'), btnDefeatHome: $('btnDefeatHome'),
      l1: { mute:$('l1Mute'), pause:$('l1Pause'), progress:$('l1Progress'), avatarBox:$('l1AvatarBox'),
            practiceImg:$('l1PracticeImg'), dummyBox:$('l1DummyBox'), canvas:$('canvasL1'), guide:$('l1Guide'),
            strokeMain:$('l1StrokeMain'), strokeSub:$('l1StrokeSub') },
      l2: { mute:$('l2Mute'), pause:$('l2Pause'), avatarLabel:$('l2AvatarLabel'), avatarHpFill:$('l2AvatarHpFill'),
            avatarHpText:$('l2AvatarHpText'), oppLabel:$('l2OppLabel'), oppHpFill:$('l2OppHpFill'), oppHpText:$('l2OppHpText'),
            timer:$('l2Timer'), hurtFlash:$('l2HurtFlash'), avatarBox:$('l2AvatarBox'), playerImg:$('l2PlayerImg'),
            canvas:$('canvasL2'), promptMain:$('l2PromptMain'), guide:$('l2Guide'), ring:$('l2Ring'),
            oppBox:$('l2OppBox'), monkImg:$('l2MonkImg') },
      l3: { mute:$('l3Mute'), pause:$('l3Pause'), progress:$('l3Progress'), avatarBox:$('l3AvatarBox'),
            practiceImg:$('l3PracticeImg'), dummyBox:$('l3DummyBox'), canvas:$('canvasL3'), guide:$('l3Guide'),
            charMain:$('l3CharMain'), py:$('l3Py'), meaning:$('l3Meaning'), orderLabel:$('l3OrderLabel'), dots:$('l3Dots') },
      l4: { mute:$('l4Mute'), pause:$('l4Pause'), avatarLabel:$('l4AvatarLabel'), avatarHpFill:$('l4AvatarHpFill'),
            avatarHpText:$('l4AvatarHpText'), oppLabel:$('l4OppLabel'), oppHpFill:$('l4OppHpFill'), oppHpText:$('l4OppHpText'),
            timer:$('l4Timer'), hurtFlash:$('l4HurtFlash'), avatarBox:$('l4AvatarBox'), playerImg:$('l4PlayerImg'),
            canvas:$('canvasL4'), promptLabel:$('l4PromptLabel'), charMain:$('l4CharMain'), py:$('l4Py'), dots:$('l4Dots'),
            ring:$('l4Ring'), oppBox:$('l4OppBox'), bossImg:$('l4BossImg'), guide:$('l4Guide') }
    };
  }

  bindEvents(){
    this.dom.btnMute.addEventListener('click', () => this.toggleMute());
    this.dom.btnLang.addEventListener('click', () => this.toggleLangMenu());
    this.dom.btnResume.addEventListener('click', () => this.resume());
    this.dom.btnPauseHome.addEventListener('click', () => this.goHome());
    this.dom.btnProceed.addEventListener('click', () => { this.pop(); this.proceedNext(); });
    this.dom.btnWinHome.addEventListener('click', () => this.goHome());
    this.dom.btnRetry.addEventListener('click', () => this.retry());
    this.dom.btnDefeatHome.addEventListener('click', () => this.goHome());
    for (const p of ['l1','l2','l3','l4']){
      this.dom[p].mute.addEventListener('click', () => this.toggleMute());
      this.dom[p].pause.addEventListener('click', () => this.togglePause());
      const c = this.dom[p].canvas;
      c.addEventListener('pointerdown', (e) => this.onCanvasDown(e));
      c.addEventListener('pointermove', (e) => this.onCanvasMove(e));
      c.addEventListener('pointerup', (e) => this.onCanvasUp(e));
      c.addEventListener('pointercancel', () => this.onCanvasCancel());
    }
  }

  // =========================================================
  //  PERSISTENCE / LIFECYCLE
  // =========================================================
  loadSave(){
    try{
      const s = JSON.parse(localStorage.getItem('skf_save')||'{}');
      if (s.langId) this.state.langId = s.langId;
      if (typeof s.muted === 'boolean') this.state.muted = s.muted;
      if (Array.isArray(s.levelsWon)) this.state.levelsWon = s.levelsWon;
      this.parentMetrics = s.parentMetrics || {levels:{},strokes:{}};
    }catch(e){ this.parentMetrics = {levels:{},strokes:{}}; }
  }
  persist(){
    try{
      localStorage.setItem('skf_save', JSON.stringify({
        langId:this.state.langId, muted:this.state.muted, levelsWon:this.state.levelsWon, parentMetrics:this.parentMetrics
      }));
    }catch(e){}
  }
  setupOrientationWatch(){
    this._mq = window.matchMedia('(orientation: portrait)');
    const upd = () => { this.state.showRotate = this._mq.matches; this.renderRotateBanner(); };
    this._mqUpd = upd; this._mq.addEventListener('change', upd); upd();
  }
  preloadAssets(){
    const total = ASSETS.length; let done = 0; const t0 = Date.now();
    const bump = () => { done++; this.state.loadProgress = done/total; this.renderLoading(); if (done>=total) finish(); };
    const finish = () => { const wait = Math.max(0, 700-(Date.now()-t0)); setTimeout(() => { this.state.loading=false; this.state.loadProgress=1; this.renderLoading(); this.renderHome(); }, wait); };
    ASSETS.forEach(name => { const im = new Image(); im.onload = bump; im.onerror = bump; im.src = ASSET(name); });
    this._loadGuard = setTimeout(() => { if (this.state.loading){ this.state.loading=false; this.state.loadProgress=1; this.renderLoading(); this.renderHome(); } }, 8000);
  }

  // =========================================================
  //  I18N
  // =========================================================
  lang(){ return LANGS.find(l=>l.id===this.state.langId) || LANGS[1]; }
  written(){ return this.lang().written; }
  L(key){ const m = LABELS[key]; return m ? m[this.written()] : key; }
  strokeName(s){ return this.written()==='english' ? s.t.english : s.t[this.written()]; }
  levelName(n){ const nm = LEVELS[n].name; return this.written()==='english' ? nm.english : nm[this.written()]; }
  charText(ch){ if (!ch) return ''; return this.written()==='simplified' ? ch.t.simplified : ch.t.traditional; }

  // =========================================================
  //  AUDIO
  // =========================================================
  ensureAudio(){
    if (!this.ac){
      try{
        this.ac = new (window.AudioContext||window.webkitAudioContext)();
        this.master = this.ac.createGain(); this.master.gain.value = this.state.muted?0:0.9;
        this.master.connect(this.ac.destination);
      }catch(e){}
    }
    if (this.ac && this.ac.state==='suspended') this.ac.resume();
  }
  applyMute(){ if (this.master) this.master.gain.value = this.state.muted?0:0.9; }
  tone(freq,dur,type,gain,t0,glideTo){
    if (!this.ac||this.state.muted) return;
    const t = t0||this.ac.currentTime; const o=this.ac.createOscillator(); const g=this.ac.createGain();
    o.type = type||'sine'; o.frequency.setValueAtTime(freq,t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo,t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(gain||0.18,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t+dur+0.03);
  }
  noise(dur,gain,filtHz,t0){
    if (!this.ac||this.state.muted) return;
    const t=t0||this.ac.currentTime; const n=Math.floor(this.ac.sampleRate*dur);
    const buf=this.ac.createBuffer(1,n,this.ac.sampleRate); const d=buf.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n);
    const src=this.ac.createBufferSource(); src.buffer=buf;
    const f=this.ac.createBiquadFilter(); f.type='bandpass'; f.frequency.value=filtHz||1400; f.Q.value=0.8;
    const g=this.ac.createGain(); g.gain.value=gain||0.2;
    src.connect(f); f.connect(g); g.connect(this.master); src.start(t);
  }
  pop(){ this.ensureAudio(); this.tone(520,0.08,'triangle',0.12); }
  hit(){ this.noise(0.09,0.32,1700); this.tone(180,0.12,'square',0.16); }
  criticalHit(){
    this.ensureAudio(); if (!this.ac) return; const b=this.ac.currentTime;
    this.noise(0.16,0.42,1600,b); this.tone(150,0.22,'square',0.22,b,70);
    this.tone(330,0.28,'sawtooth',0.16,b+0.02,1760);
    [880,1175,1568,2093].forEach((f,i)=>this.tone(f,0.2,'triangle',0.13,b+0.06+i*0.05));
    this.tone(2637,0.3,'sine',0.08,b+0.24);
  }
  missImpact(){ this.tone(110,0.22,'sine',0.24,null,70); this.noise(0.14,0.18,500); }
  dummyHit(){ this.tone(760,0.1,'triangle',0.18,null,520); this.noise(0.04,0.16,2400); }
  traceRetry(){ this.ensureAudio(); this.tone(330,0.1,'sine',0.09); }
  victoryStinger(){ this.ensureAudio(); const b=this.ac?this.ac.currentTime:0; [523,659,784,1047].forEach((f,i)=>this.tone(f,0.3,'triangle',0.16,b+i*0.12)); }
  trophyStinger(){ this.ensureAudio(); const b=this.ac?this.ac.currentTime:0; [523,659,784,1047,1319].forEach((f,i)=>this.tone(f,0.34,'triangle',0.16,b+i*0.12)); this.tone(98,0.9,'sine',0.22,b+0.5); }
  defeatStinger(){ this.ensureAudio(); const b=this.ac?this.ac.currentTime:0; [440,392,330].forEach((f,i)=>this.tone(f,0.3,'sine',0.15,b+i*0.16)); }
  levelUnlockChime(){ this.ensureAudio(); const b=this.ac?this.ac.currentTime:0; [784,1047,1319].forEach((f,i)=>this.tone(f,0.22,'sine',0.12,b+i*0.07)); }
  pauseToggle(){ this.ensureAudio(); this.noise(0.18,0.1,900); }
  languageSwitchConfirm(){ this.ensureAudio(); const b=this.ac?this.ac.currentTime:0; this.tone(660,0.1,'sine',0.1,b); this.tone(880,0.12,'sine',0.1,b+0.09); }

  startMusic(kind){
    this.ensureAudio(); this.stopMusic(); if (!this.ac) return;
    this.musicKind = kind; let step = 0;
    const penta = [262,294,330,392,440];
    this.musicTimer = setInterval(() => {
      if (this.state.muted||this.state.paused) { step++; return; }
      const t = this.ac.currentTime;
      if (kind==='train'){
        const f = penta[step%penta.length]; this.tone(f,0.42,'sine',0.05,t);
        if (step%4===0) this.tone(f/2,0.5,'triangle',0.04,t);
      } else {
        this.noise(0.07,this.intensified?0.16:0.1,step%2?2600:900,t);
        if (step%2===0) this.tone(this.intensified?78:65,0.18,'sine',0.08,t);
        if (step%8===4) this.noise(0.1,0.12,400,t);
      }
      step++;
    }, kind==='train'?420:260);
  }
  stopMusic(){ if (this.musicTimer){ clearInterval(this.musicTimer); this.musicTimer=null; } this.intensified=false; }
  intensify(){ if (!this.intensified) this.intensified = true; }

  speakStrokeName(s){
    if (this.state.muted||!window.speechSynthesis) return;
    try{
      window.speechSynthesis.cancel();
      const lang = this.lang().voice;
      const text = this.written()==='english' ? s.t.english : s.t[this.written()];
      const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = 0.85;
      const vs = window.speechSynthesis.getVoices();
      const v = vs.find(x=>x.lang && x.lang.toLowerCase()===lang.toLowerCase()) || vs.find(x=>x.lang && x.lang.toLowerCase().startsWith(lang.slice(0,2)));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
  speakChar(ch){
    if (this.state.muted||!window.speechSynthesis) return;
    try{
      window.speechSynthesis.cancel(); const lang = this.lang().voice;
      const text = this.written()==='english' ? ch.en : (this.written()==='simplified' ? ch.t.simplified : ch.t.traditional);
      const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = 0.8;
      const vs = window.speechSynthesis.getVoices();
      const v = vs.find(x=>x.lang && x.lang.toLowerCase()===lang.toLowerCase()) || vs.find(x=>x.lang && x.lang.toLowerCase().startsWith(lang.slice(0,2)));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  // =========================================================
  //  GEOMETRY / VALIDATION
  // =========================================================
  resample(path,n){
    const pts = path.map(p=>({x:p[0],y:p[1]})); let total=0; const segs=[];
    for (let i=0;i<pts.length-1;i++){ const d=Math.hypot(pts[i+1].x-pts[i].x,pts[i+1].y-pts[i].y); segs.push(d); total+=d; }
    const out=[]; for (let k=0;k<=n;k++){ let dist=total*k/n,i=0; while(i<segs.length&&dist>segs[i]){ dist-=segs[i]; i++; } if (i>=segs.length) i=segs.length-1; const r=segs[i]?dist/segs[i]:0; out.push({x:pts[i].x+(pts[i+1].x-pts[i].x)*r,y:pts[i].y+(pts[i+1].y-pts[i].y)*r}); }
    return out;
  }
  coverage(samples,user,r){ let c=0; for (const s of samples){ for (const u of user){ if (Math.hypot(s.x-u.x,s.y-u.y)<=r){ c++; break; } } } return c/samples.length; }
  onPath(user,samples,r){ if (!user.length) return 0; let c=0; for (const u of user){ let m=1e9; for (const s of samples){ const d=Math.hypot(s.x-u.x,s.y-u.y); if (d<m) m=d; } if (m<=r) c++; } return c/user.length; }
  userNorm(){ return this.userPoints.map(p=>({x:p.x/440*100,y:p.y/440*100})); }
  startOK(user,start,r){ return user.length>0 && Math.hypot(user[0].x-start[0],user[0].y-start[1])<=r; }

  classifyL1(s){ const u=this.userNorm(); if (u.length<5) return false; const sm=this.resample(s.path,120);
    return this.coverage(sm,u,20)>=0.6 && this.onPath(u,sm,22)>=0.5 && this.startOK(u,s.path[0],28); }
  classifyL2(s){ const u=this.userNorm(); if (u.length<5) return 'bad'; const sm=this.resample(s.path,120);
    const okStart = this.startOK(u,s.path[0],28);
    if (this.coverage(sm,u,19)<0.55 || this.onPath(u,sm,20)<0.45 || !okStart) return 'bad';
    if (this.coverage(sm,u,8)>=0.88 && this.onPath(u,sm,9)>=0.74) return 'crit';
    return 'hit'; }
  strokeQuality(path){
    const u=this.userNorm(); if (u.length<5) return {pass:false,score:0};
    const sm=this.resample(path,120);
    const okStart=this.startOK(u,path[0],32);
    const cov=this.coverage(sm,u,20), onp=this.onPath(u,sm,22);
    const pass = cov>=0.5 && onp>=0.42 && okStart;
    const score = Math.min(this.coverage(sm,u,11), this.onPath(u,sm,12));
    return {pass,score};
  }

  // =========================================================
  //  CANVAS
  // =========================================================
  initCanvasForLevel(n){
    this.stopTick();
    const c = this.dom['l'+n].canvas;
    c.width = 440; c.height = 440;
    this.canvasEl = c; this.ctx = c.getContext('2d'); this.userPoints = [];
    if (n===1) this.beginL1();
    else if (n===2) this.beginL2();
    else if (n===3) this.beginL3();
    else if (n===4) this.beginL4();
    this.tickLoop();
  }
  stopTick(){ if (this.rafId){ cancelAnimationFrame(this.rafId); this.rafId=null; } this._last=null; }
  tickLoop = () => {
    const now = performance.now(); this._last = now;
    this.renderCanvas(now);
    const combatScreen = this.state.screen==='level2' || this.state.screen==='level4';
    if (combatScreen && !this.state.paused && this.combatActive){
      const dt = this._prevTick ? Math.min(0.05,(now-this._prevTick)/1000) : 0;
      this.combatTick(dt);
    }
    this._prevTick = now;
    this.rafId = requestAnimationFrame(this.tickLoop);
  };

  renderCanvas(now){
    const ctx = this.ctx; if (!ctx) return; ctx.clearRect(0,0,440,440);
    if (this.state.screen==='level3' || this.state.screen==='level4'){ this.renderCharCanvas(now); return; }
    const S = 440;
    if (this.activeStroke){
      const pts = this.activeStroke.path.map(p=>({x:p[0]/100*S,y:p[1]/100*S}));
      const guided = this.state.screen==='level1' && this.state.phase==='guided';
      if (guided){
        ctx.save(); ctx.setLineDash([5,12]); ctx.lineCap='round'; ctx.lineWidth=14; ctx.strokeStyle='rgba(184,134,42,0.55)';
        ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y); for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.stroke(); ctx.restore();
        const end=pts[pts.length-1], prev=pts[pts.length-2]; const a=Math.atan2(end.y-prev.y,end.x-prev.x);
        ctx.save(); ctx.fillStyle='rgba(192,57,43,0.8)'; ctx.translate(end.x,end.y); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-16,-9); ctx.lineTo(-16,9); ctx.closePath(); ctx.fill(); ctx.restore();
        const pr = 13+Math.sin(now/260)*4;
        ctx.beginPath(); ctx.arc(pts[0].x,pts[0].y,pr,0,7); ctx.fillStyle='rgba(192,57,43,0.85)'; ctx.fill();
        ctx.beginPath(); ctx.arc(pts[0].x,pts[0].y,5,0,7); ctx.fillStyle='#fff'; ctx.fill();
      } else {
        ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=16; ctx.strokeStyle='rgba(42,36,32,0.1)';
        ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y); for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.stroke(); ctx.restore();
        ctx.beginPath(); ctx.arc(pts[0].x,pts[0].y,8,0,7); ctx.fillStyle='rgba(192,57,43,0.5)'; ctx.fill();
      }
    }
    if (this.userPoints && this.userPoints.length>1){
      ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=this.brushW||13; ctx.strokeStyle='#2a2420';
      ctx.beginPath(); ctx.moveTo(this.userPoints[0].x,this.userPoints[0].y);
      for (let i=1;i<this.userPoints.length;i++) ctx.lineTo(this.userPoints[i].x,this.userPoints[i].y); ctx.stroke(); ctx.restore();
    }
  }
  renderCharCanvas(now){
    const ctx = this.ctx, S = 440; const ch = this.activeChar; if (!ch) return;
    const scale = p=>({x:p[0]/100*S,y:p[1]/100*S});
    const drawPath = (st) => { const pts=st.map(scale); ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y); for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.stroke(); };
    ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=17; ctx.strokeStyle='rgba(42,36,32,0.08)';
    ch.strokes.forEach(drawPath); ctx.restore();
    ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=15; ctx.strokeStyle='#2a2420';
    (this.completedStrokes||[]).forEach(drawPath); ctx.restore();
    const idx = this.state.charStrokeIndex; const cur = ch.strokes[idx];
    if (cur){
      const pts = cur.map(scale);
      ctx.save(); ctx.setLineDash([5,12]); ctx.lineCap='round'; ctx.lineWidth=13; ctx.strokeStyle='rgba(192,57,43,0.5)';
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y); for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.stroke(); ctx.restore();
      const end=pts[pts.length-1], prev=pts[pts.length-2]; const a=Math.atan2(end.y-prev.y,end.x-prev.x);
      ctx.save(); ctx.fillStyle='rgba(192,57,43,0.78)'; ctx.translate(end.x,end.y); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-15,-8); ctx.lineTo(-15,8); ctx.closePath(); ctx.fill(); ctx.restore();
      const pr = 12+Math.sin(now/260)*3;
      ctx.beginPath(); ctx.arc(pts[0].x,pts[0].y,pr,0,7); ctx.fillStyle='rgba(192,57,43,0.92)'; ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='bold 15px Fredoka, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(String(idx+1), pts[0].x, pts[0].y);
    }
    if (this.userPoints && this.userPoints.length>1){
      ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=this.brushW||13; ctx.strokeStyle='#2a2420';
      ctx.beginPath(); ctx.moveTo(this.userPoints[0].x,this.userPoints[0].y);
      for (let i=1;i<this.userPoints.length;i++) ctx.lineTo(this.userPoints[i].x,this.userPoints[i].y); ctx.stroke(); ctx.restore();
    }
  }
  ptFromEvent(e){ const r=e.currentTarget.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*440,y:(e.clientY-r.top)/r.height*440}; }
  onCanvasDown(e){
    if (this.locked||this.state.paused) return; if (this.drawing) return;
    e.preventDefault(); this.ensureAudio(); e.currentTarget.setPointerCapture(e.pointerId);
    this.activePointerId = e.pointerId; this.brushW = e.pointerType==='pen'?10:(e.pointerType==='mouse'?12:15);
    this.drawing = true; this.userPoints = [this.ptFromEvent(e)];
  }
  onCanvasMove(e){ if (!this.drawing||e.pointerId!==this.activePointerId) return; e.preventDefault(); this.userPoints.push(this.ptFromEvent(e)); }
  onCanvasUp(e){
    if (!this.drawing||e.pointerId!==this.activePointerId) return; e.preventDefault(); this.drawing = false;
    try{ e.currentTarget.releasePointerCapture(e.pointerId); }catch(_){}
    this.evaluate();
  }
  onCanvasCancel(){ this.drawing=false; this.activePointerId=null; this.userPoints=[]; }

  evaluate(){
    if (this.state.screen==='level1') this.evalL1();
    else if (this.state.screen==='level2') this.evalL2();
    else if (this.state.screen==='level3') this.evalL3();
    else if (this.state.screen==='level4') this.evalL4();
  }

  // =========================================================
  //  LEVEL 1 — foundation training
  // =========================================================
  beginL1(){ this.locked=false; this.userPoints=[]; this.activeStroke=STROKES[this.state.strokeIndex]; this.startMusic('train'); this.renderL1(); }
  evalL1(){
    const s=this.activeStroke; const pass=this.classifyL1(s);
    if (!pass){
      this.locked=true; this.traceRetry();
      setTimeout(() => { this.userPoints=[]; this.locked=false; this.state.phase='guided'; this.renderL1(); }, 650);
      return;
    }
    if (this.state.phase==='guided'){ this.pop(); this.userPoints=[]; this.state.phase='free'; this.renderL1(); return; }
    this.locked=true; this.dummyHit(); this.speakStrokeName(s);
    this.triggerAttack({avatarAnim:'strike',dummyAnim:'shake'});
    setTimeout(() => { this.state.avatarAnim=''; this.state.dummyAnim=''; this.renderL1(); }, 520);
    this.recordStroke(s.id,'hit');
    setTimeout(() => {
      const ni = this.state.strokeIndex+1;
      if (ni>=STROKES.length){ this.win(1); return; }
      this.userPoints=[]; this.activeStroke=STROKES[ni]; this.locked=false;
      this.state.strokeIndex=ni; this.state.phase='guided'; this.renderL1();
    }, 640);
  }

  // =========================================================
  //  LEVEL 2 — sparring match
  // =========================================================
  beginL2(){
    this.combatActive=true; this.combatLevel=2; this.avatarMax=20; this.oppMax=20;
    this.windupMs=0; this.windupFull=6000; this.timeLeft=90; this.locked=false; this.userPoints=[]; this.intensified=false;
    this.newPrompt(); this.startMusic('combat'); this.updateTimerEl(); this.updateRingEl(); this.renderL2();
  }
  newPrompt(){ const s=STROKES[Math.floor(Math.random()*STROKES.length)]; this.activeStroke=s; this.userPoints=[]; this.state.promptStrokeId=s.id; this.renderL2Prompt(); }
  combatTick(dt){
    this.timeLeft -= dt;
    if (this.timeLeft<=0){ this.timeLeft=0; this.updateTimerEl(); this.endCombatLoss(); return; }
    this.windupMs += dt*1000; if (this.windupMs>=this.windupFull) this.opponentAttack();
    this.updateTimerEl(); this.updateRingEl();
    const am=this.avatarMax||20, om=this.oppMax||20;
    if (this.state.avatarHP/am<0.3 || this.state.opponentHP/om<0.3) this.intensify();
  }
  updateTimerEl(){ const el = this.combatLevel===4?this.dom.l4.timer:this.dom.l2.timer; if (el) el.textContent = Math.ceil(this.timeLeft)+'s'; }
  updateRingEl(){
    const el = this.combatLevel===4?this.dom.l4.ring:this.dom.l2.ring; if (!el) return;
    const pct = Math.min(1,this.windupMs/this.windupFull); const C=339.29;
    el.setAttribute('stroke-dashoffset',(C*(1-pct)).toFixed(1));
    el.setAttribute('stroke', pct>0.66?'#c0392b':(pct>0.33?'#e8862a':'#e8b84a'));
  }
  evalL2(){
    if (this.locked) return; const s=this.activeStroke; const res=this.classifyL2(s);
    if (res==='bad'){ this.traceRetry(); this.recordStroke(s.id,'miss'); this.newPrompt(); return; }
    const crit = res==='crit'; const dmg = crit?2:1;
    this.locked=true; this.triggerBossBlock();
    if (crit){ this.criticalHit(); this.triggerAttack({avatarAnim:'crit',opponentAnim:'flinch'}); }
    else { this.hit(); this.triggerAttack({avatarAnim:'strike',opponentAnim:'flinch'}); }
    this.speakStrokeName(s); this.recordStroke(s.id,crit?'crit':'hit');
    this.windupMs=0; this.updateRingEl();
    const nh = Math.max(0,this.state.opponentHP-dmg);
    setTimeout(() => { this.state.avatarAnim=''; this.state.opponentAnim=''; this.renderCombatAnim(2); }, 520);
    this.state.opponentHP = nh; this.renderCombatHP(2);
    setTimeout(() => { if (nh<=0){ this.win(2); } else { this.locked=false; this.newPrompt(); } }, 560);
  }
  opponentAttack(){
    this.windupMs=0; this.updateRingEl(); if (this.locked) return; this.locked=true;
    this.missImpact();
    this.triggerBossAttack({opponentAnim:'strikeL',blocking:true});
    setTimeout(() => { this.state.blocking=false; this.renderCombatImgs(); }, 1000);
    const dmg = this.combatLevel===4?3:2;
    const nh = Math.max(0,this.state.avatarHP-dmg);
    setTimeout(() => {
      this.state.avatarAnim='hurt'; this.state.hurt=1; this.state.opponentAnim='';
      this.renderCombatAnim(this.combatLevel);
      setTimeout(() => { this.state.avatarAnim=''; this.state.hurt=0; this.renderCombatAnim(this.combatLevel); }, 420);
    }, 260);
    this.state.avatarHP = nh; this.renderCombatHP(this.combatLevel);
    setTimeout(() => {
      if (nh<=0){ this.endCombatLoss(); }
      else { this.locked=false; if (this.combatLevel===4) this.newCharL4(); else this.newPrompt(); }
    }, 780);
  }
  endCombatLoss(){ this.combatActive=false; this.defeat(this.combatLevel||2); }
  currentLevelNum(){ return {level1:1,level2:2,level3:3,level4:4}[this.state.screen] || 0; }
  renderActiveLevel(){
    const n = this.currentLevelNum();
    if (n===1) this.renderL1();
    else if (n===2) { this.renderCombatAnim(2); this.renderCombatImgs(); }
    else if (n===3) this.renderL3();
    else if (n===4) { this.renderCombatAnim(4); this.renderCombatImgs(); this.renderL4Char(); }
  }
  triggerAttack(extra){
    this.state.attacking=true; Object.assign(this.state, extra||{});
    this.renderActiveLevel();
    clearTimeout(this._atkT); this._atkT = setTimeout(() => { this.state.attacking=false; this.renderActiveLevel(); }, 1000);
  }
  triggerBossAttack(extra){
    this.state.bossAttacking=true; Object.assign(this.state, extra||{});
    this.renderCombatAnim(this.combatLevel); this.renderCombatImgs();
    clearTimeout(this._bAtkT); this._bAtkT = setTimeout(() => { this.state.bossAttacking=false; this.renderCombatImgs(); }, 1000);
  }
  triggerBossBlock(){
    this.state.bossBlocking=true; this.renderCombatImgs();
    clearTimeout(this._bBlkT); this._bBlkT = setTimeout(() => { this.state.bossBlocking=false; this.renderCombatImgs(); }, 1000);
  }

  // =========================================================
  //  LEVEL 3 — stroke-order sequence training
  // =========================================================
  beginL3(){
    this.locked=false; this.userPoints=[]; this.completedStrokes=[];
    this.activeChar = CHARS_L3[this.state.charIndex%CHARS_L3.length]; this.startMusic('train'); this.renderL3();
  }
  evalL3(){
    if (this.locked) return;
    const ch=this.activeChar; const idx=this.state.charStrokeIndex; const stroke=ch.strokes[idx];
    const q = this.strokeQuality(stroke);
    if (!q.pass){ this.traceRetry(); this.userPoints=[]; return; }
    this.pop(); this.completedStrokes.push(stroke); this.userPoints=[];
    const ni = idx+1;
    if (ni<ch.strokes.length){ this.state.charStrokeIndex=ni; this.renderL3Dots(); return; }
    this.locked=true; this.dummyHit(); this.speakChar(ch); this.recordChar(ch,'hit');
    this.triggerAttack({avatarAnim:'strike',dummyAnim:'shake',charStrokeIndex:ni});
    this.renderL3Dots();
    setTimeout(() => { this.state.avatarAnim=''; this.state.dummyAnim=''; this.renderL3(); }, 520);
    setTimeout(() => {
      const nc = this.state.charIndex+1;
      if (nc>=CHARS_L3.length){ this.win(3); return; }
      this.completedStrokes=[]; this.userPoints=[]; this.activeChar=CHARS_L3[nc]; this.locked=false;
      this.state.charIndex=nc; this.state.charStrokeIndex=0; this.renderL3();
    }, 720);
  }

  // =========================================================
  //  LEVEL 4 — full-character combat
  // =========================================================
  beginL4(){
    this.combatActive=true; this.combatLevel=4; this.avatarMax=20; this.oppMax=24;
    this.windupMs=0; this.windupFull=9000; this.timeLeft=99; this.locked=false; this.userPoints=[]; this.completedStrokes=[]; this.intensified=false;
    this.newCharL4(); this.startMusic('combat'); this.updateTimerEl(); this.updateRingEl(); this.renderL4();
  }
  newCharL4(){
    const pool=CHARS_L4; let ch=pool[Math.floor(Math.random()*pool.length)];
    if (this.activeChar && pool.length>1){ let g=0; while(ch===this.activeChar && g<6){ ch=pool[Math.floor(Math.random()*pool.length)]; g++; } }
    this.activeChar=ch; this.completedStrokes=[]; this.userPoints=[]; this.charScoreSum=0; this.charScoreN=0;
    this.state.charStrokeIndex=0; this.renderL4Char();
  }
  evalL4(){
    if (this.locked||!this.combatActive) return;
    const ch=this.activeChar; const idx=this.state.charStrokeIndex; const stroke=ch.strokes[idx];
    const q = this.strokeQuality(stroke);
    if (!q.pass){ this.traceRetry(); this.userPoints=[]; return; }
    this.pop(); this.completedStrokes.push(stroke); this.charScoreSum+=q.score; this.charScoreN++; this.userPoints=[];
    const ni = idx+1;
    if (ni<ch.strokes.length){ this.state.charStrokeIndex=ni; this.renderL4Char(); return; }
    const avg = this.charScoreN?this.charScoreSum/this.charScoreN:0; const crit = avg>=0.72; const dmg = crit?2:1;
    this.locked=true; this.triggerBossBlock();
    if (crit){ this.criticalHit(); this.triggerAttack({avatarAnim:'crit',opponentAnim:'flinch',charStrokeIndex:ni}); }
    else { this.hit(); this.triggerAttack({avatarAnim:'strike',opponentAnim:'flinch',charStrokeIndex:ni}); }
    this.renderL4Char();
    this.speakChar(ch); this.recordChar(ch,crit?'crit':'hit');
    this.windupMs=0; this.updateRingEl();
    const nh = Math.max(0,this.state.opponentHP-dmg);
    setTimeout(() => { this.state.avatarAnim=''; this.state.opponentAnim=''; this.renderCombatAnim(4); }, 520);
    this.state.opponentHP = nh; this.renderCombatHP(4);
    setTimeout(() => { if (nh<=0){ this.win(4); } else { this.locked=false; this.newCharL4(); } }, 600);
  }

  // =========================================================
  //  METRICS
  // =========================================================
  recordStroke(id,kind){ const m=this.parentMetrics.strokes[id]||{hits:0,crits:0,misses:0}; if (kind==='crit') m.crits++; else if (kind==='hit') m.hits++; else m.misses++; this.parentMetrics.strokes[id]=m; }
  recordChar(ch,kind){ const id='char_'+ch.en; const m=this.parentMetrics.strokes[id]||{hits:0,crits:0,misses:0}; if (kind==='crit') m.crits++; else if (kind==='hit') m.hits++; else m.misses++; this.parentMetrics.strokes[id]=m; }

  // =========================================================
  //  NAVIGATION
  // =========================================================
  enterLevel(n){
    this.ensureAudio(); this.pop(); this.stopTick();
    if (n===1){ this.combatActive=false; Object.assign(this.state,{screen:'level1',paused:false,strokeIndex:0,phase:'guided',avatarAnim:'',dummyAnim:''}); }
    else if (n===2){ this.combatLevel=2; this.avatarMax=20; this.oppMax=20; Object.assign(this.state,{screen:'level2',paused:false,avatarHP:20,opponentHP:20,avatarAnim:'',opponentAnim:'',hurt:0,promptStrokeId:null}); }
    else if (n===3){ this.combatActive=false; Object.assign(this.state,{screen:'level3',paused:false,charIndex:0,charStrokeIndex:0,avatarAnim:'',dummyAnim:''}); }
    else if (n===4){ this.combatLevel=4; this.avatarMax=20; this.oppMax=24; Object.assign(this.state,{screen:'level4',paused:false,avatarHP:20,opponentHP:24,charStrokeIndex:0,avatarAnim:'',opponentAnim:'',hurt:0}); }
    this.showScreen();
    this.initCanvasForLevel(n);
  }
  win(level){
    this.stopTick(); this.stopMusic(); this.combatActive=false;
    const won = this.state.levelsWon.includes(level) ? this.state.levelsWon : [...this.state.levelsWon, level];
    this.parentMetrics.levels[level] = this.parentMetrics.levels[level] || {wins:0,attempts:0}; this.parentMetrics.levels[level].wins++;
    if (level>=4) this.trophyStinger(); else this.victoryStinger();
    this.state.screen='win'; this.state.winLevel=level; this.state.levelsWon=won; this.state.paused=false;
    this.persist(); this.showScreen(); this.renderWin();
  }
  defeat(level){
    this.stopTick(); this.stopMusic(); this.combatActive=false; this.defeatStinger();
    this.state.screen='defeat'; this.state.defeatLevel=level; this.state.paused=false;
    this.showScreen(); this.renderDefeat();
  }
  goHome(){
    this.stopTick(); this.stopMusic(); this.combatActive=false; this.pop();
    const ju = this.state.justUnlocked;
    this.state.screen='home'; this.state.paused=false; this.state.justUnlocked=0;
    this.showScreen(); this.renderHomeTiles(); this.renderPause();
    if (ju) setTimeout(() => this.levelUnlockChime(), 250);
  }
  proceedNext(){ const next=this.state.winLevel+1; if (next>=2 && next<=4) this.enterLevel(next); else this.goHome(); }
  retry(){ this.pop(); this.enterLevel(this.state.defeatLevel); }
  togglePause(){ this.ensureAudio(); this.pauseToggle(); this.state.paused=!this.state.paused; this.renderPause(); }
  resume(){ this.pauseToggle(); this.state.paused=false; this.renderPause(); }
  toggleMute(){ this.ensureAudio(); this.state.muted=!this.state.muted; this.applyMute(); this.persist(); this.updateSoundButtons(); }
  setLang(id){ this.ensureAudio(); this.state.langId=id; this.state.langMenuOpen=false; this.languageSwitchConfirm(); this.persist(); this.renderLangUI(); this.renderAllTexts(); }
  toggleLangMenu(){ this.ensureAudio(); this.pop(); this.state.langMenuOpen=!this.state.langMenuOpen; this.renderLangUI(); }

  showScreen(){
    const sc = this.state.screen;
    for (const key of Object.keys(this.dom.screens)){
      this.dom.screens[key].hidden = !(key===sc);
    }
  }

  // =========================================================
  //  RENDER HELPERS
  // =========================================================
  hpStyle(hp,max){ const m=max||20; const pct=Math.max(0,hp/m*100); const col = pct>50?'#5ba85a':(pct>25?'#e8b84a':'#c0392b'); return {width:pct+'%',background:col}; }
  damageFilter(hp,max){ const m=max||20; const r=hp/m; if (r>0.66) return 'none'; if (r>0.33) return 'brightness(0.86) sepia(0.2)'; return 'brightness(0.7) sepia(0.45) saturate(1.3)'; }
  animName(name){ const map={strike:'kfStrikeR .5s cubic-bezier(.3,.7,.3,1)',crit:'kfCritR .6s cubic-bezier(.3,.7,.3,1)',hurt:'kfHurt .42s ease',shake:'kfShake .5s ease',flinch:'kfFlinch .42s ease',strikeL:'kfStrikeL .5s cubic-bezier(.3,.7,.3,1)'};
    return (name && map[name]) ? map[name] : 'kfIdle 2.8s ease-in-out infinite'; }
  oppAnimName(name){ const map={flinch:'kfFlinch .42s ease',strikeL:'kfStrikeL .5s cubic-bezier(.3,.7,.3,1)'}; return (name && map[name]) ? map[name] : ''; }
  strokeDotsHtml(ch,idx){
    if (!ch) return '';
    return ch.strokes.map((_,i) => {
      const done=i<idx, cur=i===idx;
      const cls = done?'dot dot-done':(cur?'dot dot-current':'dot dot-pending');
      return `<div class="${cls}">${i+1}</div>`;
    }).join('');
  }

  renderLoading(){
    const pct = Math.round((this.state.loadProgress||0)*100);
    this.dom.loadBar.style.width = pct+'%';
    this.dom.loadPct.textContent = pct+'%';
  }
  renderRotateBanner(){
    this.dom.rotateBanner.hidden = !this.state.showRotate;
    this.dom.rotateText.textContent = this.L('rotate');
  }
  updateSoundButtons(){
    const icon = this.state.muted?'🔇':'🔊';
    const label = this.L('soundOn');
    this.dom.btnMute.textContent = `${icon} ${label}`;
    this.dom.btnMute.setAttribute('aria-label', label);
    for (const p of ['l1','l2','l3','l4']){ this.dom[p].mute.textContent = icon; this.dom[p].mute.setAttribute('aria-label', label); }
  }
  renderLangUI(){
    const cur = this.lang();
    this.dom.langCurrentLabel.textContent = cur.label;
    this.dom.btnLang.setAttribute('aria-expanded', String(this.state.langMenuOpen));
    this.dom.langChevron.style.transform = this.state.langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    this.dom.langMenu.hidden = !this.state.langMenuOpen;
    this.dom.langMenu.innerHTML = '';
    LANGS.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'lang-menu-btn' + (l.id===this.state.langId ? ' active' : '');
      btn.textContent = l.label;
      btn.setAttribute('aria-label', l.label);
      btn.addEventListener('click', () => this.setLang(l.id));
      this.dom.langMenu.appendChild(btn);
    });
    // pause overlay language grid
    this.dom.pauseLangGrid.innerHTML = '';
    LANGS.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'pause-lang-btn' + (l.id===this.state.langId ? ' active' : '');
      btn.textContent = l.label;
      btn.addEventListener('click', () => this.setLang(l.id));
      this.dom.pauseLangGrid.appendChild(btn);
    });
  }
  renderHomeTiles(){
    const won = this.state.levelsWon;
    const unlocked = {1:true,2:won.includes(1),3:won.includes(2),4:won.includes(3)};
    const lockKey = {2:'locked2',3:'locked3',4:'locked4'};
    this.dom.homeTiles.innerHTML = '';
    [1,2,3,4].forEach(n => {
      const isUnlocked = unlocked[n]; const locked = !isUnlocked;
      const btn = document.createElement('button');
      btn.className = 'tile-btn';
      btn.style.animation = `kfCardFloat ${3.6+n*0.25}s ease-in-out ${n*0.3}s infinite`;
      btn.style.cursor = isUnlocked ? 'pointer' : 'default';
      const name1 = `第${CN[n-1]}關 · ${this.levelName(n)}`;
      btn.setAttribute('aria-label', name1);
      const img = document.createElement('img');
      img.className = 'tile-img ' + (isUnlocked?'unlocked':'locked');
      img.draggable = false;
      img.src = ASSET(`Home_level_${n}_button.png`);
      img.alt = name1;
      btn.appendChild(img);
      if (locked){
        const lockDiv = document.createElement('div');
        lockDiv.className = 'tile-lock';
        lockDiv.innerHTML = `<svg viewBox="0 0 28 30"><path d="M8 13 V9 a6 6 0 0 1 12 0 V13" fill="none" stroke="#f5e6c8" stroke-width="3"/><rect x="5" y="13" width="18" height="14" rx="3" fill="#f5e6c8"/><circle cx="14" cy="19" r="2.4" fill="#5e3a1a"/></svg><span>${this.L(lockKey[n])}</span>`;
        btn.appendChild(lockDiv);
      }
      btn.addEventListener('click', () => { if (isUnlocked) this.enterLevel(n); else this.pop(); });
      this.dom.homeTiles.appendChild(btn);
    });
  }

  renderPause(){
    const active = this.state.paused && ['level1','level2','level3','level4'].includes(this.state.screen);
    this.dom.overlayPause.hidden = !active;
    this.dom.pauseTitle.textContent = this.L('pause');
    this.dom.pauseHint.textContent = this.L('pauseHint');
    this.dom.btnResume.textContent = this.L('resume');
    this.dom.btnPauseHome.textContent = this.L('home');
  }

  renderL1(){
    const d = this.dom.l1;
    d.progress.textContent = `${this.L('strokeWord')} ${Math.min(this.state.strokeIndex+1,8)}/8`;
    d.guide.textContent = this.state.phase==='guided' ? this.L('guided') : this.L('free');
    const s = STROKES[this.state.strokeIndex];
    d.strokeMain.textContent = this.strokeName(s);
    d.strokeSub.textContent = s.py;
    d.avatarBox.style.animation = this.animName(this.state.avatarAnim);
    d.dummyBox.style.animation = this.animName(this.state.dummyAnim==='shake'?'shake':'');
    this.renderPracticeImg();
  }
  renderL3(){
    const d = this.dom.l3;
    const ch = CHARS_L3[this.state.charIndex%CHARS_L3.length];
    d.progress.textContent = `${this.L('charWord')} ${Math.min(this.state.charIndex+1,CHARS_L3.length)}/${CHARS_L3.length}`;
    d.guide.textContent = this.L('l3Guide');
    d.charMain.textContent = this.charText(ch);
    d.py.textContent = ch.py;
    d.meaning.textContent = ch.en;
    d.orderLabel.textContent = this.L('strokeOrder');
    d.avatarBox.style.animation = this.animName(this.state.avatarAnim);
    d.dummyBox.style.animation = this.animName(this.state.dummyAnim==='shake'?'shake':'');
    this.renderPracticeImg();
    this.renderL3Dots();
  }
  renderPracticeImg(){
    const practiceSrc = ASSET(this.state.attacking?'Character_Attack.png':'Character_Stand.png');
    this.dom.l1.practiceImg.src = practiceSrc;
    this.dom.l3.practiceImg.src = practiceSrc;
  }
  renderL3Dots(){
    const ch = CHARS_L3[this.state.charIndex%CHARS_L3.length];
    this.dom.l3.dots.innerHTML = this.strokeDotsHtml(ch, this.state.charStrokeIndex);
  }

  renderL2(){
    const d = this.dom.l2;
    d.avatarLabel.textContent = this.L('avatar');
    d.oppLabel.textContent = this.L('master');
    d.guide.textContent = this.L('l2Guide');
    this.renderCombatHP(2);
    this.renderCombatAnim(2);
    this.renderCombatImgs();
    this.renderL2Prompt();
  }
  renderL2Prompt(){
    const s = STROKES.find(x=>x.id===this.state.promptStrokeId);
    this.dom.l2.promptMain.textContent = s ? this.strokeName(s) : '';
  }
  renderL4(){
    const d = this.dom.l4;
    d.avatarLabel.textContent = this.L('avatar');
    d.oppLabel.textContent = this.L('grandmaster');
    d.guide.textContent = this.L('l4Guide');
    d.promptLabel.textContent = this.L('writePrompt');
    this.renderCombatHP(4);
    this.renderCombatAnim(4);
    this.renderCombatImgs();
    this.renderL4Char();
  }
  renderL4Char(){
    const ch = this.activeChar;
    this.dom.l4.charMain.textContent = ch ? this.charText(ch) : '';
    this.dom.l4.py.textContent = ch ? ch.py : '';
    this.dom.l4.dots.innerHTML = this.strokeDotsHtml(ch, this.state.charStrokeIndex);
  }
  renderCombatHP(level){
    const d = level===4?this.dom.l4:this.dom.l2;
    const aStyle = this.hpStyle(this.state.avatarHP,this.avatarMax); const oStyle = this.hpStyle(this.state.opponentHP,this.oppMax);
    d.avatarHpFill.style.width = aStyle.width; d.avatarHpFill.style.background = aStyle.background;
    d.oppHpFill.style.width = oStyle.width; d.oppHpFill.style.background = oStyle.background;
    d.avatarHpText.textContent = `${this.state.avatarHP}/${this.avatarMax||20}`;
    d.oppHpText.textContent = `${this.state.opponentHP}/${this.oppMax||20}`;
    d.avatarBox.style.filter = this.damageFilter(this.state.avatarHP,this.avatarMax);
    d.oppBox.style.filter = this.damageFilter(this.state.opponentHP,this.oppMax);
    d.hurtFlash.style.opacity = this.state.hurt ? '0.4' : '0';
  }
  renderCombatAnim(level){
    const d = level===4?this.dom.l4:this.dom.l2;
    d.avatarBox.style.animation = this.animName(this.state.avatarAnim);
    const oppAnim = this.oppAnimName(this.state.opponentAnim);
    d.oppBox.style.animation = oppAnim;
    d.hurtFlash.style.opacity = this.state.hurt ? '0.4' : '0';
  }
  renderCombatImgs(){
    const playerSrc = ASSET(this.state.blocking?'Character_Block.png':(this.state.attacking?'Character_Attack.png':'Character_Stand.png'));
    this.dom.l2.playerImg.src = playerSrc; this.dom.l4.playerImg.src = playerSrc;
    this.dom.l2.monkImg.src = ASSET(this.state.bossBlocking?'Monk_Block.png':(this.state.bossAttacking?'Monk_Punch.png':'Monk_Stand.png'));
    this.dom.l4.bossImg.src = ASSET(this.state.bossBlocking?'Boss_Block.png':(this.state.bossAttacking?'Boss_Attack.png':'Boss_Stand.png'));
  }

  renderWin(){
    const winLvl = this.state.winLevel; const w = this.written();
    const isTrophy = winLvl>=4;
    this.dom.winImg.src = ASSET(isTrophy?'Character_Winning_2.png':'Character_Winning_1.png');
    this.dom.winTitle.textContent = isTrophy?this.L('trophy'):this.L('victory');
    const winLevelLine = w==='english' ? `${LEVELS[winLvl].name.english} Complete` : `${this.L('complete')}第${CN[winLvl-1]}關：${this.levelName(winLvl)}`;
    this.dom.winSub.textContent = winLevelLine;
    const hasNext = winLvl>=1 && winLvl<4;
    this.dom.btnProceed.hidden = !hasNext;
    this.dom.btnProceed.textContent = this.L('proceed');
    this.dom.btnWinHome.textContent = this.L('home');
    // confetti
    this.dom.winConfetti.innerHTML = '';
    const colors = ['#e8b84a','#c0392b','#4a9878','#f5e6c8'];
    for (let i=0;i<40;i++){
      const div = document.createElement('div');
      div.className = 'confetti-piece';
      div.style.left = (Math.random()*100)+'%';
      div.style.height = (10+Math.random()*8)+'px';
      div.style.background = colors[i%4];
      div.style.animationDuration = (1.8+Math.random()*1.6)+'s';
      div.style.animationDelay = (Math.random()*0.7)+'s';
      this.dom.winConfetti.appendChild(div);
    }
  }
  renderDefeat(){
    this.dom.defeatTitle.textContent = this.L('keep');
    this.dom.defeatSub.textContent = this.L('keepSub');
    this.dom.btnRetry.textContent = this.L('retry');
    this.dom.btnDefeatHome.textContent = this.L('home');
  }

  renderAllTexts(){
    // re-render whatever is currently visible so language switches take effect immediately
    this.renderHomeTiles();
    const sc = this.state.screen;
    if (sc==='level1') this.renderL1();
    else if (sc==='level2') this.renderL2();
    else if (sc==='level3') this.renderL3();
    else if (sc==='level4') this.renderL4();
    else if (sc==='win') this.renderWin();
    else if (sc==='defeat') this.renderDefeat();
    this.renderPause();
    this.renderRotateBanner();
  }

  renderHome(){
    this.showScreen();
    this.renderHomeTiles();
  }
}

document.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });

})();
