import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/redirect')({
  component: () => <div>Hello /redirect!</div>
})