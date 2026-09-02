# Shadowrocket 通用分流配置

> 此目录是 Fork 仓库维护者添加的 Shadowrocket 配置，不属于 Sukka Ruleset 官方支持范围。

## 导入地址

```text
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Shadowrocket/Shadowrocket-Universal-Split-DNS.conf
```

## 使用方法

1. 先在 Shadowrocket 首页导入并更新机场订阅。
2. 进入“配置”，点击右上角 `+`，粘贴上面的 Raw 地址并下载。
3. 选中下载的配置文件，将首页“全局路由”设为“配置”。
4. 在 Shadowrocket 首页手动选择一个机场节点。所有需要代理的国外、AI、流媒体及 Telegram 流量都会使用当前节点；配置不会自动选择或切换节点。

国内域名及中国大陆 IPv4/IPv6 默认直连，国外和未知流量统一使用小火箭内置的 `PROXY`，也就是首页当前手选的机场节点。配置没有 `Auto` 和地区策略组，不会后台更换出口。

AI 规则除自动转换的 Sukka 规则外，还使用 `ai_supplemental_non_ip.list` 补齐 Gemini 与 ChatGPT 的登录、鉴权、API、静态资源和实时通信依赖。AI 连接和国外 DoH 都使用当前 `PROXY` 节点，避免 DNS 与连接出口国家不一致。Gemini 所需的 Google 登录、`google.com`、`googleapis.com`、`gstatic.com` 和 `googleusercontent.com` 依赖已统一锁定到 `PROXY`；这会让 Google AI 会话的地区判断使用同一个出口。

## DNS 设计

- 国内直连域名使用阿里 / 腾讯 DoH。
- 代理域名使用代理隧道内的 Cloudflare DoH。
- DNS 失败不会回退到 iOS 系统 DNS。
- 机场节点域名在隧道建立前通过直连的国内 DoH 加密解析。
- 节点不支持 UDP 时拒绝该 UDP 流量，不静默改成直连。

## 验证

- 使用 <https://dnsleaktest.com> 的 Extended Test 检查 DNS；不应出现本地运营商 DNS。
- 使用 <https://ip.sb> 检查国外访问的出口 IP。
- 查看 Shadowrocket 日志：国内请求通常命中 `DIRECT`，国外请求通常命中 `Proxy`。

不存在适配所有机场和网络的绝对“零泄露”保证。机场线路、应用自带 DoH/VPN、iCloud Private Relay、IPv6 和节点协议能力都会影响实际结果。

## 与上游同步

仓库中的 `.github/workflows/sync-upstream.yml` 每天北京时间 11:17 自动拉取并合并 `SukkaW/Surge` 的 `master` 分支，也支持在 GitHub Actions 页面手动运行。

`.github/workflows/update-shadowrocket-rules.yml` 每天北京时间 11:47 从 Sukka 官方 Ruleset Server 获取构建结果，通过 `Shadowrocket/scripts/update-rules.mjs` 转换后写入 `Shadowrocket/Rules/`。主配置只引用本仓库中的这些转换结果，不再依赖第三方 Shadowrocket 规则仓库。

转换器保留 Shadowrocket 支持的域名、USER-AGENT、IPv4/IPv6 CIDR 和 ASN 规则，自动删除 Surge/iOS 不适用或需要 MITM 的 `PROCESS-NAME`、`URL-REGEX` 等内容。CDN、下载和网易云均同时覆盖其域名/non-IP/IP补充规则。广告、Map Local、全局 MITM 和其他 Surge 专属模块不会转换。

## AI 地区问题检查

更新配置后，在首页手动选择一条受 Gemini / ChatGPT 支持的节点（建议先测试美国），断开并重新连接，再完全退出并重新打开 App。最近请求中的 Gemini/ChatGPT 主域名、登录和 API 请求都应命中 `PROXY`。如果仍提示地区不支持，应更换另一条节点；节点名称是“美国”不代表 Google/OpenAI 对该出口 IP 的定位和风控结果一定是美国。

自定义文件仅放在 `Shadowrocket/` 目录，正常情况下不会干扰上游更新。如果未来上游创建同名文件并产生合并冲突，工作流会失败并保留现状，不会强制覆盖仓库内容。
