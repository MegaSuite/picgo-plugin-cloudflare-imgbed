import type { IPicGo, IPluginConfig } from 'picgo'
import FormData from 'form-data'

interface Config {
  baseUrl: string
  authCode?: string
  uploadFolder?: string
  uploadNameType?: string
  uploadChannel?: string
  channelName?: string
}

function formatTimestamp (): string {
  const d = new Date()
  const pad = (n: number, len = 2): string => String(n).padStart(len, '0')
  return (
    String(d.getFullYear()) +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds()) +
    pad(d.getMilliseconds(), 3)
  )
}

export = (ctx: IPicGo) => {
  const register = (): void => {
    ctx.helper.uploader.register('cloudflare-imgbed', {
      async handle (ctx) {
        const config = ctx.getConfig<Config>('picBed.cloudflare-imgbed')
        if (!config?.baseUrl) {
          throw new Error('[cloudflare-imgbed] baseUrl is required')
        }

        const baseUrl = config.baseUrl.replace(/\/$/, '')
        const params = new URLSearchParams()
        if (config.authCode) params.set('authCode', config.authCode)
        if (config.uploadFolder) params.set('uploadFolder', config.uploadFolder)
        params.set('uploadNameType', config.uploadNameType ?? 'origin')
        if (config.uploadChannel && config.uploadChannel !== 'server-default') {
          params.set('uploadChannel', config.uploadChannel)
          if (config.channelName) params.set('channelName', config.channelName)
        }
        const query = params.toString()
        const uploadUrl = `${baseUrl}/upload${query ? '?' + query : ''}`

        for (const img of ctx.output) {
          const ext = img.extname ?? '.jpg'
          const newFileName = formatTimestamp() + ext

          const form = new FormData()
          form.append('file', img.buffer, {
            filename: newFileName,
            contentType: img.mimeType ?? 'application/octet-stream'
          })

          const res = await ctx.request<Array<{ src: string }>, any>({
            method: 'POST',
            url: uploadUrl,
            data: form,
            headers: form.getHeaders()
          })

          const body: Array<{ src: string }> = typeof res === 'string'
            ? JSON.parse(res)
            : (res as any)?.data ?? res

          if (!Array.isArray(body) || body.length === 0 || !body[0].src) {
            throw new Error(`[cloudflare-imgbed] unexpected response: ${JSON.stringify(body)}`)
          }

          const src = body[0].src
          const imgUrl = src.startsWith('http') ? src : `${baseUrl}${src}`

          img.fileName = newFileName
          img.imgUrl = imgUrl
          img.url = imgUrl
        }

        return ctx
      },

      config (ctx): IPluginConfig[] {
        const savedConfig = ctx.getConfig<Config>('picBed.cloudflare-imgbed') ?? {}
        return [
          {
            name: 'baseUrl',
            type: 'input',
            default: (savedConfig as any).baseUrl ?? '',
            required: true,
            message: 'Base URL, e.g. https://your-imgbed.pages.dev',
            alias: 'Instance URL'
          },
          {
            name: 'authCode',
            type: 'input',
            default: (savedConfig as any).authCode ?? '',
            required: false,
            message: 'Auth Code, leave empty if not set',
            alias: 'Auth Code'
          },
          {
            name: 'uploadFolder',
            type: 'input',
            default: (savedConfig as any).uploadFolder ?? '',
            required: false,
            message: 'Upload folder, e.g. images, blog/images (leave empty for root)',
            alias: 'Upload Folder'
          },
          {
            name: 'uploadNameType',
            type: 'list',
            default: (savedConfig as any).uploadNameType ?? 'origin',
            required: false,
            message: 'How backend renames image. origin=keep name (plugin default), default=add index prefix, short=short link, index=index only. Check README in https://github.com/MegaSuite/picgo-plugin-cloudflare-imgbed for more details. ',
            choices: ['origin', 'default', 'index', 'short'],
            alias: 'Upload Name Type'
          },
          {
            name: 'uploadChannel',
            type: 'list',
            default: (savedConfig as any).uploadChannel ?? 'server-default',
            required: false,
            message: 'Upload storage channel (server-default uses server config)',
            choices: ['server-default', 'telegram', 'cfr2', 's3', 'discord', 'huggingface'],
            alias: 'Upload Channel'
          },
          {
            name: 'channelName',
            type: 'input',
            default: (savedConfig as any).channelName ?? '',
            required: false,
            message: 'Specific channel name (used when uploadChannel is not server-default)',
            alias: 'Channel Name',
            when: (answers: any) => answers.uploadChannel && answers.uploadChannel !== 'server-default'
          }
        ]
      }
    })
  }

  return {
    uploader: 'cloudflare-imgbed',
    register
  }
}