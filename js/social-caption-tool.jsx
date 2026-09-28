import React, { useState } from 'react';
import { Copy, Check, Sparkles, Loader2 } from 'lucide-react';

const PLATFORM_META = {
  facebook: { label: 'Facebook', color: '#5C6B47' },
  instagram: { label: 'Instagram', color: '#A6602F' },
  linkedin: { label: 'LinkedIn', color: '#2B2B27' },
};

export default function SocialCaptionTool() {
  const [businessName, setBusinessName] = useState('Stoneleigh Outdoor Co.');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState({});

  const generate = async () => {
    if (!input.trim()) {
      setError('Enter what you want to post about first.');
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const systemPrompt = `You are a social media caption assistant for the business "${businessName}". Given a short update from the business owner, write three platform-tailored draft captions:
- facebook: warm, conversational tone, 2-4 sentences, no hashtags.
- instagram: punchier and shorter, ends with 3-5 relevant hashtags.
- linkedin: professional register, positions the business as knowledgeable, 2-3 sentences, no hashtags.
Respond with ONLY a raw JSON object in this exact shape, no markdown formatting, no code fences, no extra text: {"facebook": "...", "instagram": "...", "linkedin": "..."}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: input }],
        }),
      });

      const data = await response.json();
      const textBlock = data.content?.find((b) => b.type === 'text');
      if (!textBlock) throw new Error('No response text received.');
      const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResults(parsed);
    } catch (err) {
      console.error(err);
      setError('Something went wrong generating drafts. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (platform, text) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [platform]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [platform]: false })), 1800);
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-6" style={{ backgroundColor: '#EDE7D9' }}>
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs font-semibold tracking-wide" style={{ color: '#5C6B47' }}>
              CLIENT PORTAL
            </p>
            <h1 className="text-2xl font-semibold" style={{ color: '#2B2B27' }}>
              {businessName}
            </h1>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#2B2B27' }}
          >
            <Sparkles size={18} color="#EDE7D9" />
          </div>
        </div>
        <p className="text-sm mb-6" style={{ color: '#5c5b53' }}>
          Social Post Generator
        </p>

        <div className="border-2 p-5 mb-6" style={{ borderColor: '#2B2B27', backgroundColor: '#FAF8F2' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: '#2B2B27' }}>
            Business name
          </label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full border-2 px-3 py-2 mb-4 text-sm rounded-none"
            style={{ borderColor: '#C9BFA8', backgroundColor: '#FAF8F2', color: '#2B2B27' }}
          />

          <label className="block text-xs font-semibold mb-2" style={{ color: '#2B2B27' }}>
            What do you want to post about?
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="e.g. We just wrapped a paver patio and fire pit install in Faribault — client's thrilled, great timing for entertaining season."
            className="w-full border-2 px-3 py-2 text-sm mb-4 rounded-none"
            style={{ borderColor: '#C9BFA8', backgroundColor: '#FAF8F2', color: '#2B2B27' }}
          />

          {error && (
            <p className="text-sm mb-3" style={{ color: '#A6602F' }}>
              {error}
            </p>
          )}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-none"
            style={{ backgroundColor: loading ? '#7C4623' : '#A6602F', color: '#FAF8F2' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generating drafts...
              </>
            ) : (
              'Generate drafts'
            )}
          </button>
        </div>

        {results && (
          <div className="space-y-4">
            {['facebook', 'instagram', 'linkedin'].map((platform) => (
              <div
                key={platform}
                className="border-2 p-5 rounded-none"
                style={{ borderColor: '#2B2B27', backgroundColor: '#FAF8F2' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: PLATFORM_META[platform].color }}
                  >
                    {PLATFORM_META[platform].label}
                  </span>
                  <button
                    onClick={() => handleCopy(platform, results[platform])}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border-2 rounded-none"
                    style={{ borderColor: '#2B2B27', color: '#2B2B27' }}
                  >
                    {copied[platform] ? (
                      <>
                        <Check size={13} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm whitespace-pre-wrap" style={{ color: '#2B2B27' }}>
                  {results[platform]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
