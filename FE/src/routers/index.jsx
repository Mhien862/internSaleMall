import Auth from "./Auth"
import Page from "./Page"
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

function Routers() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<><Auth /> <Page /></>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routers