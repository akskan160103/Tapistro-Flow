'use client'

import { useUser } from '@/contexts/UserContext' 
import { UserProvider } from '@/contexts/UserContext' // Importing the UserProvider component 
import WorkflowBuilder from '@/components/WorkflowBuilder/WorkflowBuilder'
import LoginPage from '@/components/LoginPage/LoginPage'

function HomeContent() {
  // useUser() calls useContext(UserContext) which looks up the component tree
  // It finds the UserProvider above HomeContent and gets the context value from it
  const { isLoggedIn } = useUser() // Unwrapping the context object to get the isLoggedIn property

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
