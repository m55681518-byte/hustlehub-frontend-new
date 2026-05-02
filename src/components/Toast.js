import React, { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  }

  return (
    <div className="toast">
      {icons[type]} {message}
    </div>
  )
}
