import { Github, Linkedin, Mail, Twitter, ChevronLeft, ChevronRight, Settings, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import { Navbar } from "@/components/Navbar";
import { Updates } from "@/components/Updates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const socials = [
    { icon: Mail, href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Linkedin, href: "https://linkedin.com/in/muhibwaqar" },
    { icon: Github, href: "https://github.com/muhibwqr" },
    { icon: Twitter, href: "https://x.com/muhibwqr" }
  ];

  const currently = [
    { name: "Math & Business @ Waterloo", logo: "🏛️" }
  ];

  const previously = [
    { name: "Founding Fullstack Engineer", company: "Stealth AI", logo: "🚀" },
    { name: "Software & Systems Engineering", company: "E-commerce + Non-profits", logo: "💼" },
    { name: "Cybersecurity Engineering", company: "Canadian Cyber Inc.", logo: "🔒" }
  ];

  const projects = [
    "goosetype.com — typing arena",
    "triageo — AI security incident responder",
    "anti-productivity doomscroll app",
    "campus typing championship",
    "course generation & RAG tools"
  ];

  const writing = [
    "why ontology for text-to-sql?",
    "building at scale"
  ];

  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
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
      <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-black/60 backdrop-blur-sm pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        
        {/* Header - Top section */}
        <header className="px-6 sm:px-8 py-8 sm:py-12 flex justify-between items-start">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white">
            hi im muhib
          </h1>
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-black/20 dark:border-white/20 flex-shrink-0">
            <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
            <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
              MW
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 sm:px-8 pb-24">
          <div className="max-w-4xl space-y-12">
            
            {/* Currently */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Currently
              </h2>
              <div className="space-y-3">
                {currently.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{item.logo}</span>
                    <span className="text-base text-black dark:text-white">{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Previously */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Previously
              </h2>
              <div className="space-y-3">
                {previously.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{item.logo}</span>
                    <div>
                      <span className="text-base text-black dark:text-white">{item.name}</span>
                      {item.company && (
                        <span className="text-base text-gray-600 dark:text-gray-400 ml-2">@ {item.company}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Projects
              </h2>
              <div className="space-y-2 mb-6">
                {projects.map((project, index) => (
                  <div key={index} className="text-base text-black dark:text-white">
                    {project}
                  </div>
                ))}
              </div>
              
              {/* Detailed Project Cards */}
              <div className="space-y-4 mt-6">
                <Card className="glass hover-lift border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">
                          goosetype.com — typing arena
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's email security flagged it as phishing and auto-banned it — so I rebranded and rebuilt it into GooseType.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        react, ts, tailwind, vercel
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <a
                          href="https://goosetype.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass hover-lift border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">
                          Triageo — AI security incident responder (HTN 2025)
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Slack-native agent for 5-second triage over OWASP. Severity scoring, RAG, log insights, recommended actions.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        python, fastapi, cohere, slack api
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass hover-lift border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2">
                        anti-productivity doomscroll app — GoOnHacks Winner
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        Satirical app that punishes productivity and rewards doomscrolling (AI calls your dad).
                      </CardDescription>
                    </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        swift, supabase, twilio
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Writing */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Writing
              </h2>
              <div className="space-y-2">
                {writing.map((article, index) => (
                  <div key={index} className="text-base text-black dark:text-white">
                    {article}
                  </div>
                ))}
              </div>
            </section>

            {/* Updates */}
            <section>
              <Updates />
            </section>
          </div>
        </main>

        {/* Footer - Bottom section */}
        <footer className="fixed bottom-0 left-0 right-0 z-20 px-6 sm:px-8 py-6">
          <div className="flex justify-between items-end">
            {/* Left side - Navigation */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
                  <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
                </button>
                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
                  <Settings className="w-5 h-5 text-black dark:text-white" />
                </button>
                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
                  <ChevronRight className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right side - Language selector (optional) */}
            <div className="text-sm text-black dark:text-white">
              <span className="opacity-100">EN</span>
              <span className="opacity-50 mx-1">/</span>
              <span className="opacity-50">中文</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
