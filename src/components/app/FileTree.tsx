import { useState } from "react";
import { ChevronRight, FileCode2, Folder, FolderOpen } from "lucide-react";

export type FileTreeNode = { name: string; type: "dir" | "file"; children?: FileTreeNode[] };

function TreeNode({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const pad = { paddingLeft: `${depth * 12 + 8}px` };

  if (node.type === "file") {
    return (
      <div
        style={pad}
        className="flex items-center gap-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2/40 rounded cursor-pointer"
      >
        <FileCode2 className="size-3.5 text-cyan-ai/70" />
        {node.name}
      </div>
    );
  }

  return (
    <div>
      <button
        style={pad}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 py-1 text-xs text-foreground hover:bg-surface-2/40 rounded"
      >
        <ChevronRight className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
        {open ? <FolderOpen className="size-3.5 text-purple-ai" /> : <Folder className="size-3.5 text-purple-ai" />}
        <span className="font-medium">{node.name}</span>
      </button>
      {open && node.children?.map((c) => <TreeNode key={c.name} node={c} depth={depth + 1} />)}
    </div>
  );
}

export function FileTree({ tree }: { tree: FileTreeNode[] }) {
  return (
    <div className="font-mono">
      {tree.map((n) => <TreeNode key={n.name} node={n} />)}
    </div>
  );
}

export function buildTreeFromPaths(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const path of paths) {
    const segments = path.split("/").filter(Boolean);
    let currentLevel = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;

      let existing = currentLevel.find((n) => n.name === segment);
      if (!existing) {
        existing = {
          name: segment,
          type: isLast ? "file" : "dir",
        };
        if (!isLast) {
          existing.children = [];
        }
        currentLevel.push(existing);
      }
      if (!isLast) {
        currentLevel = existing.children || [];
      }
    }
  }

  // Sort: directories first, then files alphabetically
  const sortNodes = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "dir" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children) {
        sortNodes(node.children);
      }
    }
  };

  sortNodes(root);
  return root;
}
