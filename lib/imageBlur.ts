// Inline SVG data URIs used as blurDataURL in next/image.
// They render a solid dark rectangle that fades out when the real image loads,
// eliminating the blank-white flash common on first load.

export const BLUR_DARK =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Crect width='8' height='5' fill='%23030407'/%3E%3C/svg%3E"

export const BLUR_SURFACE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Crect width='8' height='5' fill='%230D1120'/%3E%3C/svg%3E"

export const BLUR_NAVY =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Crect width='8' height='5' fill='%23080B14'/%3E%3C/svg%3E"
