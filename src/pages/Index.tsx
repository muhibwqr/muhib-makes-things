import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    // Default to dark mode if no class is set
    if (!root.classList.contains("dark") && !root.classList.contains("light")) {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      const isDarkMode = root.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = isDark ? "light" : "dark";
    root.classList.remove(isDark ? "dark" : "light");
    root.classList.add(newTheme);
    setIsDark(!isDark);
  };

  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar" }
  ];

  return (
    <div className={`min-h-screen relative ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* LiquidEther background animation */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Semi-transparent backdrop for text readability */}
      <div
        className={`fixed inset-0 z-[1] ${
          isDark ? "bg-black/60" : "bg-white/60"
        } backdrop-blur-sm pointer-events-none`}
      ></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        <div className="relative z-10">
          {/* Header */}
          <header
            className={`container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-4 border-b ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
                <AvatarFallback
                  className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                >
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1
                  className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 tracking-[0.2em] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  MUHIB WAQAR
                </h1>
                <p className={`text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  math & business @ waterloo • software + security engineer • product builder
                </p>
              </div>
            </div>
            <nav className="text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-xs sm:text-sm ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      : "bg-black/5 hover:bg-black/10 border border-black/10 text-black"
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Dark</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl space-y-16">
            {/* Who I am */}
            <section>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ who I am
              </h2>
              <div
                className={`space-y-4 text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <p>
                  I grew up believing discipline, humility, and hard work are forms of worship —
                  that you show gratitude through action.
                </p>
                <p>
                  That shaped everything: in high school I tried multiple businesses, built tools,
                  failed fast, and kept shipping.
                </p>
                <p>
                  I didn’t take loans for university (religious reasoning).
                </p>
                <p>
                  Instead, I worked three part-time jobs while doing honours Math &amp; Business at
                  Waterloo — sometimes washing dishes at 1am, then going home to code and study
                  until sunrise.
                </p>
                <p>
                  During a week of exams, quizzes, and assignments, I worked all three jobs.
                </p>
                <p>No boss dissatisfied. No deliverable missed.</p>
                <p>I don’t wait for ideal conditions — I move anyway.</p>
                <p>
                  That hunger shows up in my engineering: calm under pressure, fast execution, zero
                  entitlement, high ownership.
                </p>
              </div>
            </section>

            {/* What I've built */}
            <section>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ what I've built
              </h2>
              <div
                className={`space-y-4 text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <div>
                  <p className="font-semibold">
                    goosetype.com — typing arena
                  </p>
                  <p>
                    Shipped in 1 week → 500 users in 12 hours.
                  </p>
                  <p>
                    Originally “Waterloo Type” but after 40 students signed up instantly, Waterloo’s
                    email security flagged it as phishing and auto-banned it — so I rebranded and
                    rebuilt it into GooseType.
                  </p>
                  <p className="text-sm">
                    stack: react, ts, tailwind, vercel
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    campus typing championship (banned variant)
                  </p>
                  <p>Waterloo-only version; banned due to security auto-flags.</p>
                  <p className="text-sm">stack: ts</p>
                </div>

                <div>
                  <p className="font-semibold">
                    triageo — AI security incident responder (HTN 2025)
                  </p>
                  <p>Slack-native agent for 5-second triage over OWASP.</p>
                  <p>Severity scoring, RAG, log insights, recommended actions.</p>
                  <p className="text-sm">
                    stack: python, fastapi, cohere, slack api
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    anti-productivity doomscroll app — GoOnHacks Winner
                  </p>
                  <p>
                    Satirical app that punishes productivity and rewards doomscrolling (AI calls
                    your dad).
                  </p>
                  <p className="text-sm">stack: swift, supabase, twilio</p>
                </div>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ experience
              </h2>
              <div
                className={`space-y-4 text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <p>
                  <span className="font-semibold">founding fullstack engineer — stealth ai</span>{" "}
                  — Built interactive learning systems, RAG workflows, backend infra, UI/UX.
                </p>
                <p>
                  <span className="font-semibold">
                    software &amp; systems engineering — e-commerce + non-profits
                  </span>{" "}
                  — Shopify automation, internal tooling, workflow systems.
                </p>
                <p>
                  <span className="font-semibold">cybersecurity engineering — canadian cyber inc.</span>{" "}
                  — aws/azure integrations, bitlocker deployment, iso/soc2 documentation.
                </p>
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2
                className={`text-xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ certifications
              </h2>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                aws ccp • az-900 • ccna1 • ccst • python it specialist • cybersecurity essentials
              </p>
            </section>

            {/* Ethos */}
            <section>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ ethos
              </h2>
              <div
                className={`space-y-2 text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <p>ship fast • stay humble • solve real problems • grateful, not entitled</p>
                <p>high pressure? steady.</p>
                <p>big workload? execute.</p>
                <p>new domain? learn fast.</p>
              </div>
            </section>

            {/* Let's talk + contact */}
            <section>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ let’s talk
              </h2>
              <p
                className={`mb-6 text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                I’m looking for Summer 2026 SWE / AppSec / fullstack roles — ideally founder-led
                teams that value speed, resilience, and ownership.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${
                        isDark
                          ? "text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
                          : "text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {social.label}
                    </a>
                  );
                })}
                <a
                  href="/muhib_waqar_resume.pdf"
                  download="muhib_waqar_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${
                    isDark
                      ? "text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
                      : "text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5"
                  }`}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Resume
                </a>
              </div>
            </section>

            {/* CTA footer */}
            <div
              className={`text-center pt-8 border-t ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            >
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                high ownership, fast execution, zero entitlement — let&apos;s build.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;

