# Surge 配置

`Surge-Universal-Split-DNS.conf` 基于 [SukkaW/Surge](https://github.com/SukkaW/Surge) 的官方 Ruleset 顺序生成，适用于 Surge for iOS 和 macOS。它不包含节点；请把自建节点填写到 `[Proxy]`，并在 `[Proxy Group]` 中选择 `PROXY`。

建议同时启用 `../Modules/sukka_apns_direct.sgmodule`。主配置已经包含相同的 APNs 规则，模块用于在后续叠加其他模块时再次明确 Apple 推送直连优先级。

导入主配置：

```text
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Surge/Surge-Universal-Split-DNS.conf
```

导入模块：

```text
https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Modules/sukka_apns_direct.sgmodule
```

国内域名和中国大陆 IPv4/IPv6 地址走 `DIRECT`，AI、Telegram、流媒体和未知流量走当前 `PROXY` 节点。APNs 的 Apple 域名及 `17.0.0.0/8` 走直连；通知是否及时仍取决于 iOS 权限、蜂窝网络、节点线路和系统后台状态。
