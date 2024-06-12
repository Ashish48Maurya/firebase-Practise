"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useAuth } from "@/app/components/Client";



const EditPage = ({ params }) => {
  const { getPost, updatePost } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('Post');
  const [disable, setDisable] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const router = useRouter();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisable(true);
    setText("Posting...");
    await updatePost(params.id, title, description, image);
    setText('Post');
    setDisable(false);
    router.push(`/post/${params.id}`);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPost(params.id);
        setDescription(res.desc);
        setTitle(res.title)
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPost();
  }, [params.id]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', marginTop: "100px", padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Head>
        <title>Edit Post</title>
      </Head>
      <h3 style={{ textAlign: 'center' }}>Edit Post</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} encType="multipart/form-data">
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}></textarea>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: "50px" }}>Image:</label>
          <input type="file" name="file" onChange={handleImageChange} accept="image/*" style={{ marginBottom: '10px' }} />
        </div>
        <button disabled={disable} type="submit" style={{ width: '100%', padding: '10px', backgroundColor: disable ? 'red' : '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{text}</button>
      </form>
    </div>
  );
};

export default EditPage;
