import { Link } from "react-router-dom";
import { MessageCircle, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface QuestionCardProps {
  question: any;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const timeAgo = formatDistanceToNow(new Date(question.created_at || question.createdAt), { addSuffix: true });

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
        {question.details && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {question.details}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link
              to={`/question/${question.id}#answers`}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              {question.answer_count || question.answerCount || 0} answers
            </Link>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {question.view_count || question.viewCount || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{(question.is_anonymous || question.isAnonymous) ? "Anonymous" : (question.author_name || question.author)}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
