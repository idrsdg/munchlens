import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/lib/blog-posts";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — MunchLens Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

// Very simple markdown renderer (headings, bold, lists, code blocks)
function renderMarkdown(md: string) {
  const lines = md.trim().split("\n");
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      result.push(
        <h2 key={i} className="text-xl font-bold mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      result.push(
        <h3 key={i} className="text-base font-bold mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      result.push(
        <pre key={i} className="bg-muted rounded-xl p-4 text-sm overflow-x-auto my-3 font-mono">
          {codeLines.join("\n")}
        </pre>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      result.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-2 text-sm text-muted-foreground">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      const html = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      result.push(
        <p key={i} className="text-sm leading-relaxed text-foreground/80 my-2" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }

    i++;
  }

  return result;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readMinutes} dk okuma
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{post.emoji}</span>
            <h1 className="text-2xl font-black leading-tight">{post.title}</h1>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed border-l-4 border-primary pl-4">
            {post.excerpt}
          </p>
        </header>

        {/* Content */}
        <div className="prose-sm max-w-none">
          {renderMarkdown(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-orange-50 dark:bg-orange-950/30 rounded-2xl p-6 text-center border border-orange-200 dark:border-orange-900">
          <p className="font-bold mb-1">MunchLens ile Beslenmenizi Takip Edin</p>
          <p className="text-sm text-muted-foreground mb-4">
            AI destekli kalori takibi, haftalık planlar ve daha fazlası.
          </p>
          <Link
            href="/giris"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Ücretsiz Başla
          </Link>
        </div>

        {/* Other posts */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-muted-foreground mb-3">Diğer Yazılar</p>
          <div className="space-y-2">
            {blogPosts
              .filter((p) => p.slug !== slug)
              .slice(0, 3)
              .map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.readMinutes} dk</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}
