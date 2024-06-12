'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import { toast } from "react-hot-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/Client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
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
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <button style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: "10px" }} type='submit'>Login</button>
        <button style={{ width: '100%', padding: '10px', backgroundColor: 'blueviolet', color: "white", border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: "10px" }} type='submit'>SignIn with Google</button>
        <Link href='/register'>Sign Up</Link>
      </form>
    </div>
  );
};

export default Login;
