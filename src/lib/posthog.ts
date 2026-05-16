import posthog from 'posthog-js'
const isDev = import.meta.env.MODE === 'development'

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined

if (posthogKey) {
  posthog.init(
    posthogKey,
    {
      api_host: posthogHost,
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: isDev,
      capture_pageview: !isDev,
      disable_session_recording: isDev
    }
  )
}

export default posthog
