"use client"

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
        response = await fetch('/api/prompt');
      } else {
        response = await fetch(`/api/prompt/filter/${query}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts(searchText);
  }, [searchText, fetchPosts]);

  const handleTagClick = async (tag) => {
    try {
      const fetchFilteredPosts = await fetch(`/api/prompt/filter/${tag}`);
      const data = await fetchFilteredPosts.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
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
