import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-7xl font-black text-gradient-primary">404</div>
        <h1 className="font-display font-bold text-2xl mt-2">Page not found</h1>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-2 justify-center mt-6">
          <Button asChild className="gradient-primary text-white border-0"><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link to="/cars">Browse cars</Link></Button>
        </div>
      </div>
    </div>
  );
}
