# Shadowrocket 通用分流配置

> 此目录是 Fork 仓库维护者添加的 Shadowrocket 配置，不属于 Sukka Ruleset 官方支持范围。

## 导入地址

```text
https://raw.githubusercontent.com/coutureone/Surge/master/Shadowrocket/Shadowrocket-Universal-Split-DNS.conf
```

## 使用方法

1. 先在 Shadowrocket 首页导入并更新机场订阅。
2. 进入“配置”，点击右上角 `+`，粘贴上面的 Raw 地址并下载。
3. 选中下载的配置文件，将首页“全局路由”设为“配置”。
4. 启动 Shadowrocket，在配置的 `Proxy` 策略组中选择：
   - `Auto`：在所有真实节点中自动选择，出口国家可能变化；
   - `HK`、`TW`、`JP`、`SG`、`US`：只在对应地区节点间切换；
   - 具体节点：固定该节点，直到手动修改。

国内域名及中国大陆 IPv4/IPv6 默认直连，国外和未知流量默认通过 `Proxy`。AI、流媒体和 Telegram 提供独立策略组，默认继承 `Proxy`。

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

转换器保留 Shadowrocket 支持的域名、USER-AGENT、IPv4/IPv6 CIDR 和 ASN 规则，自动删除 Surge/iOS 不适用或需要 MITM 的 `PROCESS-NAME`、`URL-REGEX` 等内容。广告、Map Local、全局 MITM 和其他 Surge 专属模块不会转换。

自定义文件仅放在 `Shadowrocket/` 目录，正常情况下不会干扰上游更新。如果未来上游创建同名文件并产生合并冲突，工作流会失败并保留现状，不会强制覆盖仓库内容。
