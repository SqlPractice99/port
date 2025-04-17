import "./styles/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import Login from './Pages/Login';
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import Home from "./Pages/Home";
import About from "./Pages/About";
import History from "./Pages/History";
import Tariffs from "./Pages/Tariffs";
import FreeZone from "./Pages/FreeZone";
import Statistics from "./Pages/Statistics";
import News from "./Pages/News";
import NewsDetails from "./Pages/NewsDetails";
import NewsDetailsForm from "./Pages/NewsDetailsForm";
import Tenders from "./Pages/Tenders";
import TenderDetails from "./Pages/TenderDetails";
import ContactUs from "./Pages/ContactUs";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Publisher from "./Pages/Publisher";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";

function App() {
  // const user = JSON.parse(localStorage.getItem("userToken"));
  // const userData = JSON.parse(localStorage.getItem("userData"));
  // const user =  useSelector((state) => state.user.token);

  const [userD, setUserD] = useState(null);
  const [userT, setUserT] = useState(null);
  

  // useEffect (() => {
  //   if (user != null)
  //     console.log(user.admin);
  //   console.log('hey');
  // }, []);

  useEffect(() => {
    const storedUserToken = JSON.parse(localStorage.getItem("userToken"));
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserToken && storedUserData) {
      setUserD(storedUserData);
      setUserT(storedUserToken);
    }
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={token ? <Navigate to="/Admin" /> : <Navigate to="/Home" />} /> */}
          <Route path="/" element={<Navigate to="/Home" />} />
          {/* <Route path="/Login" element={token ? <Navigate to="/Home" /> : <Navigate to="/Login" />}/> */}
          {/* <Route path="/Login" element={<Login />}/> */}
          {/* <Route path="/news/:slug" element={<NewsDetails />} /> */}
          <Route path="/news/:encodedNews" element={<NewsDetails />} />
          <Route path="/Login" element={userT ? (userD.admin == 1 ? (<Navigate to="/Admin" />) : (<Navigate to="/Publisher" />)) : <Login userD={userD} setUserD={setUserD} userT={userT} setUserT={setUserT} />}/>
          <Route path="/Admin" element={userT ? (userD.admin == 1 ? (<Admin />) : (<Navigate to="/Publisher" />)) : <Admin />}/>
          <Route path="/Publisher" element={userT ? (userD.admin == 0 ? (<Publisher />) : (<Navigate to="/Admin" />)) : <Navigate to="/Login" />}/>
          {/* <Route path="/Admin" element={<Admin />}/> */}
          {/* <Route path="/Publisher" element={<Publisher />}/> */}
          {/* <Route path="/Admin" element={token ? <Admin /> : <Navigate to="/Login" />}/> */}
          {/* <Route path="/Admin" element={token ? (userData.admin === 1 ? (<Admin />) : (<Navigate to="/Home" />)) : (<Navigate to="/Login" />)}/> */}
          <Route path="/Home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/History" element={<History />} />
          <Route path="/Tariffs" element={<Tariffs />} />
          <Route path="/FreeZone" element={<FreeZone />} />
          <Route path="/Statistics" element={<Statistics />} />
          <Route path="/News" element={<News />} />
          <Route path="/NewsDetails" element={<NewsDetails />} />
          <Route path="/NewsDetailsFrom" element={<NewsDetailsForm />} />
          <Route path="/Tenders" element={<Tenders />} />
          <Route path="/TenderDetails" element={<TenderDetails />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="*" element={<Navigate to="/Home" />} />
          {/* <Route path="*" element={token ? <Navigate to="/Home" /> : <Navigate to="/Login" />} /> */}

          {/* <Route path="/" element={<div style={{position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', backgroundColor: 'red', borderRadius: '50%', transform: 'translate(-50%, -50%)'}} />} /> */}
        </Routes>
      </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;