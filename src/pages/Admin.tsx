import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pin, CheckCircle, Eye, MessageCircle, AlertTriangle, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'question' | 'answer', id: string } | null>(null);

  // Pagination
  const [questionsPage, setQuestionsPage] = useState(1);
  const [answersPage, setAnswersPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      } else {
        fetchData();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchQuestions(), fetchAnswers(), fetchUsers()]);
    setIsLoading(false);
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching questions:", error);
      return;
    }
    setQuestions(data || []);
  };

  const fetchAnswers = async () => {
    const { data, error } = await supabase
      .from("answers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching answers:", error);
      return;
    }
    setAnswers(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error loading users",
        description: error.message || "Failed to fetch users. Check RLS policies.",
        variant: "destructive",
      });
      return;
    }
    console.log("Fetched users:", data);
    setUsers(data || []);
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentAdminStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: currentAdminStatus ? "Admin removed" : "Admin granted",
        description: currentAdminStatus
          ? "User no longer has admin privileges."
          : "User now has admin privileges.",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      // Soft delete by updating status
      const { error } = await supabase
        .from("questions")
        .update({ status: "deleted" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Question deleted",
        description: "The question has been removed.",
      });

      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnswer = async (id: string) => {
    try {
      const { error } = await supabase
        .from("answers")
        .update({ status: "deleted" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Answer deleted",
        description: "The answer has been removed.",
      });

      fetchAnswers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete answer.",
        variant: "destructive",
      });
    }
  };

  const handlePinAnswer = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from("answers")
        .update({ is_pinned: !currentPinned })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: currentPinned ? "Answer unpinned" : "Answer pinned",
        description: currentPinned ? "The answer is no longer marked as best answer." : "The answer is now marked as best answer.",
      });

      fetchAnswers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update answer.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyAnswer = async (id: string, currentVerified: boolean) => {
    try {
      const { error } = await supabase
        .from("answers")
        .update({ is_verified: !currentVerified })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: currentVerified ? "Verification removed" : "Answer verified",
        description: currentVerified ? "The answer is no longer verified." : "The answer is now verified.",
      });

      fetchAnswers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update answer.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (type: 'question' | 'answer', id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'question') {
      await handleDeleteQuestion(itemToDelete.id);
    } else {
      await handleDeleteAnswer(itemToDelete.id);
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container-page py-12 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Pagination logic
  const activeQuestions = questions.filter(q => q.status !== 'deleted');
  const activeAnswers = answers.filter(a => a.status !== 'deleted');

  const questionsTotalPages = Math.ceil(activeQuestions.length / itemsPerPage);
  const answersTotalPages = Math.ceil(activeAnswers.length / itemsPerPage);
  const usersTotalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedQuestions = activeQuestions.slice(
    (questionsPage - 1) * itemsPerPage,
    questionsPage * itemsPerPage
  );
  const paginatedAnswers = activeAnswers.slice(
    (answersPage - 1) * itemsPerPage,
    answersPage * itemsPerPage
  );
  const paginatedUsers = users.slice(
    (usersPage - 1) * itemsPerPage,
    usersPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage questions, answers, and users
            </p>
          </div>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList>
            <TabsTrigger value="questions">
              Questions ({activeQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="answers">
              Answers ({activeAnswers.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Users ({users.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4 mt-6">
            {paginatedQuestions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {question.topics.map((topic) => (
                          <Badge key={topic} variant="topic" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        <Badge variant={question.status === 'active' ? 'success' : 'secondary'}>
                          {question.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">{question.title}</CardTitle>
                      {question.details && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.details}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete('question', question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {question.answer_count || 0} answers
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {question.view_count || 0} views
                    </span>
                    <span>
                      By: {question.is_anonymous ? "Anonymous" : question.author_name}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeQuestions.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No questions found
                </CardContent>
              </Card>
            )}

            <SimplePagination
              currentPage={questionsPage}
              totalPages={questionsTotalPages}
              onPageChange={setQuestionsPage}
            />
          </TabsContent>

          <TabsContent value="answers" className="space-y-4 mt-6">
            {paginatedAnswers.map((answer) => {
              const question = questions.find(q => q.id === answer.question_id);
              return (
                <Card key={answer.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {answer.is_pinned && (
                            <Badge variant="verified">Best Answer</Badge>
                          )}
                          {answer.is_verified && (
                            <Badge variant="success">Verified</Badge>
                          )}
                          <Badge variant={answer.status === 'active' ? 'success' : 'secondary'}>
                            {answer.status}
                          </Badge>
                        </div>
                        {question && (
                          <p className="text-sm text-muted-foreground mb-2">
                            On: <span className="font-medium text-foreground">{question.title}</span>
                          </p>
                        )}
                        <p className="text-sm line-clamp-3">{answer.body}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={answer.is_pinned ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePinAnswer(answer.id, answer.is_pinned)}
                          title={answer.is_pinned ? "Unpin answer" : "Pin as best answer"}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={answer.is_verified ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVerifyAnswer(answer.id, answer.is_verified)}
                          title={answer.is_verified ? "Remove verification" : "Verify answer"}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete('answer', answer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Votes: {answer.votes || 0}</span>
                      <span>By: {answer.author_name}</span>
                      <span>
                        {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeAnswers.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No answers found
                </CardContent>
              </Card>
            )}

            <SimplePagination
              currentPage={answersPage}
              totalPages={answersTotalPages}
              onPageChange={setAnswersPage}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-6">
            {paginatedUsers.map((userProfile) => {
              const userQuestions = questions.filter(q => q.author_id === userProfile.id && q.status !== 'deleted');
              const userAnswers = answers.filter(a => a.author_id === userProfile.id && a.status !== 'deleted');

              return (
                <Card key={userProfile.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{userProfile.username}</CardTitle>
                            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {userProfile.is_admin && (
                            <Badge variant="verified" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={userProfile.is_admin ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleAdmin(userProfile.id, userProfile.is_admin)}
                        disabled={userProfile.id === user?.id}
                        title={userProfile.id === user?.id ? "Cannot modify your own admin status" : (userProfile.is_admin ? "Remove admin" : "Make admin")}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {userProfile.is_admin ? "Remove Admin" : "Make Admin"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {userQuestions.length} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {userAnswers.length} answers
                      </span>
                      <span>
                        Joined {formatDistanceToNow(new Date(userProfile.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {users.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No users found
                </CardContent>
              </Card>
            )}

            <SimplePagination
              currentPage={usersPage}
              totalPages={usersTotalPages}
              onPageChange={setUsersPage}
            />
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the {itemToDelete?.type} as deleted. This action cannot be easily undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={executeDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Admin;
