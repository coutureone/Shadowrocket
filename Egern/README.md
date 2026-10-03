# Egern 规则库

本目录提供 **Egern 原生 YAML 规则集**，数据来自 [SukkaW/Surge](https://github.com/SukkaW/Surge)。Egern 官方 FAQ 也支持直接加载 Surge 规则集，但这里优先输出 Egern 自己的原生规则集格式。

## 官方格式

Egern 原生规则集支持 `domain_set`、`domain_suffix_set`、`domain_keyword_set`、`domain_regex_set`、`domain_wildcard_set`、`ip_cidr_set`、`ip_cidr6_set`、`asn_set`、`geoip_set`、`url_regex_set`、`user_agent_set` 等字段。

官方文档：

- https://doc.egernapp.com/zh-CN/docs/configuration/rules/
- https://doc.egernapp.com/zh-CN/docs/faq/

## 在 Egern Profile 中使用

保持域名 / non-IP 规则在 IP 规则之前：

```yaml
rules:
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/speedtest_domainset.yaml"
      policy: PROXY
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/cdn_domainset.yaml"
      policy: PROXY
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/apple_cdn_domainset.yaml"
      policy: DIRECT
      update_interval: 86400

  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/cdn_non_ip.yaml"
      policy: PROXY
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/stream_non_ip.yaml"
      policy: Streaming
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/ai_non_ip.yaml"
      policy: AI
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/apple_intelligence_non_ip.yaml"
      policy: AI
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/telegram_non_ip.yaml"
      policy: Telegram
      update_interval: 86400

  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/apple_services_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/apple_cn_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/microsoft_cdn_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/microsoft_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/neteasemusic_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/lan_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/domestic_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/direct_non_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/global_non_ip.yaml"
      policy: PROXY
      update_interval: 86400

  # IP rules
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/stream_ip.yaml"
      policy: Streaming
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/ai_ip.yaml"
      policy: AI
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/telegram_ip.yaml"
      policy: Telegram
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/apple_services_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/neteasemusic_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/lan_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/domestic_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/china_ip.yaml"
      policy: DIRECT
      update_interval: 86400
  - rule_set:
      match: "https://raw.githubusercontent.com/coutureone/Shadowrocket/master/Egern/Rules/china_ip_ipv6.yaml"
      policy: DIRECT
      update_interval: 86400
  - default:
      policy: PROXY
```

`PROXY`、`AI`、`Telegram`、`Streaming` 是示例策略组名，可替换成你的 Egern 策略名称。

## Download（可选）

有独立下载 / 低倍率策略时再加载 `download_domainset.yaml` 与 `download_non_ip.yaml`。

## 自动更新

`Egern/scripts/update-rules.mjs` 会从 Sukka Ruleset 直接生成 Egern 原生 YAML；如果同一上游 IP 规则集同时存在普通解析与 `no-resolve` 条目，会自动拆成两个文件（例如 `ai_ip.yaml` 与 `ai_ip_no_resolve.yaml`），避免改变原始 DNS 语义。`validate-rules.mjs` 负责校验输出结构。自动更新工作流在上游、Shadowrocket 和 Loon 更新之后执行。
