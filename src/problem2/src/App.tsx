import { SwapForm } from '@/components/SwapForm'

function App() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.16),transparent_35%)]" />
      <main className="relative mx-auto flex min-h-svh max-w-5xl items-center justify-center px-4 py-10">
        <SwapForm />
      </main>
    </div>
  )
}

export default App
