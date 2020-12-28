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