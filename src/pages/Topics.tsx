import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { topics } from "@/lib/mockData";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Topics = () => {
  const { slug } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get real-time counts for answers and views
      const questionsWithCounts = await Promise.all(
        (data || []).map(async (question) => {
          const { count: answerCount } = await supabase
            .from("answers")
            .select("*", { count: "exact", head: true })
            .eq("question_id", question.id)
            .eq("status", "active");

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

      // Calculate topic counts
      const counts: Record<string, number> = {};
      topics.forEach((topic) => {
        counts[topic.name] = questionsWithCounts.filter((q) =>
          q.topics.includes(topic.name)
        ).length;
      });
      setTopicCounts(counts);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If a specific topic is selected
  if (slug) {
    const topic = topics.find((t) => t.slug === slug);
    const filteredQuestions = questions.filter((q) =>
      q.topics.some(
        (t: string) => t.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === slug
      )
    );

    // Pagination for filtered questions
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const paginatedQuestions = filteredQuestions.slice(
      (currentPage - 1) * questionsPerPage,
      currentPage * questionsPerPage
    );

    if (!topic) {
      return (
        <Layout>
          <div className="container-page py-12 text-center">
            <h1 className="font-serif text-2xl font-semibold mb-4">
              Topic not found
            </h1>
            <Link to="/topics" className="text-primary hover:underline">
              View all topics
            </Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="container-page py-8 md:py-12">
          <Link
            to="/topics"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            All topics
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
              {topic.name}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredQuestions.length} questions in this topic`}
            </p>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : filteredQuestions.length > 0 ? (
              <>
                {paginatedQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No questions in this topic yet.
                </p>
                <Link to="/ask" className="text-primary hover:underline">
                  Ask the first question
                </Link>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // All topics view
  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            Browse Topics
          </h1>
          <p className="text-muted-foreground">
            Explore questions by category
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map((topic) => {
              const count = topicCounts[topic.name] || 0;
              return (
                <Link
                  key={topic.id}
                  to={`/topics/${topic.slug}`}
                  className="group"
                >
                  <div className="bg-card border rounded-lg p-6 hover:shadow-md hover:border-primary/30 transition-all">
                    <h2 className="font-serif text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {topic.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "question" : "questions"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Topics;
