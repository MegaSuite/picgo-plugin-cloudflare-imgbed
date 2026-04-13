## picgo-plugin-cloudflare-imgbed

Third Party PicGo Uploader For MarSeventh/CloudFlare-ImgBed

**🚧 only support picgo-cli, no GUI support now.**

## Workflow
Rename the image in format `yyyyMMddHHmmssSSS` , then upload the image according to your configuration.

## Installation
```bash
picgo install cloudflare-imgbed
```

## Configuration
```bash
picgo set uploader
```
- **Base URL**: `https://your-imgbed.com`
- **Auth Code**: you can set in `https://your-imgbed.com/systemConfig#security`, leave empty if not set.
- **Upload Folder**: relative path, leave empty for root(`/`), it's like  `https://your-imgbed.com/file/${Upload Folder}/202311251618630.webp` in links.
- **Upload Name Type**: how the backend renames your image. Since the plugin already renames images with a timestamp, the default is set to `origin` (no further rename by the backend).
    - `origin` (plugin default): keep the uploaded filename as-is, e.g. `yyyyMMddHHmmssSSS.webp`
    - `default`: add an index prefix, e.g. `11110000_yyyyMMddHHmmssSSS.webp`
    - `short`: encode like a short link, e.g. `8P2yDGMl.webp`
    - `index`: index only, e.g. `11110000.webp`
- **Upload Channel**: storage channel for uploading images (optional, defaults to `server-default` which uses server configuration).
    - `server-default`: use the server's default channel configuration
    - `telegram`: upload to Telegram
    - `cfr2`: upload to Cloudflare R2
    - `s3`: upload to S3-compatible storage
    - `discord`: upload to Discord
    - `huggingface`: upload to Hugging Face
- **Channel Name**: specific channel name (required when `Upload Channel` is not `server-default`, visit `https://your-imgbed.com/api/channels` for more details).

## Update
```bash
picgo update cloudflare-imgbed
```

## Parameters Not Implemented
- **severCompress**: "false" option only can be used in Telegram upload channel, default option is true on server side.
- **autoRetry**: AutoRetry is enabled by default on server side, so it's not necessary to add this option to the plugin.
- **returnFormat**: Always return full link, I don't think someone need the /file/xxx format.