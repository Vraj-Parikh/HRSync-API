export function APIResponse(
  success: boolean,
  msg: string,
  extraData?: Record<string, any>,
  isAuthenticated = true
) {
  return {
    isAuthenticated,
    success,
    msg,
    ...extraData,
  };
}
