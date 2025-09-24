"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

// Minimal, single-file UI for your tokenizer endpoint
// TailwindCSS styles; drop into app/page.jsx or any client route
export default function TokenizerUI() {
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [ids, setIds] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState("gpt-4o-mini");

  // Debounce input to avoid spamming the endpoint
  useEffect(() => {
    const controller = new AbortController();
    const id = setTimeout(async () => {
      if (text === "") {
        setTokens([]);
        setIds([]);
        setCount(0);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/tokenize",
          { text, model },
          {
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        );
        setTokens(res.data?.tokens ?? []);
        setIds(res.data?.ids ?? []);
        setCount(res.data?.count ?? res.data?.tokens?.length ?? 0);
      } catch (e) {
        if (!axios.isCancel(e)) {
          setError(e?.response?.data?.detail || "Failed to tokenize.");
          setTokens([]);
          setIds([]);
          setCount(0);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(id);
    };
  }, [text, model]);

  const tokenColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
  ];

  const coloredTokens = useMemo(
    () =>
      tokens?.map((t, i) => (
        <span
          key={i}
          className={`min-h-6 h-fit px-2 py-1 rounded-xl text-xs font-mono m-1 inline-block ${
            tokenColors[i % tokenColors.length]
          }`}
        >
          {t}
        </span>
      )),
    [tokens]
  );

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl grid gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            GPT Tokenizer
          </h1>
          <div className="flex items-center gap-2">
            <StatusDot loading={loading} />
            <span className="text-sm text-gray-600">
              {loading ? "Tokenizing…" : "Idle"}
            </span>
          </div>
        </div>

        {/* Model Selection */}
        <div className="grid gap-2">
          <label htmlFor="model" className="text-sm font-medium">
            Model
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 p-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-3.5">gpt-3.5</option>
          </select>
        </div>

        {/* Input */}
        <div className="grid gap-2">
          <label htmlFor="input" className="text-sm font-medium">
            Input text
          </label>
          <textarea
            id="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text…"
            className="w-full h-32 rounded-2xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none p-3 text-sm"
          />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Characters: {text.length}</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-2 py-0.5">
              <span className="font-medium">Tokens</span>
              <span className="tabular-nums">{count}</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Tokens */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tokens</label>
          </div>
          <div className="w-full min-h-40 max-h-40 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs font-mono tracking-tight flex flex-wrap">
            {coloredTokens}
          </div>
        </div>

        {/* IDs */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Token IDs</label>
          </div>
          <div className="w-full min-h-40 max-h-40 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs font-mono tracking-tight whitespace-pre-wrap break-words">
            {ids && ids.length > 0 ? `[${ids.join(", ")}]` : ""}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center">Model: {model}</div>
      </div>
    </div>
  );
}

function StatusDot({ loading }) {
  return (
    <span
      className={
        "inline-block h-2.5 w-2.5 rounded-full " +
        (loading ? "bg-gray-400 animate-pulse" : "bg-emerald-500")
      }
    />
  );
}
