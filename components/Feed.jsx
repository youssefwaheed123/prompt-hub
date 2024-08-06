"use client";

import { useEffect, useState, useCallback } from "react";
import PropmtCard from "./PropmtCard";

const PropmtCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PropmtCard
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

  const fetchPosts = useCallback(async (query = "") => {
    try {
      let response;
      if (query.trim() === '') {
        console.log("Fetching all posts");
        response = await fetch(`/api/prompt?_=${Date.now()}`, {
          cache: "no-store", // Ensure we bypass any potential cache issues
        });
      } else {
        console.log(`Fetching posts with query: ${query}`);
        response = await fetch(`/api/prompt/filter/${query}?_=${Date.now()}`, {
          cache: "no-store",
        });
      }
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      console.log("Fetched posts:", data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);  // Clear posts on error
    }
  }, []);

  useEffect(() => {
    fetchPosts(searchText);
  }, [searchText, fetchPosts]);

  const handleTagClick = async (tag) => {
    setSearchText(tag);
  }

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

      <PropmtCardList
        data={posts}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed;
