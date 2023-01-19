/**
 * 
 * @param {string} messaage - The message to send along with the response
 * @param {any} data - The response payload
 * @param {boolean} success - Whether the request was successful or not
 */
export default function (message: string, data: any | null = null, success: boolean = true) {
  return { message, data, success }
} 