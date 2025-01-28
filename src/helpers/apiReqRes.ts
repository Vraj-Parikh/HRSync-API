export function APIResponse(
  success: boolean,
  msg: string,
  extraData?: Record<string, any>
) {
  return {
    msg,
    success,
    ...extraData,
  };
}
