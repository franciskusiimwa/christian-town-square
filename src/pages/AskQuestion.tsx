import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { topics } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { ArrowLeft, X, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const AskQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    // Fetch username if user is logged in
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (data) {
          setUsername(data.username);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const toggleTopic = (topicName: string) => {
    if (selectedTopics.includes(topicName)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topicName));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topicName]);
    } else {
      toast({
        title: "Topic limit reached",
        description: "You can select up to 3 topics.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a question title.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTopics.length === 0) {
      toast({
        title: "Topic required",
        description: "Please select at least one topic.",
        variant: "destructive",
      });
      return;
    }

    // For guests, require a name unless posting anonymously
    if (!user && !guestName.trim() && !isAnonymous) {
      toast({
        title: "Name required",
        description: "Please enter your name or post anonymously.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName = isAnonymous
        ? "Anonymous"
        : user
          ? username || "User"
          : guestName.trim() || "Guest";

      const { data, error } = await supabase
        .from("questions")
        .insert({
          title: title.trim(),
          details: details.trim() || null,
          author_id: user?.id || null,
          author_name: displayName,
          is_anonymous: isAnonymous,
          topics: selectedTopics,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Question submitted!",
        description: "Your question has been posted successfully.",
      });

      navigate(`/question/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Failed to submit question",
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
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to questions
        </Link>

        <div className="max-w-2xl">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            Ask a Question
          </h1>
          <p className="text-muted-foreground mb-8">
            Share your question with the community. Be specific and provide context
            for better answers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Name Field (only if not logged in) */}
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-base font-medium">
                  Your Name {!isAnonymous && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="guestName"
                  placeholder="Enter your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="text-base"
                  disabled={isAnonymous}
                />
                <p className="text-sm text-muted-foreground">
                  {isAnonymous ? "Posting anonymously" : "Your name will be shown with your question"}
                  {!isAnonymous && ". To avoid entering a name, enable 'Post anonymously' below."}
                </p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Question Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., How do Christians explain the problem of evil?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
                maxLength={150}
              />
              <p className="text-sm text-muted-foreground">
                Be specific. Imagine you're asking a thoughtful friend.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="details" className="text-base font-medium">
                Details (recommended)
              </Label>
              <Textarea
                id="details"
                placeholder="Provide context for your question. What prompted this question? What have you already considered?"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-sm text-muted-foreground">
                More context helps others give better answers.
              </p>
            </div>

            {/* Topics */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Topics <span className="text-destructive">*</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (select up to 3)
                </span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => {
                  const isSelected = selectedTopics.includes(topic.name);
                  return (
                    <Badge
                      key={topic.id}
                      variant={isSelected ? "default" : "topic"}
                      className="cursor-pointer px-3 py-1.5 text-sm"
                      onClick={() => toggleTopic(topic.name)}
                    >
                      {topic.name}
                      {isSelected && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="anonymous" className="text-base font-medium cursor-pointer">
                    Post anonymously
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {user
                      ? "Your username won't be displayed, but you can still manage your question."
                      : "Your name won't be displayed. You can post without providing a name."}
                  </p>
                </div>
              </div>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" type="button" asChild>
                <Link to="/">Cancel</Link>
              </Button>
              <Button variant="hero" type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AskQuestion;
