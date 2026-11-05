import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createContext, useContext } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Language = 'en' | 'ar';
const LanguageContext = createContext<Language>('en');
const bilingual = (language: Language, english: string, arabic: string) => language === 'ar' ? arabic : english;

const projects: Array<{
  title: string;
  category: string;
  description: string;
  image: string;
  video?: string;
  imageAlt: string;
  details: string[];
}> = [
  { title: 'WhatsApp in your workspace', category: 'MESSAGING', description: 'Keep WhatsApp conversations close to your everyday work in Vmail.', image: '/feature-pics/pic1.png', video: '/feature-pics/whatsapp.mp4', imageAlt: 'Vmail WhatsApp integration with a connected number and conversation list', details: ['Connected WhatsApp number', 'Browse conversations', 'Reply from one workspace'] },
  { title: 'Your inbox, ready to answer', category: 'VISION AI', description: 'Ask what arrived today, summarize important messages, or prepare a reply for review.', image: '/feature-pics/pic2.png', video: '/feature-pics/visionAI.mp4', imageAlt: 'Vmail Vision AI summarizing important messages and preparing an email draft', details: ['Ask your mailbox', 'Summarize key messages', 'Draft a reply'] },
  { title: 'Meet right from Vmail', category: 'VMEET', description: 'Start a video meeting now or choose a time from your calendar.', image: '/feature-pics/pic3.png', video: '/feature-pics/vmeet.mp4', imageAlt: 'Vmail VMeet page with instant and scheduled meeting options', details: ['Start instant meetings', 'Schedule with Calendar', 'Share a guest link'] },
  { title: 'Connect your AI tools', category: 'AI & MCP', description: 'Give compatible AI clients carefully scoped access to your Vmail workspace.', image: '/feature-pics/pic4.png', video: '/feature-pics/mcp.mp4', imageAlt: 'Vmail help page explaining secure AI tool connections and approved access', details: ['Choose access permissions', 'Approve before sending', 'Connect compatible AI clients'] },
];
const steps = [
  { title: 'Bring all your accounts together', description: 'Connect multiple email accounts to Vmail and keep them together in one workspace. See your connected accounts at a glance, switch to the inbox you need, and keep everyday conversations close without juggling separate apps.', label: 'MULTI-ACCOUNT SUPPORT', image: '/vmulti.png', imageAlt: 'Several email accounts connected together in one Vmail workspace' },
  { title: 'Draft polished replies with Vmail AI', description: 'Get a helpful first draft for your email, then shape it to fit the moment. Choose a professional or friendly tone, make it shorter, and review the suggested reply before sending.', label: 'AI WRITING ASSISTANT', image: '/aismart.png', imageAlt: 'Vmail AI writing assistant drafting an email reply with tone options and a ready-to-send review' },
  { title: 'Add extra protection to private emails', description: 'Keep sensitive messages more secure with Vmail’s confidential email options. Protect access with a PIN or an authenticator code, then unlock the message when you are ready to read it.', label: 'CONFIDENTIAL EMAIL', image: '/emaillock.png', imageAlt: 'Vmail confidential email protected with a PIN code or authenticator TOTP code' },
];
const arabicProjects = [
  { title: 'واتساب ضمن مساحة عملك', category: 'المراسلة', description: 'تابع محادثات واتساب إلى جانب عملك اليومي في Vmail.', imageAlt: 'تكامل واتساب في Vmail مع رقم متصل وقائمة المحادثات', details: ['رقم واتساب متصل', 'تصفّح المحادثات', 'رد من مساحة عمل واحدة'] },
  { title: 'صندوق وارد جاهز للرد', category: 'الذكاء الاصطناعي', description: 'اسأل عمّا وصلك اليوم، ولخّص الرسائل المهمة، أو جهّز رداً لمراجعته.', imageAlt: 'مساعد Vmail الذكي يلخّص الرسائل المهمة ويجهّز مسودة بريد إلكتروني', details: ['اسأل صندوق بريدك', 'لخّص الرسائل المهمة', 'جهّز رداً'] },
  { title: 'ابدأ اجتماعك من Vmail', category: 'VMEET', description: 'ابدأ اجتماع فيديو فوراً أو اختر موعداً من تقويمك.', imageAlt: 'صفحة VMeet في Vmail مع خيارات بدء الاجتماعات وجدولتها', details: ['ابدأ اجتماعاً فورياً', 'جدوِل من التقويم', 'شارك رابط الضيوف'] },
  { title: 'اربط أدوات الذكاء الاصطناعي', category: 'AI وMCP', description: 'امنح أدوات الذكاء الاصطناعي المتوافقة صلاحيات محددة بعناية لمساحة Vmail.', imageAlt: 'مركز مساعدة Vmail يشرح ربط أدوات الذكاء الاصطناعي والصلاحيات المعتمدة', details: ['اختر صلاحيات الوصول', 'وافق قبل الإرسال', 'اربط أدوات الذكاء الاصطناعي'] },
];
const arabicSteps = [
  { title: 'اجمع كل حساباتك في مكان واحد', description: 'اربط عدة حسابات بريد إلكتروني بـ Vmail واجمعها في مساحة عمل واحدة. اطّلع على حساباتك المتصلة، وانتقل إلى صندوق الوارد الذي تحتاجه، وتابع محادثاتك اليومية دون التنقل بين التطبيقات.', label: 'دعم عدة حسابات', imageAlt: 'عدة حسابات بريد إلكتروني متصلة ضمن مساحة عمل Vmail واحدة' },
  { title: 'اكتب ردوداً أنيقة بمساعدة Vmail AI', description: 'ابدأ بمسودة بريد جاهزة، ثم عدّلها بما يناسبك. اختر نبرة رسمية أو ودية، واختصر النص، وراجع الرد المقترح قبل إرساله.', label: 'مساعد الكتابة الذكي', imageAlt: 'مساعد الكتابة في Vmail يجهّز رداً مع خيارات للنبرة ومراجعة قبل الإرسال' },
  { title: 'أضف حماية لرسائلك الخاصة', description: 'عزّز حماية الرسائل الحساسة بخيارات البريد السري في Vmail. استخدم رمز PIN أو تطبيق المصادقة لحماية الوصول، ثم افتح الرسالة عندما تكون مستعداً لقراءتها.', label: 'بريد إلكتروني سري', imageAlt: 'بريد سري في Vmail محمي برمز PIN أو رمز من تطبيق المصادقة' },
];

function LoadingScreen({ onComplete, darkMode }: { onComplete: () => void; darkMode: boolean }) {
  const language = useContext(LanguageContext);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    let doneTimer = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.floor(((now - started) / (reduceMotion ? 400 : 2300)) * 100));
      setCount(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else doneTimer = window.setTimeout(onComplete, 380);
    };
    frame = requestAnimationFrame(tick);
    const wordTimer = window.setInterval(() => setWord((i) => (i + 1) % 3), 900);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(doneTimer); window.clearInterval(wordTimer); };
  }, [onComplete, reduceMotion]);

  const progress = count / 100;
  const startColor = darkMode ? [255, 255, 255] : [15, 23, 42];
  const endColor = [50, 139, 255];
  const loadingColor = startColor.map((channel, index) => Math.round(channel + (endColor[index] - channel) * progress)).join(', ');

  return <motion.div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-bg p-6 md:p-10" exit={{ y: '-100%' }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs uppercase tracking-[.3em] text-muted">Vmail</motion.div>
    <div className="absolute inset-0 grid place-items-center pointer-events-none">
      <AnimatePresence mode="wait"><motion.div key={`${word}-${language}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: .3 }} className="font-display text-5xl italic text-text-primary/80 md:text-7xl">{language === 'ar' ? ['تركيز', 'تواصل', 'انسيابية'][word] : ['Focus', 'Connect', 'Flow'][word]}</motion.div></AnimatePresence>
    </div>
    <div className="relative z-10 flex justify-end"><span className="loading-count font-display text-7xl tabular-nums md:text-9xl" style={{ color: `rgb(${loadingColor})` }}>{String(count).padStart(3, '0')}</span></div>
    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-stroke/50"><div className="accent-gradient h-full origin-left" style={{ transform: `scaleX(${count / 100})`, boxShadow: '0 0 8px rgba(137,170,204,.35)' }} /></div>
  </motion.div>;
}

function Logo({ light = false }: { light?: boolean }) {
  const language = useContext(LanguageContext);
  return <Link to="/" aria-label={bilingual(language, 'Vmail home', 'الصفحة الرئيسية لـ Vmail')} className="group inline-flex shrink-0 items-center transition-opacity hover:opacity-80">
    <span className="block h-10 w-[160px] overflow-hidden"><img src={light ? '/vmail-logo-white.png' : '/vmail-logo-blue.png'} alt="Vmail" className="h-full w-full object-cover" /></span>
  </Link>;
}

function Navbar({ darkMode, onToggleTheme, language, onToggleLanguage, isLegalPage = false }: { darkMode: boolean; onToggleTheme: () => void; language: Language; onToggleLanguage: () => void; isLegalPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const root = isLegalPage ? '/' : '';
  const links = language === 'ar' ? [['الرئيسية', `${root}#home`], ['المزايا', `${root}#work`], ['كيف يعمل', `${root}#how-it-works`]] : [['Home', `${root}#home`], ['Features', `${root}#work`], ['How it works', `${root}#how-it-works`]];
  return <header className="site-header sticky top-0 z-50 flex justify-center px-5 py-3 md:px-8">
    <nav className="relative flex w-full max-w-[1280px] items-center justify-between gap-4 border-0 bg-transparent px-1 py-2" aria-label={bilingual(language, 'Main navigation', 'التنقل الرئيسي')}>
      <Logo light />
      <div className={`${open ? `absolute left-0 right-0 top-[calc(100%+8px)] flex flex-col rounded-2xl border p-2 shadow-xl sm:static sm:flex-row sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-stroke bg-white'}` : 'hidden sm:flex'} items-center gap-1 sm:ml-auto`}>
        {links.map(([name, href], index) => <a key={name} onClick={() => setOpen(false)} href={href} className={`relative rounded-full px-3 py-2 text-xs transition-colors after:absolute after:bottom-1 after:left-4 after:h-[2px] after:rounded-full after:bg-current after:transition-all after:duration-300 sm:px-4 sm:text-sm ${open ? (darkMode ? (index === 0 ? 'bg-slate-800 font-semibold text-white after:w-[calc(100%-2rem)]' : 'text-slate-300 after:w-0 hover:bg-slate-800 hover:text-white hover:after:w-[calc(100%-2rem)]') : (index === 0 ? 'bg-slate-100 font-semibold text-blue-700 after:w-[calc(100%-2rem)]' : 'text-slate-600 after:w-0 hover:bg-slate-50 hover:text-blue-700 hover:after:w-[calc(100%-2rem)]')) : (index === 0 ? 'font-semibold text-white after:w-[calc(100%-2rem)]' : 'text-white/85 after:w-0 hover:text-white hover:after:w-[calc(100%-2rem)]')}`}>{name}</a>)}
        <a href="https://vmail.fvcloud.online/" className="nav-login inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 sm:hidden">{bilingual(language, 'Log in', 'تسجيل الدخول')} <span>↗</span></a>
      </div>
      <a href="https://vmail.fvcloud.online/" className="nav-login hidden items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-flex sm:px-4 sm:text-sm">{bilingual(language, 'Log in', 'تسجيل الدخول')} <span>↗</span></a>
      <button className="ml-1 grid h-8 w-8 place-items-center text-white sm:hidden" aria-label={bilingual(language, 'Toggle menu', 'فتح القائمة')} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button>
      <button type="button" onClick={onToggleLanguage} aria-label={bilingual(language, 'Switch language to Arabic', 'تغيير اللغة إلى الإنجليزية')} className="language-switcher rounded-full border border-white/25 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-white/20">{language === 'en' ? 'العربية' : 'English'}</button>
      <button type="button" onClick={onToggleTheme} aria-label={darkMode ? bilingual(language, 'Switch to light mode', 'التبديل إلى الوضع الفاتح') : bilingual(language, 'Switch to dark mode', 'التبديل إلى الوضع الداكن')} aria-pressed={darkMode} title={darkMode ? bilingual(language, 'Switch to light mode', 'التبديل إلى الوضع الفاتح') : bilingual(language, 'Switch to dark mode', 'التبديل إلى الوضع الداكن')} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        {darkMode ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg>}
      </button>
    </nav>
  </header>;
}

function InboxPreview() {
  const language = useContext(LanguageContext);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  return <div className="hero-product-preview relative mx-auto w-full max-w-[1080px] overflow-hidden rounded-[1.5rem] shadow-[0_30px_70px_-24px_rgba(15,23,42,.38),0_12px_30px_-14px_rgba(37,99,235,.34)] transition-transform duration-500 hover:-translate-y-1">
    <img src="/feature-pics/pic5.png" alt={bilingual(language, 'Vmail inbox showing messages, folders, and connected workspace tools', 'صندوق وارد Vmail يعرض الرسائل والمجلدات وأدوات مساحة العمل')} className="block aspect-[2.1] w-full object-cover object-center" />
    <AnimatePresence>
      {welcomeOpen && <motion.div className="hero-preview-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
        <motion.div className="hero-preview-welcome" initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }} transition={{ duration: .35, delay: .06 }}>
          <div className="hero-preview-art" aria-hidden="true">
            <span className="hero-preview-orbit hero-preview-orbit-one"/><span className="hero-preview-orbit hero-preview-orbit-two"/>
            <span className="hero-preview-chip hero-preview-chip-vision">{bilingual(language, 'Draft replies faster', 'اكتب الردود بسرعة')}</span><span className="hero-preview-chip hero-preview-chip-vmeet">{bilingual(language, 'Meet in Vmail', 'اجتمع عبر Vmail')}</span>
            <span className="hero-preview-chip hero-preview-chip-mcp">{bilingual(language, 'Connect AI tools', 'ربط أدوات AI')}</span><span className="hero-preview-chip hero-preview-chip-shared">{bilingual(language, 'Share conversations', 'مشاركة المحادثات')}</span>
            <span className="hero-preview-chip hero-preview-chip-vchat">{bilingual(language, 'WhatsApp in Vmail', 'واتساب في Vmail')}</span><span className="hero-preview-chip hero-preview-chip-accounts">{bilingual(language, 'All inboxes together', 'كل الصناديق معاً')}</span><span className="hero-preview-chip hero-preview-chip-replies">{bilingual(language, 'Auto-reply routine mail', 'رد تلقائي')}</span>
            <span className="hero-preview-vmail-mark"><img src="/vmail-app-mark.png" alt="" /></span>
          </div>
          <p className="hero-preview-eyebrow">{bilingual(language, 'A BETTER WAY TO STAY IN FLOW', 'طريقة أفضل لمتابعة يومك')}</p>
          <h2>{bilingual(language, 'All your conversations, in one place.', 'كل محادثاتك في مكان واحد.')}</h2>
          <p className="hero-preview-description">{bilingual(language, 'Bring email, WhatsApp, meetings, and helpful AI together in your Vmail workspace.', 'اجمع البريد الإلكتروني وواتساب والاجتماعات ومساعدة الذكاء الاصطناعي في مساحة Vmail واحدة.')}</p>
          <a href="#work" className="hero-preview-action" onClick={() => setWelcomeOpen(false)}>{bilingual(language, 'Explore Vmail', 'اكتشف Vmail')} <span aria-hidden="true">→</span></a>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
function Hero() {
  const language = useContext(LanguageContext);
  const root = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, delay: .12 })
        .fromTo('.blur-in', { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, stagger: .1 }, '-=.65');
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);
  return <section ref={root} id="home" className="hero-glow relative isolate flex min-h-[690px] items-center overflow-hidden px-6 pb-20 pt-24 md:min-h-[790px] md:px-10 lg:px-16">
    <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-14">
      <div className="hero-copy max-w-[1160px] text-center">
        <div className="blur-in mb-5 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[.24em] text-blue-100/80 sm:text-[11px]"><span className="h-px w-7 bg-gradient-to-r from-transparent to-cyan-200/80"/><span>{bilingual(language, 'EMAIL THAT KEEPS YOU IN FLOW', 'بريد إلكتروني يواكب يومك')}</span><span className="h-px w-7 bg-gradient-to-l from-transparent to-cyan-200/80"/></div>
        <h1 className="name-reveal hero-headline text-[clamp(30px,5.5vw,72px)] leading-[1.02] text-white">{language === 'ar' ? <>رسائل ومحادثات كثيرة.<br />اجمعها كلها في مكان واحد.</> : <>Emails pile up. Chats keep moving.<br />Can you keep it all together?</>}</h1>
        <p className="blur-in mx-auto mt-6 max-w-[650px] text-base leading-7 tracking-[-.4px] text-white md:text-[19px] md:leading-8">{bilingual(language, 'Find important messages faster and keep conversations moving—all from one clear, easy-to-use inbox.', 'اعثر على رسائلك المهمة بسرعة، وتابع محادثاتك من صندوق وارد واحد واضح وسهل الاستخدام.')}</p>
        <div className="blur-in mt-6 flex items-center justify-center gap-5 text-[10px] font-semibold tracking-wide text-white/90 sm:gap-7 sm:text-xs" aria-label={bilingual(language, 'Works across devices', 'يعمل على مختلف الأجهزة')}>
          <span className="flex items-center gap-2 transition-colors hover:text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>{bilingual(language, 'Desktop', 'كمبيوتر مكتبي')}</span>
          <span className="flex items-center gap-2 transition-colors hover:text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><rect x="3" y="3.5" width="18" height="14" rx="1.5"/><path d="M2 20h20M9 17.5l-.8 2.5m6.6-2.5.8 2.5"/></svg>{bilingual(language, 'Laptop', 'كمبيوتر محمول')}</span>
          <span className="flex items-center gap-2 transition-colors hover:text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 18h2"/></svg>{bilingual(language, 'Mobile', 'هاتف')}</span>
        </div>
        <div className="blur-in mt-8 flex flex-wrap items-center justify-center gap-3"><a href="https://vmail.fvcloud.online/" className="button-blue">{bilingual(language, 'Open your inbox', 'افتح صندوق الوارد')} <span className="arrow-disc">↗</span></a><a href="#how-it-works" className="px-3 py-3 text-sm font-medium text-white/75 transition-colors hover:text-white">{bilingual(language, 'See how it works', 'تعرّف على طريقة العمل')} <span className="ml-1">↓</span></a></div>
        <p className="blur-in mt-4 text-xs text-white/55">{bilingual(language, 'A clearer way to stay on top of everyday email.', 'طريقة أوضح لمتابعة بريدك الإلكتروني كل يوم.')}</p>
      </div>
      <InboxPreview />
    </div>
  </section>;
}

function SectionHeading({
  eyebrow,
  badge,
  before,
  italic,
  after,
  subtext,
  tags,
  action,
  actionHref = '#contact',
  actionMeta,
  highlights,
}: {
  eyebrow: string;
  badge?: string;
  before: string;
  italic: string;
  after?: string;
  subtext: string;
  tags?: string[];
  action?: string;
  actionHref?: string;
  actionMeta?: string;
  highlights?: Array<{ label: string; title: string; detail: string }>;
}) {
  return <motion.div className="mb-10 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [.25, .1, .25, 1] }} viewport={{ once: true, margin: '-100px' }}>
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="h-px w-8 bg-blue-500/60" />
          <span className="text-[10px] font-semibold uppercase tracking-[.3em] text-muted">{eyebrow}</span>
          {badge && <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-600 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{badge}</span>}
        </div>
        <h2 className="text-4xl leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">{before} <em className="font-display font-normal text-blue-600 dark:text-blue-400">{italic}</em>{after ? ` ${after}` : ''}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">{subtext}</p>
        {tags && tags.length > 0 && <div className="mt-5 flex flex-wrap items-center gap-2">
          {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-stroke bg-surface/80 px-3 py-1.5 text-xs font-medium text-text-primary/85 shadow-sm backdrop-blur-sm"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{tag}</span>)}
        </div>}
      </div>
      {action && <div className="flex shrink-0 flex-col items-start gap-2.5 md:items-end">
        <a href={actionHref} className="gradient-ring inline-flex rounded-full border border-stroke bg-surface p-[1px] shadow-md shadow-blue-950/5 transition-transform hover:-translate-y-0.5"><span className="flex items-center gap-4 rounded-full bg-surface px-5 py-3 text-sm font-medium text-text-primary">{action}<span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500/10 text-xs text-blue-600 dark:bg-blue-400/15 dark:text-blue-300">↗</span></span></a>
        {actionMeta && <span className="text-[11px] text-muted">{actionMeta}</span>}
      </div>}
    </div>
    {highlights && highlights.length > 0 && <div className="mt-8 grid gap-3.5 border-t border-stroke/80 pt-7 sm:grid-cols-2 lg:grid-cols-4">
      {highlights.map((item) => <div key={item.title} className="rounded-2xl border border-stroke/90 bg-surface/75 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500/35">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-400"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{item.label}</div>
        <h3 className="mt-2 text-sm font-semibold text-text-primary">{item.title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
      </div>)}
    </div>}
  </motion.div>;
}

function FeatureStory({ onOpen }: { onOpen: (image: string, title: string) => void }) {
  const language = useContext(LanguageContext);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let rafId = 0;
    const updateFromScroll = () => {
      const track = trackRef.current;
      const story = storyRef.current;
      if (!track || !story) return;

      const stickyTop = window.innerWidth >= 768 ? 140 : 76;
      const rect = track.getBoundingClientRect();
      const maxScroll = Math.max(1, track.offsetHeight - story.offsetHeight);
      const scrolled = Math.min(maxScroll, Math.max(0, stickyTop - rect.top));
      const progress = scrolled / maxScroll;

      setScrollProgress(progress);

      const nextStep = Math.min(
        projects.length - 1,
        Math.max(0, Math.floor(progress * projects.length))
      );

      if (nextStep !== activeStepRef.current) {
        setDirection(nextStep > activeStepRef.current ? 1 : -1);
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const activeProject = projects[activeStep];
  const localizedProject = language === 'ar' ? arabicProjects[activeStep] : { title: activeProject.title, category: activeProject.category, description: activeProject.description, imageAlt: activeProject.imageAlt, details: activeProject.details };
  return <div ref={trackRef} className="feature-story-scroll-track mt-10">
    <div ref={storyRef} className="feature-story feature-story-overlay-layout">
      <div className="feature-story-visual-column">
        <div className="feature-story-sticky">
          <button type="button" className={`feature-story-visual ${activeProject.image === '/multi.png' ? 'feature-story-visual-multi' : ''}`} onClick={() => onOpen(activeProject.video ?? activeProject.image, localizedProject.title)} aria-label={bilingual(language, `View ${localizedProject.title} preview`, `عرض معاينة ${localizedProject.title}`)} style={{ backgroundImage: activeProject.image === '/multi.png' ? 'none' : `url("${activeProject.image}")` }}>
            {activeProject.image !== '/multi.png' && <span className="feature-story-visual-shade"/>}
            <AnimatePresence mode="wait" custom={direction}>
              {activeProject.video ? (
                <motion.video
                  key={activeProject.video}
                  src={activeProject.video}
                  poster={activeProject.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label={localizedProject.imageAlt}
                  className={activeProject.category === 'VISION AI' ? 'feature-story-image-vision-ai' : ''}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: direction > 0 ? 28 : -28, scale: 0.96, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? -28 : 28, scale: 0.98, filter: 'blur(4px)' }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : (
                <motion.img
                  key={activeProject.image}
                  src={activeProject.image}
                  alt={localizedProject.imageAlt}
                  className={`${activeProject.category === 'VISION AI' ? 'feature-story-image-vision-ai' : ''} ${activeProject.image === '/multi.png' ? 'feature-story-image-multi' : ''}`}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: direction > 0 ? 28 : -28, scale: 0.96, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? -28 : 28, scale: 0.98, filter: 'blur(4px)' }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </AnimatePresence>
            {activeProject.image !== '/multi.png' && <><span className="feature-story-visual-label"><i/>{activeProject.category}</span><span className="feature-story-visual-count">0{activeStep + 1}<small> / 0{projects.length}</small></span></>}
            <div className="feature-story-overlay-copy" aria-live="polite">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={`${activeStep}-${language}`} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: direction > 0 ? 18 : -18 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? -18 : 18 }} transition={{ duration: reduceMotion ? 0 : .3 }}>
                  <span className="feature-story-overlay-kicker">0{activeStep + 1} / 0{projects.length} · {localizedProject.category}</span>
                  <h3>{localizedProject.title}</h3>
                  <p>{localizedProject.description}</p>
                  {activeProject.category === 'VISION AI' && <p className="feature-story-overlay-trust">{bilingual(language, '✓ Vision AI prepares drafts, but never sends or changes mail.', '✓ يجهّز Vision AI المسودات، لكنه لا يرسل الرسائل أو يغيّرها.')}</p>}
                  <div className="feature-story-overlay-details">{localizedProject.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="feature-story-progress" aria-hidden="true"><span style={{ width: `${scrollProgress * 100}%` }}/></div>
          </button>
        </div>
      </div>
    </div>
  </div>;
}

function Works({ onOpen }: { onOpen: (image: string, title: string) => void }) {
  const language = useContext(LanguageContext);
  return <section id="work" className="feature-section relative overflow-x-clip px-6 py-16 md:px-10 md:py-24 lg:px-16"><div className="feature-glow feature-glow-one"/><div className="feature-glow feature-glow-two"/><div className="relative z-10 mx-auto max-w-[1200px]">
    <SectionHeading
      eyebrow={bilingual(language, 'A closer look at Vmail', 'تعرّف على Vmail عن قرب')}
      badge={bilingual(language, 'Unified Workspace', 'مساحة عمل موحّدة')}
      before={bilingual(language, 'Your email, made', 'بريدك الإلكتروني،')}
      italic={bilingual(language, 'effortless', 'بكل سهولة')}
      subtext={bilingual(language, 'A clear inbox, useful tools, and a familiar experience across your day. Read and reply to emails, stay on top of WhatsApp and VChat conversations, launch instant VMeet video calls, and let Vision AI summarize threads or prepare drafts—all without switching tabs.', 'صندوق وارد واضح وأدوات مفيدة وتجربة مألوفة طوال يومك. اقرأ رسائلك ورد عليها، وتابع محادثات واتساب وVChat، وابدأ مكالمات VMeet، ودع Vision AI يلخّص المحادثات أو يجهّز المسودات—كل ذلك دون التنقل بين علامات التبويب.')}
      tags={language === 'ar' ? ['صندوق وارد ذكي وبريد مشترك', 'واتساب وVChat', 'مساعد Vision AI', 'مكالمات VMeet', 'تكاملات AI وMCP', 'دعم عدة حسابات'] : ['Smart Inbox & Shared Mails', 'WhatsApp & VChat', 'Vision AI Assistant', 'VMeet Video Calls', 'AI & MCP Integrations', 'Multi-Account Support']}
      action={bilingual(language, 'Get started', 'ابدأ الآن')}
      actionHref="https://vmail.fvcloud.online/"
      actionMeta={bilingual(language, 'Available on Desktop, Laptop & Mobile', 'متاح على الكمبيوتر والهاتف المحمول')}
      highlights={language === 'ar' ? [
        { label: '01 · صندوق وارد موحّد', title: 'حسابات متعددة وبريد مشترك', detail: 'بدّل بين حساباتك الشخصية وحسابات الفريق، ونظّم المجلدات، واضبط الردود التلقائية بسهولة.' },
        { label: '02 · المراسلة', title: 'واتساب وVChat ضمن مساحة عملك', detail: 'تابع المحادثات الفورية إلى جانب بريدك لتبقى تواصلك مع العملاء والفريق في مكان واحد.' },
        { label: '03 · الفيديو والتقويم', title: 'اجتماعات فورية عبر VMeet', detail: 'ابدأ اجتماع فيديو فوراً أو جدوِله من التقويم وشارك رابطاً مع الضيوف.' },
        { label: '04 · Vision AI وMCP', title: 'مسودات وأدوات ذكاء اصطناعي بصلاحيات محددة', detail: 'لخّص المحادثات المزدحمة، وجهّز الردود لمراجعتها، واربط أدوات AI المتوافقة بأمان.' },
      ] : [
        { label: '01 Â· Unified Inbox', title: 'Multiple accounts & shared mail', detail: 'Switch between personal and team mailboxes, organize folders, and set automatic replies in seconds.' },
        { label: '02 Â· Messaging', title: 'WhatsApp & VChat built in', detail: 'Keep real-time chats right beside your emails so every client and team conversation stays in one place.' },
        { label: '03 Â· Video & Calendar', title: 'Instant VMeet rooms', detail: 'Launch a video meeting immediately or schedule from your calendar with shareable guest links.' },
        { label: '04 Â· Vision AI & MCP', title: 'Drafts & scoped AI tools', detail: 'Summarize busy threads, prepare replies for review, and connect MCP-compatible AI clients safely.' },
      ]}
    />
    <div className="feature-panels">
    <FeatureStory onOpen={onOpen} />
    </div>
  </div></section>;
}
function Journal() {
  const language = useContext(LanguageContext);
  return <section id="how-it-works" className="how-section px-6 py-16 md:px-10 md:py-24 lg:px-16"><div className="mx-auto max-w-[1200px]">
    <SectionHeading eyebrow={bilingual(language, 'How it works', 'كيف يعمل')} before={bilingual(language, 'A smoother way to', 'طريقة أسهل')} italic={bilingual(language, 'stay in touch', 'للبقاء على تواصل')} subtext={bilingual(language, 'Vmail keeps the everyday email routine simple—from opening your inbox to picking up the next conversation.', 'يجعل Vmail استخدام البريد الإلكتروني يومياً أكثر سهولة، من فتح صندوق الوارد إلى متابعة المحادثة التالية.')} action={bilingual(language, 'Explore features', 'استكشف المزايا')} />
    <div className="how-steps">{steps.map((step, i) => { const localizedStep = language === 'ar' ? arabicSteps[i] : step; return <motion.article key={step.title} className={`how-step ${i % 2 ? 'how-step-reverse' : ''}`} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: i * .08 }} viewport={{ once: true, margin: '-70px' }}>
      <div className={`how-step-visual ${step.image === '/vmulti.png' ? 'how-step-visual-multi' : ''} ${['/aismart.png', '/emaillock.png'].includes(step.image) ? 'how-step-visual-contained' : ''}`}><img className={`${step.image === '/vmulti.png' ? 'how-step-image-multi' : ''} ${['/aismart.png', '/emaillock.png'].includes(step.image) ? 'how-step-image-contained' : ''} ${step.image === '/aismart.png' ? 'how-step-image-ai' : ''}`} src={step.image} alt={localizedStep.imageAlt} />{step.image !== '/vmulti.png' && <><span className="how-step-image-label"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"/>{localizedStep.label}</span><span className="how-step-image-count">0{i + 1}</span></>}</div>
      <div className="how-step-copy"><span className="how-step-number">{bilingual(language, `STEP 0${i + 1}`, `الخطوة 0${i + 1}`)}</span><h3>{localizedStep.title}</h3><p>{localizedStep.description}</p><div className="how-step-rule"><span style={{ width: `${((i + 1) / steps.length) * 100}%` }}/></div><span className="how-step-caption">{language === 'ar' ? ['كل حساباتك في Vmail', 'رد بصوتك وأسلوبك', 'احمِ رسائلك برمز PIN'][i] : ['All your accounts, one Vmail', 'A reply that sounds like you', 'Protect access with a PIN or authenticator code'][i]}</span></div>
    </motion.article>; })}</div>
  </div></section>;
}

function Explorations({ onOpen }: { onOpen: (image: string, title: string) => void }) {
  const language = useContext(LanguageContext);
  const inboxImage = '/feature-pics/pic5.png';
  return <section className="visual-playground-section">
    <div className="visual-playground-heading"><span>{bilingual(language, 'EMAIL THAT GOES WITH YOU', 'بريد إلكتروني يواكبك')}</span><h2>{language === 'ar' ? <>صندوق واحد.<br/><em>كل أجهزتك.</em></> : <>One inbox.<br/><em>Every screen.</em></>}</h2><p>{bilingual(language, 'Move from desktop to laptop to phone, with your conversations close at hand.', 'انتقل من الكمبيوتر المكتبي إلى المحمول والهاتف، ومحادثاتك معك دائماً.')}</p><a href="#work" className="visual-playground-cta">{bilingual(language, 'See how Vmail works', 'تعرّف على Vmail')} <span aria-hidden="true">↘</span></a></div>
    <div className="visual-playground-stage">
      <div className="visual-playground-glow" aria-hidden="true" />
      <div className="visual-playground-monitor">
        <button type="button" className="visual-playground-monitor-screen" onClick={() => onOpen(inboxImage, bilingual(language, 'Vmail desktop inbox', 'صندوق وارد Vmail على الكمبيوتر المكتبي'))} aria-label={bilingual(language, 'View the Vmail desktop inbox', 'عرض صندوق وارد Vmail على الكمبيوتر المكتبي')}>
          <img src={inboxImage} alt={bilingual(language, 'Vmail inbox with email folders, search, and recent conversations', 'صندوق وارد Vmail مع مجلدات البريد والبحث والمحادثات الأخيرة')} />
        </button>
        <span className="visual-playground-monitor-neck" aria-hidden="true" />
        <span className="visual-playground-monitor-base" aria-hidden="true" />
      </div>
      <button type="button" className="visual-playground-laptop" onClick={() => onOpen(inboxImage, bilingual(language, 'Vmail laptop inbox', 'صندوق وارد Vmail على الكمبيوتر المحمول'))} aria-label={bilingual(language, 'View the Vmail inbox on a laptop', 'عرض صندوق وارد Vmail على الكمبيوتر المحمول')}>
        <span className="visual-playground-laptop-screen"><img src={inboxImage} alt={bilingual(language, 'Vmail inbox preview on a laptop screen', 'معاينة صندوق وارد Vmail على شاشة الكمبيوتر المحمول')} /></span>
        <span className="visual-playground-laptop-base" aria-hidden="true"><i /></span>
      </button>
      <button type="button" className="visual-playground-phone" onClick={() => onOpen('/vmail-mobile-preview.png', bilingual(language, 'Vmail mobile inbox', 'صندوق وارد Vmail على الهاتف'))} aria-label={bilingual(language, 'View the Vmail inbox on a phone', 'عرض صندوق وارد Vmail على الهاتف')}>
        <img src="/vmail-mobile-preview.png" alt={bilingual(language, 'Vmail mobile inbox shown on a portrait phone', 'صندوق وارد Vmail على هاتف بوضع عمودي')} />
      </button>
    </div>
    <div className="visual-playground-footer"><span>{bilingual(language, '01 / VMAIL ACROSS DEVICES', '01 / VMAIL على مختلف الأجهزة')}</span><span>{bilingual(language, 'Click a screen to explore it', 'انقر على شاشة لاستكشافها')}</span></div>
  </section>;
}

function Stats() {
  const language = useContext(LanguageContext);
  const items = language === 'ar' ? [['01', 'صندوق وارد واضح', 'تابع محادثاتك المهمة من مكان واحد.'], ['02', 'على مختلف الأجهزة', 'حافظ على انسيابية عملك أينما كنت.'], ['03', 'مصمم ليومك', 'مساحة عمل مألوفة وسهلة الاستخدام.']] : [['01', 'One clear inbox', 'Keep the important conversations close.'], ['02', 'Across devices', 'Stay in your flow from screen to screen.'], ['03', 'Built for your day', 'A familiar workspace that feels easy to use.']];
  return <section className="border-y border-stroke bg-bg px-6 py-16 md:px-10 md:py-24 lg:px-16"><div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-3 md:gap-6">{items.map(([num, title, text], i) => <motion.div key={num} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: i * .1 }} viewport={{ once: true }} className="border-l border-stroke pl-5"><span className="font-display text-5xl italic text-blue-500">{num}</span><h3 className="mt-3 text-lg text-text-primary">{title}</h3><p className="mt-1 text-sm text-muted">{text}</p></motion.div>)}</div></section>;
}

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const language = useContext(LanguageContext);
  const isPrivacy = type === 'privacy';
  const englishSections = isPrivacy ? [
    { title: 'About this notice', body: 'Vmail brings email, shared mail, WhatsApp and VChat conversations, VMeet calls, and optional Vision AI tools into one workspace. This notice describes the kinds of information those features may handle when you choose to use them.' },
    { title: 'Information used to provide Vmail', body: 'Depending on the features you connect, Vmail may process account and contact details, email messages and attachments, calendar information, chat and meeting details, and prompts or drafts you provide to Vision AI. The exact information available depends on the permissions you grant and the services you connect.' },
    { title: 'How information is used', body: 'Information is used to display and organize your inboxes, support messaging and meeting features, provide AI summaries or draft suggestions when requested, and operate and support the service. Vision AI suggestions should be reviewed by you; Vmail does not send or change mail automatically through Vision AI.' },
    { title: 'Connected services and AI', body: 'When you connect an email, messaging, calendar, meeting, or AI service, that provider may process information under its own terms and privacy notice. Review the permissions shown during connection. The Vmail website does not identify every service provider, AI model, or whether AI inputs are retained or used for model improvement; confirm those details before relying on this notice.' },
    { title: 'Storage, retention, and security', body: 'The public website does not specify Vmail’s data hosting locations, retention periods, deletion schedule, or technical security controls. These details should be confirmed and added by the service operator. Do not use this draft as a statement of specific security certifications or retention guarantees.' },
    { title: 'Your choices and rights', body: 'You can manage connected accounts and permissions in Vmail and can contact us with privacy questions. Depending on the law that applies to you, you may have rights to access or correct personal information, or to request that processing be restricted or stopped. We will respond in line with applicable law.' },
    { title: 'Contact and updates', body: 'For privacy questions, contact hello@vmail.fvcloud.online. We may update this notice when the service or its data practices change. The service operator should add its legal name and business address here before publication.' },
  ] : [
    { title: 'Using Vmail', body: 'Vmail is a workspace for email, shared mail, WhatsApp and VChat conversations, VMeet calls, and optional AI tools. These draft terms apply when you use the Vmail website or service. Feature availability may depend on your account, region, connected providers, and the permissions you grant.' },
    { title: 'Your account and connected services', body: 'Provide accurate account information, protect your sign-in credentials, and connect only accounts you own or are authorized to use. You are responsible for reviewing the permissions requested by connected services and for following their terms as well.' },
    { title: 'Acceptable use', body: 'Use Vmail lawfully and do not interfere with the service, bypass access controls, send abusive or unlawful messages, or access another person’s account without authorization. We may restrict access where needed to protect users, the service, or the rights of others, subject to applicable law.' },
    { title: 'Vision AI and user review', body: 'Vision AI can summarize conversations and suggest email drafts. AI output may be incomplete or inaccurate, so review it before relying on it. Vision AI does not send or change mail automatically. You remain responsible for messages and other actions you choose to take.' },
    { title: 'Third-party services', body: 'Vmail can connect to services operated by other providers. Those services are not controlled by Vmail and may have separate terms, privacy notices, availability, and fees. Check each provider’s terms before connecting or using its features.' },
    { title: 'Availability, fees, and changes', body: 'The website does not state a complete pricing, refund, warranty, or service-level policy. Any fees and plan terms should be shown to you before you purchase or subscribe. We may change or discontinue features, subject to applicable law and any terms presented with your plan.' },
    { title: 'Legal details and contact', body: 'The company operating Vmail, governing law, dispute process, and any liability limits are not identified on this website and must be completed by the service operator before these terms are used as a binding agreement. For questions, contact hello@vmail.fvcloud.online.' },
  ];
  const arabicSections = isPrivacy ? [
    { title: 'حول هذه السياسة', body: 'يجمع Vmail البريد الإلكتروني والبريد المشترك ومحادثات واتساب وVChat ومكالمات VMeet وأدوات Vision AI الاختيارية في مساحة عمل واحدة. توضّح هذه السياسة أنواع المعلومات التي قد تتعامل معها هذه المزايا عند استخدامك لها.' },
    { title: 'المعلومات اللازمة لتقديم Vmail', body: 'بحسب المزايا التي تربطها، قد يعالج Vmail تفاصيل الحسابات وجهات الاتصال ورسائل البريد ومرفقاتها ومعلومات التقويم وتفاصيل المحادثات والاجتماعات والمطالبات أو المسودات التي ترسلها إلى Vision AI. تعتمد المعلومات المتاحة على الصلاحيات التي تمنحها والخدمات التي تربطها.' },
    { title: 'كيف نستخدم المعلومات', body: 'تُستخدم المعلومات لعرض صناديق الوارد وتنظيمها، وتقديم مزايا المراسلة والاجتماعات، وإنشاء ملخصات أو مسودات مقترحة عند طلبك، وتشغيل الخدمة ودعمها. راجع اقتراحات Vision AI بنفسك؛ فهو لا يرسل الرسائل أو يغيّرها تلقائياً.' },
    { title: 'الخدمات المتصلة والذكاء الاصطناعي', body: 'عند ربط خدمة للبريد أو المراسلة أو التقويم أو الاجتماعات أو الذكاء الاصطناعي، قد يعالج مزوّدها المعلومات وفق شروطه وسياسة الخصوصية الخاصة به. راجع الصلاحيات المعروضة أثناء الربط. لا يحدد موقع Vmail جميع المزوّدين أو نماذج الذكاء الاصطناعي، ولا يوضح مدة الاحتفاظ بمدخلات AI أو استخدامها لتحسين النماذج؛ يجب تأكيد هذه التفاصيل قبل اعتماد هذه السياسة.' },
    { title: 'التخزين والاحتفاظ والأمان', body: 'لا يوضح الموقع العام مواقع استضافة البيانات أو فترات الاحتفاظ أو جدول الحذف أو الضوابط الأمنية التقنية لدى Vmail. على مشغّل الخدمة تأكيد هذه التفاصيل وإضافتها. لا تعتبر هذه المسودة إقراراً بشهادات أمنية أو ضمانات محددة للاحتفاظ بالبيانات.' },
    { title: 'خياراتك وحقوقك', body: 'يمكنك إدارة الحسابات المتصلة وصلاحياتها في Vmail، كما يمكنك التواصل معنا بشأن الخصوصية. قد تمنحك القوانين المطبقة عليك حقوقاً للاطلاع على المعلومات الشخصية أو تصحيحها أو طلب تقييد معالجتها أو إيقافها. سنتعامل مع الطلبات وفق القانون المعمول به.' },
    { title: 'التواصل والتحديثات', body: 'للاستفسارات المتعلقة بالخصوصية، راسل hello@vmail.fvcloud.online. قد نحدّث هذه السياسة عند تغيير الخدمة أو ممارسات البيانات. ينبغي لمشغّل الخدمة إضافة الاسم القانوني للمنشأة وعنوانها قبل النشر.' },
  ] : [
    { title: 'استخدام Vmail', body: 'يوفّر Vmail مساحة عمل للبريد الإلكتروني والبريد المشترك ومحادثات واتساب وVChat ومكالمات VMeet وأدوات الذكاء الاصطناعي الاختيارية. تسري هذه المسودة عند استخدامك موقع Vmail أو خدمته. قد يختلف توفر المزايا حسب حسابك وموقعك الجغرافي والمزوّدين المتصلين والصلاحيات التي تمنحها.' },
    { title: 'حسابك والخدمات المتصلة', body: 'قدّم معلومات دقيقة عن حسابك، واحمِ بيانات تسجيل الدخول، ولا تربط إلا الحسابات التي تملكها أو يُسمح لك باستخدامها. تقع على عاتقك مسؤولية مراجعة الصلاحيات المطلوبة والالتزام بشروط الخدمات المتصلة.' },
    { title: 'الاستخدام المقبول', body: 'استخدم Vmail بصورة قانونية، ولا تعطل الخدمة أو تتجاوز ضوابط الوصول أو ترسل رسائل مسيئة أو غير قانونية أو تدخل إلى حساب شخص آخر دون إذن. يجوز تقييد الوصول عند الحاجة لحماية المستخدمين أو الخدمة أو حقوق الآخرين، وفق القانون المعمول به.' },
    { title: 'Vision AI ومراجعة المستخدم', body: 'يمكن لـ Vision AI تلخيص المحادثات واقتراح مسودات للبريد. قد تكون النتائج ناقصة أو غير دقيقة، لذا راجعها قبل الاعتماد عليها. لا يرسل Vision AI الرسائل أو يغيّرها تلقائياً. وتبقى مسؤولاً عن الرسائل والإجراءات التي تختار تنفيذها.' },
    { title: 'خدمات الجهات الأخرى', body: 'يمكن لـ Vmail الاتصال بخدمات يديرها مزوّدون آخرون. هذه الخدمات ليست تحت سيطرة Vmail، وقد تكون لها شروط وسياسات خصوصية وتوفر ورسوم منفصلة. راجع شروط كل مزوّد قبل ربط خدماته أو استخدامها.' },
    { title: 'التوفر والرسوم والتغييرات', body: 'لا يعرض الموقع سياسة كاملة للأسعار أو الاسترداد أو الضمانات أو مستوى الخدمة. يجب توضيح أي رسوم وشروط خطة قبل الشراء أو الاشتراك. قد نغيّر المزايا أو نوقفها، وفق القانون المعمول به وأي شروط مرتبطة بخطتك.' },
    { title: 'التفاصيل القانونية والتواصل', body: 'لا يحدد هذا الموقع الشركة المشغّلة لـ Vmail أو القانون الحاكم أو آلية حل النزاعات أو حدود المسؤولية. يجب على مشغّل الخدمة استكمال هذه البيانات قبل استخدام الشروط كاتفاقية ملزمة. للاستفسارات، راسل hello@vmail.fvcloud.online.' },
  ];
  const sections = language === 'ar' ? arabicSections : englishSections;
  const title = bilingual(language, isPrivacy ? 'Privacy Policy' : 'Terms & Conditions', isPrivacy ? 'سياسة الخصوصية' : 'الشروط والأحكام');

  return <section className="legal-page"><div className="legal-page-inner">
    <a className="legal-back-link" href="/#home">{bilingual(language, '← Back to Vmail', 'العودة إلى Vmail ←')}</a>
    <span className="legal-eyebrow">{bilingual(language, 'VMAIL · LEGAL', 'VMAIL · معلومات قانونية')}</span>
    <h1>{title}</h1>
    <p className="legal-updated">{bilingual(language, 'Last updated: November 5, 2026', 'آخر تحديث: 5 نوفمبر 2026')}</p>
    <div className="legal-draft-note">{bilingual(language, 'Review before publishing: this draft reflects the features described on the Vmail website. Confirm the operating company, connected-service and AI providers, data retention and security practices, pricing, and governing law before treating it as final.', 'يرجى المراجعة قبل النشر: تعكس هذه المسودة المزايا الموضحة على موقع Vmail. أكّد اسم الشركة المشغّلة ومزوّدي الخدمات المتصلة والذكاء الاصطناعي وممارسات الاحتفاظ بالبيانات والأمان والأسعار والقانون الحاكم قبل اعتمادها بصيغتها النهائية.')}</div>
    <div className="legal-sections">{sections.map((section) => <article key={section.title}><h2>{section.title}</h2><p>{section.body}</p></article>)}</div>
    <div className="legal-switch-links"><a href={isPrivacy ? '/terms-and-conditions' : '/privacy-policy'}>{bilingual(language, isPrivacy ? 'Read Terms & Conditions' : 'Read the Privacy Policy', isPrivacy ? 'اقرأ الشروط والأحكام' : 'اقرأ سياسة الخصوصية')}</a><a href="mailto:hello@vmail.fvcloud.online">hello@vmail.fvcloud.online</a></div>
  </div></section>;
}

function Contact() {
  const language = useContext(LanguageContext);
  return <footer id="contact" className="vmail-footer">
    <div className="footer-main-wrap">
      <div className="footer-main">
        <div className="footer-about">
          <h2>{bilingual(language, 'Your inbox for a clearer workday. Bring email and everyday conversations together with Vmail.', 'صندوق وارد ليوم أكثر وضوحاً. اجمع بريدك الإلكتروني ومحادثاتك اليومية مع Vmail.')}</h2>
          <p>{bilingual(language, 'Find important messages faster and keep conversations moving from one clear workspace.', 'اعثر على الرسائل المهمة بسرعة، وتابع محادثاتك من مساحة عمل واحدة وواضحة.')}</p>
          <div className="footer-about-actions"><a href="https://vmail.fvcloud.online/" className="footer-contact-button">{bilingual(language, 'Open your inbox', 'افتح صندوق الوارد')}</a><a href="mailto:hello@vmail.fvcloud.online" className="footer-contact-link">{bilingual(language, 'Talk to us', 'تواصل معنا')}</a></div>
        </div>
        <nav className="footer-link-columns" aria-label={bilingual(language, 'Footer navigation', 'روابط التذييل')}>
          <div><h3>{bilingual(language, 'PRODUCT', 'المنتج')}</h3><a href="#work">{bilingual(language, 'Features', 'المزايا')}</a><a href="#how-it-works">{bilingual(language, 'How it works', 'كيف يعمل')}</a><a href="#work">{bilingual(language, 'AI & integrations', 'الذكاء الاصطناعي والتكاملات')}</a></div>
          <div><h3>{bilingual(language, 'COMPANY', 'الشركة')}</h3><a href="#home">{bilingual(language, 'About Vmail', 'عن Vmail')}</a><a href="#contact">{bilingual(language, 'Contact', 'تواصل معنا')}</a><a href="https://vmail.fvcloud.online/">{bilingual(language, 'Log in', 'تسجيل الدخول')}</a></div>
          <div><h3>{bilingual(language, 'SUPPORT', 'الدعم')}</h3><a href="mailto:hello@vmail.fvcloud.online">{bilingual(language, 'Help & support', 'المساعدة والدعم')}</a><a href="mailto:hello@vmail.fvcloud.online">{bilingual(language, 'Email us', 'راسلنا')}</a><a href="#work">{bilingual(language, 'Explore Vmail', 'اكتشف Vmail')}</a></div>
        </nav>
      </div>
    </div>
    <div className="footer-signature-band">
      <img src="/vmail-logo-white.png" alt="Vmail" />
      <div className="footer-signature-meta">
        <span>{bilingual(language, `© ${new Date().getFullYear()} Vmail. All rights reserved.`, `© ${new Date().getFullYear()} Vmail. جميع الحقوق محفوظة.`)}</span>
        <nav className="footer-policy-links" aria-label={bilingual(language, 'Legal information', 'المعلومات القانونية')}>
          <a href="/privacy-policy">{bilingual(language, 'Privacy Policy', 'سياسة الخصوصية')}</a>
          <span aria-hidden="true">|</span>
          <a href="/terms-and-conditions">{bilingual(language, 'Terms & conditions', 'الشروط والأحكام')}</a>
        </nav>
      </div>
    </div>
  </footer>;
}

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('vmail-theme') === 'dark');
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('vmail-language') === 'ar' ? 'ar' : 'en');
  const [lightbox, setLightbox] = useState<{ image: string; title: string } | null>(null);
  const location = useLocation();
  const legalType = location.pathname === '/privacy-policy' ? 'privacy' : location.pathname === '/terms-and-conditions' ? 'terms' : null;
  const done = () => setIsLoading(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('vmail-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('vmail-language', language);
  }, [language]);
  useEffect(() => {
    document.title = legalType
      ? `${bilingual(language, legalType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions', legalType === 'privacy' ? 'سياسة الخصوصية' : 'الشروط والأحكام')} · Vmail`
      : 'Vmail';
  }, [language, legalType]);
  return <LanguageContext.Provider value={language}><div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-bg text-text-primary"><AnimatePresence>{isLoading && <LoadingScreen onComplete={done} darkMode={darkMode} />}</AnimatePresence><Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((current) => !current)} language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'ar' : 'en')} isLegalPage={Boolean(legalType)} />
    <AnimatePresence mode="wait"><motion.main key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>
      {legalType ? <LegalPage type={legalType} /> : <><Hero /><Works onOpen={(image, title) => setLightbox({ image, title })} /><Journal /><Explorations onOpen={(image, title) => setLightbox({ image, title })} /><Stats /><Contact /></>}
    </motion.main></AnimatePresence>
    <AnimatePresence>{lightbox && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-5 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}><button aria-label={bilingual(language, 'Close image', 'إغلاق الصورة')} className="absolute right-6 top-5 z-10 text-3xl text-white" onClick={() => setLightbox(null)}>×</button><motion.div initial={{ scale: .94, y: 15 }} animate={{ scale: 1, y: 0 }} className="max-h-[88vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>{lightbox.image.endsWith('.mp4') ? <video src={lightbox.image} controls autoPlay loop muted playsInline className="max-h-[80vh] rounded-2xl object-contain" /> : <img src={lightbox.image} alt={lightbox.title} className="max-h-[80vh] rounded-2xl object-contain" />}<p className="mt-3 text-center text-sm text-white/70">{lightbox.title}</p></motion.div></motion.div>}</AnimatePresence>
  </div></LanguageContext.Provider>;
}

export default function App() {
  return <Routes><Route path="*" element={<Page />} /></Routes>;
}
