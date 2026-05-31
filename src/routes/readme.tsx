import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Copy, Download, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/readme")({
  head: () => ({ meta: [{ title: "README Generator — RepoMind AI" }] }),
  component: ReadmePage,
});

const defaultMd = `# nextjs-core-repo

> AI-generated documentation for **vercel/nextjs-core-repo** — Next.js 14 app using App Router, TypeScript, and TailwindCSS.

## ✨ Features

- App Router with React Server Components
- tRPC API layer with end-to-end type safety
- NextAuth session-based authentication (JWT)
- PostgreSQL with Redis cache layer
- Stripe billing & customer portal

## 🚀 Getting Started

\`\`\`bash
git clone https://github.com/vercel/nextjs-core-repo
cd nextjs-core-repo
pnpm install
pnpm dev
\`\`\`

## 🧱 Architecture

The app follows a clean hexagonal architecture:

- \`/app\` — Routing & layouts
- \`/components\` — Reusable UI primitives
- \`/lib\` — Auth, db, utilities
- \`/services\` — Domain services (cache, pipeline)

## 📚 API

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | \`/api/users\`           | List users            |
| POST   | \`/api/users\`           | Create a new user     |
| POST   | \`/api/webhooks/stripe\` | Stripe webhook hook   |

## 🤝 Contributing

PRs welcome. Run \`pnpm lint\` and \`pnpm test\` before submitting.
`;

function ReadmePage() {
  const [md, setMd] = useState(defaultMd);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="README Generator"
      subtitle="Edit and export auto-generated documentation"
      actions={
        <>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border-subtle bg-surface-2/40 text-xs font-medium hover:border-cyan-ai/30"
          >
            {copied ? <Check className="size-3.5 text-emerald-ai" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={download}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-foreground text-background text-xs font-medium hover:bg-foreground/90"
          >
            <Download className="size-3.5" /> Export
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-11rem)]">
        <div className="rounded-xl border border-border-subtle bg-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-surface-2/40">
            <span className="text-xs font-medium text-muted-foreground">Markdown</span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-ai inline-flex items-center gap-1">
              <Sparkles className="size-3" /> AI generated
            </span>
          </div>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="flex-1 w-full bg-transparent outline-none p-4 font-mono text-xs leading-relaxed resize-none text-foreground/90"
            spellCheck={false}
          />
        </div>

        <div className="rounded-xl border border-border-subtle bg-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-surface-2/40">
            <span className="text-xs font-medium text-muted-foreground">Preview</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">live</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 text-sm prose-styles">
            <Markdown md={md} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Minimal markdown renderer (headings, code, lists, tables, paragraphs)
function Markdown({ md }: { md: string }) {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <pre key={key++} className="my-4 p-4 rounded-lg bg-background border border-border-subtle overflow-x-auto">
          <code className="text-xs font-mono text-cyan-ai">{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      out.push(<h1 key={key++} className="text-2xl font-semibold tracking-tight mt-2 mb-3">{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      out.push(<h2 key={key++} className="text-lg font-semibold tracking-tight mt-6 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      out.push(<h3 key={key++} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      out.push(<blockquote key={key++} className="my-3 pl-4 border-l-2 border-cyan-ai/40 text-muted-foreground italic">{inline(line.slice(2))}</blockquote>);
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <ul key={key++} className="my-3 space-y-1 list-disc pl-5 text-foreground/90">
          {items.map((it, k) => <li key={k}>{inline(it)}</li>)}
        </ul>
      );
      continue;
    } else if (line.startsWith("| ")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i]);
        i++;
      }
      const split = (r: string) => r.split("|").slice(1, -1).map((c) => c.trim());
      const header = split(rows[0]);
      const body = rows.slice(2).map(split);
      out.push(
        <table key={key++} className="my-4 w-full text-xs border border-border-subtle rounded-lg overflow-hidden">
          <thead className="bg-surface-2/60">
            <tr>{header.map((h, k) => <th key={k} className="text-left px-3 py-2 font-semibold">{inline(h)}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className="border-t border-border-subtle">
                {row.map((c, k) => <td key={k} className="px-3 py-2 text-foreground/90">{inline(c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
      continue;
    } else if (line.trim() === "") {
      // skip
    } else {
      out.push(<p key={key++} className="my-2 text-foreground/90 leading-relaxed">{inline(line)}</p>);
    }
    i++;
  }

  return <>{out}</>;
}

function inline(s: string): React.ReactNode {
  // bold + code
  const parts = s.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`")) {
      return <code key={i} className="px-1 py-0.5 rounded bg-surface-2 border border-border-subtle text-cyan-ai font-mono text-[12px]">{p.slice(1, -1)}</code>;
    }
    if (p.startsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}
