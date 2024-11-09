import Wrapper from './styles/Wrapper'

const MainPage = () => {
  return (
    <Wrapper>
      <h1>Roomies App</h1>
      <h2>Booking system for business</h2>
      <p>
        Roomies App is a business-focused booking system designed to streamline 
        the reservation process for shared resources like meeting rooms. Easily 
        view room availability, book time slots, manage your bookings, and receive 
        important messages about scheduling and room updates. Administrators have 
        additional control to manage users, rooms, and system settings.
      </p>
      <h3>App functional description</h3>
      <p>
        <strong>User:</strong> Regular users can view room availability, read messages, book rooms, and manage their own bookings.
      </p>
      <p>
        <strong>Admin:</strong> Administrators have full access, including managing all bookings, messages, users, rooms, and system settings.
      </p>
      <p>
        <strong>Visitor:</strong> A visitor has no access to any functionality until they sign up and sign in. 
        They would typically only see the main landing page with general information.
      </p>
      <p>
        <strong>Disabled admin/user:</strong> Have no access to the app as visitor. Only another active admin can reinstate their access.
      </p>
      <table>
        <thead>
          <tr>
            <th>Functional</th>
            <th>User</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>View room availability</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Read messages</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Book rooms</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Manage own bookings (edit/delete)</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Manage all bookings (edit/delete)</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Manage messages (add/edit/delete)</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Manage users (add/edit/delete/disable)</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Manage rooms (add/edit/delete/disable)</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Set weekday availability/hours (edit/restore)</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Set holidays availability/hours (add/delete)</td>
            <td></td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Set individual room date availability/hours (add/delete)</td>
            <td></td>
            <td>✓</td>
          </tr>
        </tbody>
      </table>
    </Wrapper>
  )
}

export default MainPage