import { getAllPoems } from '../../../lib/poems';
import PoemPage from '../../../components/PoemPage';

export async function generateStaticParams() {
  const poems = await getAllPoems();
  return poems.map((_, index) => ({
    id: (index + 1).toString(),
  }));
}

export default async function Page() {
  const poems = await getAllPoems();
  return <PoemPage initialPoems={poems} />;
} 