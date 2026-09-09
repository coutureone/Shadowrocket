# Clash / Mihomo 配置

`Shadowrocket-Universal-Split-DNS.yaml` 是与本仓库小火箭配置对应的 Clash.Meta / Mihomo 配置模板。

导入后请在 Clash 客户端中保留机场订阅提供的代理节点，并将代理策略组命名为 `PROXY`；如果客户端已有自己的策略组，可把配置中的 `PROXY` 替换为实际策略组名。规则提供者使用本仓库的 Raw 地址，规则会随仓库同步自动更新。

DNS 默认采用 fake-ip + DoH，禁止向系统 DNS 回退；代理 DNS 通过代理策略组发送，避免 DNS 泄露。
