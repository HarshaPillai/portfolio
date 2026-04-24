"use client";

import { useRef, useCallback } from "react";
import NotepadWindow from "./NotepadWindow";
import type { Article } from "./types";
export type { Article };

const POSITIONS = [
  { x: 80,  y: 60   },
  { x: 520, y: 40   },
  { x: 280, y: 380  },
  { x: 740, y: 120  },
  { x: 140, y: 700  },
  { x: 600, y: 520  },
  { x: 960, y: 280  },
  { x: 420, y: 820  },
  { x: 820, y: 640  },
  { x: 200, y: 1000 },
];

export default function WritingClient({ articles }: { articles: Article[] }) {
  const maxZRef = useRef(articles.length + 10);

  const bringToFront = useCallback(() => {
    maxZRef.current += 1;
    return maxZRef.current;
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto", backgroundColor: "transparent" }}>
      <div style={{ position: "relative", width: 1600, height: 1600, backgroundColor: "#FFFFFF" }}>
        {articles.map((article, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          return (
            <NotepadWindow
              key={article.link || String(i)}
              article={article}
              initialX={pos.x}
              initialY={pos.y}
              initialZ={10 + i}
              onFocus={bringToFront}
            />
          );
        })}
      </div>
    </div>
  );
}