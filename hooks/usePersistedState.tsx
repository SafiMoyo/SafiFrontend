"use client";
import { useEffect, useState } from "react";

type Props<T> = {
  key: string;
  defaultValue: T;
};

function usePersistedState<T>({
  key,
  defaultValue
}: Props<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem(key);
    if (storedState !== null) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(JSON.parse(storedState));
      } catch (e) {
        console.error("Failed to parse localStorage item", e);
      }
    }
    setIsHydrated(true);
  }, [key]);

  useEffect(() => {
    if (isHydrated) {
      if (state !== undefined && state !== null) {
        localStorage.setItem(key, JSON.stringify(state));
      } else {
        localStorage.removeItem(key);
      }
    }
  }, [key, state, isHydrated]);

  return [state, setState];
}

export default usePersistedState;
