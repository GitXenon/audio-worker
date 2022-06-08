export async function handleGetAudio(request: any, env: any) {
  const { params } = request

  const obj = await AUDIO_BUCKET.get(params.id);
  if (!obj) {
    return new Response("Object not found", { status: 404 });
  }
  const response = new Response(obj.body, {status: 200});
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("content-type", "application/json")
  return response
}


export async function handlePostAudio(request : any, env: any) {
  const { params } = request

  await AUDIO_BUCKET.put(params.id, request.body);
  const response = new Response(`Put ${params.id} successfully!`, {status: 200});
  response.headers.set("Access-Control-Allow-Origin", "*")
  return response
}
