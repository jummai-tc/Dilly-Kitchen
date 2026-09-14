import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '@/config/navigation'
import { siteConfig, whatsappLink, whatsappMessages } from '@/config/site'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ExternalActionButton } from '@/components/ui/ExternalActionButton'
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { Logo } from './Logo'

/** Height of the fixed bar — the drawer and overlay start directly below it. */
const DRAWER_OFFSET = 'top-[70px] sm:top-[76px]'

export function Header() {
  const { pathname } = useLocation()
  /*
   * The drawer records which route it was opened on. Navigating anywhere else
   * closes it during render, so no effect is needed to keep the two in sync.
   */
  const [menuState, setMenuState] = useState({ isOpen: false, path: pathname })
  const isMenuOpen = menuState.isOpen && menuState.path === pathname
  const [isScrolled, setIsScrolled] = useState(false)
  /* Only the home page opens with a full-bleed photograph behind the bar. */
  const isHomeHero = pathname === '/'
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const setIsMenuOpen = useCallback(
    (isOpen: boolean) => setMenuState({ isOpen, path: pathname }),
    [pathname],
  )

  useLockBodyScroll(isMenuOpen)

  /* Condense the header once the page scrolls. */
  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Escape closes the drawer and returns focus to the toggle. */
  useEffect(() => {
    if (!isMenuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen, setIsMenuOpen])

  /* Keep Tab focus within the toggle + drawer while the drawer is open. */
  useEffect(() => {
    if (!isMenuOpen) return
    const panel = panelRef.current
    if (!panel) return

    // The toggle sits in the header, outside the panel, so it joins the trap.
    const focusable = [
      toggleRef.current,
      ...panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea',
      ),
    ].filter((element): element is HTMLElement => Boolean(element))

    focusable[1]?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] font-medium transition-colors duration-300 xl:px-3 xl:text-[0.95rem]',
      'after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 xl:after:inset-x-3',
      'after:bg-brand-500 after:transition-transform after:duration-300 hover:after:scale-x-100',
      isActive ? 'text-brand-500 after:scale-x-100' : 'text-cream-100/85 hover:text-cream-50',
    )

  return (
    <>
      <header
        className={cn(
          'on-dark fixed inset-x-0 top-0 z-60 transition-all duration-500 ease-[var(--ease-out-soft)]',
          isScrolled && 'bg-ink-950/95 shadow-lift backdrop-blur-md',
          /*
            Over the home hero the bar dissolves into the photograph instead of
            sitting on it as a solid band — the top stays dark enough to carry
            the navigation, and the edge fades out entirely.
          */
          !isScrolled &&
            (isHomeHero
              ? 'bg-gradient-to-b from-ink-950/95 via-ink-950/65 to-transparent'
              : 'bg-ink-950/80 backdrop-blur-sm'),
        )}
      >
        <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <Logo />

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-2.5">
            <ExternalActionButton link="uberEats" variant="primary" size="sm" showIcon={false}>
              <span className="whitespace-nowrap xl:hidden">Uber Eats</span>
              <span className="hidden whitespace-nowrap xl:inline">Order on Uber Eats</span>
            </ExternalActionButton>
            <Button href={whatsappLink(whatsappMessages.general)} variant="outline-dark" size="sm">
              <WhatsAppIcon className="size-[1.15em]" />
              <span className="whitespace-nowrap xl:hidden">WhatsApp</span>
              <span className="hidden whitespace-nowrap xl:inline">WhatsApp Us</span>
            </Button>
          </div>

          {/* Mobile toggle — also the close control while the drawer is open. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex size-11 items-center justify-center rounded-full border border-cream-100/20 text-cream-50 transition-colors hover:border-brand-500 hover:text-brand-500 lg:hidden"
          >
            {isMenuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </header>

      {/*
        The overlay and drawer are siblings of <header>, never children: the
        header's backdrop-blur would otherwise become their containing block and
        collapse them to zero height.
      */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          DRAWER_OFFSET,
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        id="mobile-navigation"
        ref={panelRef}
        role="dialog"
        aria-modal={isMenuOpen}
        aria-label="Site menu"
        inert={!isMenuOpen}
        className={cn(
          'fixed bottom-0 right-0 z-50 flex w-[min(21rem,86vw)] flex-col overflow-y-auto bg-ink-900 shadow-lift transition-transform duration-400 ease-[var(--ease-out-soft)] lg:hidden',
          DRAWER_OFFSET,
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="border-b border-cream-100/10 px-5 py-4">
          <span className="eyebrow text-brand-500">Menu</span>
        </div>

        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-4 py-3.5 font-display text-lg transition-colors',
                  isActive
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-cream-100 hover:bg-cream-100/5 hover:text-brand-500',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-cream-100/10 px-4 py-5">
          <ExternalActionButton link="uberEats" variant="primary" fullWidth showIcon={false}>
            Order on Uber Eats
          </ExternalActionButton>
          <Button href={whatsappLink(whatsappMessages.general)} variant="outline-dark" fullWidth>
            <WhatsAppIcon className="size-[1.15em]" />
            WhatsApp Us
          </Button>
          <a
            href={siteConfig.contact.phoneHref}
            className="mt-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-cream-200/75 transition-colors hover:text-brand-500"
          >
            <PhoneIcon className="size-4" />
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  )
}
