# Clash / Mihomo 分流配置

[`Shadowrocket-Universal-Split-DNS.yaml`](./Shadowrocket-Universal-Split-DNS.yaml) 是与本仓库 Shadowrocket 配置对应的 Mihomo 分流模板，适用于自建 Hysteria2、Trojan 节点，也可与节点订阅合并使用。它不包含节点或订阅地址。

## 导入与选择节点

1. 在支持 Mihomo 的客户端中，将此模板与已有节点或 `proxy-providers` 合并。只导入这份文件时没有可用代理节点。
2. 在 `PROXY` 策略组中手动选择一个实际节点。该组会收集配置中的节点和节点提供者；没有选中节点时，`REJECT` 会阻止需要代理的流量，避免误以为代理生效。
3. 保持规则模式。确认规则提供者均已更新成功，并查看连接日志，检查 X、Telegram 走 `PROXY`，国内服务走 `DIRECT`。

你使用的 [Clash - Rule Based Proxy](https://apps.apple.com/app/id6794257189) 支持 Mihomo YAML。iPhone 上从首页顶部的配置名称进入配置列表，添加此文件的 Raw URL；然后在**同一个配置**中加入节点或节点提供者，并到「代理」页为 `PROXY` 选节点。两个独立配置不会因为都已导入就自动合并。首次导入时若远程规则更新失败，先选中可用节点，再手动刷新规则提供者；未选节点时 `PROXY` 的默认 `REJECT` 也会阻止它们下载。可在「工具 → 当前会话 → 连接」查看实际命中的规则和出站节点。

## 通知测试

此模板将 Apple APNs 域名及 [Apple 公布的 APNs IP 段](https://support.apple.com/102266) 放在规则最前面直连，并让 APNs 域名避开 fake-ip。它没有把整个 `akadns.net` 或 Apple 流量强制送入代理。规则仅对 Mihomo 客户端实际接管的连接生效；iOS 是否把系统 APNs 连接交给 VPN，仍取决于客户端和系统隧道设置。

测试时先保持现有节点、通知权限和网络环境一致，分别在 Wi-Fi 与蜂窝网络下锁屏发送 X、Telegram 和微信消息。若只有蜂窝网络异常，再比较客户端连接日志中的 APNs 连接和系统网络切换；不要同时改动多个隧道开关。Apple Mail 中设为 `Fetch` 的 Gmail 帐户不会因为这些规则变成立即推送。

规则提供者由 `Shadowrocket/Rules/*.list` 自动转换，随仓库每日规则同步一起更新。较大的纯域名与 IP 规则集另编译为 MRS，以减轻 iOS 隧道加载压力；含不同域名匹配类型的规则仍使用 Mihomo `classical` 格式。不支持的 `USER-AGENT` 规则在转换时忽略。
