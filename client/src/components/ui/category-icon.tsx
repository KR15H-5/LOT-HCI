import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface CategoryIconProps {
  name: string;
  icon: React.ElementType;
  href: string;
}

export function CategoryIcon({ name, icon: Icon, href }: CategoryIconProps) {
  // Map category names to gradient colors and icon background
  const getCategoryStyles = (categoryName: string) => {
    switch(categoryName) {
      case "Tools":
        return {
          gradient: "from-blue-600 to-blue-400",
          iconBg: "bg-blue-500",
          shadow: "shadow-blue-500/25"
        };
      case "Garden":
        return {
          gradient: "from-emerald-600 to-emerald-400",
          iconBg: "bg-emerald-500",
          shadow: "shadow-emerald-500/25"
        };
      case "Kitchen":
        return {
          gradient: "from-orange-600 to-orange-400",
          iconBg: "bg-orange-500", 
          shadow: "shadow-orange-500/25"
        };
      case "Repairs":
        return {
          gradient: "from-violet-600 to-violet-400",
          iconBg: "bg-violet-500",
          shadow: "shadow-violet-500/25"
        };
      default:
        return {
          gradient: "from-primary to-blue-400",
          iconBg: "bg-primary",
          shadow: "shadow-primary/25"
        };
    }
  };

  const { gradient, iconBg, shadow } = getCategoryStyles(name);

  return (
    <Link href={href}>
      <div className="flex flex-col items-center cursor-pointer group">
        <div className={`w-[70px] h-[70px] rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-br ${gradient} ${shadow} shadow-lg relative overflow-hidden transition-transform duration-200 group-active:scale-95`}>
          {/* Decorative elements */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/10"></div>
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/20"></div>
          
          {/* Icon */}
          <div className={`relative z-10`}>
            <Icon className="h-8 w-8 text-white drop-shadow-sm" />
          </div>
        </div>
        <span className="text-xs font-semibold text-gray-800 group-active:text-primary transition-colors">{name}</span>
      </div>
    </Link>
  );
}
