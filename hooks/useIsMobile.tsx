import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(mobile = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobile - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < mobile);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < mobile);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
