"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [ids, setIds] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function tokenize() {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/tokenize",
        { text, model: "gpt-4o-mini" },
        { headers: { "Content-Type": "application/json" } }
      );
      setTokens(res.data.tokens);
      setIds(res.data.ids);
      setCount(res.data.count);
    } catch (err) {
      console.error("Tokenize error:", err);
      alert("Failed to tokenize text. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">GPT Token Visualizer</h1>

      <textarea
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Type or paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={tokenize}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Tokenizing..." : "Tokenize"}
      </button>

      {tokens.length > 0 && (
        <div className="mt-8">
          <p className="font-bold mb-4 text-lg">Total tokens: {count}</p>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t, i) => (
              <div
                key={i}
                className=" text-black px-3 py-1 rounded-md cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: `hsl(${i * 40 % 360}, 70%, 85%)` }}
                title={`Token ID: ${ids[i]}`}
              >
                <strong>{t}</strong>
                <span className="ml-1 text-sm text-gray-700">({ids[i]})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
