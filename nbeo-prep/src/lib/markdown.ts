// Minimal, dependency-free Markdown → HTML for trusted seed content.
// Supports headings, bold/italic, inline code, links, blockquotes, ordered and
// unordered lists, GitHub-style tables, and paragraphs.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-sm">$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="text-primary underline underline-offset-2" href="$2">$1</a>',
    );
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  const flushTable = () => {
    const rows: string[] = [];
    while (i < lines.length && lines[i].trim().startsWith("|")) {
      rows.push(lines[i]);
      i++;
    }
    if (rows.length < 2) {
      rows.forEach((r) => html.push(`<p>${inline(r)}</p>`));
      return;
    }
    const parse = (r: string) =>
      r
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());
    const header = parse(rows[0]);
    const body = rows.slice(2).map(parse);
    html.push('<table class="w-full border-collapse text-sm my-4">');
    html.push("<thead><tr>");
    header.forEach((h) =>
      html.push(`<th class="border border-border px-3 py-2 text-left font-semibold">${inline(h)}</th>`),
    );
    html.push("</tr></thead><tbody>");
    body.forEach((r) => {
      html.push("<tr>");
      r.forEach((c) => html.push(`<td class="border border-border px-3 py-2">${inline(c)}</td>`));
      html.push("</tr>");
    });
    html.push("</tbody></table>");
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }
    if (trimmed.startsWith("|")) {
      flushTable();
      continue;
    }
    if (trimmed.startsWith("### ")) {
      html.push(`<h3 class="mt-6 mb-2 text-lg font-semibold">${inline(trimmed.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      html.push(`<h2 class="mt-8 mb-3 text-xl font-bold">${inline(trimmed.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      html.push(`<h1 class="mt-8 mb-4 text-2xl font-bold">${inline(trimmed.slice(2))}</h1>`);
      i++;
      continue;
    }
    if (trimmed.startsWith("> ")) {
      html.push(
        `<blockquote class="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">${inline(
          trimmed.slice(2),
        )}</blockquote>`,
      );
      i++;
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      html.push('<ol class="list-decimal space-y-1 pl-6 my-3">');
      items.forEach((it) => html.push(`<li>${inline(it)}</li>`));
      html.push("</ol>");
      continue;
    }
    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      html.push('<ul class="list-disc space-y-1 pl-6 my-3">');
      items.forEach((it) => html.push(`<li>${inline(it)}</li>`));
      html.push("</ul>");
      continue;
    }
    html.push(`<p class="my-3 leading-relaxed">${inline(trimmed)}</p>`);
    i++;
  }

  return html.join("\n");
}
