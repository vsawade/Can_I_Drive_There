import { Suspense } from "react"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
