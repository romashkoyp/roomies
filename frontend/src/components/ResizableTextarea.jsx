import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

const ResizableTextarea = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  cols = 50,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener('input', handleResize)
      return () => textarea.removeEventListener('input', handleResize)
    }
  }, [])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
    />
  )
}

ResizableTextarea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
}

export default ResizableTextarea