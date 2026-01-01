import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Topic } from "@/lib/mockData";

interface TopicChipProps {
  topic: Topic;
  count?: number;
}

export function TopicChip({ topic, count }: TopicChipProps) {
  return (
    <Link to={`/topics/${topic.slug}`}>
      <Badge variant="topic" className="px-4 py-2 text-sm gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
        {topic.name}
        {count !== undefined && (
          <span className="text-xs opacity-70">({count})</span>
        )}
      </Badge>
    </Link>
  );
}
