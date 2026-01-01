import { Layout } from "@/components/layout/Layout";
import { AnswerCard } from "@/components/questions/AnswerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { questions, answers as mockAnswers } from "@/lib/mockData";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageCircle, Eye, Flag, Clock, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuestionDetail = () => {
  const { id } = useParams();
  const question = questions.find((q) => q.id === id);
  const answers = mockAnswers.filter((a) => a.questionId === id);
  const [sortBy, setSortBy] = useState("top");
  const [newAnswer, setNewAnswer] = useState("");

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

  const timeAgo = formatDistanceToNow(question.createdAt, { addSuffix: true });

  const sortedAnswers = [...answers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
      default: // top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.votes - a.votes;
    }
  });

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    alert("Sign in to post an answer");
    setNewAnswer("");
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
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {question.details}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Asked {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {answers.length} answers
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {question.viewCount} views
            </span>
            <span className="ml-auto">
              Asked by{" "}
              <span className="font-medium text-foreground">
                {question.isAnonymous ? "Anonymous" : question.author}
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
          <form onSubmit={handleSubmitAnswer}>
            <Textarea
              placeholder="Share your perspective with clarity and charity. Include citations (Bible references, historical sources) when possible..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-[150px] mb-4"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Be respectful. Include sources when possible.
              </p>
              <Button type="submit" variant="hero">
                Post Answer
              </Button>
            </div>
          </form>
        </div>

        {/* Answers Section */}
        <div>
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
