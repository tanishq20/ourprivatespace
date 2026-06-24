import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Riyaa's World 🌸 — a little universe by Tanishq" },
      { name: "description", content: "A private universe built for one girl in this whole world — Riyaa." },
    ],
  }),
  component: RiyaaWorld,
});

/* ============================================================
   Floating ambient layer
   ============================================================ */
function FloatingHearts({ count = 16 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 22,
        duration: 11 + Math.random() * 12,
        delay: Math.random() * 14,
        opacity: 0.15 + Math.random() * 0.45,
        char: ["❤", "❤", "❤", "🌸", "✨"][Math.floor(Math.random() * 5)],
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-heart text-rose"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   The Gate — mature, multi-step, *only Riyaa* can enter
   ============================================================ */
type GateStep = "intro" | "name" | "date" | "quiz" | "promise" | "press";

function HeartGate({ onUnlock }: { onUnlock: () => void }) {
  const [step, setStep] = useState<GateStep>("intro");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressTimer = useRef<number | null>(null);

  const quiz = [
    {
      q: "☎️ Which silly mistake of mine completely changed our story?",
      options: [
        "I called you by mistake",
        "I typed 'bhi' instead of 'nhi'",
        "I forgot to reply",
        "I sent the wrong sticker"
      ],
      correct: 1,
    }
  ];

  const fail = (msg: string) => {
    setShake(true);
    setWhisper(msg);
    setTimeout(() => setShake(false), 500);
  };

  const checkName = () => {
    const ok = name.trim().toLowerCase().replace(/[^a-z]/g, "").startsWith("riya");
    if (!ok) return fail("This little universe belongs to one girl only 🌸");
    setWhisper(null);
    setStep("date");
  };

  const checkDate = () => {
    const d = day.trim();
    const m = month.trim().toLowerCase();
    const y = year.trim();
    const okDay = d === "31";
    const okMonth = ["12", "dec", "december"].includes(m);
    const okYear = y === "2025";
    if (!(okDay && okMonth && okYear)) {
      return fail("Hmm… that's not the day my world changed 💭");
    }
    setWhisper(null);
    setStep("quiz");
  };

  const answer = (i: number) => {
    if (i !== quiz[quizIndex].correct) {
      return fail("Not quite, betuu — try again 💕");
    }
    setWhisper(null);
    if (quizIndex < quiz.length - 1) setQuizIndex(quizIndex + 1);
    else setStep("promise");
  };

  const startPress = () => {
    setPressing(true);
    const start = Date.now();
    const tick = () => {
      const p = Math.min(100, ((Date.now() - start) / 2600) * 100);
      setProgress(p);
      if (p >= 100) {
        setTimeout(onUnlock, 400);
        return;
      }
      pressTimer.current = requestAnimationFrame(tick);
    };
    pressTimer.current = requestAnimationFrame(tick);
  };
  const stopPress = () => {
    setPressing(false);
    if (pressTimer.current) cancelAnimationFrame(pressTimer.current);
    if (progress < 100) setProgress(0);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-romance px-4 py-12 overflow-hidden">
      <FloatingHearts count={12} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-xl bg-card/90 backdrop-blur-xl rounded-3xl shadow-soft p-7 sm:p-12 border border-border ${shake ? "shake" : ""}`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-px w-10 bg-rose/40" />
          <span className="text-xs uppercase tracking-[0.3em] text-rose/80">private</span>
          <span className="h-px w-10 bg-rose/40" />
        </div>
        <p className="font-script text-3xl text-rose text-center">a little universe…</p>
        <h1 className="font-display text-4xl sm:text-5xl text-center mt-1 text-shimmer">
          Only for my cutuu.
        </h1>
        <p className="text-center text-sm text-muted-foreground mt-3">
          If you are not her, please close this softly — this place wasn't made for you 🤍
        </p>

        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 space-y-5"
            >
              <div className="rounded-2xl bg-blush/30 border border-rose/20 p-5 text-center">
                <p className="font-display text-lg leading-relaxed text-foreground/85">
                  Before you step inside, my love,
                  there's something I want you to feel. <br />
                  A few little memories, a few pieces of my heart,
                  carefully kept here just for you. <br />
                  Take your time, betuuu... every moment ahead was made with love 💌
                </p>
              </div>
              <button
                onClick={() => setStep("name")}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-base hover:opacity-95 transition shadow-soft pulse-glow"
              >
                Once ready, come with me →
              </button>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="mt-8 space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">Door 1 of 4</p>
              <h2 className="text-2xl text-center font-display">Whisper your name, my love…</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkName()}
                placeholder="your name"
                className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-center font-display text-2xl focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <button
                onClick={checkName}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-95 transition shadow-soft"
              >
                Open the next door →
              </button>
            </motion.div>
          )}

          {step === "date" && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="mt-8 space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">Door 2 of 4</p>
              <h2 className="text-2xl text-center font-display">
                The day my whole world quietly changed…
              </h2>
              <p className="text-center text-muted-foreground text-sm">
                The day a girl walked up to me and said,
                <span className="font-script text-rose text-lg"> "apko koi help chaiye?" </span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                <input
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="DD"
                  className="px-3 py-4 rounded-2xl bg-background border border-border text-center font-display text-xl focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="MM"
                  className="px-3 py-4 rounded-2xl bg-background border border-border text-center font-display text-xl focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="YYYY"
                  className="px-3 py-4 rounded-2xl bg-background border border-border text-center font-display text-xl focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={checkDate}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-95 transition shadow-soft"
              >
                That's the day →
              </button>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key={`quiz-${quizIndex}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="mt-8 space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">
                Door 3 of 4 · {quizIndex + 1}/{quiz.length}
              </p>
              <h2 className="text-2xl text-center font-display leading-snug">{quiz[quizIndex].q}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {quiz[quizIndex].options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => answer(i)}
                    className="px-4 py-4 rounded-2xl bg-secondary text-secondary-foreground hover:bg-blush hover:scale-[1.02] transition border border-border font-medium"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "promise" && (
            <motion.div
              key="promise"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-8 space-y-5"
            >
              <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">Door 4 of 4</p>
              <h2 className="text-2xl text-center font-display">One tiny promise before you enter…</h2>
              <div className="rounded-2xl bg-blush/30 border border-rose/20 p-5 text-center space-y-3">
                <p className="font-display leading-relaxed">
                  ✋ With my hand on my heart,<br />I, <b>RIYA JHA</b>, do solemnly swear that:
                  <br /><br />

                  💌 I will read every page slowly and carefully.
                  <br />

                  😊 I will smile at the cute memories.
                  <br />

                  😂 I will not judge the extra cheesy parts too harshly.
                  <br />

                  🥺 I will remember every moment that made us <i>us</i>.
                  <br />

                  ❤️ And above all, I will never forget that I am loved,
                  missed, cherished, and adored more than words can explain.
                  <br />
                </p>
              </div>

              <button
                onClick={() => setStep("press")}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-95 transition shadow-soft"
              >
                I promise 🤍 →
              </button>
            </motion.div>
          )}

          {step === "press" && (
            <motion.div
              key="press"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center space-y-6"
            >
              <p className="text-muted-foreground">
                Last thing. Press &amp; hold the heart… <br />
                <span className="text-sm">until it beats with mine 💗</span>
              </p>
              <div className="flex justify-center">
                <button
                  onMouseDown={startPress}
                  onMouseUp={stopPress}
                  onMouseLeave={stopPress}
                  onTouchStart={startPress}
                  onTouchEnd={stopPress}
                  className="relative w-44 h-44 flex items-center justify-center select-none"
                  aria-label="Press and hold to enter"
                >
                  <span
                    className="text-[8rem] leading-none transition-transform"
                    style={{
                      transform: `scale(${1 + progress / 280})`,
                      filter: `drop-shadow(0 0 ${progress / 2.5}px oklch(0.7 0.25 20))`,
                    }}
                  >
                    {pressing || progress > 0 ? "❤️" : "🤍"}
                  </span>
                </button>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-[width] duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">hold… don't let go…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {whisper && (
          <p className="mt-5 text-center text-base text-rose font-script">{whisper}</p>
        )}
      </motion.div>
    </div>
  );
}

/* ============================================================
   The Universe — full story experience
   ============================================================ */

const story: { date: string; title: string; text: string; emoji: string }[] = [
  {
    date: "31st Dec 2025",
    title: "The day my world quietly split in two",
    emoji: "✨",
    text: "I met you for the first time. I didn't know it yet, but my life had just been divided into 'before Riyaa' and 'after Riyaa'.",
  },
  {
    date: "That same evening",
    title: "Tea, and the first time I melted",
    emoji: "🍵",
    text: "I was making tea in the Airbnb. You walked up and asked, so softly — 'apko koi help chaiye?' I think a small part of me has been melting ever since.",
  },
  {
    date: "New Year's Eve, 2026",
    title: "Litti, lights, and a blast of a party",
    emoji: "🎉",
    text: "Making litti with you felt like a small forever. Then we partied into the new year and I knew — this year was going to belong to you.",
  },
  {
    date: "New Year week, Hyderabad",
    title: "Niloufer, and melting all over again",
    emoji: "☕",
    text: "You were in my city. We had a blast of a week. I looked at you at Niloufer and I quietly melted, all over again.",
  },
  {
    date: "After Delhi",
    title: "When 'ping' became my favourite sound",
    emoji: "📱",
    text: "You went back to Delhi and we started chatting. My heart literally started running every time your name lit up on my screen.",
  },
  {
    date: "Every morning since",
    title: "Waiting for your good morning",
    emoji: "🌅",
    text: "I'd wake up and just… wait. For your good morning text. The whole day depended on it. Still does.",
  },
  {
    date: "Office life",
    title: "Split-screen heart",
    emoji: "💻",
    text: "I literally split my office screen — work on one side, your chat on the other — because I couldn't bear to miss a single message from you.",
  },
  {
    date: "A typo at the right time",
    title: "'bhi' instead of 'nhi'",
    emoji: "☎️",
    text: "One tiny typo. It turned into our first audio call. I heard your voice and I just knew — yeah, this one. This one is mine.",
  },
  {
    date: "Slowly, then all at once",
    title: "Video calls became home",
    emoji: "📹",
    text: "Then came the video calls. Your face, your laugh, your bad-network freeze frames — somehow all of it felt like home.",
  },
  {
    date: "7th Feb 2026",
    title: "'I like you, Riyaa'",
    emoji: "💗",
    text: "I told you in the morning — 'I like you. I can't stay without you.' You said 'thank you' 🥹. And honestly, even that 'thank you' lives rent-free in my head.",
  },
  {
    date: "14th Feb 2026",
    title: "Our first (virtual) date — Kissa",
    emoji: "💌",
    text: "Our first date was on a screen. It was a tiny little café called Kissa. It was clumsy. It was sweet. It was perfect.",
  },
  {
    date: "23rd Feb 2026",
    title: "The sentence that broke me (in the best way)",
    emoji: "🤍",
    text: "'Tanishq, I can't say I like you… because I love you.' I read it twice. Three times. Ten. I still couldn't believe this was really happening to me.",
  },
  {
    date: "April 2026 · Mumbai",
    title: "First time really together",
    emoji: "🌊",
    text: "I flew to Mumbai on 10th April. Our first physical date. We came closer in a way calls could never give us. Even losing your iPhone in an Uber and filing an FIR together became our adventure.",
  },
  {
    date: "30th April – 1st May",
    title: "Marine Drive and a sleepy head on your lap",
    emoji: "🌃",
    text: "I came back again. We sat at Marine Drive. I fell asleep on your lap — and the Mumbai police actually came to wake me up. We laughed about it for days.",
  },
  {
    date: "8th – 18th June 2026",
    title: "10 days that became my best ones",
    emoji: "🏙️",
    text: "You came to Hyderabad. We went back to the same place as our very first virtual date — this time, hand in hand. Go-karting. Deep talks. Long walks. The best ten days of my life. No competition.",
  },
  {
    date: "After you left",
    title: "The realisation",
    emoji: "🌙",
    text: "When you went back, I felt the silence. That's when I really, really understood how much I love you. I'm not great with words out loud — but Riyaa, you are it for me. Please stay. Forever.",
  },
];

const reasons = [
  "The way your laugh quietly rearranges my whole day.",
  "How 'apko koi help chaiye' became the softest sentence I've ever heard.",
  "Your good morning texts they decide my mood before chai does.",
  "The way you said 'I love you', and saved my whole life.",
  "How safe my heart feels next to yours, in any city, in any timezone.",
  "Your kindness it changes everything when it touches to me.",
  "Litti night, Niloufer evenings, Marine Drive midnight.",
  "Your name. I never get tired of saying it. Riyaa. Riyaa. Riyaa. Riyaa.",
];

function FlipCard({ index, text }: { index: number; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setOpen((v) => !v)}
      className="relative w-full text-left p-5 rounded-2xl bg-card border border-border shadow-card hover:border-rose/60 hover:shadow-soft transition group min-h-[140px]"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl group-hover:animate-heartbeat shrink-0">💗</span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Reason #{index + 1}</p>
          <AnimatePresence mode="wait">
            {open ? (
              <motion.p
                key="open"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-lg mt-2 leading-snug text-foreground"
              >
                {text}
              </motion.p>
            ) : (
              <motion.p
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-script text-2xl text-rose mt-1"
              >
                tap to read…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

function LoveExperience() {
  const [count, setCount] = useState(0);
  const [openedLetter, setOpenedLetter] = useState(false);
  const [activeStory, setActiveStory] = useState(0);

  return (
    <div className="relative bg-romance min-h-screen overflow-hidden">
      <FloatingHearts count={20} />

      {/* ribbon */}
      <div className="relative z-10 text-center pt-6 text-xs uppercase tracking-[0.4em] text-rose/80">
        · private universe · property of riyaa ·
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 py-14 sm:py-20 space-y-28 sm:space-y-36">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <p className="font-script text-3xl sm:text-4xl text-rose drift inline-block">hi, betuu 🤍</p>
          <h1 className="font-display text-6xl sm:text-8xl text-shimmer leading-[1] tracking-tight">
            Welcome to <br className="sm:hidden" /> your world.
          </h1>
          <p className="text-base sm:text-lg text-foreground/75 max-w-xl mx-auto leading-relaxed">
            I'm not very good with feelings out loud. So I poured them in here, quietly, one pixel at a time.
            Take your time. Scroll slowly. Smile often. <br />
            <span className="font-script text-2xl text-rose">Every inch of this is for you.</span>
          </p>
          <div className="flex justify-center pt-4">
            <span className="text-6xl animate-heartbeat inline-block">❤️</span>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground pt-2">
            — handwritten, by Tanishq
          </p>
        </motion.section>

        {/* LETTER */}
        <section className="text-center">
          <p className="font-script text-2xl text-rose">a letter, only for you</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-1 mb-10">My Riyaa,</h2>
          {!openedLetter ? (
            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenedLetter(true)}
              className="relative mx-auto w-72 h-52 bg-gradient-to-br from-blush to-rose rounded-2xl shadow-glow flex items-center justify-center text-primary-foreground drift"
            >
              <div className="absolute inset-0 flex items-center justify-center text-7xl">💌</div>
              <span className="absolute bottom-4 left-0 right-0 text-sm font-script text-2xl text-white/90">
                tap to open
              </span>
            </motion.button>
          ) : (
            <motion.article
              initial={{ opacity: 0, scale: 0.92, rotateX: -25 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="bg-card border border-border rounded-3xl shadow-soft p-7 sm:p-12 text-left max-w-2xl mx-auto"
            >
              <p className="font-script text-3xl text-rose">My Riyaa, my betuu, my cutuu, my whole heart —</p>
              <div className="mt-6 space-y-5 text-[17px] sm:text-lg leading-[1.85] text-foreground/90 font-display">
                <p>
                  If I sat down to write every single feeling you've given me since
                  31st December 2025, the words would run out long before the feeling ever did.
                  So I'll just try.
                </p>
                <p>
                  You walked up to me in that Airbnb, soft and curious, and asked
                  <em> "apko koi help chaiye?" </em> and something inside me said,
                  <span className="font-script text-2xl text-rose"> "kyaa merese koi puch raha hai??" </span>
                  I've been quietly melting ever since. Litti night, the chaos of New Year, Niloufer,
                  the first long drive on scotty, somewhere between all of it, I lost a small part of myself to you.
                  Honestly, I never want it back.
                </p>
                <p>
                  Then you went back to Delhi, and our story became a screen.
                  And still your good morning texts decided my mood. My heart raced every time
                  your name lit up. I split my office screen just so I wouldn't miss a single
                  message from you. Mad? Yes. Embarrassed? Not even a little.
                </p>
                <p>
                  One silly typo <em>'bhi' instead of 'nhi'</em> turned into hearing your voice
                  for the first time on a call. And on 7th Feb when I told you I liked you, you said
                  <em> "thank you" </em> and I was like kar dia kya galti.
                  Then on 23rd Feb you said <span className="font-script text-2xl text-rose">"I can't say I like you... because I love you ❤️" </span>
                  and I genuinely couldn't believe a girl this gentle, this kind, this beautiful
                  could love a boy like me. I still can't.
                </p>
                <p>
                  Mumbai happened. Marine Drive happened. Falling asleep on your lap while the
                  Mumbai police literally came to wake me up. Losing your iPhone in
                  an Uber and our first physical date being a police station also happened.
                  And somehow, every single one of those is one of my favourite memories now.
                </p>
                <p>
                  Then those 10 days in June, in Hyderabad 8th to 18th were quietly the best
                  ten days of my life. Go-karting with you, taking you to the same place as our
                  first virtual date but holding your hand this time, our long deep-talk nights.
                  I don't think I have ever been that completely <em>present</em> with another human.
                </p>
                <p>
                  And then you left. And the silence in my room got loud. That's when I really,
                  really understood. I am not just <em>in</em> love with you, Riyaa. I am made of it now.
                  I'm not the best at showing it. Sometimes I go quiet, sometimes I don't say
                  enough, please, never read that as me loving you less. It's the opposite.
                  You matter so much that I'm scared of saying it wrong.
                </p>
                <p className="text-rose">
                  So here it is, in writing, where I can't fumble it:
                  <br />
                  <strong>I love you, Riyaa. Today, tomorrow, every quiet day after.</strong>
                  <br />
                  Please stay with me. I'll be right here. Always.
                </p>
              </div>
              <p className="mt-8 font-script text-2xl text-right text-rose">
                — yours, your Babyyuuu 🤍
              </p>
            </motion.article>
          )}
        </section>

        {/* STORY TIMELINE — interactive */}
        <section>
          <div className="text-center mb-10">
            <p className="font-script text-2xl text-rose">our little forever, so far</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1">Us, in chapters.</h2>
            <p className="text-muted-foreground mt-3 text-sm">tap any chapter to relive it 💗</p>
          </div>

          <div className="grid md:grid-cols-[260px_1fr] gap-6">
            {/* chapter list */}
            <div className="space-y-2 md:max-h-[480px] md:overflow-y-auto pr-1">
              {story.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStory(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition ${activeStory === i
                    ? "bg-primary text-primary-foreground border-primary shadow-card"
                    : "bg-card hover:bg-blush/50 border-border"
                    }`}
                >
                  <p className={`text-[11px] uppercase tracking-widest ${activeStory === i ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {s.date}
                  </p>
                  <p className="font-display text-base leading-tight mt-0.5">
                    {s.emoji} {s.title}
                  </p>
                </button>
              ))}
            </div>

            {/* active chapter */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45 }}
                className="bg-card border border-border rounded-3xl shadow-card p-7 sm:p-10 min-h-[280px] flex flex-col justify-center"
              >
                <span className="text-5xl mb-3">{story[activeStory].emoji}</span>
                <p className="font-script text-2xl text-rose">{story[activeStory].date}</p>
                <h3 className="font-display text-2xl sm:text-3xl mt-1">{story[activeStory].title}</h3>
                <p className="mt-4 text-foreground/85 leading-relaxed text-[17px]">
                  {story[activeStory].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* REASONS */}
        <section>
          <div className="text-center mb-10">
            <p className="font-script text-2xl text-rose">{reasons.length} reasons (of infinite)</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1">Why I love you.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => (
              <FlipCard key={i} index={i} text={r} />
            ))}
          </div>
        </section>

        {/* NICKNAMES strip */}
        <section className="text-center bg-card/70 backdrop-blur border border-border rounded-3xl py-10 px-6 shadow-card">
          <p className="font-script text-2xl text-rose">in our private dictionary</p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {["betuu", "cutuu", "Babyyuuu", "my Riyaa", "sara hua chua", "my whole world"].map((n) => (
              <span
                key={n}
                className="px-5 py-2 rounded-full bg-blush/50 border border-rose/30 font-display text-lg text-foreground"
              >
                {n}
              </span>
            ))}
          </div>
        </section>

        {/* COUNTER */}
        <section className="text-center bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-soft">
          <p className="font-script text-2xl text-rose">a tiny game</p>
          <h2 className="font-display text-3xl sm:text-4xl mt-1">How much do I love you?</h2>
          <p className="text-muted-foreground mt-2">go ahead… keep pressing. I'll keep loving.</p>
          <div className="my-8">
            <motion.div
              key={count}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.35 }}
              className="text-7xl sm:text-8xl font-display text-shimmer"
            >
              {count.toLocaleString()}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">…and still counting.</p>
          </div>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:scale-105 active:scale-95 transition text-lg"
          >
            ❤️ +1 unit of love
          </button>
          {count >= 10 && count < 50 && (
            <p className="mt-4 font-script text-xl text-rose">okay that's already a lot 🥹</p>
          )}
          {count >= 50 && count < 100 && (
            <p className="mt-4 font-script text-xl text-rose">my hand hurts but my heart doesn't 💗</p>
          )}
          {count >= 100 && count < 250 && (
            <p className="mt-4 font-script text-xl text-rose">see? infinite. told you. ∞</p>
          )}
          {count >= 250 && (
            <p className="mt-4 font-script text-xl text-rose">okay betuu now go drink some water 🤍</p>
          )}
        </section>

        {/* PROMISES */}
        <section>
          <div className="text-center mb-8">
            <p className="font-script text-2xl text-rose">a few quiet promises</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-1">From me, to you.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "I'll keep choosing you. Every quiet day. Even the boring ones. Especially those.",
              "I'll get better at saying it out loud. Until then, look here whenever you doubt it.",
              "Your good mornings will always have a reply. Always.",
              "Hyderabad, Delhi, Mumbai, anywhere — I'll meet you in the middle. Or the end. Or anywhere.",
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <p className="font-script text-xl text-rose">promise #{i + 1}</p>
                <p className="mt-2 font-display text-lg leading-snug text-foreground/90">{p}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINAL */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center pb-10"
        >
          <p className="font-script text-3xl text-rose">in case i missed to say it..</p>
          <h2 className="font-display text-5xl sm:text-7xl text-shimmer mt-4 leading-[1.05]">
            I love you, Riyaa.
          </h2>
          <p className="mt-5 text-foreground/75 max-w-lg mx-auto">
            today, tomorrow, and every quiet day after. <br />
            stay with me, betuu. always.
          </p>
          <p className="mt-10 text-5xl animate-heartbeat">❤️</p>
        </motion.section>

        {/* SIGNATURE */}
        <footer className="text-center pt-8 border-t border-border/60">
          <p className="font-script text-2xl text-rose">made with love by Tanishq</p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">
            for one girl in this whole world · Riyaa 🌸
          </p>
          <p className="text-xs text-center mt-1 text-muted-foreground">
  © 2026 Unauthorized copying prohibited.<br />
  Every memory preserved with love by Tanishq for Riya.
</p>
        </footer>
      </main>
    </div>
  );
}

function RiyaaWorld() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (unlocked) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [unlocked]);
  return unlocked ? <LoveExperience /> : <HeartGate onUnlock={() => setUnlocked(true)} />;
}
