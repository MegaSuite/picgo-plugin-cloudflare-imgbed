## picgo-plugin-cloudflare-imgbed

Third Party PicGo Uploader For MarSeventh/CloudFlare-ImgBed

## Workflow
Rename the image in format `yyyyMMddHHmmssSSS` , then upload the image according to your configuration.

**Cli only til now.**

## Installation
```bash
picgo install cloudflare-imgbed
```

## Configuration
```bash
picgo set uploader
```

![set-uploader](./doc/set-uploader.png)

- **Base URL**: `https://your-imgbed.com`
- **Auth Code**: you can set in `https://your-imgbed.com/systemConfig#security`, leave empty if not set.
- **Path**: relative path, leave empty for root(`/`), it's like  `https://your-imgbed.com/file/${Path}/202311251618630.webp` in links.
- **Upload Name Type**: how the backend rename your image.
    - origin(default): no rename, like `yyyyMMddHHmmssSSS.webp`
    - default: add index in front, like `11110000_yyyyMMddHHmmssSSS.webp`
    - short: encoding like short link, like `8P2yDGMl.webp`
    - index: only index, like `11110000.webp`
## Update
```bash
picgo update cloudflare-imgbed
```

## 