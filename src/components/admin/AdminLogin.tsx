/**
 * Sign-in form for the admin area.
 *
 * Nothing links here. `/admin` is absent from the site navigation, the sitemap
 * and robots.txt, and this form is all an ordinary visitor who guesses the URL
 * would ever see. Failures are deliberately vague so the form cannot be used to
 * work out which email addresses have accounts.
 */
import { useState, type FormEvent } from 'react'
import { useAuth } from '@/context/authContext'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/forms/Field'
import { AdminShell } from './AdminShell'

export function AdminLogin() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const result = await signIn(email, password)
    setIsSubmitting(false)
    if (!result.ok) setError(result.message)
    // On success the auth listener swaps this form out for the dashboard.
  }

  return (
    <AdminShell title="Staff sign-in">
      <p className="text-sm leading-relaxed text-ink-600">
        This area is for Dilly Kitchen staff. If you were looking for the restaurant, the{' '}
        <a href="/" className="font-medium text-ink-900 underline underline-offset-4">
          main site is this way
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <p role="alert" className="rounded-2xl bg-spice-500/10 px-4 py-3 text-sm text-spice-600">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting || !email || !password} fullWidth>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AdminShell>
  )
}
