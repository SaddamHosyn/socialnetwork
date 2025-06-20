import React, { useEffect, useState } from "react";
import Category from "./Category";
import type { CategoryType } from "../types";

const categoryIcons: Record<string, string> = {
  Aland: "🏝️",
  Animals: "🐾",
  Anime: "🌸",
  Art: "🎨",
  Books: "📚",
  Celebrities: "⭐",
  Cooking: "👩‍🍳",
  Creepy: "👻",
  Dreams: "💭",
  Fashion: "👗",
  Food: "🍔",
  Funny: "😂",
  Gaming: "🎮",
  Gym: "🏋️‍♂️",
  History: "🏰",
  Horoscopes: "🔭",
  Love: "❤️",
  Money: "💰",
  Movies: "🎬",
  Music: "🎵",
  Politics: "🏛️",
  Relationships: "💑",
  "Rich People": "🤑",
  "Shower Thoughts": "🚿",
  Sports: "🏅",
  Travel: "✈️",
  Weird: "🤪",
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  return (
    <div>
      {categories.map((cat) => (
        <Category
          key={cat.id}
          name={cat.name}
          icon={categoryIcons[cat.name]}
          selected={selected === cat.id}
          onClick={() => setSelected(cat.id)}
        />
      ))}
    </div>
  );
};

export default CategoryList;
