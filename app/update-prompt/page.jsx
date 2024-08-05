"use client"; // Ensure this is at the top to mark the component as client-side

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";

const EditPrompt = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const promptId = searchParams.get('id');
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  useEffect(() => {
    const getPromptDetails = async () => {
      if (!promptId) return;
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();
      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };
    getPromptDetails();
  }, [promptId]);

  const editPrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!promptId) {
      alert('Prompt ID not found');
      return;
    }
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={editPrompt}
      />
    </Suspense>
  );
};

export default EditPrompt;
