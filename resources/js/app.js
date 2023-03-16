import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'jotai';
import App from './components/App';
import { QueryClient, QueryClientProvider } from 'react-query';
import "./app.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <Provider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>,
  document.getElementById('app')
);