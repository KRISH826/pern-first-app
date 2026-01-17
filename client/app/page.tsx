"use client"
import React from 'react'
import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthGuard from '@/components/common/AuthGuard';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/store/user/userSlice';

const TenantDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogOut = async () => {
    await signOut();
    dispatch(logout());
    router.replace('/auth/sign-in');
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-6 p-4'>
      <h1 className='text-4xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
        Tenant Dashboard
      </h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>You are logged in as a Tenant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{user?.role}</p>
          </div>
          <Button onClick={handleLogOut} variant="destructive" className="w-full mt-4">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const Home = () => {
  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <TenantDashboard />
    </AuthGuard>
  )
}

export default Home