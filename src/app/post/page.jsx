"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useAuth } from '../components/Client';

const NewPost = () => {
  const { handlePost } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('Post');
  const [disable, setDisable] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

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
    await handlePost(title, description, image);
    toast.success("Posted...");
    setText('Post');
    setTitle("");
    setDescription("");
    setImage(null)
    setDisable(false);
};

return (
  <div style={{ maxWidth: '600px', margin: 'auto', marginTop: "100px", padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
    <Head>
      <title>New Post</title>
    </Head>
    <h1 style={{ textAlign: 'center' }}>New Post</h1>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} enctype="multipart/form-data">
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
  </div >
);
};

export default NewPost;
