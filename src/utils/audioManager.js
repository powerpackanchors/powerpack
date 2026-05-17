let currentlyPlayingRef = null

export const setCurrentAudio = (videoRef) => {
  if (currentlyPlayingRef && currentlyPlayingRef !== videoRef) {
    currentlyPlayingRef.muted = true
    // Dispatch custom event to sync local mute states on other cards
    currentlyPlayingRef.dispatchEvent(new CustomEvent('globalMute'))
  }
  currentlyPlayingRef = videoRef
}

export const clearCurrentAudio = () => {
  currentlyPlayingRef = null
}
