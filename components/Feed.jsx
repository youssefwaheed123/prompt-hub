import { useEffect, useState, useCallback } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    try {
      let response;
      const trimmedSearchText = searchText.trim();

      if (trimmedSearchText === "") {
        response = await fetch("/api/prompt");
      } else {
        response = await fetch(`/api/prompt/filter/${encodeURIComponent(trimmedSearchText)}`);
      }

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to fetch posts. Please try again later.');
    }
  }, [searchText]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTagClick = (tag) => {
    setSearchText(tag);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
        />
      </form>

      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
