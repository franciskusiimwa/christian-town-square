import { ChevronUp, CheckCircle, BookOpen, Flag, MessageCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface AnswerCardProps {
  answer: any;
}

interface Reply {
  id: string;
  answer_id: string;
  author_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  const [votes, setVotes] = useState(answer.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const timeAgo = formatDistanceToNow(new Date(answer.created_at || answer.createdAt), { addSuffix: true });
  const isPinned = answer.is_pinned || answer.isPinned;
  const isVerified = answer.is_verified || answer.isVerified;
  const hasCitations = answer.has_citations || answer.hasCitations;
  const authorName = answer.author_name || answer.author;

  useEffect(() => {
    fetchReplies();
  }, [answer.id]);

  useEffect(() => {
    if (user) {
      fetchUsername();
    }
  }, [user]);

  const fetchUsername = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    if (data) {
      setUsername(data.username);
    }
  };

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from("replies")
        .select("*")
        .eq("answer_id", answer.id)
        .eq("status", "active")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) {
      toast({
        title: "Reply required",
        description: "Please enter your reply.",
        variant: "destructive",
      });
      return;
    }

    if (!user && !guestName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to post a reply.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName = user ? (username || "User") : (guestName.trim() || "Guest");

      // If user is authenticated, ensure their profile exists
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        // If profile doesn't exist, create it
        if (profileError || !profileData) {
          console.log("Profile doesn't exist, creating one...");
          const { error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              username: username || user.email?.split("@")[0] || "User",
            });

          if (createError) {
            console.error("Failed to create profile:", createError);
            toast({
              title: "Posting as guest",
              description: "We couldn't link this to your account, posting as guest instead.",
            });
          }
        }
      }

      const { error } = await supabase.from("replies").insert({
        answer_id: answer.id,
        author_id: user?.id || null,
        author_name: displayName,
        body: replyText.trim(),
      });

      if (error) throw error;

      toast({
        title: "Reply posted!",
        description: "Your reply has been posted successfully.",
      });

      setReplyText("");
      setGuestName("");
      setShowReplyForm(false);
      setShowReplies(true);
      fetchReplies();
    } catch (error: any) {
      console.error("Error posting reply:", error);
      toast({
        title: "Failed to post reply",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article
      className={cn(
        "p-6 rounded-lg border bg-card transition-all",
        isPinned && "ring-2 ring-primary/20 bg-navy-soft"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Vote Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant={hasVoted ? "default" : "outline"}
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleVote}
            aria-label="Upvote"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <span className={cn("font-semibold text-sm", hasVoted && "text-primary")}>
            {votes}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {isPinned && (
              <Badge variant="verified" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Best Answer
              </Badge>
            )}
            {isVerified && (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {hasCitations && (
              <Badge variant="gold" className="gap-1">
                <BookOpen className="h-3 w-3" />
                Citations
              </Badge>
            )}
          </div>

          {/* Answer Body */}
          <div className="prose prose-sm max-w-none text-foreground">
            {answer.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 last:mb-0 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {authorName.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-foreground">{authorName}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 pl-4 border-l-2 border-primary/20">
              <form onSubmit={handleSubmitReply} className="space-y-3">
                {!user && (
                  <div className="space-y-1">
                    <Label htmlFor={`guestName-${answer.id}`} className="text-xs font-medium">
                      Your Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`guestName-${answer.id}`}
                      placeholder="Enter your name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                )}
                <Textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    <Send className="h-3 w-3 mr-1" />
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Replies Section */}
          {replies.length > 0 && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-foreground mb-2"
                onClick={() => setShowReplies(!showReplies)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </Button>

              {showReplies && (
                <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                  {replies.map((reply) => {
                    const replyTimeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
                    return (
                      <div key={reply.id} className="bg-muted/30 rounded-lg p-4">
                        <div className="text-sm text-foreground mb-2 whitespace-pre-wrap">
                          {reply.body}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {reply.author_name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{reply.author_name}</span>
                          <span>·</span>
                          <span>{replyTimeAgo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
