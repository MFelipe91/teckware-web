import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
    title: { absolute: `${post.title} | TECKWARE` },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      locale: 'es_CL',
      siteName: 'TECKWARE SpA',
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
    <div className="min-h-svh bg-ink-900 pt-16">
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
        <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 mb-6 text-sm text-fg-muted hover:text-brand-bright transition-colors">
          <ArrowLeft size={14} />
          Todas las guías
        </Link>

        <h1 className="mb-5 text-[clamp(2.25rem,4.6vw,3.75rem)]">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-10 text-sm text-fg-subtle">
          <span>Por {BLOG_AUTHOR}</span>
          <time dateTime={post.date}>{fecha(post.date)}</time>
          <span>{post.minutes} min de lectura</span>
        </div>

        <p className="text-lg text-fg-muted leading-relaxed mb-10">{post.intro}</p>

        {post.sections.map((s) => (
          <section key={s.h2} className="mb-10">
            <h2 className="text-fg text-3xl mb-4">{s.h2}</h2>
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
        <aside className="panel-corte mt-14 p-7 sm:p-8">
          <p className="font-display text-2xl font-semibold text-fg mb-2">¿Prefieres que lo revisemos nosotros?</p>
          <p className="text-fg-muted leading-relaxed mb-6">
            Diagnóstico claro antes de cualquier trabajo, pago al retirar y 30 días de garantía. Atendemos en La Serena y Coquimbo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={post.related.href}
              className="btn btn-primario"
            >
              {post.related.label}
            </Link>
            <a
              href={WA.servicio(post.related.label)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secundario"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </aside>
      </article>

      {/* Otras guías */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-fg text-3xl mb-5">Otras guías</h2>
        <ul className="border-t border-white/10">
          {otros.map((p) => (
            <li key={p.slug} className="border-b border-white/10">
              <Link href={`/blog/${p.slug}`} className="block py-3 text-fg-muted hover:text-brand-bright transition-colors">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
