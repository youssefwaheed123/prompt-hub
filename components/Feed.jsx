"use client"

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
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async (query = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/prompt?query=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchPosts(searchText), 500); // Debounce fetch
    return () => clearTimeout(timeoutId);
  }, [searchText, fetchPosts]);

  const handleTagClick = (tag) => {
    setSearchText(tag); // Reuse the search input
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

      {isLoading ? <p>Loading...</p> : (
        <PromptCardList 
          data={posts}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  )
}

export default Feed;
