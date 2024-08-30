const signout = () => {
  localStorage.removeItem('loggedUser')
  window.location.href = '/'
}

export default { signout }