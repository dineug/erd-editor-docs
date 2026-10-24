---
sidebar_position: 1
description: Claude Code veya Codex gibi bir kodlama ajanının @dineug/erd-editor-mcp MCP sunucusu üzerinden erd-editor diyagramlarını VS Code'da, Obsidian'da veya bir JetBrains IDE'sinde canlı olarak ya da doğrudan diskte düzenlemesini sağlama.
---

# Giriş

`@dineug/erd-editor-mcp`, bir kodlama ajanının erd-editor diyagramlarını düzenlemesini sağlayan bir MCP sunucusudur.
Claude Code, Codex ve diğer tüm [Model Context Protocol](https://modelcontextprotocol.io) istemcileri, bir belge üzerindeki her işlem için bir araç elde eder: bir tablo ekleme, bir sütunu yeniden adlandırma, iki tabloyu ilişkilendirme, bir DDL dökümünü içe aktarma, şemayı SQL olarak geri okuma.

Belge [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) veya bir [JetBrains IDE'si](https://plugins.jetbrains.com/plugin/23594-erd-editor) içindeki ERD Editor ile açık olduğunda, ajan düzenleyiciye bir ortak çalışan gibi katılır.
Her değişiklik gerçekleştiği anda tuvalde görünür ve ajanın geri alma işlemi yalnızca kendi düzenlemelerini geri alır.
VS Code, ajanın değişikliklerini ajan ya da siz kaydedene kadar kaydedilmemiş tutar, Obsidian ve bir JetBrains IDE'si ise bunları sizinkileri kaydettikleri gibi kaydeder.
Belgeyi tutan bir düzenleyici yoksa aynı araçlar dosyanın kendisini düzenler.

![Bir kodlama ajanının VS Code'da açık bir diyagrama tablolar ve ilişkiler eklemesi](/img/coding-agents.webp)

## Bir ajan neler yapabilir {#what-an-agent-can-do}

- Sohbet içinde bir şema oluşturur veya değiştirir: tablolar, sütunlar ve tüm sütun seçenekleri, kardinaliteleri ile ON DELETE ve ON UPDATE eylemleriyle birlikte ilişkiler, dizinler, notlar, renkler ve tuval üzerindeki konumlar. [İlişkiler](./tools.md#relationships) bölümüne bakın.
- Tabloları [tablo gruplarında](../guide/guides/table-groups.md) toplar: Adını verdiği tabloların çevresine ya da tuvalin bir alanının üzerine bir grup ekler, ardından grubu yeniden adlandırır, renklendirir, tablolarıyla birlikte taşır, yeniden boyutlandırır, gruba tablo ekler veya gruptan tablo çıkarır ya da grubu, tablolarını oldukları yerde bırakarak kaldırır. [Tablo grupları](./tools.md#table-groups) bölümüne bakın.
- Tabloları ve sütunları düzenleyicinin [Sözlük](../guide/guides/dictionary.md) sekmesindeki sözcüklerden ve terimlerden adlandırır ve sütunları, onlara veri türlerini veren değer alanlarına bağlar. Tabloların ve sütunların [mantıksal adlarını](../guide/guides/logical-names.md) ayarlar; sözlükler de fiziksel adları düzenleyicide olduğu gibi bunlardan türetir, ancak elle yazılmış bir fiziksel ad boş olmadıkça olduğu gibi kalır. Değer alanları, sözcükler ve terimler ekler, değiştirir ve kaldırır; bir sözcük veya terim değiştikten sonra fiziksel adları tek bir sütun, tek bir tablo ya da belgenin tamamı için yeniden türetir. Sekmenin `Checks` sayfasının bulduklarını listeler: yasaklı, kayıtlı olmayan ve eş anlamlı sözcükler; bir sözlüğün iki satırının paylaştığı adlar; belgenin listelemediği bir değer alanına bağlantılar; terimlerinin verdiğinden farklı fiziksel adlar ve değer alanlarının veri türüne uymayan sütunlar. [Sözlükler](./tools.md#dictionaries) ve [Sözlük denetimleri](./tools.md#dictionary-checks) bölümlerine bakın.
- Belgeyi SQL DDL, GraphQL SDL, DBML veya AML'den ayrıştırılan bir şemayla ya da başka bir `.erd.json` belgesiyle değiştirir. Ya da düzenleyicideki [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) öğesinin yaptığı gibi, bu şemayı veya belgeyi diyagramın altına ekler ve zaten var olan her şeyi korur. Bir DBML `TableGroup` tanımı her iki durumda da bir tablo grubu olarak gelir. Belgenin yerini alan bir şema belgenin sözlüklerini korur, belgenin yerini alan bir belge kendi sözlüklerini getirir, bir ekleme ise hiç sözlük getirmez. [İçe aktarma](./tools.md#import) bölümüne bakın.
- Diyagramı mantıksal adları ve sözlük satırlarıyla birlikte bir kimlik listesi, eksiksiz varlıklar ya da bir kaydetme işleminin yazdığı `.erd.json` metni olarak geri okur. Ya da [Şema SQL](../guide/guides/schema-sql.md) sekmesinin `Statements` ve `Header` seçenekleri ve [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) anahtarıyla sekiz veritabanından herhangi biri için DDL olarak okur. Binlerce tablodan oluşan bir şemada her seferinde bir sayfa, birkaç tablo ya da birkaç tablo grubunun tablolarını okur. [Belge okuma](./tools.md#reading-a-document) bölümüne bakın.
- Veritabanını, veritabanı adını ve Şema SQL'de tablolardan önce ve sonra yazılan, tablolardan önceki bir `CREATE EXTENSION` ya da sonraki bir `GRANT` gibi [betikleri](../guide/guides/schema-sql.md#before-and-after-scripts) ayarlar. `erd_read` aracı betikleri tek başına ya da belgenin tamamının DDL'i içinde verir. [Ayarlar](./tools.md#settings) bölümüne bakın.
- Birkaç düzenlemeyi ya hepsi ya hiçbiri ilkesiyle, tek bir geri alma adımı olan tek bir düzenleme olarak çalıştırır. [erd_batch](./tools.md#erd_batch) bölümüne bakın.
- Kendi düzenlemelerini geri alır ve yineler, sizinkileri asla.

Yapmadığı şeyler:

- Yakınlaştırmaz, kaydırmaz ve sekme değiştirmez. Bunlar her görüntüleyenin kendisine aittir, bu yüzden hiçbir araç bunları yapmaz. Yine de belgenin yerini alan bir içe aktarma, düzenleyicideki `Import` öğesinin yaptığı gibi, `Viewport` kilitliyken bile görünümü taşır: %100 yakınlaştırmayla yeniden tuvalin başlangıcına ya da `erd_import_json` ile yüklediği belgenin görünümüne ve o belge `Canvas Type` ayarını kilitlemedikçe o belgenin sekmesine de. [İçe aktarma](./tools.md#import) bölümüne bakın.
- [Ad görünümünü](../guide/guides/logical-names.md#switching-the-view) `Physical Names`, `Logical Names` ve `Both Names` arasında değiştirmez. Ad görünümü, yeni bir diyagramda olduğu gibi [kilidi](../guide/guides/settings.md#lock) etkinken her görüntüleyenin kendisine aittir, kilit devre dışı bırakıldıktan sonra ise düzenleyicide sizin seçiminizdir; bu yüzden hiçbir araç onu değiştirmez. Ajan, görünüm ne olursa olsun mantıksal adları okur ve yazar. Belgenin yerini alan bir `erd_import_json`, yüklediği belgenin Ad görünümünü yalnızca o belgede `Name View` kilidi devre dışıysa getirir.
- [`View Option`](../guide/guides/table-related-functions.md#table-view-options) seçeneklerini, Kod oluşturucunun dilini ve ad biçimlerini, tırnak türünü ya da [Ayarlar](../guide/guides/settings.md) sekmesindeki `Relationship DataType Sync`, `Maximum comment width` ve `Column Order` ayarlarını değiştirmez. Bunları düzenleyicide siz ayarlarsınız, ajan da bunları dosyanın kaydettiği şekliyle okur.
- Bir [kilidi](../guide/guides/settings.md#lock) etkinleştirmez veya devre dışı bırakmaz. Kilitleri ya da yukarıdaki ayarları yalnızca belgenin tamamının yerini alan `erd_import_json` aracı, yüklediği belgeninkilerle değiştirir. VS Code uzantısının `4.0.0` sürümünden önceki ya da Obsidian veya JetBrains eklentisinin `1.0.0` sürümünden önceki bir sürümünün kaydettiği bir dosya gibi, `lockSettings` alanı olmayan bir belge tüm kilitleri etkinleştirir. Belgenin yerini alan herhangi bir içe aktarmayı geri almak, belgenin önceden sahip olduğu ayarları ve kilitleri geri getirir.
- [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) iletişim kutusunun yaptığı gibi bir ilişkiyi başka sütunlara yeniden eşlemez. Bunun yerine ajan, tek bir geri alma adımı olan tek bir `erd_batch` çağrısında, ilişkiyi, yabancı anahtar sütunlarını yerinde bırakarak kaldırır ve istediği sütunları `erd_link_columns` aracıyla bağlar.
- [Sözlük](../guide/guides/dictionary.md) sekmesinin yaptığı gibi bir sözlüğü CSV olarak içe veya dışa aktarmaz, bir sayfayı sıralamaz ya da bir satırın üstüne veya altına satır eklemez. Ajan satır ekler, değiştirir ve kaldırır, tek bir `erd_batch` içinde birçoğunu birden; yeni bir satır da kendi sayfasının sonuna eklenir.
- Kod oluşturucuyu çalıştırmaz. `erd_read` aracı DDL ya da JSON ile yanıt verir, ajan da kodu bundan kendisi yazar.

## Nasıl çalışır {#how-it-works}

Sunucu, MCP istemcinizin başlattığı bir stdio sürecidir.
Sunucu her çağrıda belgeyi tutan bir düzenleyici arar: her birinde ERD Editor uzantısı veya eklentisi kurulu olan bir VS Code penceresi, bir Obsidian kasa penceresi ya da bir JetBrains IDE'si.

- **Canlı** – belge bir düzenleyicinin çalışma alanında, kasasında veya açık projelerinden birindedir ya da o düzenleyicide açıktır. Sunucu o düzenleyicinin düzenleme oturumuna katılır ve düzenleme düzenleyiciye yansır: VS Code'da kaydedilmemiş olarak, Obsidian'da ve bir JetBrains IDE'sinde ise kendi düzenlemeleriniz gibi kaydedilmiş olarak.
- **Headless** – düzenleyici yoktur. Sunucu dosyayı yükler, düzenlemeyi uygular ve dosyayı geri yazar.
- **Reddedilir** – belgeyi bir düzenleyici tutar, ancak düzenleyicinin hub'ı kapalıdır. Açık düzenleyici bir sonraki kaydetmesinde dosyanın üzerine yazabileceği için sunucu diskten okur ama hiçbir şey yazmaz. Hub'ı açık bir JetBrains IDE'si de yalnızca güvenmediği projelerin tuttuğu bir belgeyi değiştirmeyi reddeder, fakat ajan bu belgeyi yine de okuyabilir. Düzenleyicinin hub'ı açık olduğu hâlde düzenleyicideki ERD Editor uzantısı veya eklentisi sunucudan farklı bir hub protokolü kullandığında, okumalar dahil belgeye yapılan her çağrı `protocolMismatch` koduyla ve güncellenmesi gereken tarafı belirten bir iletiyle reddedilir. [Güncelleme](./installation.md#updating) bölümüne bakın.

Ayrıntılar için [Canlı ve headless](./live-and-headless.md) sayfasına bakın.

## Gereksinimler {#requirements}

| | |
| --- | --- |
| Node.js | Sunucuyu çalıştırmak için `22.12` veya sonraki bir sürüm |
| Bir MCP istemcisi | Claude Code, Codex veya bir stdio sunucusunu başlatabilen herhangi bir istemci |
| Canlı düzenleme için VS Code | `1.101.0` veya sonraki bir sürüm, ERD Editor uzantısının `4.0.0` veya sonraki bir sürümüyle birlikte |
| Canlı düzenleme için Obsidian | Masaüstü uygulamasının `1.5.7` veya sonraki bir sürümü, ERD Editor eklentisinin `1.0.0` veya sonraki bir sürümüyle birlikte |
| Canlı düzenleme için bir JetBrains IDE'si | IntelliJ tabanlı bir IDE'nin `2025.2` veya sonraki bir sürümü, ERD Editor eklentisinin `1.0.0` veya sonraki bir sürümüyle birlikte |

Sunucunun `1.0.0` veya sonraki bir sürümü ve yukarıdaki sürümler hub protokolü 2'yi kullanır.
Ajanlara hizmet veren daha eski sürümler protokol 1'i kullanır: VS Code uzantısının `3.0.0` sürümünden `3.1.0` sürümüne kadar olan sürümleri, Obsidian eklentisinin `0.1.0` ve `0.2.0` sürümleri ve JetBrains eklentisinin `0.9.0` ve `0.10.0` sürümleri.
Böyle bir sürüm ile sunucunun `1.0.0` veya sonraki bir sürümü birbirini reddeder, daha eski bir sunucu ile yukarıdaki sürümler de öyle. [Güncelleme](./installation.md#updating) bölümüne bakın.
`3.0.0` sürümünden önceki bir VS Code uzantısının ya da `0.9.0` sürümünden önceki bir JetBrains eklentisinin hub'ı yoktur, bu yüzden sunucu onu görmez ve diskteki dosyayı, o düzenleyicide açık olan bir diyagramı bile düzenler.

Mantıksal adlar, değer alanları ve sözlükler için araçlar, sunucunun `1.1.0` veya sonraki bir sürümünü ve belgenin açık olduğu her yerde en az VS Code uzantısının `4.2.0` sürümünü ya da Obsidian veya JetBrains eklentisinin `1.2.0` sürümünü gerektirir.
Yukarıdaki sürümlerden `4.2.0` sürümünden önceki bir uzantı veya `1.2.0` sürümünden önceki bir eklenti, protokol 2'yi kullandığı için ajanın canlı düzenleme yapmasına yine izin verir, ancak ajanın yazdığı mantıksal adları, değer alanı bağlantılarını ve sözlük satırlarını yok sayar ve dosyayı kaydettiğinde bunları dışarıda bırakır.
Bir dosyayı diskte düzenleyen, `1.1.0` sürümünden önceki bir sunucu dosyayı mantıksal adları, değer alanı bağlantıları ve sözlük satırları olmadan geri yazar. [Güncelleme](./installation.md#updating) bölümüne bakın.

Sonraki adım: [Kurulum](./installation.md).
