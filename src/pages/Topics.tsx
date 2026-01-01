import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { topics, questions } from "@/lib/mockData";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const Topics = () => {
  const { slug } = useParams();

  // If a specific topic is selected
  if (slug) {
    const topic = topics.find((t) => t.slug === slug);
    const filteredQuestions = questions.filter((q) =>
      q.topics.some(
        (t) => t.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === slug
      )
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
              {filteredQuestions.length} questions in this topic
            </p>
          </div>

          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
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
  const getQuestionCount = (topicName: string) => {
    return questions.filter((q) => q.topics.includes(topicName)).length;
  };

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

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((topic) => {
            const count = getQuestionCount(topic.name);
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
      </div>
    </Layout>
  );
};

export default Topics;
