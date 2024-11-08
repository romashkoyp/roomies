import { RotatingLines } from 'react-loader-spinner'

const Spinner = () => {
  return (
    <div style={{ alignSelf: 'center', margin: '5rem' }}>
      <RotatingLines
        visible={true}
        height='50'
        width='50'
        strokeWidth='3'
        strokeColor='#1B263B'
        animationDuration='1'
        ariaLabel='rotating-lines-loading'
        wrapperStyle={{}}
        wrapperClass=''
      />
    </div>
  )}

export default Spinner