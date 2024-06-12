'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import { toast } from "react-hot-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/Client';

const Login = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const router = useRouter();
  const {signInWithGoogle} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // logIn(email,password);
    signInWithGoogle();
  };

  return (
    <div style={{ maxWidth: '300px', margin: "auto", marginTop: "100px", padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Head>
        <title>Login</title>
      </Head>
      <h2 style={{ marginBottom: "10px" }}>Login</h2>
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', backgroundColor: 'blueviolet', color: "white", border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: "10px" }} type='submit'>SignIn with Google</button>
    </div>
  );
};

export default Login;
