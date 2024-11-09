import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser, selectUsers, selectUsersLoading, selectUsersError } from '../../reducers/userReducer'
import Wrapper from '../styles/Wrapper'
import Spinner from '../spinner'
import useDelayedLoading from '../../services/delayedLoading'

const Users = () => {
  const user = useSelector(selectUser)
  const users = useSelector(selectUsers)
  const loading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const showSpinner = useDelayedLoading(loading)
  const navigate = useNavigate()

  if (!user) return null

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`)
  }

  if (user.admin && user.enabled) {
    return (
      <>
        {showSpinner && <Spinner />}
        {!showSpinner && !loading && error && <p>Error: {error}</p>}
        {!showSpinner && !loading && !error &&
          <Wrapper>
            <h3>
              <i style={{ paddingRight: '0.5em' }} className="fa-solid fa-user-group" />
              Users
            </h3>
            {users.length == 0 && <p>No users found.</p>}
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
        }
      </>
    )
  }
}

export default Users