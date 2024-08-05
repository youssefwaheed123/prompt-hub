"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    fetchPosts();
  }, []);
  
  const handleTagClick = async (tag) => {
    try {
      console.log("test")
      const fetchFilteredPosts = await fetch(`/api/prompt/filter/${tag}`);
      const data = await fetchFilteredPosts.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  }

  const handleSearchChange = async (e) => {
    e.preventDefault();
    const text = e.target.value;
    setSearchText(text);

    if (text.trim() === '') {
      fetchPosts();
      return;
    }

    try {
      const fetchFilteredPosts = await fetch(`/api/prompt/filter/${text}`);
      const data = await fetchFilteredPosts.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };



  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input type="text" placeholder="Search for a tag or a username" value={searchText} onChange={handleSearchChange} className="search_input peer"/>
      </form>

      <PropmtCardList 
        data={posts}
        handleTagClick = {handleTagClick}
      />
    </section>
  )
}

export default Feed