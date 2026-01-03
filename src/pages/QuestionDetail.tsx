import { Layout } from "@/components/layout/Layout";
import { AnswerCard } from "@/components/questions/AnswerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, Link, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageCircle, Eye, Flag, Clock, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const QuestionDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("top");
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [guestName, setGuestName] = useState("");
  const answersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchAnswers();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchUsername();
    }
  }, [user]);

  // Scroll to answers section if hash is present
  useEffect(() => {
    if (location.hash === '#answers' && answersRef.current) {
      setTimeout(() => {
        answersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash, answers]);

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

  const fetchQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Record view using the database function (with IP-based deduplication)
      const viewerIdentifier = getViewerIdentifier();

      try {
        await supabase.rpc('record_question_view', {
          p_question_id: id!,
          p_viewer_ip: viewerIdentifier,
          p_viewer_id: user?.id || null
        });
      } catch (viewError) {
        console.error('Error recording view:', viewError);
      }

      // Count real-time views from question_views table
      const { count: viewCount } = await supabase
        .from("question_views")
        .select("*", { count: "exact", head: true })
        .eq("question_id", id);

      // Count real-time answers
      const { count: answerCount } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("question_id", id)
        .eq("status", "active");

      setQuestion({
        ...data,
        view_count: viewCount || 0,
        answer_count: answerCount || 0,
      });
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a consistent viewer identifier for client-side view tracking
  const getViewerIdentifier = () => {
    // Try to get from localStorage, or create a new one
    let identifier = localStorage.getItem('viewer_id');
    if (!identifier) {
      identifier = `viewer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('viewer_id', identifier);
    }
    return identifier;
  };

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", id)
        .eq("status", "active");

      if (error) throw error;
      setAnswers(data || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-page py-12 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <div className="container-page py-12 text-center">
          <h1 className="font-serif text-2xl font-semibold mb-4">
            Question not found
          </h1>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(question.created_at), { addSuffix: true });

  const sortedAnswers = [...answers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default: // top
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return b.votes - a.votes;
    }
  });

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please enter your answer.",
        variant: "destructive",
      });
      return;
    }

    // For guests, require a name
    if (!user && !guestName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to post an answer.",
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

      const { error } = await supabase.from("answers").insert({
        question_id: id!,
        author_id: user?.id || null,
        author_name: displayName,
        body: newAnswer.trim(),
      });

      if (error) throw error;

      toast({
        title: "Answer posted!",
        description: "Your answer has been posted successfully.",
      });

      setNewAnswer("");
      setGuestName(""); // Clear guest name for next answer
      fetchAnswers();
      fetchQuestion(); // This will refresh the real-time count
    } catch (error: any) {
      console.error("Error posting answer:", error);
      toast({
        title: "Failed to post answer",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to questions
        </Link>

        {/* Question */}
        <article className="bg-card rounded-lg border p-6 md:p-8 mb-8">
          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.topics.map((topic) => (
              <Badge key={topic} variant="topic">
                {topic}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
            {question.title}
          </h1>

          {/* Details */}
          {question.details && (
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {question.details}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Asked {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {question.answer_count || 0} answers
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {question.view_count || 0} views
            </span>
            <span className="ml-auto">
              Asked by{" "}
              <span className="font-medium text-foreground">
                {question.is_anonymous ? "Anonymous" : question.author_name}
              </span>
            </span>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </article>

        {/* Answer Composer */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h2 className="font-serif text-xl font-semibold mb-4">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-sm font-medium">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guestName"
                  placeholder="Enter your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your name will be shown with your answer
                </p>
              </div>
            )}
            <Textarea
              placeholder="Share your perspective with clarity and charity. Include citations (Bible references, historical sources) when possible..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-[150px]"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Be respectful. Include sources when possible.
              </p>
              <Button type="submit" variant="hero" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Answer"}
              </Button>
            </div>
          </form>
        </div>

        {/* Answers Section */}
        <div ref={answersRef} id="answers">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold">
              {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </div>

          {answers.length === 0 && (
            <div className="text-center py-12 bg-muted rounded-lg">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-serif text-lg font-semibold mb-2">
                No answers yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your perspective
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuestionDetail;
