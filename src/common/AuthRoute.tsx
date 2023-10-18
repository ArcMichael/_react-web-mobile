import * as React from "react";
import { RouteProps, Route } from "react-router";

export interface IAuthRouteProps extends RouteProps {
  onEnter?: () => any;
  onSsrMatch?: () => void;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { onEnter, ...restProp } = props;
  React.useEffect(() => {
    if (props.onEnter) props.onEnter();
  }, []);

  return <Route {...restProp} />;
};

export default AuthRoute;
