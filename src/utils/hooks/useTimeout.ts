import { useEffect, useState } from 'react';

/**
 * Return false until the given timeout time is up, then true.
 * Restarts the timer when the timeout changes.
 */
const useTimeout = (timeout: number) => {
  const [timeIsUp, setTimeIsUp] = useState(false);
  useEffect(() => {
    const t = timeout > 0 ? setTimeout(() => setTimeIsUp(true), timeout) : null;
    return () => clearTimeout(t);
  }, [timeout]);
  return timeIsUp;
};

export default useTimeout;
