import { useEffect, useState } from 'react'

const useDelayedLoading = (loading) => {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    let timer
    if (loading) {
      setShowSpinner(true)
    } else if (!loading && showSpinner) {
      timer = setTimeout(() => setShowSpinner(false), 700)
    }
    return () => clearTimeout(timer)
  }, [loading, showSpinner])
  
  return showSpinner
}

export default useDelayedLoading