"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function Dashboard() {
  const [username] = useState();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [error] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState();
  const postsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setData(data);
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("jwtToken");
        router.push("/signin");
      }
    };
    fetchData();
  }, [router]);

  // Filter posts by title or ID
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.id.toString().includes(search)
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [search, posts]);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleLogout = async () => {
    localStorage.removeItem("jwtToken");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {data ? (
        <div className="flex h-screen bg-gray-900 text-white">
          {/* Sidebar */}
          <aside className="w-64 bg-black/40 backdrop-blur-sm border-r border-blue-500/20 p-5">
            <h2 className="text-2xl font-bold mb-5 text-blue-400">Dashboard</h2>
            <nav>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-500/10 transition-colors"
                  >
                    <span className="mr-3">🏠</span>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-500/10 transition-colors"
                  >
                    <span className="mr-3">⚙️</span>
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-500/10 transition-colors"
                  >
                    <span className="mr-3">👤</span>
                    <span>Profile</span>
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Header */}
            <header className="flex justify-between items-center bg-black/40 backdrop-blur-sm border border-blue-500/20 p-4 rounded-lg shadow-lg mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Welcome,</span>
                <span className="font-bold text-lg text-blue-400">
                  {username || "Guest"}
                </span>
              </div>
              <button
                className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors hover:cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </header>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by Title or ID..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Error Handling */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            {/* Table */}
            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg shadow-lg p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-500/20">
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Title
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/20">
                  {currentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-blue-500/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {post.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {post.title}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer ${
                    currentPage === 1
                      ? "bg-blue-500/20 text-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <span className="mr-2">⬅️</span>
                  Previous
                </button>

                <span className="text-gray-400">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredPosts.length / postsPerPage)}
                </span>

                <button
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer ${
                    indexOfLastPost >= filteredPosts.length
                      ? "bg-blue-500/20 text-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={indexOfLastPost >= filteredPosts.length}
                >
                  Next
                  <span className="ml-2">➡️</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="flex items-center gap-2 text-blue-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
