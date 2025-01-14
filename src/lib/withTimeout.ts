export const withTimeout = async <T>(
    promise: Promise<T>,
    timeout: number
  ): Promise<T | "timeout"> => {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve("timeout"), timeout);
      promise
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(() => {
          clearTimeout(timer);
          resolve("timeout");
        });
    });
  };
