import type { Meta, StoryObj } from '@storybook/react-vite'

import * as styles from './Post.module.scss'
import { PostView } from './PostView'

const articleHtml = `
  <p>포스트 상세 화면의 본문 스타일을 한 번에 검수하기 위한 샘플 콘텐츠입니다. 문단, 링크, 목록, 인용문, 코드와 표를 포함합니다.</p>
  <h2 id="overview">구현 개요</h2>
  <p>컴포넌트를 작은 단위로 분리하면 <a href="#details">변경 범위</a>를 파악하고 테스트하기 쉬워집니다.</p>
  <ul>
    <li>페이지 헤더와 메타 정보</li>
    <li>본문 타이포그래피와 콘텐츠 요소</li>
    <li>목차와 작성자 프로필</li>
  </ul>
  <blockquote><p>Storybook의 샘플 데이터는 실제 포스트와 같은 마크업 구조를 사용합니다.</p></blockquote>
  <h2 id="details">상세 구성</h2>
  <h3 id="code-example">코드 예시</h3>
  <pre><code class="language-typescript">const visiblePosts = posts.filter((post) =&gt; post.isPublished)</code></pre>
  <h3 id="table-example">표 스타일</h3>
  <table>
    <thead><tr><th>영역</th><th>검수 항목</th></tr></thead>
    <tbody>
      <tr><td>Header</td><td>제목, 날짜, 태그</td></tr>
      <tr><td>Content</td><td>간격과 가독성</td></tr>
      <tr><td>Aside</td><td>목차 활성 상태</td></tr>
    </tbody>
  </table>
  <h2 id="summary">마무리</h2>
  <p>브라우저 너비를 조절해 데스크톱과 모바일 레이아웃을 함께 확인할 수 있습니다.</p>
`

const tableOfContents = `
  <ul>
    <li><a href="#overview">구현 개요</a></li>
    <li>
      <a href="#details">상세 구성</a>
      <ul>
        <li><a href="#code-example">코드 예시</a></li>
        <li><a href="#table-example">표 스타일</a></li>
      </ul>
    </li>
    <li><a href="#summary">마무리</a></li>
  </ul>
`

const defaultArgs = {
  title: 'Storybook으로 포스트 상세 UI 관리하기',
  date: '26.09.10',
  tags: ['React', 'Storybook', 'UI'],
  html: articleHtml,
  tableOfContents,
  showComments: false,
}

const series = {
  name: 'JavaScript 고유 문법',
  currentSlug: '/javascript-functions/',
  posts: [
    {
      slug: '/javascript-scope/',
      title: 'var, let, const와 호이스팅',
      date: '26.09.09',
      tags: ['javascript'],
      seriesOrder: 1,
    },
    {
      slug: '/javascript-functions/',
      title: '함수 선언문부터 화살표 함수까지',
      date: '26.09.10',
      tags: ['javascript'],
      seriesOrder: 2,
    },
    {
      slug: '/javascript-destructuring/',
      title: '구조 분해 할당과 Rest·Spread',
      date: '26.09.11',
      tags: ['javascript'],
      seriesOrder: 3,
    },
  ],
}

const meta = {
  title: 'Pages/Post',
  component: PostView,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    hero: { control: false },
    html: { control: false },
    tableOfContents: { control: false },
  },
} satisfies Meta<typeof PostView>

export default meta
type Story = StoryObj<typeof meta>

export const FullArticle: Story = {
  args: {
    ...defaultArgs,
    hero: (
      <img
        src="/assets/woojin-dachshund.png"
        alt="포스트 대표 이미지 예시"
        className={styles.heroImage}
      />
    ),
  },
}

export const WithoutHeroImage: Story = {
  args: defaultArgs,
}

export const WithSeriesNavigation: Story = {
  args: {
    ...defaultArgs,
    series,
  },
}
