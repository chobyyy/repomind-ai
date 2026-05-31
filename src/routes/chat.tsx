import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkles, ArrowUp, MessageSquareCode } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Assistant — RepoMind AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "How does authentication work?",
  "Explain the backend architecture",
  "Where is JWT handled?",
  "Find duplicate logic",
  "Explain the API flow",
];

const seed: Msg[] = [
  { role: "assistant", content: "Hi! I'm RepoMind AI. Ask me anything about your repository — auth flow, architecture, endpoints, dependencies." },
];

function fakeAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("auth") || lower.includes("jwt")) {
    return "Authentication is handled by NextAuth in `/lib/auth.ts`. It issues JWT sessions with a 15m TTL, refreshed via `/api/refresh`. The middleware at `/src/middleware.ts` validates the `__session` cookie using Jose and redirects unauthenticated users to `/login`.";
  }
  if (lower.includes("architecture") || lower.includes("backend")) {
    return "The backend follows a clean hexagonal pattern. Domain services live under `/services`, exposed via tRPC routers in `/server/api`. Data access flows through Prisma against PostgreSQL with a Redis cache for hot reads. Events are emitted through a Cloud Events bus.";
  }
  if (lower.includes("duplicate")) {
    return "I found 2 likely duplicates: validation logic appears both in `/lib/validators/user.ts` and inline in `/api/users/route.ts`. Consider extracting a single `validateUserInput()` helper.";
  }
  return "I scanned the codebase and here's what I found: the relevant logic lives across `/lib`, `/services` and `/app/api`. Want me to generate a diagram or open the file tree?";
}

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, pending]);

  useEffect(() => {
    inputRef.current?.focus();
  });

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setPending(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", content: fakeAnswer(q) }]);
      setPending(false);
    }, 700);
  }

  return (
    <AppShell title="AI Assistant" subtitle="Context-aware conversations grounded in your repo">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-9rem)]">
        <div className="flex-1 overflow-y-auto space-y-6 pb-6">
          {msgs.map((m, i) => (
            <Message key={i} m={m} />
          ))}
          {pending && (
            <div className="flex items-start gap-3 animate-fade-in">
              <Avatar />
              <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-cyan-ai animate-glow-pulse" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {msgs.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 text-xs rounded-full border border-border-subtle bg-surface-2/40 text-muted-foreground hover:text-foreground hover:border-cyan-ai/30 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="relative rounded-xl border border-border-subtle bg-card focus-within:border-cyan-ai/40 transition-colors"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Ask anything about this repository…"
            className="w-full bg-transparent resize-none outline-none text-sm px-4 py-3 pr-14 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || pending}
            className="absolute right-3 bottom-3 size-9 rounded-lg bg-cyan-ai text-background flex items-center justify-center disabled:opacity-40 hover:bg-cyan-ai/90 transition-colors"
          >
            <ArrowUp className="size-4" />
          </button>
        </form>
        <div className="text-[10px] text-muted-foreground mt-2 text-center">
          RepoMind AI grounds answers in your indexed codebase. Always verify before shipping.
        </div>
      </div>
    </AppShell>
  );
}

function Avatar() {
  return (
    <div className="size-7 shrink-0 rounded-lg bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center">
      <Sparkles className="size-3.5 text-background" />
    </div>
  );
}

function Message({ m }: { m: Msg }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-cyan-ai text-background px-4 py-2.5 text-sm">
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <Avatar />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 inline-flex items-center gap-1.5">
          <MessageSquareCode className="size-3" /> RepoMind
        </div>
        <div
          className="text-sm text-foreground/90 leading-relaxed [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-surface-2 [&_code]:border [&_code]:border-border-subtle [&_code]:text-cyan-ai [&_code]:font-mono [&_code]:text-[12px]"
          dangerouslySetInnerHTML={{ __html: m.content.replace(/`([^`]+)`/g, "<code>$1</code>") }}
        />
      </div>
    </div>
  );
}
