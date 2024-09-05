import PropTypes from 'prop-types'

const Message = ({ messages }) => {
  // console.log('Messages received in Message component:', messages)

  if (Array.isArray(messages) && messages.length > 0) {
    return (
      <div>
        <h2>Current messages</h2>
        <ol>
          {messages.map((m, index) => (
            <li key={index}>{m.content}</li>
          ))}
        </ol>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Current messages</h2>
        <p>No messages yet.</p>
      </div>
    )
  }
}

Message.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired
    })
  ).isRequired
}

export default Message