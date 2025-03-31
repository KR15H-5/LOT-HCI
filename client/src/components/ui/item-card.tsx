import { Link } from "wouter";
import { Item } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ItemCardProps {
  item: Item;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

export function ItemCard({ item, size = "md", showStatus = false }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`}>
      <a className="block">
        <Card className="overflow-hidden">
          <AspectRatio ratio={1 / 1}>
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
            {showStatus && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-xs opacity-90">
                  {item.trainingRequired 
                    ? "Training Required" 
                    : item.expertSupportRequired 
                      ? "Expert Support" 
                      : "Available"}
                </p>
              </div>
            )}
          </AspectRatio>
          {!showStatus && (
            <CardContent className={`p-3 ${size === "sm" ? "p-2" : ""}`}>
              <h3 className={`font-medium ${size === "sm" ? "text-xs" : ""}`}>{item.name}</h3>
              <p className={`text-gray-500 ${size === "sm" ? "text-[10px]" : "text-xs"}`}>{item.description}</p>
            </CardContent>
          )}
        </Card>
      </a>
    </Link>
  );
}
