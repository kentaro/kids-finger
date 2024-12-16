import { getAllPoems } from '@/lib/poems';
import PoemPage from '@/components/PoemPage';

// 静的ページ生成のためのパラメータを定義
export async function generateStaticParams() {
  const poems = await getAllPoems();
  return poems.map((_, index) => ({
    id: (index + 1).toString(),
  }));
}

// ページコンポーネント
export default async function Page() {
  const poems = await getAllPoems();
  return <PoemPage initialPoems={poems} />;
}

// メタデータの設定
export async function generateMetadata({ params }: { params: { id: string } }) {
  const poems = await getAllPoems();
  const page = parseInt(params.id, 10);
  const poem = poems[page - 1];

  return {
    title: `${poem.title} - Web詩集`,
    description: poem.excerpt || poem.title,
  };
} 