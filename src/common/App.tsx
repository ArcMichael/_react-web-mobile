import React from "react";
import { Switch } from "react-router";
import Layout from "./layout";
import AuthRoute from "./AuthRoute";
import routes from "./routes";

const App = () => (
  <Layout>
    <Switch>
      {routes.map((item) => {
        return <AuthRoute key={item.path as string} exact {...item} />;
      })}
    </Switch>
  </Layout>
);

export default App;
