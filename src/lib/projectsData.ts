export type ProjectData = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  stack: string;
  link: string | null;
  previewVideo?: string;
  previewImage?: string;
  previewImages?: string[];
  highlights?: string[];
  challenges?: string[];
  results?: string[];
};

export const projectsData: ProjectData[] = [
  {
    id: "goosetype",
    title: "goosetype.com",
    tagline: "typing arena, 5000+ tests",
    description:
      "shipped in 1 week, 500 users in 12 hours. originally 'waterloo type' but after 40 students signed up instantly, waterloo's security flagged it as phishing and banned it. rebranded to goosetype, rebuilt in 48h, 5000+ tests taken.",
    longDescription:
      "goosetype is a real-time typing arena where students compete in typing tests. what started as a simple idea to help students practice typing quickly became a viral hit at the university of waterloo.\n\noriginally launched as 'waterloo type', the platform gained 40 signups within minutes of launch. however, the university's security team flagged it as a potential phishing attempt and blocked access. this forced a complete rebrand and rebuild in just 48 hours.\n\nthe new platform, goosetype, features real-time leaderboards, customizable test durations, and a competitive ranking system. within 12 hours of relaunch, it had over 500 active users and has since processed over 5,000 typing tests.",
    stack: "react, ts, tailwind, vercel",
    link: "https://goosetype.com",
    previewVideo: "/goosetype-preview.mp4",
    previewImage: "/goosetype-preview.png",
    highlights: [
      "500+ users in 12 hours after relaunch",
      "5,000+ typing tests completed",
      "rebuilt and rebranded in 48 hours after security block",
      "real-time leaderboard and competitive rankings",
      "customizable test durations and difficulty levels",
    ],
    challenges: [
      "university security flagged original domain as phishing",
      "had to rebrand and rebuild entire platform in 48 hours",
      "managing rapid user growth and server load",
      "creating engaging competitive mechanics",
    ],
    results: [
      "successfully relaunched with zero user churn",
      "maintained 80%+ user retention rate",
      "built a sustainable community of typists",
      "proved concept viability despite setbacks",
    ],
  },
  {
    id: "triageo",
    title: "triageo",
    tagline: "ai security incident responder, htn 2025",
    description:
      "slack-native ai agent that triages security incidents in under 5 seconds. owasp severity scoring, rag over logs, recommended actions with tagged responders. learns from past incidents to flag similar patterns. got kudos from judges.",
    longDescription:
      "triageo is a slack-native ai agent designed to revolutionize security incident response. built for hack the north 2025, it uses advanced ai to triage security incidents in under 5 seconds, dramatically reducing response times and improving security posture.\n\nthe system integrates seamlessly with slack, allowing security teams to receive instant alerts and recommendations. it uses owasp severity scoring to prioritize incidents, performs rag (retrieval-augmented generation) over security logs to provide context, and suggests specific actions with tagged responders.\n\nwhat sets triageo apart is its learning capability — it analyzes past incidents to identify similar patterns, helping teams catch recurring issues before they escalate. the system received kudos from htn 2025 judges for its practical approach to a real-world problem.",
    stack: "python, fastapi, cohere, slack api",
    link: "https://devpost.com/software/triageo",
    previewImage: "/triageo-preview.jpg",
    previewImages: ["/triageo-1.jpg", "/triageo-2.jpg"],
    highlights: [
      "5-second incident triage time",
      "owasp severity scoring integration",
      "rag over security logs for context",
      "pattern recognition from past incidents",
      "slack-native integration for seamless workflow",
    ],
    challenges: [
      "processing large volumes of security logs in real-time",
      "accurate severity scoring without false positives",
      "integrating with slack's api and webhook system",
      "training the ai to recognize incident patterns",
    ],
    results: [
      "received kudos from htn 2025 judges",
      "demonstrated practical real-world application",
      "proved ai can significantly reduce incident response time",
      "created a scalable architecture for enterprise use",
    ],
  },
  {
    id: "scrollify",
    title: "scrollify",
    tagline: "anti-productivity doomscroll app, goonhacks25",
    description:
      "an app that maximizes doomscrolling. if you're off social media for 5+ mins, it triggers a twilio voice ai agent that calls your dad. features live leaderboard, browser extension tracking, and ios app blocking. won the 67 award at goonhacks25.",
    longDescription:
      "scrollify is a satirical anti-productivity app that gamifies doomscrolling. the concept is simple yet powerful: if you're off social media for more than 5 minutes, the app triggers a twilio voice ai agent that calls your dad to check in.\n\nbuilt for goonhacks25, scrollify features a live leaderboard showing who's been scrolling the longest, browser extension tracking for desktop usage, and ios app blocking capabilities. the app uses humor and social accountability to highlight the absurdity of our relationship with social media.\n\nthe project won the 67 award at goonhacks25, impressing judges with its creative approach to addressing digital wellness through satire. it combines multiple technologies — swift for ios, supabase for backend, twilio for voice ai, and browser extensions — to create a comprehensive tracking and intervention system.",
    stack: "swift, supabase, twilio",
    link: "https://devpost.com/software/scrollify-tp4a2l",
    previewVideo: "/scrollify.mov",
    highlights: [
      "won the 67 award at goonhacks25",
      "twilio voice ai integration for automated calls",
      "live leaderboard for competitive doomscrolling",
      "cross-platform tracking (browser extension + ios)",
      "satirical approach to digital wellness",
    ],
    challenges: [
      "integrating twilio voice ai with natural conversation flow",
      "building reliable browser extension tracking",
      "creating ios app blocking mechanisms",
      "designing a compelling user experience despite the satirical nature",
    ],
    results: [
      "won the 67 award at goonhacks25",
      "demonstrated creative problem-solving approach",
      "created engaging social accountability mechanism",
      "successfully integrated multiple platforms and technologies",
    ],
  },
  {
    id: "brev-analyzer",
    title: "model cost analyzer",
    tagline: "brev.dev instance optimizer",
    description:
      "a friend and i were setting up a gpu instance on brev.dev by nvidia and were struggling to pick an instance for our model that wouldn't cost us extra. built a cost analyzer to help choose the right gpu instance based on model requirements and budget constraints.",
    longDescription:
      "while setting up a gpu instance on brev.dev by nvidia, my friend and i found it challenging to select the right instance for our model without overspending. the platform offers various gpu options with different pricing tiers, and choosing the wrong instance could lead to unnecessary costs or insufficient resources.\n\nto solve this problem, i built a model cost analyzer that helps developers choose the optimal gpu instance based on their model's requirements and budget constraints. the tool analyzes model specifications, compares available gpu instances, and recommends the most cost-effective option that meets performance needs.\n\nthe analyzer takes into account factors like model size, inference speed requirements, memory needs, and budget limits to provide intelligent recommendations. this helps developers avoid over-provisioning expensive instances or under-provisioning and facing performance issues.",
    stack: "python, jupyter notebook, shell",
    link: "https://brev.dev",
    previewVideo: "/brev-instance.mp4",
    highlights: [
      "helps choose optimal gpu instance for ml models",
      "cost-effective instance recommendations",
      "analyzes model requirements vs. available instances",
      "prevents over-provisioning and unnecessary costs",
      "integrates with brev.dev platform",
    ],
    challenges: [
      "understanding different gpu instance specifications",
      "matching model requirements to instance capabilities",
      "calculating cost vs. performance trade-offs",
      "integrating with brev.dev api",
    ],
    results: [
      "successfully helped choose the right instance for our model",
      "saved costs by avoiding over-provisioning",
      "created a reusable tool for future projects",
      "demonstrated practical problem-solving approach",
    ],
  },
  {
    id: "flowerOS",
    title: "flowerOS",
    tagline: "dedicated to zahid mehboob",
    description:
      "if you sacrifice purpose for technical prowess, you're ngmi. a tool built for a seventy-year-old artisan, my grandfather, to bridge the engineering principles of tech with the workflow of hand sewn ribbons and floral motifs.",
    longDescription:
      "if you sacrifice purpose for technical prowess, you're ngmi.\n\na few weeks ago, i returned to pakistan. it is a place that remains, stubbornly and beautifully, my home. i went there to find a retreat from the noise, but i quickly realized that the infectious waterloo mindset does not have an off switch.\n\nwhile my surroundings were filled with the warmth of family, my internal dialogue remained cold. i felt the guilt of stasis. i felt as though every hour not spent building was an hour surrendered to irrelevance. i was searching for a spark in the abstract, yet i found it in the tangible.\n\ni found it in my grandfather.\n\nnearing seventy years old, my grandfather is the silent architect of his own world. for decades, he has operated a business centered on the delicate art of hand sewn ribbons and floral motifs. these are the intricate details that breathe life into traditional clothing and footwear. it was patient, disciplined, and deeply human.\n\nyet i also saw the friction. i saw how the pace of the modern world was putting pressure on his analog systems. fragmented communication and manual logistics were creating barriers between his vision and his team.\n\nin that moment, my restlessness finally found its target.\n\nthis is flowerOS.\n\nstop building for your resume and start building for your legacy. flowerOS is a bridge. it is an attempt to take the engineering principles of the tech world and distill them into a tool that honors the workflow of a seventy year old artisan.\n\nthis project was never about chasing a trend or optimizing a metric. while it's not the craziest system, it was made fast and specifically for a purpose, while life has been further than what i can control, i plan on (inshallah) overengineering it to make sure it works out well. it was about using code to preserve a legacy. i have learned that the most profound innovation happens when we stop looking at technology as a way to replace the old and start looking at it as a way to empower it.\n\ncode is just the medium. purpose is the masterpiece.",
    stack: "built for purpose",
    link: null,
    previewVideo: "/cursorful-video-1770059587142.mp4",
    highlights: [
      "bridge between tech principles and artisan workflow",
      "built for a seventy-year-old craftsman",
      "hand sewn ribbons and floral motifs business",
      "preserving legacy through code",
      "empowering the old instead of replacing it",
    ],
    challenges: [
      "fragmented communication and manual logistics",
      "analog systems under pressure from modern pace",
      "honoring workflow while introducing tools",
    ],
    results: [
      "a tool that honors the workflow of an artisan",
      "code as a medium for purpose",
      "legacy preserved and empowered by technology",
    ],
  },
  {
    id: "cursor-doc-intelligence",
    title: "document intelligence pipeline",
    tagline: "nv-ingest + nims, cursor.md",
    description:
      "rl documentation is a desert. built a document intelligence pipeline on nvidia nv-ingest with nims, fed a real amazon prd through the system, and ran it with cursor.md. cursor analyzed the full schema and mapped the logic within seconds.",
    longDescription:
      "rl documentation is a desert. it is a problem that goes beyond missing files because it defines how the next generation of ai systems are being built.\n\nafter a conversation with carter abdallah about this gap, i called demir eren.\n\nwithin twenty-four hours, we were already in the middle of a build.\n\nwe constructed a document intelligence pipeline on top of nvidia nv-ingest, layering nvidia nims for multimodal extraction.\n\nwe developed our own reasoning frameworks to analyze the structured output, then fed a real amazon prd (we found it online) through the system.\n\nthe challenge was simple: could an agent reconstruct the entire product spec using nothing but the raw json?\n\nwe previously ran this through claude.md, where the agent successfully reconstructed the functional requirements, user journeys, and system architecture from the structured data alone.\n\nwe just finished the run with cursor.md.\n\nusing the same nv-ingest pipeline, cursor successfully analyzed the entire schema and mapped the logic within seconds.\n\nseeing a code-native framework interpret complex layout logic with that kind of speed changes the math on how we process enterprise data.\n\nfor anyone attempting to replicate this, do not run the pipeline bare metal on a 2020 macbook air. my machine crashed five times before i admitted defeat and moved everything into docker.",
    stack: "nvidia nv-ingest, nvidia NIMs, docker",
    link: null,
    previewVideo: "/cursor-doc-intelligence.mov",
    highlights: [
      "document intelligence pipeline on nvidia nv-ingest",
      "nvidia nims for multimodal extraction",
      "agent reconstructs product spec from raw json",
      "cursor.md analyzed full schema and mapped logic within seconds",
      "claude.md reconstructed requirements, user journeys, system architecture",
    ],
    challenges: [
      "rl documentation gap",
      "running pipeline on 2020 macbook air (crashed 5× then moved to docker)",
      "interpreting complex layout logic from structured data",
    ],
    results: [
      "code-native framework interpreting enterprise data at speed",
      "end-to-end run from ingestion to analysis",
      "proof that agents can reconstruct specs from structured output alone",
    ],
  },
];
