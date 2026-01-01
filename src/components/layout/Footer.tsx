import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container-wide py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-serif text-lg font-semibold text-primary">
              Christian Town Square
            </span>
            <p className="text-sm text-muted-foreground">
              A place for honest questions and thoughtful answers
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/guidelines" className="hover:text-foreground transition-colors">
              Community Guidelines
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Christian Town Square. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
