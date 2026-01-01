import { Layout } from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container-page py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
            About Christian Town Square
          </h1>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Christian Town Square is a place for honest questions and thoughtful 
              answers about the Christian faith. Whether you're a lifelong believer 
              with deep questions, a skeptic curious about Christianity, or someone 
              somewhere in between—you belong here.
            </p>

            <h2 className="font-serif text-2xl font-semibold mt-8 mb-4">
              Our Purpose
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We exist for people who don't fully understand what they believe—and 
              want thoughtful, well-reasoned, and respectful answers. This isn't a 
              debate arena. It's a truth-seeking space where questions are honored 
              and honest dialogue is encouraged.
            </p>

            <h2 className="font-serif text-2xl font-semibold mt-8 mb-4">
              What We Value
            </h2>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <strong className="text-foreground">Intellectual honesty</strong> — 
                  Wrestling with hard questions rather than avoiding them
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <strong className="text-foreground">Charitable dialogue</strong> — 
                  Assuming good faith and treating others with respect
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <strong className="text-foreground">Clear reasoning</strong> — 
                  Supporting claims with evidence, citations, and sound logic
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <strong className="text-foreground">Humility</strong> — 
                  Acknowledging the limits of our understanding
                </span>
              </li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold mt-8 mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ask questions, share answers, and upvote the most helpful responses. 
              The best answers—those with clear reasoning, citations, and charitable 
              tone—rise to the top. Our community of thoughtful believers and honest 
              seekers helps ensure quality through upvotes and moderation.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
