import { BrowserRouter, Route, Routes, Link } from "react-router-dom"

// Pages
import Scan from "./pages/Scan"
import Summary from "./pages/Summary"
import Logs from "./pages/Logs";
import GeneralRecord from "./pages/GeneralRecord";
import GeneralLogs from "./pages/GeneralLogs";

function App() {
  return (
    <BrowserRouter>
      {/* <link to="/summary"></link> */}
      <Routes>
        <Route path="/" element={<Scan />} />
        <Route path="/general" element={<GeneralRecord />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/generallogs" element={<GeneralLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
