import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser, selectUsers } from '../../reducers/userReducer'
import Wrapper from '../styles/Wrappers'

const Users = () => {
  const user = useSelector(selectUser)
  const users = useSelector(selectUsers)
  const navigate = useNavigate()

  if (!user) return null

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  }

  if (Array.isArray(users) && users.length > 0 ) {
    return (
      <Wrapper>
        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Admin status</th>
              <th>Active status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={()=>handleRowClick(u.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.name}</td>
                <td>{u.admin ? 'Yes' : 'No'}</td>
                <td>{u.enabled ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <h3>Users</h3>
        <p>No users found</p>
      </Wrapper>
    )
  }
}

export default Users