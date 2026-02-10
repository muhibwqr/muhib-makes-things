import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

const articles: Record<string, { title: string; content: React.ReactNode }> = {
  "a-letter-of-dedication-to-ambition": {
    title: "A Letter of Dedication to Ambition",
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
          <time className="text-sm text-gray-500 dark:text-gray-400 tabular-nums" dateTime="2026-02-09">
            Feb 9, 2026
          </time>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white mb-8">
          {article.title}
        </h1>

        <div className="text-gray-600 dark:text-gray-300 leading-[1.7]">
          {article.content}
        </div>
      </div>
    </div>
  );
}
