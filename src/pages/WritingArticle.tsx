import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

const articles: Record<string, { title: string; date?: string; dateTime?: string; byline?: string; content: React.ReactNode }> = {
  "a-letter-of-dedication-to-ambition": {
    title: "A Letter of Dedication to Ambition",
    date: "Feb 9, 2026",
    dateTime: "2026-02-09",
    content: (
      <article>
        <p className="mb-4">
          As an ambitious Muslim, I am constantly grappling with a mental tug-of-war. I find myself questioning whether I should blame my own shortcomings when things stall, or trust that every delay is for the best. This internal dialogue is rooted in a profound concept: the affair of the believer is strange. There is a famous tradition in our faith that states everything that happens to a person of faith is good; if something positive happens, they are grateful; if something difficult occurs, they are patient. Yet, for a founder and a student, the gap between working hard and seeing results often feels like a battlefield of self-blame.
        </p>

        <figure className="my-8">
          <img
            src="/writing/letter-ambition-1.png"
            alt=""
            className="rounded-lg max-w-full w-auto h-auto"
          />
        </figure>

        <p className="mb-4">
          Last semester, I lived at the edge of this philosophy. At one point, I was juggling the weight of three different jobs to the point of exhaustion while navigating the intensity of a computational mathematics degree. My life was a high-stakes sprint, driven by a hunger to build for my community and my family. In those moments of peak fatigue, I was forced to confront the limits of my own agency. I eventually quit two of those jobs, but the period taught me that while willpower is a tool, it cannot be the foundation.
        </p>

        <p className="mb-4">
          The reality of Qadr, or Divine Decree, is the ultimate psychological anchor. I experienced the sting of passing a final round interview at a major tech firm, only to be told I couldn&apos;t be hired simply because I was a freshman—a factor entirely outside my control. The Quran reminds us: &quot;But perhaps you hate a thing and it is good for you; and perhaps you love a thing and it is bad for you. Allah knows, while you know not&quot; (2:216). This isn&apos;t a call to complacency; it is a call to Tawakkul—the act of tying our camel with excellence while leaving the results to the One who sustains the universe.
        </p>

        <figure className="my-8">
          <img
            src="/writing/letter-ambition-2.png"
            alt="Sohaib Ashraf tweet"
            className="rounded-lg max-w-full w-auto h-auto"
          />
          <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
            sohaib&apos;s tweet — the tweet that got me thinking about this yesterday
          </figcaption>
        </figure>

        <p className="mb-4">
          The solution to the mental battle is realizing that &quot;sidequestmaxxing&quot; is not a distraction; it is a manifestation of faith. When I built an app for fun that reached 5,000 users, it wasn&apos;t part of a rigid corporate ladder. It was an exploration of curiosity that led to an interview at a company I could never have imagined and a trip to San Francisco where I met incredible people. These weren&apos;t just results of labor; they were doors opened when I stopped trying to force the &quot;main quest&quot; and started trusting the process of growth. We must realize that inaction is an action itself; choosing to wait or to overthink is a decision that carries its own weight. True ambition is moving with purpose even when the destination is obscured.
        </p>

        <p className="mb-4">
          I love being surrounded by people who are unapologetically ambitious yet deeply conscious of this balance. There is a unique power in a person who grinds through 2:00 AM coding sessions not because they are desperate for validation, but because they view their potential as an amanah, a trust to be fulfilled. We &quot;organize our lives like engineers&quot; to honor the talent we were given, not because we think we are the ultimate architects of our fate.
        </p>

        <p className="mb-4">
          With Ramadan only a week away, this perspective becomes our strength. This month is a reminder that our productivity isn&apos;t fueled by constant movement, but by a deeper, spiritual discipline. It is a time to trade the frantic energy of the &quot;hustle&quot; for the steady, purposeful pace of a believer. Whether I am hunting for a Summer &apos;26 internship or solving complex proofs, I do so with a heart that is at rest.
        </p>

        <p className="mb-4">
          To be ambitious and aware of Qadr is to be truly unstoppable. It means that no rejection can break your spirit and no success can cloud your vision. We work with the precision of mathematicians and the spirits of those who know that what is meant for us will never miss us. We tie our camels, we lean into the sidequests, and we step into the future with Tawakkul, knowing that the path is already perfectly written.
        </p>
      </article>
    ),
  },
  "the-death-of-agency-slop": {
    title: "The Death of \"Agency Slop\": Why We Chose the Hard Path to Autonomy",
    date: "Jan 28, 2026",
    dateTime: "2026-01-28",
    byline: "Muhib Waqar & Ibrahim Ansari",
    content: (
      <article>
        <p className="mb-4 font-medium text-gray-700 dark:text-gray-200">
          <strong>TL;DR:</strong> We built a distributed service mesh that allows frontier AI agents to autonomously generate, deploy, and iterate on landing pages based on real-world telemetry. No human in the loop. The best run identified a 1.2 percent conversion leak and self-patched the site to hit a 17.5 percent baseline in seconds. Our takeaway: training is execution, but growth is judgment. We have automated both.
        </p>

        <h2 className="text-lg font-semibold text-black dark:text-white mt-8 mb-2">The Future Everyone Is Talking About</h2>
        <p className="mb-4">
          There is a narrative building in AI right now that feels inevitable: AI systems will soon build and optimize themselves.
        </p>
        <p className="mb-4">
          At the World Economic Forum, the vision was clear: models that are good at coding and research will create a loop that increases the speed of development exponentially. But while the giants are talking about AGI, Ibrahim and I wanted to solve a more immediate, expensive problem: The Frontend Agency.
        </p>
        <p className="mb-4">
          The traditional agency model is architecturally slow. You are essentially paying for a middleman to look at a spreadsheet and manually move buttons around. It is a world of stagnant assets and subjective design intuition. We built this ecosystem to move the industry toward a state of statistical certainty.
        </p>
        <p className="mb-4">
          The truth is that &quot;ease&quot; is just a cover for future hardship. Every time you choose the easy path of a standard agency retainer, you are taking out a high-interest loan against your future growth. &quot;Easy&quot; keeps your business state weak, and your internal state always dictates your external reality. We chose the hard path of building an autonomous engine because it builds the structure required to hold the weight of real scale.
        </p>

        <h2 className="text-lg font-semibold text-black dark:text-white mt-8 mb-2">The Idea: A Service Mesh of Specialized Agents</h2>
        <p className="mb-4">
          What if you could describe what you want and an AI agent handled the rest? Not just writing code, but generating the data, tracking the clicks, picking the winners, and autonomously patching the losers.
        </p>
        <p className="mb-4">
          We conceptualized this architecture as a specialized service mesh where each agent represents a distinct professional role:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>The Architect (Python Generation Backend):</strong> Replaces the creative director. It synthesizes four parallel design hypotheses in seconds, grounding AI creativity in a structured library of conversion patterns.</li>
          <li><strong>The Observer (Python Telemetry Agent):</strong> Replaces the data analyst. It provides the &quot;eyes,&quot; ingesting every user interaction to evaluate performance in real-time.</li>
          <li><strong>The Executor (Node Sync Agent):</strong> Replaces the DevOps team. It handles the secure cryptographic handshake with GitHub to push production-level code with absolute precision.</li>
          <li><strong>The Orchestrator (Next.js Frontend):</strong> The command center that elegantly proxies user intent to the specialized agents within the mesh.</li>
        </ul>

        <h2 className="text-lg font-semibold text-black dark:text-white mt-8 mb-2">The Problems: Purging the Slop</h2>
        <p className="mb-4">
          During development, we identified several critical leaks in the logic of existing agentic systems. We realized that the &quot;iffiness&quot; in most software projects stems from redundant backends and hardcoded configurations that prevent true repeatability.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>The Sync Contract Failure:</strong> We resolved chronic validation errors by establishing a strict contract: &#123; filePath, data, commitMessage &#125;. This ensured the frontend and the agents were finally speaking the same language.</li>
          <li><strong>Path Hardening:</strong> We implemented robust path-resolution logic to ensure the executor could securely locate its keys regardless of the host environment.</li>
          <li><strong>The Static Logic Trap:</strong> A system that can push code but cannot think about performance is useless. We needed a loop.</li>
        </ul>

        <h2 className="text-lg font-semibold text-black dark:text-white mt-8 mb-2">The Qodo Influence: Observe, Diagnose, Act</h2>
        <p className="mb-4">
          Our work draws significant inspiration from the iterative rigor of tools like Qodo (formerly Codium). While those systems optimize for code architecture, we pivoted that logic toward the psychology of user growth and revenue.
        </p>
        <p className="mb-4">
          For our demo, we simulated a full week of performance data—1,142 visits—to establish a clear performance benchmark.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Observation:</strong> The system monitored the baseline performance of every variant.</li>
          <li><strong>Diagnosis:</strong> The agent identified conversion leaks with mathematical precision. In one run, it flagged Variant B hitting a 1.2 percent click rate against a 17.5 percent baseline.</li>
          <li><strong>Action:</strong> This is the &quot;Magical MVP.&quot; Upon detecting the leak, the system enters a ready state indicated by a pulsing green dot on the dashboard. If Autonomy is toggled ON, the agent autonomously fetches the code, prepends an optimization header, and pushes a live patch back to the repository.</li>
        </ul>

        <h2 className="text-lg font-semibold text-black dark:text-white mt-8 mb-2">The Story of the Demo</h2>
        <p className="mb-4">
          We designed the dashboard to be a narrative of intent and action:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>The Intent:</strong> You click &quot;Simulate Week.&quot; The UI explodes with a week&apos;s worth of traffic data.</li>
          <li><strong>The Problem:</strong> Variant B turns red. A &quot;LEAK DETECTED&quot; warning appears.</li>
          <li><strong>The Thought:</strong> A pulsing Green Dot appears. The agent has already staged four new design hypotheses and is waiting for the signal.</li>
          <li><strong>The Action:</strong> You approve (or the toggle does it for you), and a live patch is deployed. The agent has officially fired the agency.</li>
        </ul>

        <h2 className="text-lg font-semibold text-black dark:text-white mt-8 mb-2">Takeaways</h2>
        <p className="mb-4">
          High performers do not pick choices based on difficulty. They pick based on impact. They understand the &quot;time lag&quot;—the gap between the internal choice and the material reality. We built Landright because we chose to be the ones who chose themselves first.
        </p>
        <p className="mb-4">
          With the right scaffolding, frontier AI agents can run complete growth pipelines autonomously. They replace the designer, the analyst, and the developer for a cost that is effectively negligible—under a dollar per optimized deployment.
        </p>
        <p className="mb-4">
          The AI-trains-AI loop is not a fantasy. It works on constrained tasks today. Tinkerer and Landright give a generally capable agent the right tools to do a specific professional task. It is a meaningful step toward more autonomous AI research. But it is a step, not the finish line.
        </p>
        <p className="mb-4">
          The hard path is the only path that makes you worthy of the result. The era of the human-managed agency is over. The era of the autonomous growth partner has begun.
        </p>

        <p className="mb-4">
          Explore the code and run your own experiments:{" "}
          <a href="https://github.com/muhibwqr/landright" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
            github.com/muhibwqr/landright
          </a>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Built by Muhib Waqar and Ibrahim Ansari.
        </p>
      </article>
    ),
  },
};

export default function WritingArticle() {
  const { slug } = useParams<{ slug: string }>();
  const dockItems = useDockItems();
  const isMobile = useIsMobile();
  const article = slug ? articles[slug] : null;

  useEffect(() => {
    if (article) document.title = `${article.title} | Muhib Waqar`;
    else document.title = "Writing | Muhib Waqar";
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none" />
        <Dock items={dockItems} panelHeight={isMobile ? 56 : 68} baseItemSize={isMobile ? 42 : 50} magnification={70} />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-muted-foreground">Article not found.</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline">
            <ArrowLeft size={16} /> Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white pb-24 sm:pb-12">
      <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none" />
      <Dock items={dockItems} panelHeight={isMobile ? 56 : 68} baseItemSize={isMobile ? 42 : 50} magnification={70} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <time className="text-sm text-gray-500 dark:text-gray-400 tabular-nums" dateTime={article.dateTime ?? "2026-02-09"}>
            {article.date ?? "Feb 9, 2026"}
          </time>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white mb-2">
          {article.title}
        </h1>
        {article.byline && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">By {article.byline}</p>
        )}
        {!article.byline && <div className="mb-8" />}

        <div className="text-gray-600 dark:text-gray-300 leading-[1.7]">
          {article.content}
        </div>
      </div>
    </div>
  );
}
