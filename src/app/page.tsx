import { getAllPoems } from '../lib/poems';
import PoemPage from '../components/PoemPage';

export default async function Home() {
  const poems = await getAllPoems();
  return <PoemPage initialPoems={poems} />;
}
