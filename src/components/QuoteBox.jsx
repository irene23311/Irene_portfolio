import React, { useState, useEffect } from "react";

const API_URL = "https://api.adviceslip.com/advice";

export default function QuoteBox() {
  const [quote, setQuote] = useState("Loading advice…");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);

  async function fetchQuote() {
    try {
      setError(null);

      const res = await fetch(API_URL, {
        // AdviceSlip caches for 2 seconds; this avoids super-aggressive caching
        cache: "no-cache",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const advice = data?.slip?.advice;

      if (!advice) {
        throw new Error("Malformed response");
      }

      setQuote(advice);
      setAuthor("Advice Slip API");
    } catch (err) {
      console.error("Quote API error:", err);
      setError(err.message || "Unknown error");
      setQuote("Creativity is just intelligence having fun.");
      setAuthor("Local fallback");
    }
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="quote-box">
      {error && (
        <p className="quote-error">
          Unable to reach advice service. Showing a local quote instead.
          <br />
          <small>({error})</small>
        </p>
      )}

      <p className="quote-text">“{quote}”</p>
      {author && <p className="quote-author">— {author}</p>}

      <button className="quote-button" onClick={fetchQuote}>
        New quote
      </button>
    </div>
  );
}
