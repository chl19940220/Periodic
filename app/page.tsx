import PeriodicTable from '../components/PeriodicTable';
import { elements } from '../data/elements';

export default function Home() {
  return (
    <main className="min-h-screen p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">元素周期表</h1>
      <div className="max-w-fit mx-auto overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <PeriodicTable elements={elements} />
      </div>
    </main>
  );
}
