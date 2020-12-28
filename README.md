# React & Redux Lab - Build a Hacker News Clone

## *Build a production React project using Redux and Styled Components.*

In this lab, we are going to build a production-quality Hacker News clone. We will walk through the steps of initializing the application, adding [Redux](https://redux.js.org/) to manage state and building the UI in React. We will style the application using [styled-components](https://www.styled-components.com/) and call the public [Hacker News API](https://github.com/HackerNews/API) using the [axios](https://github.com/axios/axios) library.

### Folder Structure

Inside `src`, a folder structure has been set up for you.

- `components`: This folder will hold all of our React components (both container and presentational).
- `services`: Services allow you to connect to APIs (ex. using axios to call the HN API) or provide extended functionality to the application (ex. adding Markdown support).
- `store`: The store holds all of our logic for Redux and managing state.
- `styles`: Inside the styles folder, we declare variables, templates, and reusable style patterns that can be shared in components.
- `utils`: Helper functions that can be reused throughout the application.

We have added some boilerplate base styling inside the `src/styles` folder with files named `globals.js` and `palette.js`.

The `globals.js` is used to generate our default base styling shared across the app. The `createGlobalStyle` method from `styled-components` should be used sparingly, but it is useful for app-level styles. It generates a new component with globally applied styling.

Now, open `src/index.js` (the root file of your project) and update the content to use our new folder structure.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import GlobalStyles from './styles/globals';

const renderApp = () => {
  ReactDOM.render(
    <div>
      <GlobalStyles />
      <App />
    </div>,
    document.getElementById('root'),
  );
};

renderApp();

```

Now we’re ready to start our development environment with our core structure in place. Run the following command to start the app, and you should see it on `http://localhost:3000`. Not much to look at yet, but we’ll get there :)

```
yarn start
```

![img](https://cdn-images-1.medium.com/max/1600/1*kerMzK7dPowXiHRJx90Zfg.png)

### Adding Redux to Your React App

Inside our `src/store` folder, create an `index.js` file a `reducer.js` file, and a `middleware.js` file. Let’s also initialize an `app` feature to manage state for the app.

![img](https://cdn-images-1.medium.com/max/1600/1*WiTf2X7rt16a_YhDrKqMcw.png)

Inside the `index.js` we’ll create a `configureStore` function which is how we will initialize Redux in the application.

![img](https://cdn-images-1.medium.com/max/1600/1*81tI96h93hovxfBlCc0lgA.png)

We use `createStore` from Redux which builds the initial `store`. We import `reducer` from our root reducer file, and we import the `middleware` from our middleware configuration file. The `initialState` will be supplied at runtime and passed to our function.

Inside the `reducer.js` file, create the root reducer using `combineReducers`. This function combines all your reducer functions to build a single state tree.

![img](https://cdn-images-1.medium.com/max/1600/1*B7Vfn2aQ8xbFRG5ihnVpnw.png)

Next we can create our middleware in the `middleware.js` file. A middleware is a function that the dispatched action must pass through every time. It is used to extend the functionality of Redux. Add the following code to the file.

![img](https://cdn-images-1.medium.com/max/1600/1*gHwwDTE5o8UomnMrvlUuKw.png)

We will also build our first reducer. Inside `src/store/app`, create `reducer.js` and `actions.js` files. We’ll add functionality to toggle between day mode and night mode, so let’s create an action to manage this feature. Inside `src/store/app/actions.js`, add the following code.

```js
const NS = '@hnReader/app';

export const actionTypes = {
  SET_THEME: `${NS}/SET_THEME`
};

const actions = {
  setTheme: (payload = {}) => ({ type: actionTypes.SET_THEME, payload })
};

export default actions;
```

​	We create an `actionTypes` object to hold our action-type constants. These will be used in the reducer to match the type with the state change. We also create an `actions` object that holds the functions we will `dispatch` from our application to create state changes. Every action will have a `type` and a `payload`.

Finally, we can create our reducer.

```js
import { actionTypes } from './actions';

const getInitialState = () => ({
  theme: 'dark'
});

const app = (state = getInitialState(), { type, payload }) => {
  console.log('payload: ', payload);
  switch (type) {
    case actionTypes.SET_THEME:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default app;

```

When we `dispatch` a `SET_THEME` action, it will update the `theme` value of the state to the value inside the payload. The `payload` will be an object that has the form `{ theme: 'value' }`. When we spread `…` the `payload` object, the keys of the `state` will be replaced by the keys in `...state` that match — in this case `theme`.

Return to the `src/index.js`, and now we can update it to connect our app to Redux. Add an import for `Provider` and update your render method to look like the following.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store';
import GlobalStyles from './styles/globals';

const renderApp = () => {
  const store = configureStore({});

  if (process.env.NODE_ENV !== 'production') {
    console.log('Initial state ->');
    console.log(store.getState());
  }

  ReactDOM.render(
    <Provider store={store}>
      <div>
        <GlobalStyles />
        <App />
      </div>
    </Provider>,
    document.getElementById('root'),
  );
};

renderApp();

```

And that should be all you need to get Redux integrated with the app! 

### Build the UI with React and Styled Components

Now that Redux is initialized, we can begin working on our UI. First, let’s declare some more style constants that we’ll use inside our components. In this case, we’ll create a `mediaQueries` file to hold constants to make it easy to add mobile responsiveness to our app. Create a `src/styles/mediaQueries.js` file, and the following code.

![img](https://cdn-images-1.medium.com/max/1600/1*P2P94sWY44UGWgEmnp93fg.png)

Return to our `src/components/App` folder. Inside `index.js`, we update the content to be the following.

```js
import React from 'react';
import { ThemeProvider } from 'styled-components';
import List from '../List';
import { colorsDark } from '../../styles/palette';

import { Wrapper, Title } from './styles';

function App() {
    return (
      <ThemeProvider theme={colorsDark}>
        <div>
          <Wrapper>
              <Title>Hacker News Reader</Title>
              <List />
          </Wrapper>
        </div>
      </ThemeProvider>
    );
  }

export default App;
```

We use the `ThemeProvider` component from `styled-components`. This provides functionality enables us to pass a “theme” as a `prop` to all styled components that we build. We’ll initialize it here as the `colorsDark` object.

`App` contains components that we have not built yet, so let’s do that now. First, let’s build our styled components. Create a file `styles.js` inside the`App` folder and add the following code.

```js
import styled from 'styled-components';
import { tablet } from '../../styles/mediaQueries';

export const Wrapper = styled.div`
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  overflow: hidden;
  padding-bottom: 200px;

  ${tablet} {
    width: 96%;
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 20px;
  font-weight: 300;
  margin-top: 24px;
  margin-bottom: 26px;
`;

```

This creates `div` for the page which we call `Wrapper` and an `h1` for the page as the component `Title`. The `styled-components` syntax creates a component using the HTML element that you specify after after the `styled` object. You use a string to define the CSS properties of that component.

Notice on line 20, we use our `theme` prop. A function containing `props` as an argument is injected by `styled-components` into the styling string allowing us to extract properties or add logic to construct styles, abstracting this away from the component that uses them.

Next we create our `List` component which will contain our Hacker News stories. Create a `src/components/List` folder and add an `index.js` and `styles.js` files. Inside `index.js` add the following.

```js
import React from 'react';
import ListItem from '../ListItem';
import { ListWrapper } from './styles';

const List = () => (
    <ListWrapper>
        <ListItem />
    </ListWrapper>
);

export default List;

```

And inside the `styles.js` we create the `ListWrapper`. We set the `background-color` using the `theme` prop which we get from the `ThemeProvider` component.

```js
import styled from 'styled-components';

export const ListWrapper = styled.ul`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;
```

Finally, we create our `ListItem` component which will display the individual stories. Create a `src/components/ListItem` folder and an `index.js` and `styles.js` files.

We want our UI to mimic that of Hacker News. For now, we will use fake data inside our `ListItem` to mock this. Add the following code to the `index.js` file.

```js
import React from 'react';
import { Item, Title, Host, ExternalLink, Description, CommentLink } from './styles';

const ListItem = () => {
  return (
    <Item>
      <ExternalLink href="http://github.com" rel="nofollow noreferrer noopener" target="_blank">
        <Title>
          The Developer Community <Host>(github.com)</Host>
        </Title>
      </ExternalLink>
      <Description>
        9000 points by{' '}
        <CommentLink href="#" rel="nofollow noreferrer noopener" target="_blank">
          Test User
        </CommentLink>{' '}
        1 Hour Ago {' | '}
        <CommentLink href="#" rel="nofollow noreferrer noopener" target="_blank">
          42 Comments
        </CommentLink>
      </Description>
    </Item>
  );
};

export default ListItem;

```

Each story has a title, author, score, time of post, source URL, and comment count. We initialize these to test values so we can see how it looks in our UI. The `rel="nofollow noreferrer noopener"` is added for [security reasons](https://support.performancefoundry.com/article/186-noopener-noreferrer-on-my-links).

In the `styles.js` file, add the following code.

```js
import styled from 'styled-components';

export const Item = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 14px 24px;

  &:last-child {
    border-bottom: none;
  }
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.text};
  margin-top: 0;
  margin-bottom: 6px;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.4px;
`;

export const Host = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
`;

export const ExternalLink = styled.a`
  color: ${({ theme }) => theme.text};
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
`;

export const Description = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

export const CommentLink = styled.a`
  color: ${({ theme }) => theme.textSecondary};

  &:visited {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

```

And that should be the basic UI components that we need! Return to your browser and you should have a single item feed with fake data.

![img](https://cdn-images-1.medium.com/max/1600/1*U0d5JVmGjTZfttpvnhcz4w.png)

### Making API Calls with Redux and Axios

It’s time to add real data to our app. We will call the Hacker News API using the`axios` request library. Calling an API will introduce a “[side effect](https://en.wikipedia.org/wiki/Side_effect_(computer_science))” to our application which means that it will modify the state from a source outside of our local environment.

API calls are considered side effects because they will introduce outside data to our state. Other examples of side effects are interacting with `localStorage` in the browser, tracking user analytics, connecting to a web socket, and many more. There are multiple libraries to manage side effects in Redux apps, from the simple [redux-thunk](https://github.com/reduxjs/redux-thunk) to the more complex [redux-saga](https://github.com/redux-saga/redux-saga). However, they all serve the same purpose — allow Redux to interact with the outside world. `redux-thunk` is one of the simplest libraries to use in that it allows you `dispatch` a JavaScript `function` in addition to action `objects`. This is the exact functionality we need to use `axios` by utilizing a function that manages the returned promise from the API call.

Inside our `src/services` folder, we have an `Api.js` file and `hackerNewsApi.js`. The `axios` library is incredibly powerful and extensible. The `Api.js` contains the configuration to make `axios` requests easy.

Inside the `src/services/hackerNewsApi.js` file, we define the functions to make requests to the Hacker News API. The [documentation](https://github.com/HackerNews/API) shows that will use the `/v0/topstories` endpoint to get a list of IDs, and the `/v0/items/<id>` endpoint to get the data for each individual story.

The `/v0/topstories` endpoint returns all top story IDs which is ~400–500 items in the list. Since we fetch the data for each story individually, it would kill performance to then fetch all 500 individual items immediately. To solve this, we only fetch 20 stories at a time. We `.slice()` the story ID array based on the current page and return that section of story items. Since we call the the `/v0/item/<id>` for each story ID, we use a `Promise.all` to condense the response promises into a single array resolving to one `.then()` and preserving the ranking form the order of the story IDs.

To manage the state of the stories inside our application, we will create a `story` reducer. Create a `src/store/story` folder and inside it add a `reducer.js` file and an `actions.js` file. Inside the `actions.js` file, add the following code.

```js
import hackerNewsApi from "../../services/hackerNewsApi";

const NS = '@hnReader/story';

export const actionTypes = {
    FETCH_STORY_IDS_REQUEST: `${NS}/FETCH_STORY_IDS_REQUEST`,
    FETCH_STORY_IDS_SUCCESS: `${NS}/FETCH_STORY_IDS_SUCCESS`,
    FETCH_STORY_IDS_FAILURE: `${NS}/FETCH_STORY_IDS_FAILURE`,
    FETCH_STORIES_REQUEST: `${NS}/FETCH_STORIES_REQUEST`,
    FETCH_STORIES_SUCCESS: `${NS}/FETCH_STORIES_SUCCESS`,
    FETCH_STORIES_FAILURE: `${NS}/FETCH_STORIES_FAILURE`,
};

const action = (type, payload) => ({ type, payload });

const actions = {
    fetchStoryIds: (payload = {}) => {
        return dispatch => {
            dispatch(action(actionTypes.FETCH_STORY_IDS_REQUEST, payload));

            return hackerNewsApi
                .getTopStoryIds()
                .then(storyIds => {
                    dispatch(action(actionTypes.FETCH_STORY_IDS_SUCCESS, { storyIds }));
                    dispatch(actions.fetchStories({ storyIds, page: 0 }));
                    return storyIds;
                })
                .catch(err => dispatch(action(actionTypes.FETCH_STORY_IDS_FAILURE, err)));
        };
    },
    fetchStories: (payload = {}) => {
        return dispatch => {
            const { storyIds, page } = payload;

            dispatch(action(actionTypes.FETCH_STORIES_REQUEST, payload));

            return hackerNewsApi
                .getStoriesByPage(storyIds, page)
                .then(stories => dispatch(action(actionTypes.FETCH_STORIES_SUCCESS, { stories })))
                .catch(err => dispatch(action(actionTypes.FETCH_STORIES_SUCCESS, err)));
        };
    },
};

export default actions;

```

We create `actionTypes` for the request, success, and failure states for our story ID and story items API calls.

Our `actions` object will contain `thunk` functions which manage the request. By dispatching functions instead of an action object, we are able to `dispatch` actions at different points during the request lifecycle.

The function `getTopStoryIds` will make the API call to get the full list of stories. In the success callback of `getTopStoryIds`, we `dispatch` the `fetchStories` action to retrieve the first page of results for story items.

When our API calls successfully return, we `dispatch` the success `action`, allowing us to update our Redux store with the new data.

Now we need to create the reducer to store the data in our Redux state. Inside the `src/store/story/reducer.js` file, add the following.

![img](https://cdn-images-1.medium.com/max/1600/1*1lx_NoFojzqqH-dMNbr_xw.png)

For the `FETCH_STORY_IDS_SUCCESS` action type, we spread the current state and payload. The only key/value inside the payload is `storyIds`, which will then update the state to the new value.

For the `FETCH_STORIES_SUCCESS` action type, we add the new stories to the previously created list of stories which will keep them in order as we fetch more pages. In addition, we increment the page and set the `isFetching` state to false.

Now that we are managing the state of our stories in Redux, we can display this data using our components.

### Connect the React App to the Redux Store

Update the `src/store/reducer.js` file to include the `story` reducer. 

```js
import { combineReducers } from 'redux';

import app from './app/reducer';
import story from './story/reducer';

const rootReducer = combineReducers({
    story,
    app,
});

export default rootReducer;

```

By using the `react-redux` hooks, we are able to `connect` our components to the store. Then any time there is an update to the store, the hooks will also change, causing a re-render of our components, which will update the UI.

We can also `dispatch` actions inside our component, which can trigger state changes in our Redux store.

Let’s see how we manage this in our application. Return to the `src/components/App/index.js` file and add the following code:

```js
import { useDispatch, useSelector } from 'react-redux';

[Within function App() {]

  const stories = useSelector(state => state.story.stories);
  const page = useSelector(state => state.story.page);
  const storyIds = useSelector(state => state.story.storyIds);
  const isFetching = useSelector(state => state.story.isFetching);

  const dispatch = useDispatch()
```

The `useelector` hook takes the Redux `state` as an argument. For `App`, we need the array of `stories`, the current `page`, the array of `storyIds`, and the `isFetching` indicator.

The `useDispatch` hook will let us `dispatch` the action to fetch story IDs (and then fetch the first page of story items).

In `App.js` file, first we add a `useEffect` so that the stories are fetched once the component is in the DOM, then pass `stories` as a prop to the `List` component.

```js
const App = (props) => {

  useEffect(() => {
    dispatch(actions.fetchStoryIds())
  },[dispatch]);

    return (
        <ThemeProvider theme={colorsDark}>
            <div>
                <Wrapper>
                    <Title>Hacker News Reader</Title>
                    <List stories={ stories } />
                </Wrapper>
            </div>
        </ThemeProvider>
    );
}

```

Inside `src/components/List/index.js` we map over the stories array and create an array of `ListItem` components. We set the key to the story ID and spread the story object `…story` — this passes all the values of the object as individual props to the component. The `key` prop is required for components mounted as an array so that React can be faster when updating them during a render.

![img](https://cdn-images-1.medium.com/max/1600/1*7eEOEtZMMaefxKwhIjvkkw.png)

If we look at the screen now, we should have 20 list items but still using the hard-coded data.

![img](https://cdn-images-1.medium.com/max/1600/1*yUTZNu2i3K8_4kdnFUsXhA.png)

We need to update our `ListItem` to use the values from the stories. Also in Hacker News, it displays the time since the story was published and the domain of the source. We will install the `react-timeago` and `url` packages to help calculate these values since they are not passed directly from the API. Install them using the following command.

```
yarn add react-timeago url
```

We also have helper functions to build these values in the `src/utils` folder.

Now we can update our the `src/components/ListItem/index.js` file to the following.

```js
import React from 'react';
import TimeAgo from 'react-timeago';
import getSiteHostname from '../../utils/getSiteHostname';
import getArticleLink, { HN_USER, HN_ITEM } from '../../utils/getArticleLink';

import { Item, Title, Host, ExternalLink, Description, CommentLink } from './styles';

const ListItem = ({ by, kids = [], score, url, title, id, type, time }) => {
  const site = getSiteHostname(url) || 'news.ycombinator.com';
  const link = getArticleLink({ url, id });
  const commentUrl = `${HN_ITEM}${id}`;

  return (
    <Item>
      <ExternalLink href={link} rel="nofollow noreferrer noopener" target="_blank">
        <Title>
          {title} <Host>({site})</Host>
        </Title>
      </ExternalLink>
      <Description>
        {score} points by{' '}
        <CommentLink href={`${HN_USER}${by}`} rel="nofollow noreferrer noopener" target="_blank">
          {by}
        </CommentLink>{' '}
        <TimeAgo date={new Date(time * 1000).toISOString()} />{' | '}
        <CommentLink href={commentUrl} rel="nofollow noreferrer noopener" target="_blank">
          {kids.length} Comments
        </CommentLink>
      </Description>
    </Item>
  );
};

export default ListItem;

```

And with that step, we are now displaying the first 20 top Hacker News items in our app — very cool!

![img](https://cdn-images-1.medium.com/max/1600/1*CWm1RlXAwNatofoYIUTIag.png)

### Paginating Requests with Infinite Scroll

Now we want to fetch an additional page as the user scrolls down the screen. Recall that every time we successfully fetch stories, we increment the page number in the store, and so after the first page is received, our Redux store should now read `page: 1`. We need a way to `dispatch` the `fetchStories` action on scroll.

To implement infinite scrolling, we’ll use the `react-infinite-scroll-component`. We will also want a way to determine if we have more pages to load and we can do this in a selector using `reselect`.

```
yarn add react-infinite-scroll-component reselect
```

First we will build our selector to calculate if more stories exist. Create a `src/store/story/selectors.js` file. To determine if more stories exist, we see if the array length of the `storyIds` in our Redux store has the same length as the `stories` array. If the `stories` array is shorter, we know that there are more pages.

![img](https://cdn-images-1.medium.com/max/1600/1*9BZsfoH8vkhyo8kModYwxQ.png)

Inside the `src/components/App/index.js` container, we import the `hasMoreStoriesSelector` and add `hasMoreStories` using `useSelector`.

```js
// ---
import { hasMoreStoriesSelector } from '../../store/story/selectors';

// ... other code

const hasMoreStories = useSelector(state => hasMoreStoriesSelector(state));
```

We will want a loading animation to show while we wait on our API request. Create a `src/components/Loader` folder and the `index.js` and `styles.js` files. We want our animation to be 3 fading dots.

![img](https://cdn-images-1.medium.com/max/1600/1*n3ITZcnQidyQ3dBVlSVyHw.gif)

Inside the `styles.js` file add the following code.

```js
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  /**
  * At the start of the animation the dot
  * has an opacity of .2
  */
  0% {
    opacity: .2;
  }
  /**
  * At 20% the dot is fully visible and
  * then fades out slowly
  */
  20% {
    opacity: 1;
  }
  /**
  * Until it reaches an opacity of .2 and
  * the animation can start again
  */
  100% {
    opacity: .2;
  }
`;

export const Animation = styled.div`
  text-align: center;

  span {
    color: ${({ theme }) => theme.textSecondary};
    display: inline-block;
    margin-left: 4px;
    margin-right: 4px;
    font-size: 80px;
    line-height: 0.1;

    /**
    * Use the blink animation, which is defined above
    */
    animation-name: ${blink};
    /**
    * The total time of animation
    */
    animation-duration: 1s;
    /**
    * It will repeat itself forever
    */
    animation-iteration-count: infinite;
    /**
    * This makes sure that the starting style (opacity: .2)
    * of the animation is applied before the animation starts.
    * Otherwise we would see a short flash or would have
    * to set the default styling of the dots to the same
    * as the animation. Same applies for the ending styles.
    */
    animation-fill-mode: both;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

```

The [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) API is a CSS technique to define animations. The above code shows the abstraction for it in Styled Components. We will have 3 dots on the screen that have their opacity start at 0.2, increase to 1, and then return to 0.2. We add an animation delay to the second and third dot which gives the offset bouncing appearance.

Our `Loader` component will just be our `Animation` styled component with 3 spans containing periods.

![img](https://cdn-images-1.medium.com/max/800/1*OEvcjnFwj7x6OMsue2rTKQ.png)

Now we are ready to add the functionality to our list. Import the infinite scroll module and our `Loader` in the `App` component. We will also create a `fetchStories` callback that will call the `fetchStories` prop to dispatch the request for the next page. We only call the `fetchStories` dispatch prop if the `isFetching` is false. Otherwise we could fetch the same page multiple times. Your `src/components/App/App.js` should now look like the following.

```js
import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import List from '../List';
import { colorsDark } from '../../styles/palette';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Loader';

import { Wrapper, Title } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../store/story/actions';
import { hasMoreStoriesSelector } from "../../store/story/selectors";

function App() {

    const stories = useSelector(state => state.story.stories);
    const page = useSelector(state => state.story.page);
    const storyIds = useSelector(state => state.story.storyIds);
    const isFetching = useSelector(state => state.story.isFetching);
    const hasMoreStories = useSelector(state => hasMoreStoriesSelector(state));

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actions.fetchStoryIds())
    },[dispatch]);

    const fetchStories = () => {
        if (!isFetching) {
            dispatch(actions.fetchStories({storyIds, page}))
            fetchStories({ storyIds, page });
        }
    }

    return (
        <ThemeProvider theme={colorsDark}>
            <div>
                <Wrapper>
                    <Title>Hacker News Reader</Title>
                    <InfiniteScroll
                        dataLength={stories.length}
                        next={fetchStories}
                        hasMore={hasMoreStories}
                        loader={<Loader />}
                        style={{
                            height: '100%',
                            overflow: 'visible'
                        }}
                    >
                        <List stories={stories} />
                    </InfiniteScroll>
                </Wrapper>
            </div>
        </ThemeProvider>
    );
}


export default App;

```

As we scroll down the page, the `InfiniteScroll` component will call `this.fetchStories` as long as `hasMoreStories` is true. When the `fetchStories` API request returns, the new stories are appending to `stories` array, adding them to the page.

With this functionality, you can now scroll through the entire list of top stories! *high fives*
