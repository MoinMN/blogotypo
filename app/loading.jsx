import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const Loading = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Spinner animation="border" />
    </div>
  )
}

export default Loading
