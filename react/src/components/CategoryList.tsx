import React, { useEffect, useState } from "react";
import CategorySingle from "./CategorySingle";
import type { Category } from "../types";

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

type Props = {
  selected: string | null;
  onSelect: (name: string | null) => void;
};

const CategoryList: React.FC<Props> = ({ selected, onSelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  return (
    <div>
      <CategorySingle
        name="All"
        icon="🌐"
        selected={selected === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((cat) => (
        <CategorySingle
          key={cat.id}
          name={cat.name}
          icon={categoryIcons[cat.name] || "?"}
          selected={selected === cat.name}
          onClick={() => onSelect(cat.name)}
        />
      ))}
    </div>
  );
};

export default CategoryList;
