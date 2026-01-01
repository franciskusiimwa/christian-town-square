import { Layout } from "@/components/layout/Layout";

const Guidelines = () => {
  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
            Community Guidelines
          </h1>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Christian Town Square is built on trust, respect, and a shared 
              commitment to truth-seeking. These guidelines help us maintain a 
              space where meaningful dialogue can flourish.
            </p>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Be Respectful
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Treat every person with dignity, regardless of their beliefs</li>
                <li>Disagree with ideas, not people</li>
                <li>Avoid mockery, insults, or condescending language</li>
                <li>Assume good faith in others' questions and answers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Be Thoughtful
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Support your answers with reasoning, evidence, or citations</li>
                <li>Reference sources when possible (Bible, scholarship, history)</li>
                <li>Acknowledge uncertainty when appropriate ("Here's my understanding…")</li>
                <li>Focus on clarity over cleverness</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Stay On Topic
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Keep discussions focused on Christian worldview questions</li>
                <li>Avoid tangential debates that derail the conversation</li>
                <li>Political topics should connect clearly to faith and ethics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                What's Not Allowed
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Harassment, personal attacks, or hate speech</li>
                <li>Spam, self-promotion, or off-topic content</li>
                <li>"Gotcha" arguments designed to embarrass rather than understand</li>
                <li>Deliberately misleading information</li>
              </ul>
            </section>

            <section className="bg-muted rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold mb-2 text-foreground">
                Report Concerns
              </h2>
              <p className="text-muted-foreground">
                If you see content that violates these guidelines, please use the 
                report button. Our moderators review all reports and take appropriate 
                action to maintain a healthy community.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Guidelines;
