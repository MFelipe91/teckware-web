import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, MessageCircle } from 'lucide-react'
import { POSTS, BLOG_AUTHOR, getPost } from '@/lib/blog'
import { articleLd } from '@/lib/structured-data'
import { WA } from '@/lib/whatsapp'

// Solo existen las guías definidas en lib/blog.ts; cualquier otro slug → 404
export const dynamicParams = false

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: { absolute: `${post.title} | Blog TECKWARE` },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [BLOG_AUTHOR],
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const otros = POSTS.filter((p) => p.slug !== post.slug)

  return (
    <div className="min-h-screen bg-ink-900 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleLd({
              title: post.title,
              description: post.description,
              path: `/blog/${post.slug}`,
              date: post.date,
              author: BLOG_AUTHOR,
            }),
          ),
        }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 mb-8 text-sm text-fg-muted hover:text-brand-bright transition-colors">
          <ArrowLeft size={14} />
          Todas las guías
        </Link>

        <h1 className="text-fg mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-10 text-xs text-fg-subtle">
          <span>Por {BLOG_AUTHOR}</span>
          <span>·</span>
          <time dateTime={post.date}>{fecha(post.date)}</time>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={12} />{post.minutes} min de lectura</span>
        </div>

        <p className="text-lg text-fg-muted leading-relaxed mb-10">{post.intro}</p>

        {post.sections.map((s) => (
          <section key={s.h2} className="mb-10">
            <h2 className="text-fg text-2xl mb-4">{s.h2}</h2>
            {s.p.map((t, i) => (
              <p key={i} className="text-fg-muted leading-relaxed mb-4">{t}</p>
            ))}
            {s.list && (
              <ul className="space-y-2 pl-5 list-disc marker:text-brand-bright">
                {s.list.map((li) => (
                  <li key={li} className="text-fg-muted leading-relaxed">{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA al servicio relacionado */}
        <aside className="mt-14 p-8 rounded-sm border border-brand-bright/15 bg-brand/5">
          <p className="text-fg font-bold mb-2">¿Prefieres que lo revisemos nosotros?</p>
          <p className="text-sm text-fg-muted mb-6">
            Diagnóstico claro antes de cualquier trabajo, pago al retirar y 30 días de garantía. Atendemos en La Serena y Coquimbo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={post.related.href}
              className="flex items-center gap-2 px-5 py-3 bg-brand text-white text-sm font-extrabold rounded-sm hover:bg-brand-hover transition-colors min-h-[44px]"
            >
              {post.related.label}
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <a
              href={WA.servicio(post.related.label)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-whatsapp/40 text-whatsapp text-sm font-bold rounded-sm hover:bg-whatsapp/10 transition-colors min-h-[44px]"
            >
              <MessageCircle size={14} />
              Consultar por WhatsApp
            </a>
          </div>
        </aside>
      </article>

      {/* Otras guías */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-fg text-xl mb-5">Otras guías</h2>
        <ul className="space-y-3">
          {otros.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-sm bg-white/[0.03] border border-white/8 text-sm text-fg-muted hover:text-fg hover:border-brand-bright/30 transition-colors"
              >
                {p.title}
                <ArrowRight size={14} className="text-brand-bright shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
