import { QueryClientProvider, QueryClient } from "react-query";

import Map from './pages/map';

import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <Map />
      </main>
    </QueryClientProvider>
  );
}
