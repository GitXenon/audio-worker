import { Router } from 'itty-router'
import {handlePostAudio, handleGetAudio} from "./handler";
import { handleCors } from "./corshelper";

export const PRESHARED_AUTH_HEADER_KEY = 'X-Custom-Auth-Key'

declare global {
  const AUDIO_BUCKET: any
}

const router = Router()

router.options('/audios/:id?', handleCors({ maxAge: 86400}))

router.get('/audios/:id?', handleGetAudio)
router.post('/audios/:id?', handlePostAudio)
router.put('/audios/:id?', handlePostAudio)

router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})