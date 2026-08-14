import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

/**
 * Landed on after clicking the link from requestPasswordReset(). Supabase
 * puts the user into a temporary recovery session automatically (via the
 * URL fragment it appends), so this just needs to call updateUser() with
 * the new password — no token handling required here.
 */
export default function ResetPassword() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(values: ResetPasswordValues) {
    setFormError(null)
    const { error } = await supabase.auth.updateUser({ password: values.password })
    if (error) {
      setFormError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/login', { replace: true }), 1500)
  }

  if (done) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-2xl font-medium text-teal-900">Password updated</h1>
        <p className="text-sm text-charcoal-500">Redirecting you to sign in...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-teal-900">Set a new password</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <InputField
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <InputField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {formError && <p className="text-sm text-coral-500">{formError}</p>}

        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Update password
        </Button>
      </form>
    </div>
  )
}
