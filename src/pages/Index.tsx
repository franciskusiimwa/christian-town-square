import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { TopicChip } from "@/components/topics/TopicChip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { topics } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Fetch questions with real-time answer counts and view counts
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (questionsError) throw questionsError;

      // For each question, count answers and views in real-time
      const questionsWithCounts = await Promise.all(
        (questionsData || []).map(async (question) => {
          // Count active answers
          const { count: answerCount } = await supabase
            .from("answers")
            .select("*", { count: "exact", head: true })
            .eq("question_id", question.id)
            .eq("status", "active");

          // Count unique views
          const { count: viewCount } = await supabase
            .from("question_views")
            .select("*", { count: "exact", head: true })
            .eq("question_id", question.id);

          return {
            ...question,
            answer_count: answerCount || 0,
            view_count: viewCount || 0,
          };
        })
      );

      setQuestions(questionsWithCounts);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const trendingQuestions = [...questions].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
  const newestQuestions = [...questions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const popularTopics = topics.slice(0, 10);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-navy-soft to-background">
        <div className="container-page py-12 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-4 text-balance animate-slide-up">
              Honest Questions.{" "}
              <span className="text-primary">Thoughtful Answers.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
              A place for seekers and believers to explore faith, doubt, and everything
              in between with wisdom and respect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
              <Button variant="hero" size="xl" asChild>
                <Link to="/ask">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Ask a Question
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/topics">Browse Topics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-page py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Questions Feed */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="trending" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="trending" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="newest" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Newest
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="trending" className="space-y-4">
                {trendingQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </TabsContent>

              <TabsContent value="newest" className="space-y-4">
                {newestQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Popular Topics */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="font-serif text-lg font-semibold mb-4">
                Popular Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic) => (
                  <TopicChip key={topic.id} topic={topic} />
                ))}
              </div>
              <Link
                to="/topics"
                className="block mt-4 text-sm text-primary hover:underline"
              >
                View all topics →
              </Link>
            </div>

            {/* Community Guidelines Teaser */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="font-serif text-lg font-semibold mb-2">
                Our Commitment
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                This is a space for truth-seeking, not debate-winning. We value
                respectful dialogue, thoughtful reasoning, and intellectual humility.
              </p>
              <Link
                to="/guidelines"
                className="text-sm text-primary hover:underline"
              >
                Read our guidelines →
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="font-serif text-lg font-semibold mb-4">Community</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-serif font-semibold text-primary">
                    {questions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-serif font-semibold text-primary">
                    127
                  </div>
                  <div className="text-xs text-muted-foreground">Answers</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
