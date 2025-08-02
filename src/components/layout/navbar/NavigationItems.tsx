import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Users, Archive } from "lucide-react";

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigationItems: NavigationItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Explore", path: "/explore", icon: Search },
  { name: "Community", path: "/community", icon: Users },
  { name: "Archive", path: "/archive", icon: Archive },
];

interface NavigationItemsProps {
  className?: string;
  onItemClick?: () => void;
}

const NavigationItems: React.FC<NavigationItemsProps> = ({ className, onItemClick }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={className}>
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          onClick={onItemClick}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
            isActive(item.path)
              ? "bg-heritage-purple text-white"
              : "text-foreground hover:bg-heritage-purple/10 hover:text-heritage-purple"
          }`}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default NavigationItems;