import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "./badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import Image from "next/image";

interface CourseCardProps {
  title: string;
  instructor: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  onClick?: () => void;
}

export function CourseCard({
  title,
  instructor,
  image,
  price,
  originalPrice,
  rating,
  students,
  duration,
  level,
  onClick
}: CourseCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute top-3 right-3 bg-white/90 text-black">
            {level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">By {instructor}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">₹{price}</span>
          {originalPrice && (
            <span className="text-sm line-through text-muted-foreground">
              ₹{originalPrice}
            </span>
          )}
        </div>
        <Button size="sm" onClick={onClick}>
          <BookOpen className="h-4 w-4 mr-2" />
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}
