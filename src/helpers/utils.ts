export function GetErrorMessage(error: unknown, defaultMessage: string) {
  const msg =
    error instanceof Error && error.message ? error.message : defaultMessage;
  return msg;
}
