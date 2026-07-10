/* ============================================================
   Innovation Marketplace — إعدادات الاتصال بقاعدة البيانات
   ============================================================
   عدّل القيمتين التاليتين ببيانات مشروعك في Supabase
   (Project Settings → API)
   إن تُركتا فارغتين، يعمل الموقع تلقائياً في "وضع العرض التجريبي"
   (بيانات وهمية محفوظة في الذاكرة فقط، لتجربة الموقع قبل الربط).
   ============================================================ */
const SUPABASE_URL = "https://oskafesmbjxjbanrmurn.supabase.co";      // مثال: https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_r9f4t3k-SW6NTYEv8bS3UQ_floV4BxH";  // مفتاح anon public

const DEMO_MODE = !SUPABASE_URL || !SUPABASE_ANON_KEY;

/* ---------- تهيئة Supabase (عند توفر الإعدادات) ---------- */
let supabaseClient = null;
if (!DEMO_MODE) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ============================================================
   وضع العرض التجريبي — مخزن بيانات وهمي في المتصفح
   ============================================================ */
const DEMO_SEED_COMPANIES = [
  { id:"c1", name:"Green Energy", sector:"الطاقة", emoji:"🌞",
    team_members:"سارة العتيبي، فيصل القحطاني، نورة الدوسري",
    problem:"ارتفاع فاقد الطاقة في المباني السكنية القديمة بسبب ضعف العزل والمراقبة.",
    solution:"نظام استشعار ذكي يراقب استهلاك الطاقة لحظياً ويقترح تعديلات تلقائية لتقليل الفاقد.",
    value_prop:"خفض فاتورة الكهرباء حتى 30% دون تدخل يدوي من المستخدم.",
    video_url:"", booth_number:"A1" },
  { id:"c2", name:"Med AI", sector:"الصحة", emoji:"🩺",
    team_members:"عبدالله المطيري، ريم الشمري",
    problem:"تأخر تشخيص أمراض الشبكية لدى مرضى السكري في المناطق النائية.",
    solution:"نموذج ذكاء اصطناعي يحلل صور قاع العين ويصدر تقرير أولي خلال ثوانٍ.",
    value_prop:"تقليل زمن الكشف المبكر من أسابيع إلى دقائق بدقة تفوق 90%.",
    video_url:"", booth_number:"A2" },
  { id:"c3", name:"Smart Farm", sector:"الزراعة", emoji:"🌱",
    team_members:"خالد الحربي، منى العنزي، تركي الرشيدي",
    problem:"هدر كبير في مياه الري بالمزارع الصغيرة بسبب الجدولة اليدوية.",
    solution:"وحدة ري ذكية تعتمد على رطوبة التربة الفعلية وتوقعات الطقس.",
    value_prop:"توفير يصل إلى 40% من استهلاك المياه في الموسم الواحد.",
    video_url:"", booth_number:"B1" },
  { id:"c4", name:"EduPath", sector:"التعليم", emoji:"🎓",
    team_members:"لمى الغامدي، ياسر السبيعي",
    problem:"صعوبة تحديد المسار التعليمي المناسب لكل طالب حسب قدراته الفعلية.",
    solution:"منصة تقيّم مهارات الطالب وتبني له خطة تعلم تكيفية أسبوعية.",
    value_prop:"رفع نسبة إكمال المسارات التعليمية بنسبة 25%.",
    video_url:"", booth_number:"B2" },
  { id:"c5", name:"LogiTrack", sector:"اللوجستيات", emoji:"📦",
    team_members:"بندر العصيمي، هند الزهراني",
    problem:"ضعف تتبع الشحنات الداخلية بين فروع الشركات الصغيرة.",
    solution:"نظام تتبع لحظي بالباركود يعمل بدون اتصال إنترنت دائم.",
    value_prop:"تقليل الشحنات المفقودة أو المتأخرة بنسبة 50%.",
    video_url:"", booth_number:"C1" }
];

function loadDemoStore(){
  const raw = window.__IM_DEMO_STORE__;
  if (raw) return raw;
  const store = {
    event_state: { phase: "explore", investor_budget: 5000 },
    companies: JSON.parse(JSON.stringify(DEMO_SEED_COMPANIES)),
    investors: [],
    visits: [],
    watchlist: [],
    evaluations: []
  };
  window.__IM_DEMO_STORE__ = store;
  return store;
}
const demoStore = DEMO_MODE ? loadDemoStore() : null;

function uid(){ return 'id-' + Math.random().toString(36).slice(2,10); }

/* ============================================================
   طبقة بيانات موحّدة — تعمل فوق Supabase أو وضع العرض التجريبي
   ============================================================ */
const DB = {
  async getPhase(){
    if (DEMO_MODE) return demoStore.event_state.phase;
    const { data, error } = await supabaseClient.from('event_state').select('phase').eq('id',1).single();
    if (error) throw error;
    return data?.phase || 'explore';
  },
  async setPhase(phase){
    if (DEMO_MODE){ demoStore.event_state.phase = phase; return; }
    const { error } = await supabaseClient.from('event_state').update({ phase, updated_at: new Date().toISOString() }).eq('id',1);
    if (error) throw error;
  },
  async getBudget(){
    if (DEMO_MODE) return demoStore.event_state.investor_budget ?? 5000;
    const { data, error } = await supabaseClient.from('event_state').select('investor_budget').eq('id',1).single();
    if (error) throw error;
    return data?.investor_budget ?? 5000;
  },
  async setBudget(amount){
    amount = Math.max(0, parseInt(amount) || 0);
    if (DEMO_MODE){ demoStore.event_state.investor_budget = amount; return; }
    const { error } = await supabaseClient.from('event_state').update({ investor_budget: amount, updated_at: new Date().toISOString() }).eq('id',1);
    if (error) throw error;
  },
  onPhaseChange(cb){
    let lastPhase = null;
    const maybeNotify = (p)=>{ if (p !== lastPhase){ lastPhase = p; cb(p); } };
    if (DEMO_MODE){ setInterval(()=>maybeNotify(demoStore.event_state.phase), 1500); return; }
    supabaseClient.channel('event_state_ch')
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'event_state' }, payload=>{
        maybeNotify(payload.new.phase);
      }).subscribe();
    setInterval(async ()=>{ try{ maybeNotify(await DB.getPhase()); }catch(err){ /* يُعاد المحاولة في الدورة التالية */ } }, 4000);
  },

  async getCompanies(){
    if (DEMO_MODE) return demoStore.companies;
    const { data, error } = await supabaseClient.from('companies').select('*').order('created_at');
    if (error) throw error;
    return data || [];
  },
  async addCompany(c){
    if (DEMO_MODE){ c.id = uid(); demoStore.companies.push(c); return c; }
    const { data, error } = await supabaseClient.from('companies').insert(c).select().single();
    if (error) throw error;
    return data;
  },
  async deleteCompany(id){
    if (DEMO_MODE){ demoStore.companies = demoStore.companies.filter(c=>c.id!==id); return; }
    const { error } = await supabaseClient.from('companies').delete().eq('id', id);
    if (error) throw error;
  },

  /* ============================================================
     تسجيل الشركات الذاتي — بواسطة فريق الشركة نفسه، بدون لوحة تحكم
     محمي برمز وصول يختاره الفريق؛ يُقارن داخل قاعدة البيانات فقط
     ============================================================ */
  async registerCompany(fields, accessCode){
    accessCode = String(accessCode).trim();
    if (!accessCode) throw new Error('الرجاء اختيار رمز وصول');
    if (DEMO_MODE){
      const id = uid();
      const co = { id, ...fields, access_code: accessCode };
      demoStore.companies.push(co);
      return { id, name: co.name };
    }
    const { data, error } = await supabaseClient.rpc('register_company', {
      p_name: fields.name, p_sector: fields.sector||'', p_emoji: fields.emoji||'',
      p_team_members: fields.team_members||'', p_problem: fields.problem||'',
      p_solution: fields.solution||'', p_value_prop: fields.value_prop||'',
      p_video_url: fields.video_url||'', p_booth_number: fields.booth_number||'',
      p_access_code: accessCode
    });
    if (error) throw error;
    return data && data[0];
  },
  async verifyCompanyAccess(name, accessCode){
    name = String(name).trim();
    accessCode = String(accessCode).trim();
    if (DEMO_MODE){
      const co = demoStore.companies.find(c=>c.name.trim().toLowerCase()===name.toLowerCase() && c.access_code===accessCode);
      return co ? { id: co.id, name: co.name } : null;
    }
    const { data, error } = await supabaseClient.rpc('verify_company_access', { p_name: name, p_access_code: accessCode });
    if (error) throw error;
    return (data && data[0]) || null;
  },
  async updateCompanyProfile(companyId, accessCode, fields){
    accessCode = String(accessCode).trim();
    if (DEMO_MODE){
      const co = demoStore.companies.find(c=>c.id===companyId && c.access_code===accessCode);
      if (!co) throw new Error('رمز الوصول غير صحيح');
      Object.assign(co, fields);
      return;
    }
    const { error } = await supabaseClient.rpc('update_company_profile', {
      p_company_id: companyId, p_access_code: accessCode,
      p_sector: fields.sector||'', p_emoji: fields.emoji||'', p_team_members: fields.team_members||'',
      p_problem: fields.problem||'', p_solution: fields.solution||'', p_value_prop: fields.value_prop||'',
      p_video_url: fields.video_url||'', p_booth_number: fields.booth_number||''
    });
    if (error) throw error;
  },

  async createInvestor(name, username, password){
    username = String(username).trim().toLowerCase();
    password = String(password).trim();
    if (DEMO_MODE){
      if (demoStore.investors.find(i=>i.username===username)) throw new Error('اسم المستخدم مستخدم مسبقاً');
      const inv = { id: uid(), name, username, password };
      demoStore.investors.push(inv);
      return { id: inv.id, name: inv.name, username: inv.username };
    }
    const { data, error } = await supabaseClient.rpc('create_investor', { p_name: name, p_username: username, p_password: password });
    if (error) throw error;
    return data && data[0];
  },
  async verifyInvestor(username, password){
    username = String(username).trim().toLowerCase();
    password = String(password).trim();
    if (DEMO_MODE){
      const inv = demoStore.investors.find(i=>i.username===username && i.password===password);
      return inv ? { id: inv.id, name: inv.name } : null;
    }
    const { data, error } = await supabaseClient.rpc('verify_investor', { p_username: username, p_password: password });
    if (error) throw error;
    return (data && data[0]) || null;
  },
  async adminCount(){
    if (DEMO_MODE) return demoStore.admins ? demoStore.admins.length : 0;
    const { data, error } = await supabaseClient.rpc('admin_count');
    if (error) throw error;
    return data || 0;
  },
  async createAdmin(username, password){
    username = String(username).trim().toLowerCase();
    password = String(password).trim();
    if (DEMO_MODE){
      demoStore.admins = demoStore.admins || [];
      if (demoStore.admins.find(a=>a.username===username)) throw new Error('اسم المستخدم مستخدم مسبقاً');
      demoStore.admins.push({ id: uid(), username, password });
      return { username };
    }
    const { data, error } = await supabaseClient.rpc('create_admin', { p_username: username, p_password: password });
    if (error) throw error;
    return data && data[0];
  },
  async verifyAdmin(username, password){
    username = String(username).trim().toLowerCase();
    password = String(password).trim();
    if (DEMO_MODE){
      demoStore.admins = demoStore.admins || [];
      const a = demoStore.admins.find(a=>a.username===username && a.password===password);
      return a ? { id: a.id, username: a.username } : null;
    }
    const { data, error } = await supabaseClient.rpc('verify_admin', { p_username: username, p_password: password });
    if (error) throw error;
    return (data && data[0]) || null;
  },

  async addVisit(investor_id, company_id){
    if (DEMO_MODE){
      if (!demoStore.visits.find(v=>v.investor_id===investor_id && v.company_id===company_id))
        demoStore.visits.push({ id:uid(), investor_id, company_id, visited_at:new Date().toISOString(), notes:null });
      return;
    }
    const { error } = await supabaseClient.from('visits').upsert({ investor_id, company_id }, { onConflict:'investor_id,company_id' });
    if (error) throw error;
  },
  async setVisitNotes(investor_id, company_id, notes){
    notes = (notes||'').trim() || null;
    if (DEMO_MODE){
      const v = demoStore.visits.find(v=>v.investor_id===investor_id && v.company_id===company_id);
      if (v) v.notes = notes;
      return;
    }
    const { error } = await supabaseClient.from('visits').update({ notes }).match({ investor_id, company_id });
    if (error) throw error;
  },
  async getVisits(investor_id){
    if (DEMO_MODE) return demoStore.visits.filter(v=>v.investor_id===investor_id);
    const { data, error } = await supabaseClient.from('visits').select('*').eq('investor_id', investor_id);
    if (error) throw error;
    return data || [];
  },
  async getAllVisits(){
    if (DEMO_MODE) return demoStore.visits;
    const { data, error } = await supabaseClient.from('visits').select('*');
    if (error) throw error;
    return data || [];
  },

  async toggleWatch(investor_id, company_id, on){
    if (DEMO_MODE){
      demoStore.watchlist = demoStore.watchlist.filter(w=>!(w.investor_id===investor_id && w.company_id===company_id));
      if (on) demoStore.watchlist.push({ id:uid(), investor_id, company_id });
      return;
    }
    if (on){
      const { error } = await supabaseClient.from('watchlist').upsert({ investor_id, company_id }, { onConflict:'investor_id,company_id' });
      if (error) throw error;
    }else{
      const { error } = await supabaseClient.from('watchlist').delete().match({ investor_id, company_id });
      if (error) throw error;
    }
  },
  async getWatchlist(investor_id){
    if (DEMO_MODE) return demoStore.watchlist.filter(w=>w.investor_id===investor_id);
    const { data, error } = await supabaseClient.from('watchlist').select('*').eq('investor_id', investor_id);
    if (error) throw error;
    return data || [];
  },

  async submitEvaluation(ev){
    if (DEMO_MODE){
      demoStore.evaluations = demoStore.evaluations.filter(e=>!(e.investor_id===ev.investor_id && e.company_id===ev.company_id));
      demoStore.evaluations.push({ id:uid(), ...ev, submitted_at:new Date().toISOString() });
      return;
    }
    const { error } = await supabaseClient.from('evaluations').upsert(ev, { onConflict:'investor_id,company_id' });
    if (error) throw error;
  },
  async getEvaluations(investor_id){
    if (DEMO_MODE) return demoStore.evaluations.filter(e=>e.investor_id===investor_id);
    const { data, error } = await supabaseClient.from('evaluations').select('*').eq('investor_id', investor_id);
    if (error) throw error;
    return data || [];
  },
  async getAllEvaluations(){
    if (DEMO_MODE) return demoStore.evaluations;
    const { data, error } = await supabaseClient.from('evaluations').select('*');
    if (error) throw error;
    return data || [];
  },
  async markEvaluationDone(investor_id){
    if (DEMO_MODE){
      const inv = demoStore.investors.find(i=>i.id===investor_id);
      if (inv) inv.evaluation_done = true;
      return;
    }
    const { error } = await supabaseClient.rpc('mark_evaluation_done', { p_investor_id: investor_id });
    if (error) throw error;
  },

  async getAllInvestors(){
    if (DEMO_MODE) return demoStore.investors;
    const { data, error } = await supabaseClient.from('investors').select('id,name,username,evaluation_done,created_at');
    if (error) throw error;
    return data || [];
  },

  /* وضع الدخول المفتوح (بدون كلمة مرور) — للمرحلة الحالية فقط.
     يبحث عن مستثمر بنفس الاسم لتفادي تكرار الحساب لنفس الشخص،
     وإلا يُنشئ له حساباً تلقائياً (بنفس جدول investors في Supabase)
     بحيث يسهل لاحقاً تفعيل الحماية بدون تغيير هيكل البيانات. */
  async findOrCreateInvestorByName(name){
    name = String(name).trim();
    if (!name) throw new Error('الرجاء إدخال الاسم');
    const all = await this.getAllInvestors();
    const existing = all.find(i => i.name.trim().toLowerCase() === name.toLowerCase());
    if (existing) return { id: existing.id, name: existing.name };
    const username = 'guest-' + Math.random().toString(36).slice(2,8);
    const password = Math.random().toString(36).slice(2,10);
    const created = await this.createInvestor(name, username, password);
    return { id: created.id, name };
  }
};

function toast(msg){
  let t = document.querySelector('.toast');
  if (!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ============================================================
   عناصر الهوية البصرية المشتركة — مستوحاة من نشرة حاضنة ابتكار 5
   ============================================================ */
const BRAND_COLORS = ['#9A05B9','#FCC342','#00BF9D','#63D653'];
function ticksHTML(count){
  count = count || 26;
  let out = '';
  for (let i=0;i<count;i++){
    const color = BRAND_COLORS[i % BRAND_COLORS.length];
    const h = 8 + ((i*7)%3===0 ? 14 : (i*5)%2===0 ? 9 : 5);
    out += `<span style="height:${h}px;background:${color}"></span>`;
  }
  return `<div class="brand-ticks">${out}</div>`;
}
function logoLockup(dark){
  const cls = dark ? 'logo-lockup on-dark' : 'logo-lockup';
  const boxCls = dark ? 'logo-num-box on-dark' : 'logo-num-box';
  return `
    <div class="${cls}">
      <div class="${boxCls}">5</div>
      <div class="logo-text">
        <b>حاضنة ابتكار</b>
        <span class="en">Innovation Incubator</span>
      </div>
    </div>`;
}
function phaseColor(p){
  return p==='explore' ? getComputedCssVar('--phase-explore')
       : p==='evaluation' ? getComputedCssVar('--phase-evaluation')
       : getComputedCssVar('--phase-results');
}
function getComputedCssVar(name){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ============================================================
   توليد بيانات دخول (لإضافة المستثمرين دفعة واحدة من لوحة التحكم)
   ============================================================ */
function genUsername(seq){
  return 'INV-' + String(seq).padStart(3,'0');
}
function genPassword(){
  return String(Math.floor(100000 + Math.random()*900000)); // رمز رقمي من 6 خانات
}
