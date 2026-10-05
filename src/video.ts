import { createContext, useContext } from 'react'
import type { Video } from './content'

export const VideoContext = createContext<(video: Video) => void>(() => {})

/** Opens a video in the video layer. */
export function usePlayVideo() {
  return useContext(VideoContext)
}
