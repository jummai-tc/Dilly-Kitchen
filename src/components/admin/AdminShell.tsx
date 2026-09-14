/** Plain centred frame shared by the admin sign-in, error and loading states. */
import type { ReactNode } from 'react'

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-5 py-16">
      <div className="w-full max-w-md rounded-card bg-white p-8 shadow-soft ring-1 ring-ink-900/8">
        <p className="eyebrow text-[0.6rem] text-ink-500">Dilly Kitchen</p>
        <h1 className="mt-2 font-display text-2xl text-ink-900">{title}</h1>
        <div className="mt-5">{children}</div>
      </div>
    </main>
  )
}
