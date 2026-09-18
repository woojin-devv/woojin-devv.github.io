import { Link } from 'gatsby'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type AdjacentPost = {
  slug: string
  title: string
}

export type PostSummary = {
  slug: string
  title: string
  date: string
  tags: readonly string[]
}

export type PostSeries = {
  name: string
  currentSlug: string
  posts: readonly (PostSummary & { seriesOrder?: number | null })[]
}

type PostDiscoveryProps = {
  previousPost?: AdjacentPost
  nextPost?: AdjacentPost
  relatedPosts: readonly PostSummary[]
  series?: PostSeries
}

const postPath = (slug: string) => `/posts${slug}`

const SectionHeading = ({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) => (
  <header className="mb-5 space-y-2">
    <p className="m-0 font-mono text-[0.625rem] font-bold tracking-[0.16em] text-muted-foreground">
      {eyebrow}
    </p>
    <h2 id={id} className="m-0 text-2xl font-semibold tracking-[-0.05em] text-foreground md:text-3xl">
      {title}
    </h2>
  </header>
)

export const PostDiscovery = ({ previousPost, nextPost, relatedPosts, series }: PostDiscoveryProps) => (
  <div className="mt-20 grid min-w-0 gap-16 md:mt-24 md:gap-20">
    {(previousPost || nextPost) && (
      <nav className="grid gap-3 md:grid-cols-2" aria-label="이전 글과 다음 글">
        {previousPost && (
          <Button
            asChild
            variant="outline"
            className="group h-auto min-h-32 items-stretch justify-start whitespace-normal rounded-xl border-border bg-card px-6 py-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-card hover:text-foreground hover:shadow-md"
          >
            <Link to={postPath(previousPost.slug)}>
              <span className="flex min-w-0 flex-1 flex-col justify-between gap-6">
                <span className="flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={14} aria-hidden="true" />
                  Previous post
                </span>
                <strong className="text-base font-semibold leading-snug tracking-[-0.035em] text-foreground md:text-lg">
                  {previousPost.title}
                </strong>
              </span>
            </Link>
          </Button>
        )}
        {nextPost && (
          <Button
            asChild
            variant="outline"
            className={cn(
              'group h-auto min-h-32 items-stretch justify-start whitespace-normal rounded-xl border-border bg-card px-6 py-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-card hover:text-foreground hover:shadow-md md:text-right',
              !previousPost && 'md:col-start-2',
            )}
          >
            <Link to={postPath(nextPost.slug)}>
              <span className="flex min-w-0 flex-1 flex-col justify-between gap-6 md:items-end">
                <span className="flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Next post
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={14} aria-hidden="true" />
                </span>
                <strong className="text-base font-semibold leading-snug tracking-[-0.035em] text-foreground md:text-lg">
                  {nextPost.title}
                </strong>
              </span>
            </Link>
          </Button>
        )}
      </nav>
    )}

    {relatedPosts.length > 0 && (
      <section aria-labelledby="related-posts-title">
        <SectionHeading eyebrow="KEEP READING" title="Related writing" id="related-posts-title" />
        <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
          {relatedPosts.map((post) => (
            <li key={post.slug}>
              <Link className="group block h-full text-inherit no-underline" to={postPath(post.slug)}>
                <Card className="flex h-full min-h-52 flex-col rounded-xl transition-all group-hover:-translate-y-1 group-hover:border-foreground/30 group-hover:shadow-md">
                  <CardHeader className="space-y-4 p-5 pb-3">
                    <CardDescription className="m-0 font-mono text-[0.625rem]">{post.date}</CardDescription>
                    <CardTitle className="text-base leading-snug tracking-[-0.035em] md:text-[1.05rem]">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-wrap gap-1.5 p-5 pt-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-[0.625rem] font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}

    {series && series.posts.length > 1 && (
      <section aria-labelledby="series-title">
        <Card className="overflow-hidden rounded-xl">
          <CardHeader className="border-b border-border p-5 md:p-6">
            <div className="flex items-center gap-2 font-mono text-[0.625rem] font-bold tracking-[0.16em] text-muted-foreground">
              <BookOpen size={14} aria-hidden="true" /> SERIES
            </div>
            <CardTitle id="series-title" className="pt-1 text-xl tracking-[-0.04em] md:text-2xl">
              {series.name}
            </CardTitle>
            <CardDescription className="m-0">총 {series.posts.length}개의 글로 구성된 시리즈입니다.</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-3">
            <ol className="m-0 list-none space-y-1 p-0">
              {series.posts.map((post, index) => {
                const isCurrent = post.slug === series.currentSlug
                return (
                  <li key={post.slug}>
                    <Link
                      to={postPath(post.slug)}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={cn(
                        'grid min-h-14 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:px-4',
                        isCurrent && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                      )}
                    >
                      <span className="font-mono text-xs opacity-70">
                        {String(post.seriesOrder ?? index + 1).padStart(2, '0')}
                      </span>
                      <strong className="text-sm font-medium leading-snug md:text-[0.9375rem]">{post.title}</strong>
                      <span className="hidden md:block">
                        {isCurrent ? (
                          <Badge variant="secondary" className="font-mono text-[0.625rem]">Reading</Badge>
                        ) : (
                          <small className="font-mono text-[0.625rem]">{post.date}</small>
                        )}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
      </section>
    )}
  </div>
)
