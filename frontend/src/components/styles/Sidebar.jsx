import styled from 'styled-components'

const StyledSidebar = styled.nav`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 300px;
    z-index: 999;
    background-color: white;
    display: ${(props) => (props.visible ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`

export default StyledSidebar