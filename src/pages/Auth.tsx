import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // Password Reset form state
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle email confirmation and password reset on page load
  useEffect(() => {
    const handleAuthActions = async () => {
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      // Handle email confirmation
      if (tokenHash && type === 'email') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (error) throw error;

          toast({
            title: "Email verified!",
            description: "Your email has been successfully verified. You can now sign in.",
          });
        } catch (error: any) {
          toast({
            title: "Verification failed",
            description: error.message || "Could not verify your email. The link may have expired.",
            variant: "destructive",
          });
        }
      }

      // Handle password recovery
      if (tokenHash && type === 'recovery') {
        setIsResettingPassword(true);
        toast({
          title: "Set your new password",
          description: "Please enter a new password below.",
        });
      }
    };

    handleAuthActions();
  }, [searchParams, toast]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(signInEmail, signInPassword);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(signUpEmail, signUpPassword, signUpName);

      // Log success for debugging
      console.log('✅ Signup successful! Email should be sent to:', signUpEmail);
      console.log('📧 Check your spam folder if you don\'t see the email in a few minutes');

      toast({
        title: "Account created!",
        description: "Please check your email (including spam/junk folder) to verify your account. The confirmation email may take 1-2 minutes to arrive.",
        duration: 10000, // Show for 10 seconds
      });

      // Don't navigate away immediately so user sees the message
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(resetEmail);

      toast({
        title: "Password reset email sent!",
        description: "Check your email for a link to reset your password. The link will expire in 1 hour.",
        duration: 10000,
      });

      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);

      toast({
        title: "Password updated!",
        description: "Your password has been successfully changed. You can now sign in with your new password.",
      });

      setIsResettingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Failed to update password",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is resetting password, show password reset form
  if (isResettingPassword) {
    return (
      <Layout>
        <div className="container-page py-8 md:py-12">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>

          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
                Set New Password
              </h1>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 md:p-8">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating password..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to home
        </Link>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
              Welcome
            </h1>
            <p className="text-muted-foreground">
              Join the conversation or sign in to your account
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your username"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset">
                <form onSubmit={handleResetPasswordRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll send you a link to reset your password
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <Link to="/guidelines" className="text-primary hover:underline">
              Community Guidelines
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
