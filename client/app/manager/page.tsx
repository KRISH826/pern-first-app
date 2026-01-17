"use client"
import { Button } from '@/components/ui/button'
import { signOut } from 'aws-amplify/auth'

const ManagerPage = () => {
    return (
        <div>
            <Button onClick={() => signOut()}>Log Out</Button>
        </div>
    )
}

export default ManagerPage