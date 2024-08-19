"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  if (!data.length) {
    return <p className="mt-10 text-md">No posts found</p>;
  }

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
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const trimmedSearchText = searchText.trim();

      if (trimmedSearchText === "") {
        response = await fetch("/api/prompt");
      } else {
        response = await fetch(
          `/api/prompt/filter/${encodeURIComponent(trimmedSearchText)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTagClick = useMemo(
    () => (tag) => {
      setSearchText(tag);
    },
    []
  );

  const handleSearchChange = useCallback((e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  }, []);

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

      {loading ? (
        <p className="text-lg text center mt-32">Loading posts...</p>
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
