import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — MunchLens",
  description: "Beslenme, diyet ve sağlıklı yaşam hakkında uzman içerikleri.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-3xl mb-3">📖</p>
          <h1 className="text-3xl font-black mb-3">MunchLens Blog</h1>
          <p className="text-muted-foreground">
            Beslenme, diyet ve sağlıklı yaşam hakkında bilimsel içerikler
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readMinutes} dk
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <h2 className="font-bold text-base group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-2xl p-6 text-center border border-orange-200 dark:border-orange-900">
          <p className="text-lg font-bold mb-2">Beslenmenizi takip etmeye hazır mısınız?</p>
          <p className="text-sm text-muted-foreground mb-4">
            MunchLens ile fotoğrafla kalori sayın, AI ile haftalık plan yapın.
          </p>
          <Link
            href="/giris"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Ücretsiz Başla <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
