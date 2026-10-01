"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera, Sparkles, BarChart2, ShoppingCart, Zap, ArrowRight,
  Star, ChevronDown, CheckCircle2, Leaf, Flame, Target, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import LanguageSwitcher from "@/components/language-switcher";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2000, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0</span>;
}

// ─── Floating Food ────────────────────────────────────────────────────────────
const FOODS = ["🥗", "🍎", "🥑", "🫐", "🍇", "🥦", "🍊", "🥝", "🍓", "🥕"];
function FloatingFoods() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {FOODS.map((food, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl md:text-4xl opacity-20"
          style={{
            left: `${(i * 11 + 5) % 90}%`,
            top: `${(i * 17 + 10) % 85}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          {food}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Mock App Card ─────────────────────────────────────────────────────────────
function MockAppCard() {
  const t = useT();
  const [calorie, setCalorie] = useState(1245);
  const [animIdx, setAnimIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCalorie((c) => c + Math.floor(Math.random() * 50 + 10));
      setAnimIdx((i) => (i + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const meals = [
    { label: t.dashboard.breakfast, name: "Yulaf Ezmesi + Meyve", cal: 380, done: true },
    { label: t.dashboard.lunch, name: "Izgara Tavuk Salatası", cal: 450, done: true },
    { label: t.dashboard.dinner, name: "Somon + Quinoa", cal: animIdx === 1 ? 520 : 415, done: animIdx >= 1 },
    { label: t.dashboard.snack, name: "Yoğurt + Fındık", cal: 195, done: animIdx === 2 },
  ];

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center">
            <span className="text-sm">🥗</span>
          </div>
          <span className="font-black text-sm">MunchLens</span>
        </div>
        <Badge className="bg-green-100 text-green-700 text-xs">🔥 5 {t.landing.mockStreak}</Badge>
      </div>

      {/* Calorie ring mock */}
      <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#fed7aa" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15" fill="none"
              stroke="#f97316" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="94.2"
              animate={{ strokeDashoffset: 94.2 - (calorie / 2000) * 94.2 }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-orange-600">{calorie}</span>
            <span className="text-[8px] text-muted-foreground">kcal</span>
          </div>
        </div>
        <div className="flex-1 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-muted-foreground">{t.landing.mockGoal}</span><span className="font-semibold">2.000 kcal</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t.landing.mockRemaining}</span><span className="font-semibold text-green-600">{2000 - calorie} kcal</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t.dashboard.protein}</span><span className="font-semibold">87 / 150g</span></div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="mb-4 space-y-2">
        {[
          { label: t.dashboard.protein, val: 87, max: 150, color: "bg-blue-500" },
          { label: t.dashboard.carbs, val: 142, max: 200, color: "bg-amber-500" },
          { label: t.dashboard.fat, val: 38, max: 65, color: "bg-rose-500" },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground w-10 shrink-0">{m.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", m.color)}
                initial={{ width: 0 }}
                animate={{ width: `${(m.val / m.max) * 100}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
            <span className="font-semibold text-[10px] w-10 text-right">{m.val}g</span>
          </div>
        ))}
      </div>

      {/* Meals */}
      <div className="space-y-2">
        {meals.map((m, i) => (
          <motion.div
            key={m.label}
            className={cn("flex items-center gap-3 p-2.5 rounded-xl text-xs transition-colors",
              m.done ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-gray-800/50"
            )}
            animate={animIdx === i ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <span>{m.label.split(" ")[0]}</span>
            <div className="flex-1">
              <p className="font-medium text-[11px]">{m.name}</p>
              <p className="text-muted-foreground text-[10px]">{m.cal} kcal</p>
            </div>
            {m.done && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Photo Strip ──────────────────────────────────────────────────────────────
const STRIP_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80", alt: "Healthy bowl" },
  { src: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?auto=format&fit=crop&w=400&q=80", alt: "Healthy breakfast" },
  { src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80", alt: "Nutrition tracking" },
  { src: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80", alt: "Meal prep" },
  { src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80", alt: "Healthy food" },
  { src: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80", alt: "Cooking" },
];

function PhotoStrip() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none py-2 px-4">
      {STRIP_PHOTOS.map((photo, i) => (
        <motion.div
          key={i}
          className="shrink-0 w-44 h-28 rounded-2xl overflow-hidden relative group"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, title, desc, emoji, delay }: { step: number; title: string; desc: string; emoji: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center p-6"
    >
      <motion.div
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-primary/30 mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {emoji}
      </motion.div>
      <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center mb-3">
        {step}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{desc}</p>
    </motion.div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ emoji, title, desc, gradient, delay }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:shadow-lg transition-shadow"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br", gradient)}>
        {emoji}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Ayşe K.", avatar: "👩‍🦰", text: "3 ayda 8 kg verdim! Fotoğraf özelliği hayatımı değiştirdi. Artık her yediğimi tek tıkla kaydediyorum.", stars: 5, goal: "−8 kg" },
  { name: "Mehmet A.", avatar: "👨", text: "Spor salonuna gidiyorum ama beslenmeyi hiç takip edemiyordum. MunchLens ile artık makrolarımı tam kontrol ediyorum.", stars: 5, goal: "+5 kg kas" },
  { name: "Selin T.", avatar: "👩", text: "Haftalık AI planı muhteşem. Her hafta farklı ve sağlıklı öğünler öneriyor, hiç sıkılmıyorum.", stars: 5, goal: "Sağlıklı yaşam" },
];

function TestimonialSlider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-3xl p-6 max-w-md mx-auto"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{TESTIMONIALS[idx].avatar}</span>
            <div>
              <p className="font-bold">{TESTIMONIALS[idx].name}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: TESTIMONIALS[idx].stars }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs font-bold">
              {TESTIMONIALS[idx].goal}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed italic">"{TESTIMONIALS[idx].text}"</p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={cn("w-2 h-2 rounded-full transition-all", i === idx ? "bg-primary w-6" : "bg-border")}
          />
        ))}
      </div>
    </div>
  );
}

// ─── AI Showcase ─────────────────────────────────────────────────────────────
function AIShowcase() {
  const t = useT();
  const [step, setStep] = useState(0);
  const steps = [
    { label: t.landing.aiStepPhoto, icon: "📸" },
    { label: t.landing.aiStepAnalyzing, icon: "🤖" },
    { label: t.landing.aiStepReady, icon: "✅" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 3), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <img
        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
        alt="AI food analysis"
        className="w-full h-64 object-cover"
      />
      {/* Scanning overlay */}
      <motion.div
        className="absolute inset-0 border-2 border-primary/60 rounded-3xl"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-primary/70 shadow-lg shadow-primary"
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Result card */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {step === 2 ? (
              <div className="space-y-2">
                <p className="font-bold text-sm flex items-center gap-1.5">
                  <span>✅</span> {t.landing.aiDetectedFood}
                </p>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {[
                    { label: t.analysis.calorie, val: "387", color: "text-orange-600" },
                    { label: t.dashboard.protein, val: "12g", color: "text-blue-600" },
                    { label: t.dashboard.carbs, val: "58g", color: "text-amber-600" },
                    { label: t.dashboard.fat, val: "8g", color: "text-rose-600" },
                  ].map((n) => (
                    <div key={n.label} className="bg-muted/50 rounded-xl p-1.5">
                      <p className={cn("font-black text-sm", n.color)}>{n.val}</p>
                      <p className="text-[9px] text-muted-foreground">{n.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-semibold text-sm flex items-center gap-2">
                <span className="text-xl">{steps[step].icon}</span>
                {steps[step].label}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const t = useT();

  const features = [
    { emoji: "📸", title: t.landing.feature1Title, desc: t.landing.feature1Desc, gradient: "from-orange-100 to-rose-100 dark:from-orange-900/40 dark:to-rose-900/40", delay: 0 },
    { emoji: "🤖", title: t.landing.feature2Title, desc: t.landing.feature2Desc, gradient: "from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40", delay: 0.1 },
    { emoji: "📊", title: t.landing.feature3Title, desc: t.landing.feature3Desc, gradient: "from-blue-100 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/40", delay: 0.2 },
    { emoji: "⚖️", title: t.landing.feature4Title, desc: t.landing.feature4Desc, gradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40", delay: 0.3 },
    { emoji: "🛒", title: t.landing.feature5Title, desc: t.landing.feature5Desc, gradient: "from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40", delay: 0.4 },
    { emoji: "🔍", title: t.landing.feature6Title, desc: t.landing.feature6Desc, gradient: "from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40", delay: 0.5 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">🥗</span>
            </div>
            <span className="font-black text-base">MunchLens</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="rounded-xl hidden sm:inline-flex">Blog</Button>
            </Link>
            <Link href="/giris">
              <Button variant="ghost" size="sm" className="rounded-xl">{t.landing.login}</Button>
            </Link>
            <Link href="/giris">
              <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90">{t.landing.signupFree}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background food photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
            alt="Healthy food"
            className="w-full h-full object-cover opacity-[0.07] dark:opacity-[0.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-50 via-background to-violet-50 dark:from-orange-950/20 dark:via-background dark:to-violet-950/20" />
        {/* Blob */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-56 h-56 bg-violet-400/10 rounded-full blur-3xl z-0"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <FloatingFoods />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-5 text-sm px-4 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  {t.landing.aiBadge}
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t.landing.heroTitle.split(" ").slice(0, -3).join(" ")}{" "}
                <span className="bg-gradient-to-r from-primary via-orange-500 to-rose-500 bg-clip-text text-transparent">
                  {t.landing.heroTitle.split(" ").slice(-3).join(" ")}
                </span>{" "}
                🥗
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t.landing.heroDesc}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/giris">
                  <Button className="h-13 px-8 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 shadow-xl shadow-primary/30 font-bold text-base w-full sm:w-auto">
                    {t.landing.heroCtaPrimary} <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/giris">
                  <Button variant="outline" className="h-13 px-8 rounded-2xl font-semibold w-full sm:w-auto">
                    {t.landing.heroCtaSecondary}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[`✓ ${t.landing.trustFree}`, `✓ ${t.landing.trustNoCard}`, `✓ ${t.landing.trustSetup}`].map((item) => (
                  <span key={item} className="flex items-center gap-1">{item}</span>
                ))}
              </motion.div>

              {/* Social proof row */}
              <motion.div
                className="flex items-center gap-3 justify-center lg:justify-start mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex -space-x-2">
                  {["🧑‍🦱", "👩", "👨‍🦰", "👩‍🦳"].map((face, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 border-2 border-background flex items-center justify-center text-sm">
                      {face}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">2.000+</span> {t.landing.socialProof}
                </p>
              </motion.div>
            </div>

            {/* Right — App mockup */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <MockAppCard />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary to-orange-500">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
          {[
            { label: t.landing.statUsers, to: 2000000, suffix: "+" },
            { label: t.landing.statMeals, to: 50000000, suffix: "+" },
            { label: t.landing.statLost, to: 500000, suffix: "+ kg" },
            { label: t.landing.statSatisfaction, to: 98, suffix: "%" },
          ].map(({ label, to, suffix }) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-black mb-1">
                <Counter to={to} suffix={suffix} />
              </div>
              <p className="text-sm text-white/80 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Food photo strip */}
      <section className="py-10 overflow-hidden bg-muted/20">
        <motion.div
          className="text-center mb-6 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            {t.landing.foodStripLabel}
          </p>
        </motion.div>
        <PhotoStrip />
      </section>

      {/* AI Showcase */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 order-2 lg:order-1">
              <AIShowcase />
            </div>
            <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-0 mb-4">
                  <Camera className="h-3 w-3 mr-1" /> {t.landing.aiBadgeLabel}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  {t.landing.aiShowcaseTitle}{" "}
                  <span className="text-primary">{t.landing.aiShowcaseHighlight}</span>
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t.landing.aiShowcaseDesc}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: "⚡", title: t.landing.aiFeature1Title, desc: t.landing.aiFeature1Desc },
                    { icon: "🎯", title: t.landing.aiFeature2Title, desc: t.landing.aiFeature2Desc },
                    { icon: "🍽️", title: t.landing.aiFeature3Title, desc: t.landing.aiFeature3Desc },
                    { icon: "🔢", title: t.landing.aiFeature4Title, desc: t.landing.aiFeature4Desc },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/giris">
                  <Button className="rounded-2xl bg-primary hover:bg-primary/90 gap-2">
                    {t.landing.aiShowcaseCTA} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-0 mb-4">
              {t.landing.howBadge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t.landing.howTitle}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t.landing.howSubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-orange-400 to-violet-500 opacity-30" />

            <StepCard step={1} emoji="📸" title={t.landing.step1Title} desc={t.landing.step1Desc} delay={0} />
            <StepCard step={2} emoji="🤖" title={t.landing.step2Title} desc={t.landing.step2Desc} delay={0.2} />
            <StepCard step={3} emoji="🎯" title={t.landing.step3Title} desc={t.landing.step3Desc} delay={0.4} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-0 mb-4">
              <Leaf className="h-3 w-3 mr-1" />{t.landing.featuresBadge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t.landing.featuresTitle}</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* Gamification / Streak section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-0 mb-4">
              🏆 {t.landing.gamiBadge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t.landing.gamiTitle}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t.landing.gamiSubtitle}</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Flame className="h-8 w-8 text-orange-500" />,
                bg: "bg-orange-100 dark:bg-orange-950",
                title: t.landing.streak,
                desc: t.landing.streakDesc,
                badge: `🔥 ${t.landing.streakBadge}`,
              },
              {
                icon: <Trophy className="h-8 w-8 text-amber-500" />,
                bg: "bg-amber-100 dark:bg-amber-950",
                title: t.landing.badges,
                desc: t.landing.badgesDesc,
                badge: `🏅 ${t.landing.badgesBadge}`,
              },
              {
                icon: <Target className="h-8 w-8 text-blue-500" />,
                bg: "bg-blue-100 dark:bg-blue-950",
                title: t.landing.personalGoal,
                desc: t.landing.personalGoalDesc,
                badge: `🎯 ${t.landing.personalGoalBadge}`,
              },
            ].map(({ icon, bg, title, desc, badge }, i) => (
              <motion.div
                key={title}
                className="bg-card border border-border rounded-2xl p-6 space-y-3 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", bg)}>
                  {icon}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
                <Badge className="bg-muted text-muted-foreground border-0 text-xs">{badge}</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-0 mb-4">
              ⭐ {t.landing.testimonialBadge}
            </Badge>
            <h2 className="text-3xl font-black">{t.landing.testimonialTitle}</h2>
          </motion.div>
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA — with food photo background */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto rounded-3xl relative overflow-hidden text-white text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Background food photo */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh fruit"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-orange-600/90" />
          </div>

          <FloatingFoods />

          <div className="relative p-10">
            <motion.p
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🚀
            </motion.p>
            <h2 className="text-3xl font-black mb-4">{t.landing.ctaTitle}</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              {t.landing.ctaDesc}
            </p>
            <Link href="/giris">
              <Button className="h-13 px-10 rounded-2xl bg-white text-primary hover:bg-gray-50 font-bold text-base shadow-xl">
                {t.landing.ctaSignup} <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <div className="flex justify-center gap-6 mt-8 text-sm text-white/70">
              <span>✓ {t.landing.ctaTrustNoCard}</span>
              <span>✓ {t.landing.ctaTrustCancel}</span>
              <span>✓ {t.landing.ctaTrustTrial}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-xs">🥗</span>
            </div>
            <span className="font-bold">MunchLens</span>
            <span className="text-muted-foreground text-sm">{t.landing.footerCopyright}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/gizlilik" className="hover:text-foreground">{t.landing.footerPrivacy}</Link>
            <Link href="/kosullar" className="hover:text-foreground">{t.landing.footerTerms}</Link>
            <Link href="/fiyatlar" className="hover:text-foreground">{t.landing.footerPricing}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
