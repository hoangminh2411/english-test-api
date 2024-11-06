export const createResponse = (
  statusCode: number,
  message: string,
  data: any = null,
  error: any = null
) => ({
  statusCode,
  message,
  data,
  error: error instanceof Error ? error.message : error,
});
