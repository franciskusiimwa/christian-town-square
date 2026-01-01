import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { topics } from "@/lib/mockData";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
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
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesQuery =
      !query ||
      q.title.toLowerCase().includes(query.toLowerCase()) ||
      (q.details && q.details.toLowerCase().includes(query.toLowerCase()));

    const matchesTopic =
      !selectedTopic || q.topics.includes(selectedTopic);

    return matchesQuery && matchesTopic;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-6">
            Search Questions
          </h1>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" variant="hero" className="h-12 px-8">
              Search
            </Button>
          </form>

          {/* Topic Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTopic === null ? "default" : "topic"}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setSelectedTopic(null)}
            >
              All Topics
            </Badge>
            {topics.slice(0, 8).map((topic) => (
              <Badge
                key={topic.id}
                variant={selectedTopic === topic.name ? "default" : "topic"}
                className="cursor-pointer px-3 py-1.5"
                onClick={() =>
                  setSelectedTopic(
                    selectedTopic === topic.name ? null : topic.name
                  )
                }
              >
                {topic.name}
                {selectedTopic === topic.name && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-6">
              {filteredQuestions.length}{" "}
              {filteredQuestions.length === 1 ? "result" : "results"}
              {query && ` for "${query}"`}
              {selectedTopic && ` in ${selectedTopic}`}
            </p>
          )}

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
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">
                  No questions found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse topics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
