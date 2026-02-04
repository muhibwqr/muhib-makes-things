import { ArrowLeft, ExternalLink } from "lucide-react";
import Dock from "@/components/Dock";
import Cubes from "@/components/Cubes";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDockItems } from "@/lib/dockItems";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectData {
  id: string;
  title: string;
  fullTitle: string;
  description: string;
  longDescription: string;
  stack: string;
  link: string;
  previewVideo?: string;
  previewImage?: string;
  previewImages?: string[];
  highlights?: string[];
  challenges?: string[];
  results?: string[];
}

const projectsData: ProjectData[] = [
  {
    id: "goosetype",
    title: "goosetype.com — typing arena (5000+ tests)",
    fullTitle: "GooseType — Typing Arena",
    description: "Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's security flagged it as phishing and banned it. Rebranded to GooseType, rebuilt in 48h (5000+ tests taken).",
    longDescription: "GooseType is a real-time typing arena where students compete in typing tests. What started as a simple idea to help students practice typing quickly became a viral hit at the University of Waterloo.\n\nOriginally launched as 'Waterloo Type', the platform gained 40 signups within minutes of launch. However, the university's security team flagged it as a potential phishing attempt and blocked access. This forced a complete rebrand and rebuild in just 48 hours.\n\nThe new platform, GooseType, features real-time leaderboards, customizable test durations, and a competitive ranking system. Within 12 hours of relaunch, it had over 500 active users and has since processed over 5,000 typing tests.",
    stack: "react, ts, tailwind, vercel",
    link: "https://goosetype.com",
    previewVideo: "/goosetype-preview.mp4",
    highlights: [
      "500+ users in 12 hours after relaunch",
      "5,000+ typing tests completed",
      "Rebuilt and rebranded in 48 hours after security block",
      "Real-time leaderboard and competitive rankings",
      "Customizable test durations and difficulty levels"
    ],
    challenges: [
      "University security flagged original domain as phishing",
      "Had to rebrand and rebuild entire platform in 48 hours",
      "Managing rapid user growth and server load",
      "Creating engaging competitive mechanics"
    ],
    results: [
      "Successfully relaunched with zero user churn",
      "Maintained 80%+ user retention rate",
      "Built a sustainable community of typists",
      "Proved concept viability despite setbacks"
    ]
  },
  {
    id: "triageo",
    title: "Triageo — AI security incident responder (HTN 2025)",
    fullTitle: "Triageo — AI Security Incident Responder",
    description: "Slack-native AI agent that triages security incidents in under 5 seconds. OWASP severity scoring, RAG over logs, recommended actions with tagged responders. Learns from past incidents to flag similar patterns. HTN 2025 — got kudos from judges.",
    longDescription: "Triageo is a Slack-native AI agent designed to revolutionize security incident response. Built for Hack the North 2025, it uses advanced AI to triage security incidents in under 5 seconds, dramatically reducing response times and improving security posture.\n\nThe system integrates seamlessly with Slack, allowing security teams to receive instant alerts and recommendations. It uses OWASP severity scoring to prioritize incidents, performs RAG (Retrieval-Augmented Generation) over security logs to provide context, and suggests specific actions with tagged responders.\n\nWhat sets Triageo apart is its learning capability—it analyzes past incidents to identify similar patterns, helping teams catch recurring issues before they escalate. The system received kudos from HTN 2025 judges for its practical approach to a real-world problem.",
    stack: "python, fastapi, cohere, slack api",
    link: "https://devpost.com/software/triageo",
    previewImages: ['/triageo-1.jpg', '/triageo-2.jpg'],
    highlights: [
      "5-second incident triage time",
      "OWASP severity scoring integration",
      "RAG over security logs for context",
      "Pattern recognition from past incidents",
      "Slack-native integration for seamless workflow"
    ],
    challenges: [
      "Processing large volumes of security logs in real-time",
      "Accurate severity scoring without false positives",
      "Integrating with Slack's API and webhook system",
      "Training the AI to recognize incident patterns"
    ],
    results: [
      "Received kudos from HTN 2025 judges",
      "Demonstrated practical real-world application",
      "Proved AI can significantly reduce incident response time",
      "Created a scalable architecture for enterprise use"
    ]
  },
  {
    id: "scrollify",
    title: "Scrollify — anti-productivity doomscroll app (GoOnHacks25)",
    fullTitle: "Scrollify — Anti-Productivity Doomscroll App",
    description: "Scrollify — an app that maximizes doomscrolling. If you're off social media for 5+ mins, it triggers a Twilio voice AI agent that calls your dad. Features live leaderboard, browser extension tracking, and iOS app blocking. Won the 67 award at GoOnHacks25.",
    longDescription: "Scrollify is a satirical anti-productivity app that gamifies doomscrolling. The concept is simple yet powerful: if you're off social media for more than 5 minutes, the app triggers a Twilio voice AI agent that calls your dad to check in.\n\nBuilt for GoOnHacks25, Scrollify features a live leaderboard showing who's been scrolling the longest, browser extension tracking for desktop usage, and iOS app blocking capabilities. The app uses humor and social accountability to highlight the absurdity of our relationship with social media.\n\nThe project won the 67 award at GoOnHacks25, impressing judges with its creative approach to addressing digital wellness through satire. It combines multiple technologies—Swift for iOS, Supabase for backend, Twilio for voice AI, and browser extensions—to create a comprehensive tracking and intervention system.",
    stack: "swift, supabase, twilio",
    link: "https://devpost.com/software/scrollify-tp4a2l",
    previewVideo: '/scrollify.mov',
    highlights: [
      "Won the 67 award at GoOnHacks25",
      "Twilio voice AI integration for automated calls",
      "Live leaderboard for competitive doomscrolling",
      "Cross-platform tracking (browser extension + iOS)",
      "Satirical approach to digital wellness"
    ],
    challenges: [
      "Integrating Twilio voice AI with natural conversation flow",
      "Building reliable browser extension tracking",
      "Creating iOS app blocking mechanisms",
      "Designing a compelling user experience despite the satirical nature"
    ],
    results: [
      "Won the 67 award at GoOnHacks25",
      "Demonstrated creative problem-solving approach",
      "Created engaging social accountability mechanism",
      "Successfully integrated multiple platforms and technologies"
    ]
  },
  {
    id: "brev-analyzer",
    title: "Model Cost Analyzer — brev.dev instance optimizer",
    fullTitle: "Model Cost Analyzer — Brev.Dev Instance Optimizer",
    description: "A friend and I were setting up a GPU instance on Brev.Dev by NVIDIA and were struggling to pick an instance for our model that wouldn't cost us extra.",
    longDescription: "While setting up a GPU instance on Brev.Dev by NVIDIA, my friend and I found it challenging to select the right instance for our model without overspending. The platform offers various GPU options with different pricing tiers, and choosing the wrong instance could lead to unnecessary costs or insufficient resources.\n\nTo solve this problem, I built a Model Cost Analyzer that helps developers choose the optimal GPU instance based on their model's requirements and budget constraints. The tool analyzes model specifications, compares available GPU instances, and recommends the most cost-effective option that meets performance needs.\n\nThe analyzer takes into account factors like model size, inference speed requirements, memory needs, and budget limits to provide intelligent recommendations. This helps developers avoid over-provisioning expensive instances or under-provisioning and facing performance issues.",
    stack: "python, jupyter notebook, shell",
    link: "https://brev.dev",
    previewVideo: "/brev-instance.mp4",
    highlights: [
      "Helps choose optimal GPU instance for ML models",
      "Cost-effective instance recommendations",
      "Analyzes model requirements vs. available instances",
      "Prevents over-provisioning and unnecessary costs",
      "Integrates with Brev.Dev platform"
    ],
    challenges: [
      "Understanding different GPU instance specifications",
      "Matching model requirements to instance capabilities",
      "Calculating cost vs. performance trade-offs",
      "Integrating with Brev.Dev API"
    ],
    results: [
      "Successfully helped choose the right instance for our model",
      "Saved costs by avoiding over-provisioning",
      "Created a reusable tool for future projects",
      "Demonstrated practical problem-solving approach"
    ]
  },
  {
    id: "flowerOS",
    title: "flowerOS — dedicated to zahid mehboob",
    fullTitle: "flowerOS — dedicated to zahid mehboob",
    description: "If you sacrifice purpose for technical prowess, you're ngmi. A tool built for a seventy-year-old artisan—my grandfather—to bridge the engineering principles of tech with the workflow of hand sewn ribbons and floral motifs.",
    longDescription: `If you sacrifice purpose for technical prowess, you're ngmi.

A few weeks ago, I returned to Pakistan. It is a place that remains, stubbornly and beautifully, my home. I went there to find a retreat from the noise, but I quickly realized that the infectious waterloo mindset does not have an off switch.

While my surroundings were filled with the warmth of family, my internal dialogue remained cold. I felt the guilt of stasis. I felt as though every hour not spent building was an hour surrendered to irrelevance. I was searching for a spark in the abstract, yet I found it in the tangible.

I found it in my grandfather.

Nearing seventy years old, my grandfather is the silent architect of his own world. For decades, he has operated a business centered on the delicate art of hand sewn ribbons and floral motifs. These are the intricate details that breathe life into traditional clothing and footwear. It was patient, disciplined, and deeply human.

Yet I also saw the friction. I saw how the pace of the modern world was putting pressure on his analog systems. Fragmented communication and manual logistics were creating barriers between his vision and his team.

In that moment, my restlessness finally found its target.

This is flowerOS.

Stop building for your resume and start building for your legacy. flowerOS is a bridge. It is an attempt to take the engineering principles of the tech world and distill them into a tool that honors the workflow of a seventy year old artisan.

This project was never about chasing a trend or optimizing a metric. While it's not the craziest system, it was made fast and specifically for a purpose, while life has been further than what I can control, I plan on (inshallah) overengineering it to make sure it works out well. It was about using code to preserve a legacy. I have learned that the most profound innovation happens when we stop looking at technology as a way to replace the old and start looking at it as a way to empower it.

Code is just the medium. Purpose is the masterpiece.`,
    stack: "built for purpose",
    link: "#",
    previewVideo: "/cursorful-video-1770059587142.mp4",
    highlights: [
      "Bridge between tech principles and artisan workflow",
      "Built for a seventy-year-old craftsman",
      "Hand sewn ribbons and floral motifs business",
      "Preserving legacy through code",
      "Empowering the old instead of replacing it"
    ],
    challenges: [
      "Fragmented communication and manual logistics",
      "Analog systems under pressure from modern pace",
      "Honoring workflow while introducing tools"
    ],
    results: [
      "A tool that honors the workflow of an artisan",
      "Code as a medium for purpose",
      "Legacy preserved and empowered by technology"
    ]
  },
  {
    id: "cursor-doc-intelligence",
    title: "Document intelligence pipeline — nv-ingest + NIMs (cursor.md)",
    fullTitle: "Document Intelligence Pipeline — nv-ingest + NIMs",
    description: "RL documentation is a desert. After a conversation with Carter Abdallah about this gap, we built a document intelligence pipeline on NVIDIA nv-ingest with NIMs for multimodal extraction. We fed a real Amazon PRD through the system: could an agent reconstruct the entire product spec from raw JSON? Cursor analyzed the full schema and mapped the logic within seconds.",
    longDescription: `RL documentation is a desert. It is a problem that goes beyond missing files because it defines how the next generation of AI systems are being built.

After a conversation with Carter Abdallah about this gap, I called Demir Eren.

Within twenty-four hours, we were already in the middle of a build.

We constructed a document intelligence pipeline on top of NVIDIA nv-ingest, layering NVIDIA NIMs for multimodal extraction.

We developed our own reasoning frameworks to analyze the structured output, then fed a real Amazon PRD (we found it online) through the system.

The challenge was simple: could an agent reconstruct the entire product spec using nothing but the raw JSON?

We previously ran this through claude.md, where the agent successfully reconstructed the functional requirements, user journeys, and system architecture from the structured data alone.

We just finished the run with cursor.md.

Using the same nv-ingest pipeline, Cursor successfully analyzed the entire schema and mapped the logic within seconds.

Seeing a code-native framework interpret complex layout logic with that kind of speed changes the math on how we process enterprise data.

The screen recording below shows the whole process from ingestion to the final analysis.

For anyone attempting to replicate this, do not run the pipeline bare metal on a 2020 MacBook Air. My machine crashed five times before I admitted defeat and moved everything into Docker.

On that note, if anyone wants to sponsor a new laptop for a Waterloo student who is currently melting his hardware in the name of progress, my DMs are open.`,
    stack: "nvidia nv-ingest, nvidia NIMs, docker",
    link: "#",
    previewVideo: "/cursor-doc-intelligence.mov",
    highlights: [
      "Document intelligence pipeline on NVIDIA nv-ingest",
      "NVIDIA NIMs for multimodal extraction",
      "Agent reconstructs product spec from raw JSON",
      "cursor.md analyzed full schema and mapped logic within seconds",
      "claude.md reconstructed requirements, user journeys, system architecture"
    ],
    challenges: [
      "RL documentation gap",
      "Running pipeline on 2020 MacBook Air (crashed 5× → moved to Docker)",
      "Interpreting complex layout logic from structured data"
    ],
    results: [
      "Code-native framework interpreting enterprise data at speed",
      "End-to-end run from ingestion to analysis",
      "Proof that agents can reconstruct specs from structured output alone"
    ]
  }
];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dockItems = useDockItems();
  const isMobile = useIsMobile();

  const project = projectsData.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen relative bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        {/* Black overlay for dark mode */}
        <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen relative bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      {/* Black overlay for dark mode */}
      <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none"></div>
      
      <div className="relative z-10 min-h-screen">
        <Dock 
          items={dockItems}
          panelHeight={isMobile ? 56 : 68}
          baseItemSize={isMobile ? 42 : 50}
          magnification={70}
        />
        
        <main className="px-3 sm:px-6 py-6 sm:py-12 pb-24 sm:pb-12 section-spacing">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 min-h-[44px] -ml-2 pl-2 pr-3 py-2 transition-colors touch-manipulation"
            >
              <ArrowLeft size={18} />
              <span>Back to Projects</span>
            </button>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="hero-title mb-3 sm:mb-4">{project.fullTitle}</h1>
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity min-h-[44px] items-center touch-manipulation"
                  >
                    <ExternalLink size={18} />
                    <span>View Project</span>
                  </a>
                </div>
              </div>

              {project.previewVideo && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <video 
                    src={project.previewVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-auto"
                  />
                </div>
              )}

              {project.previewImages && project.previewImages.length > 0 && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src={project.previewImages[0]} 
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {project.previewImage && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src={project.previewImage} 
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="whitespace-pre-line text-foreground">
                {project.longDescription}
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Tech Stack</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">{project.stack}</p>
                </div>

                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Highlights</h2>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {project.challenges && project.challenges.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Challenges</h2>
                  <ul className="space-y-2">
                    {project.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.results && project.results.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Results</h2>
                  <ul className="space-y-2">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

