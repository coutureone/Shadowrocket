# Loon 规则库

本目录为 Loon 专用规则输出，规则数据来自 [SukkaW/Surge](https://github.com/SukkaW/Surge)，并转换为 Loon 官方文档明确支持的规则语法。

## 设计原则

- 规则文件位于 `Loon/Rules/`，可直接作为 Loon 的订阅规则使用。
- Loon 官方要求订阅规则文件中的每一行都使用 Loon 支持的规则语法，因此不会直接复用 Surge `DOMAIN-SET` 的纯域名格式。
- Surge `DOMAIN-SET` 中以 `.` 开头的条目转换为 `DOMAIN-SUFFIX`，普通条目转换为 `DOMAIN`。
- 域名 / HTTP 类只保留官方文档明确支持的 `DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`USER-AGENT`、`URL-REGEX`。
- IP 类只保留 `IP-CIDR`、`IP-CIDR6`、`IP-ASN`、`GEOIP`。上游已有的 `no-resolve` 原样保留，不会强行添加。
- 使用时保持 `domainset / non_ip` 在 `ip` 规则之前，以延续 SukkaW 上游的规则顺序设计。
- `.github/workflows/update-loon-rules.yml` 每日从 SukkaW Ruleset 更新并校验规则。

官方参考：

- https://nsloon.app/docs/Rule/sub_rule/
- https://nsloon.app/docs/Rule/domain_rule/
- https://nsloon.app/docs/Rule/ip_rule/
- https://nsloon.app/docs/Rule/http_rule/

## 推荐的 `[Remote Rule]`

下面的 `AI`、`Telegram`、`Streaming`、`PROXY` 是策略名，需要在你的 `[Proxy Group]` 中存在；也可以替换成自己的策略名。

```ini
[Remote Rule]
# DOMAIN / non-IP：放在 IP 规则之前
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/speedtest_domainset.list,policy=PROXY,tag=Speedtest,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/cdn_domainset.list,policy=PROXY,tag=Common CDN Domain,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/apple_cdn_domainset.list,policy=DIRECT,tag=Apple CDN,enabled=true

https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/cdn_non_ip.list,policy=PROXY,tag=Common CDN,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/stream_non_ip.list,policy=Streaming,tag=Streaming,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/ai_non_ip.list,policy=AI,tag=AI,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/apple_intelligence_non_ip.list,policy=AI,tag=Apple Intelligence,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/telegram_non_ip.list,policy=Telegram,tag=Telegram,enabled=true

https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/apple_services_non_ip.list,policy=DIRECT,tag=Apple Services,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/apple_cn_non_ip.list,policy=DIRECT,tag=Apple CN,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/microsoft_cdn_non_ip.list,policy=DIRECT,tag=Microsoft CDN,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/microsoft_non_ip.list,policy=DIRECT,tag=Microsoft,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/neteasemusic_non_ip.list,policy=DIRECT,tag=NetEase Music,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/lan_non_ip.list,policy=DIRECT,tag=LAN Domain,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/domestic_non_ip.list,policy=DIRECT,tag=Domestic,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/direct_non_ip.list,policy=DIRECT,tag=Direct,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/global_non_ip.list,policy=PROXY,tag=Global,enabled=true

# IP：从这里开始
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/stream_ip.list,policy=Streaming,tag=Streaming IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/ai_ip.list,policy=AI,tag=AI IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/telegram_ip.list,policy=Telegram,tag=Telegram IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/apple_services_ip.list,policy=DIRECT,tag=Apple IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/neteasemusic_ip.list,policy=DIRECT,tag=NetEase Music IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/lan_ip.list,policy=DIRECT,tag=LAN IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/domestic_ip.list,policy=DIRECT,tag=Domestic IP,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/china_ip.list,policy=DIRECT,tag=China IPv4,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/china_ip_ipv6.list,policy=DIRECT,tag=China IPv6,enabled=true
```

## 可选 Download

只有存在独立下载节点或低倍率策略时再启用：

```ini
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/download_domainset.list,policy=Download,tag=Download Domain,enabled=true
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Loon/Rules/download_non_ip.list,policy=Download,tag=Download,enabled=true
```

## 单独导入规则订阅

Loon 官方支持 `loon://import?rules=encode(url)`。将某个 `.list` 的 Raw URL 进行 URL 编码后替换 `encode(url)` 即可。

## 自动更新

`Loon/scripts/update-rules.mjs` 负责下载和转换；`Loon/scripts/validate-rules.mjs` 会检查生成文件是否只包含当前采用的 Loon 官方规则类型。自动更新工作流安排在上游同步与 Shadowrocket 更新之后执行。
