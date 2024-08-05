"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

import Form from "@components/Form"

const EditPrompt = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const promptId = searchParams.get('id')
    const [post, setPost] = useState({
        prompt: "",
        tag: "",
    })

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch (`api/prompt/${promptId}`)
            const data = await response.json();

            setPost({
                prompt: data.prompt,
                tag: data.tag,
            })
        }
        if(promptId) getPromptDetails();
    }, [promptId])

    const editPrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if(!promptId) return alert ('Prompt ID not found')
        try{
            const response = await fetch(`/api/prompt/${promptId}` , {
                method: 'PATCH',
                body: JSON.stringify ( {
                    prompt: post.prompt,
                    tag: post.tag
                })
            });

            if(response.ok) {
                router.push("/profile")
            }
        } catch(err) {
            console.log(err);
        }
        finally {
            setSubmitting(false);
        }
    }


    return (
        <Form 
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={editPrompt}
        />
    )
}

export default EditPrompt