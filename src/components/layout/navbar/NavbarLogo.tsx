import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      <div className="w-10 h-10 bg-gradient-to-br from-heritage-purple to-cultural-gold rounded-lg flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
        Talescapes
      </span>
    </Link>
  );
};

export default NavbarLogo;