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

  await AUDIO_BUCKET.put(params.id, request.body, {
    httpMetadata: request.headers
  });
  const response = new Response(`Put ${params.id} successfully!`, {status: 200});
  response.headers.set("Access-Control-Allow-Origin", "*")
  return response
}

async function handleSession(websocket: WebSocket, id: any) {
  websocket.accept();
  const obj : {body: ReadableStream} = await AUDIO_BUCKET.get(id);
  if (obj !== null) {
    console.log(obj.body)
    websocket.send(JSON.stringify(obj.body));
  }
  websocket.addEventListener("message", async ({ data }) => {
    await AUDIO_BUCKET.put(id, data);
  })
}

export async function websocketHandle(request : any) {
  const upgradeHeader = request.headers.get("Upgrade")
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 400 })
  }
  
  const [client, server] = Object.values(new WebSocketPair())
  await handleSession(server, request.query.id)
  
  return new Response(null, {
    status: 101,
    webSocket: client
  })
}