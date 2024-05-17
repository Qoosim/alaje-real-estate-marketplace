import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Listing from "./pages/Listing"
import PrivateRoute from "./components/PrivateRoute"

export default function App() {

  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<Listing />} />
            <Route path="*" />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

