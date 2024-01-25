import { useEffect, useState } from "react";
import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import { useSelector } from "react-redux";
import { getUser } from "../../stores/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { path } from "../../utils";

function Home() {
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (user.role_id === 1) {
      navigate(path.USER_COURSES);
    } else {
      navigate(path.USER_COURSES);
    }
  }, [pathname, user]);
  const [addValue, setAddValue] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* <p>{count.value}</p> */}
        {/* <button onClick={() => dispatch(increment())}>
                    +
                </button>
                <button onClick={() => dispatch(decrement())}>
                    -
                </button> */}
        <input
          type="text"
          value={addValue}
          onChange={(e) => setAddValue(e.target.value)}
        />
        {/* <button onClick={() => dispatch(incrementByAmount(incrementAmount))}>Add Amount</button>
                <button onClick={resetAll}>reset</button> */}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default Home;
