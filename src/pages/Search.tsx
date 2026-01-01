import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { questions, topics } from "@/lib/mockData";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesQuery =
      !query ||
      q.title.toLowerCase().includes(query.toLowerCase()) ||
      q.details.toLowerCase().includes(query.toLowerCase());

    const matchesTopic =
      !selectedTopic || q.topics.includes(selectedTopic);

    return matchesQuery && matchesTopic;
  });

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
          <p className="text-sm text-muted-foreground mb-6">
            {filteredQuestions.length}{" "}
            {filteredQuestions.length === 1 ? "result" : "results"}
            {query && ` for "${query}"`}
            {selectedTopic && ` in ${selectedTopic}`}
          </p>

          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
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
