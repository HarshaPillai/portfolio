"use client";

import { useRef, useCallback } from "react";
import NotepadWindow from "./NotepadWindow";

export type Article = {
  title: string;
  pubDate: string;
  description: string;
  link: string;
};

export default function WritingClient({ articles }: { articles: Article[] }) {
  const maxZRef = useRef(articles.length + 10);

  const bringToFront = useCallback(() => {
    maxZRef.current += 1;
    return maxZRef.current;
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#FAFAF8",
      }}
    >
      {articles.map((article, i) => (
        <NotepadWindow
          key={article.link || String(i)}
          article={article}
          initialX={180 + i * 60}
          initialY={80 + i * 40}
          initialZ={10 + i}
          onFocus={bringToFront}
        />
      ))}
    </div>
  );
}