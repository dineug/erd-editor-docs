---
sidebar_position: 2
description: "@dineug/erd-editor-mcp sunucusunu Claude Code, Codex veya başka bir MCP istemcisine kaydetme ve canlı düzenleme için VS Code, Obsidian ya da bir JetBrains IDE'sini ayarlama."
---

# Kurulum

Sunucu, npm'de `@dineug/erd-editor-mcp` adıyla yayımlanır.
Çalışma zamanı bağımlılığı olmayan, kendi içinde eksiksiz tek bir dosyadır ve ajan onu ilk kez başlattığında `npx` dosyayı indirir, bu yüzden kurulacak başka bir şey yoktur.
Node.js `22.12` veya sonraki bir sürüm gerektirir.

Ajanın bir diyagramı canlı olarak düzenleyebilmesi için diyagramı tutan düzenleyiciyi de ayarlayın: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) veya [bir JetBrains IDE'si](#set-up-a-jetbrains-ide).
Belgeye hizmet veren bir düzenleyici yoksa ajan diskteki dosyayı düzenler. [Canlı ve headless](./live-and-headless.md) sayfasına bakın.

## Claude Code {#claude-code}

Proje klasörünüzde çalıştırın:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Sunucuyu bunun yerine projenin `.mcp.json` dosyasına yazmak için `--transport` seçeneğinden önce `--scope project` ekleyin; projeyi klonlayan herkes sunucuyu oradan alır.

## Codex {#codex}

Bir kez çalıştırın. Codex CLI, Codex uygulaması ve IDE uzantısı bu ayarı paylaşır:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Ya da sunucuyu `~/.codex/config.toml` dosyasına veya güvenilir bir projedeki `.codex/config.toml` dosyasına ekleyin:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Diğer MCP istemcileri {#any-other-mcp-client}

`npx -y @dineug/erd-editor-mcp` komutunu bir stdio sunucusu olarak çalıştırın: Komut olarak `npx`, argüman olarak da `-y` ve `@dineug/erd-editor-mcp` verilir.

Sunucu göreli bir belge yolunu kendi çalışma dizinine göre çözümler, bu yüzden sunucuyu proje klasörünüzde başlatın.
MCP protokolünün `2025-06-18`, `2025-03-26` ve `2024-11-05` sürümlerini kullanır ve daha yeni bir sürüm kullanan bir istemciye `2025-06-18` sürümüyle yanıt verir.

## VS Code'u ayarlama {#set-up-vs-code}

Bir VS Code penceresi, çalışma alanı klasörlerindeki diyagramlara ve kendisinde açık olan her diyagrama hizmet verir.

1. [ERD Editor uzantısının](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` veya sonraki bir sürümünü kurun. Uzantı, VS Code `1.101.0` veya sonraki bir sürüm gerektirir.
2. Proje klasörünü açın ve çalışma alanına güvenin. Uzantı, ajanlara yalnızca güvenilir bir çalışma alanında hizmet verir.
3. `dineug.erd-editor.agentHub.enabled` ayarını açık bırakın. Bu ayar varsayılan olarak açıktır.

`3.0.0` sürümünden `3.1.0` sürümüne kadar olan bir uzantı ile sunucunun `1.0.0` veya sonraki bir sürümü birbirini reddeder, `3.0.0` sürümünden önceki bir uzantı ise hiçbir ajana hizmet vermez.
`4.0.0` veya `4.1.0` sürümlü bir uzantı bağlanır, ancak ajanın yazdığı mantıksal adları, değer alanı bağlantılarını ve sözlük satırlarını ne gösterir ne de korur. [Güncelleme](#updating) bölümüne bakın.

Uzantı, `.erd`, `.erd.json`, `.vuerd` veya `.vuerd.json` dosyaları içeren bir çalışma alanında başlar, bu yüzden ajan bu diyagramlara siz birini açmadan önce erişir.
Bunlardan hiçbirini içermeyen bir çalışma alanında uzantı bir diyagram açtığınızda başlar ve o zamana kadar ajan dosyaları diskte düzenler.

| Ayar | Varsayılan | Etkisi |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Bir ajanın MCP sunucusunun bu pencerenin belgelerini yerel bir soket, Windows'ta ise adlandırılmış bir kanal üzerinden düzenlemesine izin verir. Ayar kapalıyken ya da güvenilmeyen bir çalışma alanında ajanlar pencerenin diyagramlarını diskten okumaya devam edebilir, ancak hiçbirini düzenleyicisinin haberi olmadan asla yazamaz. |

## Obsidian'ı ayarlama {#set-up-obsidian}

Bir Obsidian kasa penceresi, kasasındaki diyagramlara hizmet verir.

1. [ERD Editor eklentisinin](https://community.obsidian.md/plugins/erd-editor) `1.0.0` veya sonraki bir sürümünü Community plugins bölümünden kurun ve eklentiyi etkinleştirin. Eklenti yalnızca masaüstü uygulamasında çalışır ve Obsidian `1.5.7` veya sonraki bir sürüm gerektirir.
2. Settings → ERD Editor → Coding agents ayarını açık bırakın. Bu ayar varsayılan olarak açıktır ve her kasa kendi ayarını tutar.

`1.0.0` sürümünden önceki bir eklenti ile sunucunun `1.0.0` veya sonraki bir sürümü birbirini reddeder.
`1.0.0` veya `1.1.0` sürümlü bir eklenti bağlanır, ancak ajanın yazdığı mantıksal adları, değer alanı bağlantılarını ve sözlük satırlarını ne gösterir ne de korur. [Güncelleme](#updating) bölümüne bakın.

Bir kasa penceresi, eklenti yüklendiği andan itibaren ajanlara hizmet verir, bu yüzden ajan kasanın diyagramlarına siz birini açmadan önce erişir.
Güvenme adımı yoktur.
Adı nokta ile başlayan bir klasördeki dosya gibi kasanın listelemediği bir dosya ERD Editor ile açılamaz, bu yüzden bu dosyaya yapılan bir düzenleme reddedilir.

Ajandan yeni diyagramları `.erd` uzantısıyla adlandırmasını isteyin.
Uzantısız bir ada `.erd.json` uzantısı eklenir ve Obsidian'ın dosya gezgini bir `.erd.json` dosyasını yalnızca Settings → Files and links → Detect all file extensions ayarı açıkken listeler.

| Ayar | Varsayılan | Etkisi |
| --- | --- | --- |
| Coding agents | Açık | Bir ajanın MCP sunucusunun bu kasanın diyagramlarını yerel bir soket, Windows'ta ise adlandırılmış bir kanal üzerinden düzenlemesine izin verir. Ayar kapalıyken ajanlar kasanın diyagramlarını diskten okumaya devam edebilir, ancak hiçbirini düzenleyicisinin haberi olmadan asla yazamaz. |

Flathub'dan kurulan Obsidian, sunucunun erişemediği bir Flatpak korumalı alanında çalışır.
Bu durumda eklenti hiçbir ajana hizmet vermez ve kilit dosyası tutmaz, bu yüzden ajan diskteki dosyaları, açtığınız bir diyagramı bile düzenler.
Obsidian, kendi dışında yapılan her değişiklikten sonra yaptığı gibi diyagramı yeniden yükler ve henüz kaydetmediği bir düzenlemeniz yerini ajanın düzenlemesine bırakır.
Coding agents ayarını kapatmadığınız sürece eklenti, kasa her açıldığında bunu bildirir.

## JetBrains IDE'sini ayarlama {#set-up-a-jetbrains-ide}

Bir JetBrains IDE'si, içinde açık olan her projenin diyagramlarına ve içindeki ERD Editor ile açılmış her diyagrama hizmet verir.

1. [ERD Editor eklentisinin](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` veya sonraki bir sürümünü kurun. Eklenti, JetBrains Runtime üzerinde çalışan, IntelliJ tabanlı bir IDE'nin `2025.2` veya sonraki bir sürümünü gerektirir.
2. Projeyi açın ve projeye güvenin. Güvenli modda açılmış bir proje gibi IDE'nin güvenmediği bir projede ajanlar diyagramları okur, ancak asla değiştirmez.
3. Settings | Tools | ERD Editor → Coding agents ayarını işaretli bırakın. Bu ayar varsayılan olarak açıktır ve IDE'nin tamamı için geçerlidir.

`0.9.0` veya `0.10.0` sürümlü bir eklenti ile sunucunun `1.0.0` veya sonraki bir sürümü birbirini reddeder, `0.9.0` sürümünden önceki bir eklenti ise hiçbir ajana hizmet vermez.
`1.0.0` veya `1.1.0` sürümlü bir eklenti bağlanır, ancak ajanın yazdığı mantıksal adları, değer alanı bağlantılarını ve sözlük satırlarını ne gösterir ne de korur. [Güncelleme](#updating) bölümüne bakın.

IDE, ilk proje açıldığı andan itibaren ajanlara hizmet verir, bu yüzden ajan bir projenin diyagramlarına siz birini açmadan önce erişir.

| Ayar | Varsayılan | Etkisi |
| --- | --- | --- |
| Coding agents | Açık | Bir ajanın MCP sunucusunun bu IDE'nin diyagramlarını yerel bir soket, Windows'ta ise adlandırılmış bir kanal üzerinden düzenlemesine izin verir. Ayar kapalıyken ajanlar açık projelerin diyagramlarını diskten okumaya devam edebilir, ancak hiçbirini düzenleyicisinin haberi olmadan asla değiştiremez. |

Ayarlar sayfası, kodlama ajanlarının kullanılamadığı durumları belirtir: JCEF içermeyen bir IDE'de (ERD Editor de orada çalışamaz), Linux'ta Flatpak olarak kurulmuş bir IDE'de ve IDE'nin hub'ı başlatılamadığında.
Bu durumlarda IDE kilit dosyası tutmaz ve ajan diskteki dosyaları düzenler.
ERD Editor, açıkken diskte değiştirilen bir diyagramı yeniden yüklemez ve diyagramda yapacağınız bir sonraki düzenleme diyagramın tamamını ajanın değişikliklerinin üzerine yeniden yazar, bu yüzden önce diyagramı kapatın.

## Deneyin {#try-it}

1. Diyagramlarınızı içeren klasörü açın: VS Code'da güvendiğiniz bir çalışma alanı olarak; Obsidian'da bir kasa olarak; bir JetBrains IDE'sinde güvendiğiniz bir proje olarak.
2. Ajanı aynı klasörde başlatın ve isteğinizi sade bir dille iletin, örneğin _“schema.erd.json dosyasına users ve products ile ilişkili bir reviews tablosu ekleyin”_.
3. Değişikliğin tuvale yansımasını izleyin. VS Code'da `Ctrl + S` (Windows/Linux) veya `⌘ + S` (Mac) ile kaydedin ya da ajandan kaydetmesini isteyin. Obsidian ve bir JetBrains IDE'si değişikliği kendi düzenlemelerinizi kaydettikleri gibi kaydeder, ajandan kaydetmesini istemek ise değişikliği hemen yazar.

Henüz açık olmayan bir diyagram, ajanın ilk düzenlemesinde klavye odağını almadan ERD Editor ile açılır.
Ajan yeni bir belgeyi `erd_open_document` aracıyla oluşturur ve uzantısız bir ada `.erd.json` uzantısı eklenir.

## Güncelleme {#updating}

Yukarıdaki komutlar bir sürüm belirtmez, bu yüzden ajan sunucuyu her başlattığında `npx`, npm'de sunucunun daha yeni bir sürümü olup olmadığını denetler.
Zaten çalışan bir sunucu, ajan onu yeniden başlatana kadar kendi sürümünde kalır.

Sunucu, bağlanmadan önce düzenleyicinin kullandığı protokol sürümünü denetler.
İkisi farklı olduğunda, okumalar ve `erd_list_documents` aracı dahil o düzenleyiciye ulaşan her çağrı `protocolMismatch` koduyla reddedilir ve hiçbir şey yazılmaz.
İleti, güncellenmesi gereken tarafı belirtir: sunucu ya da düzenleyicideki ERD Editor; bu, VS Code'da uzantı, Obsidian'da ve bir JetBrains IDE'sinde ise eklentidir.

Sunucunun `1.0.0` veya sonraki bir sürümü, VS Code uzantısının `4.0.0` veya sonraki bir sürümü, Obsidian eklentisinin `1.0.0` veya sonraki bir sürümü ve JetBrains eklentisinin `1.0.0` veya sonraki bir sürümü protokol 2'yi kullanır.
Daha eski her sunucu ve ajanlara hizmet veren daha eski her düzenleyici sürümü protokol 1'i kullanır: VS Code uzantısının `3.0.0` sürümünden `3.1.0` sürümüne kadar olan sürümleri, Obsidian eklentisinin `0.1.0` ve `0.2.0` sürümleri ve JetBrains eklentisinin `0.9.0` ve `0.10.0` sürümleri.
Böyle bir düzenleyici ile sunucunun `1.0.0` veya sonraki bir sürümü birbirini reddeder, daha eski bir sunucu ile protokol 2'yi kullanan bir düzenleyici de öyle.
`3.0.0` sürümünden önceki bir VS Code uzantısı ya da `0.9.0` sürümünden önceki bir JetBrains eklentisi ajanlara hiç hizmet vermez, bu yüzden ajan diskteki dosyaları, o düzenleyicide açık olan bir diyagramı bile düzenler.

| Kombinasyon | İletinin sonu |
| --- | --- |
| Sunucunun `1.0.0` veya sonraki bir sürümü ile protokol 1'i kullanan bir uzantı veya eklenti | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Daha eski bir sunucu ile protokol 2'yi kullanan bir uzantı veya eklenti | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Sunucuyu ve uzantıyı ya da eklentiyi birlikte güncelleyin.
Aynı protokolü kullanan bir sunucu ve düzenleyici, hangisi daha eski olursa olsun bağlanır, ancak mantıksal adlar, değer alanları ve sözlükler için araçlar yalnızca sunucunun `1.1.0` veya sonraki bir sürümünde bulunur. [Sözlükler](./tools.md#dictionaries) bölümüne bakın.
Bu araçların yazdığı mantıksal adları, değer alanı bağlantılarını ve sözlük satırlarını yalnızca VS Code uzantısının `4.2.0` veya sonraki bir sürümü ile Obsidian ve JetBrains eklentilerinin `1.2.0` veya sonraki bir sürümü gösterir ve korur.
Bağlanan daha eski bir uzantı veya eklenti bunları yok sayar, ancak ajanın çağrısı başarılı olur.
Yine de sözlüklerin türettiği fiziksel adları ve değer alanlarının verdiği veri türlerini uygular.
`1.1.0` sürümünden önceki bir sunucu bir dosyayı mantıksal adları, değer alanı bağlantıları ve sözlük satırları olmadan okur ve dosyayı diskte düzenlediğinde bunları dışarıda bırakır. [Headless](./live-and-headless.md#headless) bölümüne bakın.

Diyagramların açıldığı her yerde ERD Editor sürümünü de güncelleyin.
VS Code uzantısının `4.2.0` sürümünden önceki, Obsidian eklentisinin `1.2.0` sürümünden önceki ve JetBrains eklentisinin `1.2.0` sürümünden önceki sürümleri, daha yeni bir sürümün kaydettiği ya da ajanın diskte düzenlediği bir diyagramı tablolarının ve sütunlarının mantıksal adları, sütunlarının değer alanı bağlantıları ve sözcükleri, terimleri ve değer alanları olmadan açar.
Bu sürümler dosyayı kaydettiklerinde bunları dışarıda bırakır.
VS Code uzantısının `4.0.0` sürümünden önceki, Obsidian eklentisinin `1.0.0` sürümünden önceki ve JetBrains eklentisinin `1.0.0` sürümünden önceki sürümleri ayrıca böyle bir diyagramı birincil anahtar simgeleri olmadan gösterir ve dosyayı kaydettiklerinde dosyanın tablo gruplarını ve Şema SQL betiklerini atar.
VS Code uzantısının `3.1.0` sürümünden önceki, Obsidian eklentisinin `0.2.0` sürümünden önceki ve JetBrains eklentisinin `0.10.0` sürümünden önceki sürümleri de dosyayı kaydettiklerinde bir diyagramın ON DELETE ve ON UPDATE eylemlerini atar.
Obsidian'da eklentiyi güncelledikten sonra uygulamayı yeniden başlatın: O zamana kadar bir kasa penceresi, ilk yüklediği eklenti sürümündeki ERD Editor ile çalışmaya devam eder.
