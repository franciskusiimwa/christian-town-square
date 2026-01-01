import { Link } from "react-router-dom";
import { MessageCircle, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const timeAgo = formatDistanceToNow(question.createdAt, { addSuffix: true });

  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {question.topics.map((topic) => (
            <Badge key={topic} variant="topic" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        <Link to={`/question/${question.id}`}>
          <CardTitle className="group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {question.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {question.details}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {question.answerCount} answers
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {question.viewCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{question.isAnonymous ? "Anonymous" : question.author}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
