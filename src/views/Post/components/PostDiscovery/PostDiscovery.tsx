import { Link } from 'gatsby'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

type PostDiscoveryProps = {
  previousPost?: AdjacentPost
  nextPost?: AdjacentPost
  relatedPosts: readonly PostSummary[]
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

export const PostDiscovery = ({ previousPost, nextPost, relatedPosts }: PostDiscoveryProps) => (
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
            <li key={post.slug} className="h-full">
              <Button
                asChild
                variant="outline"
                className="group h-full min-h-52 w-full items-stretch justify-start whitespace-normal rounded-xl border-foreground/30 bg-secondary/20 p-0 text-left text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-foreground/55 hover:bg-accent/60 hover:text-accent-foreground hover:shadow-md"
              >
                <Link className="flex flex-col no-underline" to={postPath(post.slug)}>
                  <span className="flex flex-col gap-4 p-5 pb-3">
                    <span className="font-mono text-[0.625rem] font-normal text-muted-foreground">{post.date}</span>
                    <strong className="text-base font-semibold leading-snug tracking-[-0.035em] md:text-[1.05rem]">
                      {post.title}
                    </strong>
                  </span>
                  <span className="mt-auto flex flex-wrap gap-1.5 p-5 pt-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-[0.625rem] font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    )}
  </div>
)
