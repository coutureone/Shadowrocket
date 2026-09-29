# Clash / Mihomo 分流配置

[`Shadowrocket-Universal-Split-DNS.yaml`](./Shadowrocket-Universal-Split-DNS.yaml) 是与本仓库 Shadowrocket 配置对应的 Mihomo 分流模板，适用于自建 Hysteria2、Trojan 节点，也可与节点订阅合并使用。它不包含节点或订阅地址。

## 导入与选择节点

1. 在支持 Mihomo 的客户端中，将此模板与已有节点或 `proxy-providers` 合并。只导入这份文件时没有可用代理节点。
2. 在 `PROXY` 策略组中手动选择一个实际节点。该组会收集配置中的节点和节点提供者；没有选中节点时，`REJECT` 会阻止需要代理的流量，避免误以为代理生效。
3. 保持规则模式。确认规则提供者均已更新成功，并查看连接日志，检查 X、Telegram 走 `PROXY`，国内服务走 `DIRECT`。

你使用的 [Clash - Rule Based Proxy](https://apps.apple.com/app/id6794257189) 支持 Mihomo YAML。iPhone 上从首页顶部的配置名称进入配置列表，添加此文件的 Raw URL；然后在**同一个配置**中加入节点或节点提供者，并到「代理」页为 `PROXY` 选节点。两个独立配置不会因为都已导入就自动合并。首次导入时若远程规则更新失败，先选中可用节点，再手动刷新规则提供者；未选节点时 `PROXY` 的默认 `REJECT` 也会阻止它们下载。可在「工具 → 当前会话 → 连接」查看实际命中的规则和出站节点。

## 分流与 DNS

规则按 Sukka README 的分类顺序排列，域名规则在 IP 规则之前；Apple 系统域名与 Apple IP 使用上游 Apple Services 规则集，不另加 APNs 覆盖规则。`PROXY` 使用你在客户端选择的自建或订阅节点。

默认的国外域名查询通过所选 `PROXY` 访问 Cloudflare DoH；国内和直连目标使用阿里 / 腾讯 DoH。DNS 服务器域名的启动解析使用加密的阿里 DNS IP 端点，节点域名也使用国内加密 DNS。配置不使用明文 `default-nameserver`，也不再配置国内 `nameserver` 与国外 `fallback` 同时查询的组合。以上仅约束 Mihomo 接管的查询；其他 VPN、应用内 DNS 和系统网络行为仍需在设备上核对。

规则提供者由 `Shadowrocket/Rules/*.list` 自动转换，随仓库每日规则同步一起更新。较大的纯域名与 IP 规则集另编译为 MRS，以减轻 iOS 隧道加载压力；含不同域名匹配类型的规则仍使用 Mihomo `classical` 格式。上游 IP 规则的 `no-resolve` 语义保留在对应的 `RULE-SET` 引用中。不支持的 `USER-AGENT` 和无法编译为 MRS 的 `IP-ASN` 规则在 Clash 转换时忽略。自动更新会校验规则顺序、`no-resolve` 和所有提供者文件。
