import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { api } from "./axios";
import PostCard from "./components/PostCard";

const App = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(false);
  const submitForm = async (e) => {
    e.preventDefault();
    if (code) {
      setIsLoading(true);
      setError(false);
      try {
        const { data } = await api(`/p/${code}`);
        console.log(data);
        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        setPosts(null);
        setIsLoading(false);
        setError(true);
        console.log(error);
      }
    }
  };

  return (
    <div className="max-w-7xl p-3 mx-auto border rounded-md h-screen">
      <form onSubmit={submitForm}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only "
        >
          Search
        </label>
        <div className="relative">
          <input
            type="search"
            id="default-search"
            className="block w-full py-4 px-6  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Enter the ID"
            required
            value={code}
            onChange={({ target }) => setCode(target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-2 disabled:opacity-50"
          >
            Fetch
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <ImSpinner3 className="text-3xl text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {posts ? (
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mt-3 h-full w-full">
              {posts?.carouselMedia ? (
                posts?.carouselMedia.map((post, index) => (
                  <PostCard
                    key={index}
                    userData={posts?.user}
                    post={post}
                    code={code}
                  />
                ))
              ) : (
                <PostCard
                  userData={posts?.user}
                  post={posts?.singleMedia}
                  code={code}
                />
              )}
            </div>
          ) : error ? (
            <section className="bg-gray-100 flex items-center min-h-screen">
              <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                  <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
                    404
                  </h1>
                  <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
                    Something&apos;s missing.
                  </p>
                  <p className="mb-4 text-lg font-light text-gray-900 ">
                    Sorry, we can&apos;t find that page. You&apos;ll find lots
                    to explore on the home page.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            // <iframe
            //   allowFullScreen={true}
            //   title="YouTube video player"
            //   src="https://www.youtube.com/embed/_FuDMEgIy7I"
            //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            //   className="aspect-video mx-auto mb-6 w-full rounded-lg border dark:border-dark-900 border-gray-300 shadow-2xl mt-3"
            // />
            "Enter the post id"
          )}
        </>
      )}
    </div>
  );
};

export default App;
