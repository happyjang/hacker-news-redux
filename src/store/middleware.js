import { applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

const isProd = process.env.NODE_ENV === 'production';
const middlewareList = [];

middlewareList.push(thunk);
if (!isProd)
{
    middlewareList.push(createLogger());
}

const middleware = compose(applyMiddleware(...middlewareList));

export default middleware;