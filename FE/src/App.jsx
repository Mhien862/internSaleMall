import Routers from './routers';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer className="toast-content"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <Routers></Routers>
    </>
  )
}

export default App
