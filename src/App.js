import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import { useEffect, useState } from "react";
import MainLayout from "./pages/MainLayout";
import LoadingScreen from "./containers/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <>
      {!loading ? (
        <Provider store={store}>
          <div className="relative">
            <Router>
              <div className="App bg-dark-400 overflow-x-hidden">
                <Switch>
                  <Route path="/" component={MainLayout} />
                </Switch>
              </div>
            </Router>
          </div>
        </Provider>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default App;
