import { ChevronUp, CheckCircle, BookOpen, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Answer } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  answer: Answer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  const [votes, setVotes] = useState(answer.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const timeAgo = formatDistanceToNow(answer.createdAt, { addSuffix: true });

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <article
      className={cn(
        "p-6 rounded-lg border bg-card transition-all",
        answer.isPinned && "ring-2 ring-primary/20 bg-navy-soft"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Vote Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant={hasVoted ? "default" : "outline"}
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleVote}
            aria-label="Upvote"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <span className={cn("font-semibold text-sm", hasVoted && "text-primary")}>
            {votes}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {answer.isPinned && (
              <Badge variant="verified" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Best Answer
              </Badge>
            )}
            {answer.isVerified && (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {answer.hasCitations && (
              <Badge variant="gold" className="gap-1">
                <BookOpen className="h-3 w-3" />
                Citations
              </Badge>
            )}
          </div>

          {/* Answer Body */}
          <div className="prose prose-sm max-w-none text-foreground">
            {answer.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 last:mb-0 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {answer.author.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-foreground">{answer.author}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
