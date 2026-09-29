# Shadowrocket 通用分流配置

> 此目录是 Fork 仓库维护者添加的 Shadowrocket 配置，不属于 Sukka Ruleset 官方支持范围。

## 导入地址

```text
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Shadowrocket/Shadowrocket-Universal-Split-DNS.conf
```

## 使用方法

1. 先在 Shadowrocket 首页添加自建节点，或导入并更新节点订阅（Hysteria2、Trojan 等均可）。
2. 进入“配置”，点击右上角 `+`，粘贴上面的 Raw 地址并下载。
3. 选中下载的配置文件，将首页“全局路由”设为“配置”。
4. 在 Shadowrocket 首页手动选择一个节点。所有需要代理的国外、AI、流媒体及 Telegram 流量都会使用当前节点；配置不会自动选择或切换节点。

需要单独比较 APNs 路由时，可导入 [APNs 代理测试配置](./Shadowrocket-Universal-Split-DNS-APNs-Test.conf)。它只把 Apple 公布的推送域名和 IP 范围改为代理，其他分流沿用主配置；测试结束后可切回主配置。系统 APNs 流量是否进入隧道仍取决于 iOS 和 Shadowrocket 的设置。

国内域名及中国大陆 IPv4 / IPv6 默认直连。Shadowrocket 已启用 IPv6，但双栈域名仍优先 IPv4；IPv6-only 目标按相同规则分流。国外和未知流量统一使用小火箭内置的 `PROXY`，也就是首页当前手选的节点，无论来自自建还是订阅。配置没有 `Auto` 和地区策略组，不会后台更换出口。

两份配置共用同一批 Sukka 规则和策略：本地、APNs、微信与腾讯域名先匹配；测速、流媒体、AI 和 Telegram 走代理；Apple、Microsoft、网易云的专项规则按原有策略直连；通用 CDN、下载走代理；局域网、国内和显式直连列表之后兜底，未知流量走代理。通用 CDN 现在优先于国内兜底，以覆盖上游列表中的海外静态资源。`bilivideo.com` 与 `wpscdn.com` 和已有腾讯域名在 CDN 之前直连，避免这些国内资源因顺序调整而改走代理。所有域名规则仍排在 IP 规则之前，IP 专项规则先于中国 IP 兜底。

Sukka 的 Apple Services 源文件还包含 `17.0.0.0/8,no-resolve`。转换器将它单独保存为 `apple_services_ip.list`，放在所有域名规则之后直连；这样通过 Apple IP 直连的请求也能沿用上游规则，AI 等域名专项代理规则仍先匹配。APNs 代理测试配置中的精确 APNs IP 规则排在这一条广义 Apple IP 规则之前。

APNs 使用的 `courier.push.apple.com` 可能经 `courier-push-apple.com.akadns.net` 别名解析，因此主配置对这个窄域名直连，测试配置则让它代理；不会把整个 `akadns.net` 改为代理。

AI 规则除自动转换的 Sukka 规则外，还使用 `ai_supplemental_non_ip.list` 补齐 Gemini 与 ChatGPT 的登录、鉴权、API、静态资源和实时通信依赖。AI 连接和国外 DoH 都使用当前 `PROXY` 节点，避免 DNS 与连接出口国家不一致。Gemini 所需的 Google 登录、`google.com`、`googleapis.com`、`gstatic.com` 和 `googleusercontent.com` 依赖已统一锁定到 `PROXY`；这会让 Google AI 会话的地区判断使用同一个出口。

## DNS 设计

- 国内直连域名优先使用阿里 / 腾讯 DoH；解析失败时可能经代理回退。
- 需要本地解析的代理域名通过当前节点使用 Cloudflare / Google DoH；代理连接也可能由远端节点解析域名。
- DNS 失败不会回退到 iOS 系统 DNS。
- 节点域名在隧道建立前通过直连的国内 DoH 加密解析。
- 节点不支持 UDP 时拒绝该 UDP 流量，不静默改成直连。
- Shadowrocket 已启用 IPv6，国内 IPv6 地址列表按 `DIRECT` 处理；公网 IPv6 不排除在 TUN 外。节点域名在支持 IPv6 的网络上也可能通过 IPv6 连接。

## 验证

- 使用 <https://dnsleaktest.com> 的 Extended Test 检查 DNS；不应出现本地运营商 DNS。
- 使用 <https://ip.sb> 检查国外访问的出口 IP。
- 查看 Shadowrocket 日志：国内请求通常命中 `DIRECT`，国外请求通常命中 `Proxy`。
- 在双栈网络和 IPv6-only 网络上分别检查日志：国内 IPv6 地址应命中 `china_ip_ipv6` 或 `GEOIP,CN` 并走 `DIRECT`，国外 IPv6 地址应走 `PROXY`；再检查实际出口 IP。自建与订阅节点都需要验证能否转发目标 IPv6 流量；节点接入地址本身不必是 IPv6。

不存在适配所有节点和网络的绝对“零泄露”保证。节点线路、应用自带 DoH/VPN、iCloud Private Relay、IPv6 和节点协议能力都会影响实际结果。

## 与上游同步

仓库中的 `.github/workflows/sync-upstream.yml` 每天北京时间 11:17 自动拉取并合并 `SukkaW/Surge` 的 `master` 分支，也支持在 GitHub Actions 页面手动运行。

`.github/workflows/update-shadowrocket-rules.yml` 每天北京时间 11:47 从 Sukka 官方 Ruleset Server 获取构建结果，通过 `Shadowrocket/scripts/update-rules.mjs` 转换后写入 `Shadowrocket/Rules/`。主配置只引用本仓库中的这些转换结果，不再依赖第三方 Shadowrocket 规则仓库。

转换器保留 Shadowrocket 支持的域名、USER-AGENT、IPv4/IPv6 CIDR 和 ASN 规则，自动删除 Surge/iOS 不适用或需要 MITM 的 `PROCESS-NAME`、`URL-REGEX` 等内容。当前主配置引用中国 IPv4 / IPv6 地址列表；其余 CDN、下载和网易云均同时覆盖域名/non-IP/IP补充规则。广告、Map Local、全局 MITM 和其他 Surge 专属模块不会转换。

每日更新还会校验 Shadowrocket 与 Clash 配置的域名/IP 规则顺序、规则源优先级和策略是否一致，以及引用的规则文件是否存在。Clash 版本另将可编译的域名集、IP 列表制作成 MRS；无法编译的 `IP-ASN` 和不适用的 `USER-AGENT` 不导入 Clash。

## AI 地区问题检查

更新配置后，在首页手动选择一条受 Gemini / ChatGPT 支持的节点（建议先测试美国），断开并重新连接，再完全退出并重新打开 App。最近请求中的 Gemini/ChatGPT 主域名、登录和 API 请求都应命中 `PROXY`。如果仍提示地区不支持，应更换另一条节点；节点名称是“美国”不代表 Google/OpenAI 对该出口 IP 的定位和风控结果一定是美国。

自定义文件仅放在 `Shadowrocket/` 目录，正常情况下不会干扰上游更新。如果未来上游创建同名文件并产生合并冲突，工作流会失败并保留现状，不会强制覆盖仓库内容。
