import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin } from "lucide-react";

interface UpdatePost {
  source: "x" | "linkedin";
  text: string;
  url: string;
  createdAt: string;
}

export function Updates() {
  const [posts, setPosts] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const [xResponse, linkedinResponse] = await Promise.allSettled([
          fetch("/api/x-feed"),
          fetch("/api/linkedin-feed")
        ]);

        const allPosts: UpdatePost[] = [];

        if (xResponse.status === "fulfilled" && xResponse.value.ok) {
          const xData = await xResponse.value.json();
          allPosts.push(...xData);
        }

        if (linkedinResponse.status === "fulfilled" && linkedinResponse.value.ok) {
          const linkedinData = await linkedinResponse.value.json();
          allPosts.push(...linkedinData);
        }

        // Sort by createdAt descending
        allPosts.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setPosts(allPosts);
        setError(null);
      } catch (err) {
        setError("Failed to load updates");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <section id="updates" className="py-12 sm:py-16 relative scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">
          ◆ updates
        </h2>

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading updates...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No updates available at the moment.
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Card key={index} className="glass hover-lift border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {post.source === "x" ? (
                        <Twitter className="w-4 h-4 text-primary" />
                      ) : (
                        <Linkedin className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {post.source === "x" ? "X" : "LinkedIn"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {truncateText(post.text)}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View post
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

