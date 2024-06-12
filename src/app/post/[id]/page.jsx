"use client"
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from '../loading';
import { useAuth } from "@/app/components/Client";

const PostPage = ({ params }) => {
    const [post, setPost] = useState({});
    const [url, setUrl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const router = useRouter();
    const { user ,getPost, getImageURL, Postmessage,getPostMsg } = useAuth();

    const getMsgs=async()=>{
        const res = await getPostMsg(params.id)
        setMessages(res);
    }

    useEffect(() => {
        const handlePost = async () => {
            try {
                const res = await getPost(params.id);
                const img = await getImageURL(res.image);
                setPost(res);
                setUrl(img);
            } catch (err) {
                toast.error(err.message);
            }
        };
        handlePost();
        getMsgs();
    }, [params.id, getPost, getImageURL]);


    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        await Postmessage(newMessage,params?.id)
        toast.success("Message Sent")
        getMsgs();
        setNewMessage('');
    };

    return (
        <Suspense fallback={<Loading />}>
            {post && (
                <div style={{
                    maxWidth: '800px',
                    margin: 'auto',
                    padding: '20px',
                    border: '1px solid #000',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#000',
                    color: '#fff',
                    marginTop: '20px'
                }}>
                    <img src={url} alt={url} style={{
                        width: '50%',
                        height: "50%",
                        borderRadius: '10px',
                        marginBottom: '20px',
                    }} />
                    <h4 style={{
                        color: '#aaa',
                        marginBottom: '10px'
                    }}>{post.timestamp}</h4>
                    <div style={{
                        marginBottom: '20px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>{post.title}</div>
                    <h6 style={{
                        marginBottom: '20px',
                        lineHeight: '1.6',
                        fontSize: '1.2rem'
                    }}>{post.desc}</h6>
                    <h4 style={{
                        color: '#007bff',
                        marginBottom: '20px'
                    }}>Posted by: {post?.userName}</h4>

                    {user?.displayName === post?.userName && (
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                            onClick={() => router.push(`/edit/${post.id}`)}
                        >Edit</button>
                    )}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '20px',
                        backgroundColor: '#111',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '100%',
                    }}>
                        <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: '#222',
                            color: '#fff',
                        }} />
                        <button onClick={handleSendMessage} style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}>Send</button>
                    </div>
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        {messages?.map((message, index) => (
                            <div key={index} style={{
                                backgroundColor: '#222',
                                padding: '10px',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                color: '#fff',
                            }}>
                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{message.timestamp} - {message.userName}</div>
                                <div style={{ fontSize: '1.1rem' }}>{message.message}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Suspense>
    );
};

export default PostPage;
