import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
            <Share2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg text-foreground">
            QuickShare Rooms
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            to="/about" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            About
          </Link>
          <Link 
            to="/privacy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
