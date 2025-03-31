import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface CategoryIconProps {
  name: string;
  icon: React.ElementType;
  href: string;
}

export function CategoryIcon({ name, icon: Icon, href }: CategoryIconProps) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center cursor-pointer">
        <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-1">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xs">{name}</span>
      </div>
    </Link>
  );
}
