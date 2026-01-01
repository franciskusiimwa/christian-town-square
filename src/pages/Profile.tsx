import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { questions, answers } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { User, Edit, MessageCircle, HelpCircle, Star } from "lucide-react";

const Profile = () => {
  // Mock user data
  const user = {
    username: "Sarah Mitchell",
    bio: "Theologian and author. Passionate about making complex ideas accessible.",
    reputation: 127,
    joinedAt: new Date("2024-06-15"),
    questionsCount: 3,
    answersCount: 12,
  };

  const userQuestions = questions.slice(0, 3);
  const userAnswers = answers.filter((a) => a.author === "Dr. Sarah Mitchell");

  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        {/* Profile Header */}
        <div className="bg-card border rounded-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="font-serif text-2xl font-semibold">
                    {user.username}
                  </h1>
                  <p className="text-muted-foreground">
                    Member since{" "}
                    {user.joinedAt.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {user.bio && (
                <p className="text-muted-foreground mt-4">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                <Badge variant="gold" className="px-4 py-2 text-sm gap-2">
                  <Star className="h-4 w-4" />
                  {user.reputation} reputation
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {user.questionsCount} questions
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {user.answersCount} answers
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="questions" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Questions ({userQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="answers" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Answers ({userAnswers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            {userQuestions.length > 0 ? (
              userQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">
                  No questions yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by asking your first question
                </p>
                <Button variant="hero" asChild>
                  <Link to="/ask">Ask a Question</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="answers" className="space-y-4">
            {userAnswers.length > 0 ? (
              userAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <Link
                    to={`/question/${answer.questionId}`}
                    className="text-sm text-muted-foreground hover:text-primary mb-2 block"
                  >
                    View question →
                  </Link>
                  <p className="line-clamp-3">{answer.body}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {answer.votes} votes
                    </span>
                    {answer.isVerified && (
                      <Badge variant="success" className="gap-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">
                  No answers yet
                </h3>
                <p className="text-muted-foreground">
                  Share your knowledge by answering questions
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
