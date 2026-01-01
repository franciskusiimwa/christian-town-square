import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { User, Edit, MessageCircle, HelpCircle, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

const Profile = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigate("/auth");
      return;
    }
    fetchProfileData();
  }, [authUser, navigate]);

  const fetchProfileData = async () => {
    if (!authUser) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      setProfile(profileData);

      // Fetch user's questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("author_id", authUser.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!questionsError) {
        // Get real-time counts for each question
        const questionsWithCounts = await Promise.all(
          (questionsData || []).map(async (question) => {
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
        setUserQuestions(questionsWithCounts);
      }

      // Fetch user's answers
      const { data: answersData, error: answersError } = await supabase
        .from("answers")
        .select("*")
        .eq("author_id", authUser.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!answersError) {
        setUserAnswers(answersData || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-page py-12 text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container-page py-12 text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </Layout>
    );
  }

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
                    {profile.username}
                  </h1>
                  <p className="text-muted-foreground">
                    Member since{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
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

              <div className="flex flex-wrap gap-4 mt-6">
                <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {userQuestions.length} questions
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {userAnswers.length} answers
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
                    to={`/question/${answer.question_id}`}
                    className="text-sm text-muted-foreground hover:text-primary mb-2 block"
                  >
                    View question →
                  </Link>
                  <p className="line-clamp-3">{answer.body}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {answer.votes || 0} votes
                    </span>
                    {answer.is_verified && (
                      <Badge variant="success" className="gap-1">
                        Verified
                      </Badge>
                    )}
                    {answer.is_pinned && (
                      <Badge variant="verified" className="gap-1">
                        Best Answer
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
