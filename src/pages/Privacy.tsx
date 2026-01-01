import { Layout } from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Your privacy matters to us. This policy explains how we collect, 
              use, and protect your information.
            </p>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Information We Collect
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Account information (email, username) when you register</li>
                <li>Content you post (questions, answers, votes)</li>
                <li>Basic usage data to improve the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                How We Use Your Information
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>To provide and improve our services</li>
                <li>To display your content to other users</li>
                <li>To send important account notifications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Anonymous Posting
              </h2>
              <p className="text-muted-foreground">
                When you choose to post anonymously, your username is hidden from 
                other users. However, we retain the connection to your account 
                internally for moderation purposes and to allow you to manage your 
                content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Data Protection
              </h2>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal 
                information. We do not sell your data to third parties.
              </p>
            </section>

            <section className="bg-muted rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold mb-2 text-foreground">
                Questions?
              </h2>
              <p className="text-muted-foreground">
                If you have questions about this privacy policy, please contact us.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
