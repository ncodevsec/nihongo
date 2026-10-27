import { createContext, useContext } from "react";

// Everything the routed pages share (progress, settings, favorites, update state, …).
// App owns the hooks once; pages read what they need from here instead of prop drilling.
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);
