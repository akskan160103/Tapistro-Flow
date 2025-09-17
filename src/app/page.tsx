'use client'

import { useUser } from '@/contexts/UserContext'
import { UserProvider } from '@/contexts/UserContext'
import WorkflowBuilder from '@/components/WorkflowBuilder/WorkflowBuilder'
import LoginPage from '@/components/LoginPage/LoginPage'

function HomeContent() {
  const { isLoggedIn } = useUser()

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return <WorkflowBuilder />
}

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  )
}
