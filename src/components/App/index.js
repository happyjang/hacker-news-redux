import React, { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import List from "../List";
import { colorsDark } from "../../styles/palette";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../Loader";

import { Wrapper, Title } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../store/story/actions";
import { hasMoreStoriesSelector } from "../../store/story/selectors";

function App() {
  const stories = useSelector((state) => state.story.stories);
  const page = useSelector((state) => state.story.page);
  const storyIds = useSelector((state) => state.story.storyIds);
  const isFetching = useSelector((state) => state.story.isFetching);
  const hasMoreStories = useSelector((state) => hasMoreStoriesSelector(state));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchStoryIds());
  }, [dispatch]);

  const fetchStories = () => {
    if (!isFetching) {
      dispatch(actions.fetchStories({storyIds, page}));
    }
  };

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
