"use client"
import React, { useState, useEffect } from 'react'
import { signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Profile = {
  name: string;
  email: string;
  role: string;
}

const Home = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const router = useRouter()
  useEffect(() => {
    async function fetchProfile() {
      try {
        await getCurrentUser();
        const attributes = await fetchUserAttributes();
        setUser({
          name: attributes.name!,
          email: attributes.email!,
          role: attributes['custom:role']!
        })
      } catch (error) {
        console.log(error);
        router.replace('/auth/sign-in')
      }
    }
    fetchProfile();
  }, [router])
  const handleLogOut = async () => {
    await signOut();
    router.replace('/auth/sign-in')
  }
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-6'>
      <h1 className='text-3xl font-bold'>Welcome to our platform</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  )
}

export default Home