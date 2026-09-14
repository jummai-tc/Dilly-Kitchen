/** Registers the `.ts` resolver hook — see `ts-resolve.mjs`. */
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register('./ts-resolve.mjs', pathToFileURL(import.meta.filename))
