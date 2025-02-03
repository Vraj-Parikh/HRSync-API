export function APIResponse(
  success: boolean,
  msg: string,
  extraData?: Record<string, any>
) {
  return {
    success,
    msg,
    ...extraData,
  };
}
