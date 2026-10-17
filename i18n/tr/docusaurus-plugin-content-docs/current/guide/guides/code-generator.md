---
sidebar_position: 12
description: Diyagramdan yirmi iki hedef için kod oluşturma, seçenekler panelinde dili, veritabanını, ad biçimini ve tırnağı seçme, hangi hedeflerin bir ilişkinin ON DELETE ve ON UPDATE eylemlerini yazdığını görme, sonucu kaydetme veya kopyalama.
---

# Kod oluşturucu

Araç çubuğunda `Code Generator` sekmesine geçin. Sekme, solda belgenin tamamının kodunu, sağında ise dili, veritabanını, ad biçimlerini ve bazı hedefler için tırnağı seçtiğiniz, `Code Generator` başlıklı bir seçenekler panelini gösterir.  
Panel, sekme ilk açıldığında düzenleyici 640 px genişlikten dar değilse kendiliğinden açılır. Panelin üst kısmındaki `Hide options` düğmesi paneli daraltır, kodun sağ üst köşesindeki `Show options` düğmesi ise geri getirir. Panel, düzenleyici açık kaldığı sürece sekme geçişlerinde açık ya da daraltılmış kalır, Şema SQL sekmesinin panelinden bağımsızdır ve asla dosyaya kaydedilmez.

Bağlam menüsünü açmak için koda sağ tıklayın: `Language`, `Database`, `Table Name Case`, `Column Name Case` ve `Bracket` (yalnızca `Doctrine`, `JPA` ve `SeaORM` için) öğelerinin her biri geçerli değeri işaretli gösteren bir alt menü açar, ardından paneli daraltan ya da açan ve panel görünürken işaretli olan `Options panel` ile `Save file` gelir.  
Bu sekme açıkken [Hızlı arama](./quick-search.md) `Database`, `Bracket` (yalnızca `Doctrine`, `JPA` ve `SeaORM` için), `Language`, `Table Name Case`, `Column Name Case` ve paneli daraltan ya da açan `Code Generator: Options panel` öğelerini sunar.

![Kodun bağlam menüsünden TypeScript'i, ardından Rust'ı seçme, seçenekler panelinde sütun adlarını Snake biçimine geçirme ve kodu kopyalama](/img/demo-code-generator.webp)

[Tablo özelliklerinin](./table-related-functions.md#table-properties) `Code Generator` sekmesi de aynı kod görünümüdür ve orada belgenin tamamı yerine yalnızca o tek tablo için kod oluşturur. Orada seçenekler paneli yoktur, bağlam menüsü ise aynı ayarları değiştirir ancak `Options panel` ve `Save file` öğelerini içermez.  
Belgenin tamamının kodu içe aktarma ifadeleriyle veya bir başlıkla başlıyorsa, tek tablonun kodu da bunlardan o tablonun ihtiyaç duyduklarıyla başlar: örneğin `PHP` için `<?php`, `Swift` için `import Foundation` veya `JSON Schema` için `$schema`.

Kod, sekme açıldığında yazılır ve dil, veritabanı, bir ad biçimi veya tırnak her değiştiğinde yeniden yazılır. Sekme açıkken diyagramda yapılan bir düzenleme, örneğin bir ortak çalışanın veya bir kodlama ajanının düzenlemesi, sekmeden çıkıp geri döndüğünüzde ya da bu ayarlardan biri değiştiğinde görünür.

## Seçenekler paneli {#options-panel}

Panel, `Saved in the document` başlık yazısının altında `Language`, `Database`, `Table Name Case` ve `Column Name Case` öğelerini, dil `Doctrine`, `JPA` veya `SeaORM` olduğu sürece de ardından `Bracket` öğesini listeler. Her biri bir açılır listedir ve bir değişiklik kodu hemen yeniden yazar.  
Seçili dil `Database` ayarını veya ad biçimlerini yok saydığında, bunlar altlarında `Not used by DBML` gibi bir bilgi notuyla soluk olarak panelde kalır ve yine de değiştirilebilir.  
`Save file` ve `Copy` düğmeleri panelin alt kısmında yer alır. [Sonucu kaydetme veya kopyalama](#saving-or-copying-the-result) bölümüne bakın.

Bunlar, bağlam menüsünün ve Hızlı aramanın da değiştirdiği, diyagramın kendi ayarlarıdır. `Database` her düzenleme gibi dosyaya kaydedilir.  
`Language`, `Table Name Case`, `Column Name Case` ve `Bracket` yalnızca Ayarlar sekmesindeki kendi kilitleri (`Bracket` için `Bracket Type`) devre dışıyken kaydedilir ve yeni bir diyagramda tüm kilitler etkindir. Kilit etkinken yapılan bir değişiklik ekranınızdaki kodu yeniden yazar, ancak dosya kilitli değeri korur ve diyagram bu değerle yeniden açılır. Panel bir kilide dair hiçbir işaret göstermez; bir seçimi dosyada tutmak için o seçimin kilidini devre dışı bırakın. [Kilit](./settings.md#lock) bölümüne bakın.

## Dil {#language}

Yirmi iki hedef desteklenir ve bunlar üç grupta – diller, ORM'ler, ardından şemalar – her grup kendi içinde alfabetik sırada olmak üzere listelenir. Panelin listesi ve bağlam menüsü gruplar arasına bir çizgi çeker, ancak hiçbirine ad vermez:

| Hedef | Grup | İlişkiler | Dizinler | ON DELETE / ON UPDATE | Dosya uzantısı |
| --- | --- | --- | --- | --- | --- |
| `C#` | Dil | — | — | — | `.cs` |
| `Go` | Dil | — | — | — | `.go` |
| `Java` | Dil | — | — | — | `.java` |
| `Kotlin` | Dil | — | — | — | `.kt` |
| `PHP` | Dil | — | — | — | `.php` |
| `Rust` | Dil | — | — | — | `.rs` |
| `Scala` | Dil | — | — | — | `.scala` |
| `Swift` | Dil | — | — | — | `.swift` |
| `TypeScript` | Dil | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Yalnızca ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Yalnızca benzersiz olanlar | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Şema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Şema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Şema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Şema | — | — | — | `.json` |
| `Mermaid` | Şema | ✓ | — | — | `.mmd` |
| `Zod` | Şema | — | — | — | `.ts` |

Varsayılan olarak `GraphQL` seçilidir. Her hedef sütunları üretir; ✓ işaretleri hedefin başka neler ürettiğini gösterir.  
Tablolar tuvaldeki sıralarına göre değil ad sırasına göre üretilir ve dizinler, üzerlerindeki `Keys` satırları değil, [Tablo özelliklerinde](./table-related-functions.md#indexes) `Indexes` altında listelenenlerdir. `SeaORM` yalnızca benzersiz olanları yazar, `Mermaid` ise benzersiz bir sütunu `UK` olarak işaretler ancak hiç dizin yazmaz.  
`Java`, `AML`, `DBML` ve `Mermaid` dışındaki her hedef, bir birincil anahtar sütununu üzerinde `Not Null` ayarlı olsun ya da olmasın NULL olamaz olarak yazar. `Java` hiçbir sütunu NULL olabilir ya da NULL olamaz diye işaretlemez, `AML`, `DBML` ve `Mermaid` ise bayrağı diyagramdaki hâliyle korur.

Bazı hedeflerin yazdıkları:

- `PHP`: `<?php` ve `declare(strict_types=1);` ile başlayan, türü belirtilmiş public özelliklerden oluşan düz sınıflar.
- `Doctrine`: DBAL 4.2 veya sonraki bir sürüm için öznitelikli Doctrine ORM 3 varlıkları, her sütun seçili veritabanına göre kendi DBAL türü ve seçenekleriyle.
- `Rust`: her tablo için, türleri `chrono::NaiveDateTime` veya `rust_decimal::Decimal` gibi tam yollarıyla yazılmış, `use` satırı olmayan bir `pub struct`.
- `SeaORM`: dense biçimindeki SeaORM 2.0 varlıkları, her tablo bir `pub mod` olarak, böylece metnin tamamı tek bir dosya olarak derlenir.
- `Swift`: her tablo için, Swift 6.1 veya sonraki bir sürüm gerektiren `Codable`, `Hashable`, `Sendable` bir struct.
- `TypeScript`: her tablo için, `Zod` şemasının yaptığı gibi satırı JSON olarak tanımlayan bir `export interface` – bir tarih ya da saat `string`, NULL olabilen bir sütun ise `T | null` olur.
- `Zod`: her tablo için bir Zod 4 satır şeması ve bu şemanın çıkarsadığı tür, ekleme şeması ve ilişkiler olmadan.
- `JSON Schema`: `$defs` altında her tablo için bir satır şeması bulunan tek bir JSON Schema draft 2020-12 belgesi.
- `Mermaid`: GitHub'ın görüntülediği türden bir `erDiagram`. Her tablo, her sütunu türü ve varsa `PK`, `FK` veya `UK` işaretiyle listeleyen bir varlık, her ilişki ise iki tablosu arasındaki bir çizgidir.

`AML`, `DBML` ve `GraphQL` gidiş-dönüş biçimleridir: Her biri aynı zamanda bir içe aktarma kaynağıdır. [Dosyaları içe veya dışa aktarma](./file-import-export.md) sayfasına bakın. Diğer şemalar, yani `JSON Schema`, `Mermaid` ve `Zod`, yalnızca çıktıdır.  
`DBML`, her tablonun rengini `headercolor` olarak yazar ve belgenin tamamının kodunda, tablo içeren her [tablo grubu](./table-groups.md) için `Ref` tanımlarından sonra bir `TableGroup` bloğu yazar. `AML` ise bir tablonun rengini AML'in renk adlarından en yakını olarak yazar.

## ON DELETE ve ON UPDATE {#on-delete-and-on-update}

Bir ilişkinin ON DELETE ve ON UPDATE eylemleri, ilişkinin bağlam menüsünden ayarlanır. [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) bölümüne bakın.  
[Dil](#language) tablosunun `ON DELETE / ON UPDATE` sütununda ✓ bulunan hedefler, bir ilişkinin ayarladığı eylemleri yazar; `Not set` olarak bırakılan bir eylem hiçbir şey yazmaz.  
ORM hedeflerinin hangi eylemleri koruduğu seçili veritabanına bağlıdır, `AML` ve `DBML` ise hepsini korur. [Veritabanı](#database) bölümüne bakın.

- `Doctrine`, Doctrine'de ON UPDATE bulunmadığından yalnızca ON DELETE yazar. Sahip tarafın `ManyToOne` veya `OneToOne` ilişkisindeki her `#[ORM\JoinColumn]` özniteliğine `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]` örneğindeki gibi `onDelete: 'CASCADE'` ekler, ters taraftaki `OneToMany` veya `OneToOne` ilişkisine ise hiçbir şey eklemez. Birincil anahtar olmayan benzersiz bir sütuna giden bir ilişki, Doctrine'in ilişkilendirme olmadan eşlediği düz sütunlar olarak kalır, bu yüzden hiçbir eylem yazmaz.
- `Drizzle` bunları küçük harfle yazar. `.references()` çağrısında bunlar `{ onDelete: "cascade", onUpdate: "set null" }` gibi seçeneklerdir; çok sütunlu bir anahtarın aldığı `foreignKey()` çağrısında ise `.onDelete("restrict").onUpdate("no action")` gibi zincirlenir.
- `SeaORM` bunları alt tablonun `belongs_to` ilişkisine, önce ON UPDATE olmak üzere, SeaORM'un `NoAction`, `Cascade`, `SetNull`, `SetDefault` ve `Restrict` adlarıyla, `on_update = "Cascade", on_delete = "SetNull"` örneğindeki gibi yazar. Üst tablonun `has_one` veya `has_many` ilişkisi hiçbirini almaz.
- `Sequelize`, `onDelete: "CASCADE"` ve `onUpdate` girdilerini her iki ilişkilendirme çağrısına da yazar: `hasMany` veya `hasOne` ile `belongsTo`. Çok sütunlu bir anahtar hiç ilişkilendirme çağrısı almaz, bu yüzden `Sequelize` onun için hiçbir eylem yazmaz.
- `SQLAlchemy`, `ondelete="CASCADE"` ve `onupdate` argümanlarını tek sütunlu bir anahtar için `ForeignKey()` çağrısına, çok sütunlu bir anahtar için ise `ForeignKeyConstraint()` çağrısına geçirir.
- `TypeORM`, `onDelete: "CASCADE"` ve `onUpdate` seçeneklerini sahip tarafın `@ManyToOne` veya `@OneToOne` ilişkisine yazar, ters tarafa asla yazmaz. `SET DEFAULT` eylemini her zaman dışarıda bırakır, çünkü TypeORM onu hiçbir veritabanının kabul etmediği `DEFAULT` olarak yazardı.
- `DBML`, `Ref` tanımına `[delete: set null, update: no action]` gibi ayarlar ekler.
- `AML`, eylemi olan bir ilişkiyi sütununda satır içi yazmak yerine `{onDelete: cascade, onUpdate: "set null"}` gibi özelliklere sahip bağımsız bir `rel` ifadesi olarak yazar.

`JPA` hiçbirini yazmaz: Düz JPA'da bunlar için bir seçenek yoktur ve oluşturucu Hibernate'in `@OnDelete` anotasyonunu kullanmaz. `Mermaid` de hiçbirini yazmaz, çünkü bir `erDiagram` satırında bunlara yer yoktur.  
Tek bir tabloyu gösteren Tablo özelliklerinin `Code Generator` sekmesinde `DBML` hiç `Ref`, `AML` de hiç `rel` ifadesi yazmaz, bu yüzden ikisi de orada eylemleri göstermez; `AML`, eylemi olan tek sütunlu bir ilişkiyi, eylemi olmayan bir ilişkide yaptığı gibi sütununda satır içi tutar. `Mermaid` orada hiç ilişki çizgisi yazmaz. `Doctrine` ve `SeaORM` orada belgenin tamamındakiyle aynı varlığı eylemler dahil yazar.

## Ad biçimi {#name-case}

`Table Name Case` ve `Column Name Case` ayarlarının her biri `Pascal`, `Camel`, `Snake` ve `None` değerlerini destekler.  
Varsayılan değerler tablo adları için `Pascal`, sütun adları için `Camel` olur. `None`, bir adı diyagramda yazıldığı gibi üretir.  
Her biçimde, hedefin dilinin ayırdığı bir ad, o dilin kaçış uygulayabildiği yerde `C#` dilindeki `@class` veya `Rust` dilindeki `r#type` gibi kaçışla yazılır, uygulayamadığı yerde ise `Java` dilindeki `class_` gibi yeniden adlandırılır.

`AML`, `DBML` ve `Mermaid` iki ayarı da yok sayar ve adları her zaman diyagramdaki gibi üretir.  
`SeaORM` de bunları yok sayar: Alanları ve modülleri SeaORM'un geri okuduğu biçim olan snake case ile adlandırır, saklanan adları ise `table_name` içinde ve farklı olduklarında `column_name` içinde verir.  
Bu dört hedef için panel, iki listeyi de altlarında `Not used by` bilgi notuyla soluk gösterir.

## Veritabanı {#database}

Veri türleri seçili veritabanına göre çözümlenir. [Veritabanları](./table-related-functions.md#databases) bölümüne bakın.  
Bu sekmede veritabanını panelin `Database` listesinden, bağlam menüsündeki `Database` öğesinden veya Hızlı aramadan seçin, kod hemen yeniden yazılır. Bu, diyagramın tek veritabanı ayarıdır ve tuvalin bağlam menüsü ile [Şema SQL](./schema-sql.md) sekmesinin ayarladığı ayarla aynıdır, bu yüzden burada yapılan bir değişiklik orada da görünür.  
`Drizzle` lehçesini aynı ayardan alır: PostgreSQL için `pgTable`, MySQL ve MariaDB için `mysqlTable`, SQLite için `sqliteTable`, diğer her veritabanı için `pgTable`.  
`SeaORM`, SeaORM'un aksi hâlde PostgreSQL, MySQL, MariaDB veya SQLite üzerinde farklı bir sütun türü oluşturacağı yerlerde bir `column_type` yazar, SeaORM'un arka ucu olmayan MSSQL, Oracle, Snowflake veya Databricks üzerinde ise hiç yazmaz.

Seçili veritabanı, ORM hedeflerinin hangi ON DELETE ve ON UPDATE eylemlerini yazacağını da belirler.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` ve `TypeORM`, o veritabanının Şema SQL'inin dışarıda bıraktığı her eylemi, örneğin MySQL ve MariaDB'de `SET DEFAULT`, MSSQL'de `RESTRICT` ya da Snowflake ve Databricks'te `NO ACTION` dışındaki her eylemi dışarıda bırakır, böylece veritabanının varsayılanı geçerli olur. Tam liste [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) bölümündedir.  
`Drizzle` ise bunun yerine yazdığı lehçeyi izler: `mysqlTable` kodu `SET DEFAULT` eylemini dışarıda bırakır, `pgTable` ve `sqliteTable` kodu ise MSSQL, Oracle, Snowflake ve Databricks için yazdığı `pgTable` kodu dahil her eylemi korur.

`AML`, `DBML` ve `Mermaid` ise istisnadır: Her veri türünü diyagramda yazıldığı gibi üretirler, bu yüzden veritabanı ayarı çıktılarını değiştirmez ve panel onlar için `Database` listesini soluk gösterir. `AML` ve `DBML` bir ilişkinin ayarladığı her eylemi yazar, `Mermaid` ise hiçbirini yazmaz.

## Tırnak {#bracket}

`Bracket`, panelde, bağlam menüsünde ve Hızlı aramada yalnızca dil `Doctrine`, `JPA` veya `SeaORM` iken sunulur.  
Şema SQL sekmesindeki tırnakla aynı ayardır, bu yüzden burada yapılan bir değişiklik Şema SQL'in adları nasıl tırnak içine aldığını da değiştirir. [Şema SQL](./schema-sql.md#database-and-bracket) bölümüne bakın. `SingleQuote`, `DoubleQuote`, `Backtick` ve `None` seçeneklerini sunar ve `None` ile başlar.

- `Doctrine`: `None` dışındaki herhangi bir tırnak seçiliyken her tablo, sütun ve birleştirme sütunu adı, Doctrine'in tırnak içine alınacak bir adı işaretleme yolu olan ters tırnaklar arasına alınır, örneğin ``#[ORM\Table(name: '`order`')]``. `None` seçiliyken yalnızca buna ihtiyaç duyan bir ad ters tırnaklar arasına alınır: bir veritabanının ayırdığı bir sözcük, düz bir ASCII tanımlayıcısı olmayan bir ad ya da tırnak içinde yazılmış bir ad.
- `JPA`: `None` dışındaki herhangi bir tırnak seçiliyken, ayrılmış sözcük olan bir tablo adı `@Table` içinde tırnağa alınır, örneğin `@Table(name = "\"user\"")`. `None` seçiliyken, Şema SQL'in bıraktığı gibi tırnaksız bırakılır.
- `SeaORM`: `None` seçiliyken adlar veritabanının sakladığı gibi yazılır: Noktalı bir tablo adı `schema_name` ve `table_name` olarak ayrılır, PostgreSQL'de ise tırnaksız bir ad küçük harfe dönüştürülür. Diğer herhangi bir tırnak seçiliyken ad, yazıldığı gibi bütün olarak korunur.

## Sonucu kaydetme veya kopyalama {#saving-or-copying-the-result}

Seçenekler panelinin alt kısmındaki veya bağlam menüsündeki `Save file`, gösterilen kodu bir dosya olarak kaydeder.  
Dosya her dışa aktarma gibi adlandırılır: `<database name>-<timestamp>` ve ardından [Dil](#language) tablosundaki uzantı, örneğin `shop-2026-10-12T04_05_06.ts`. Ana uygulamanızda her dışa aktarmanın gittiği yere gider. [Dışa aktarma](./file-import-export.md#exporting) bölümüne bakın. `Java` ve `JPA`, sekmenin gösterdiği gibi tüm sınıfları tek bir `.java` dosyasına koyar.  
Dışa aktar menüsünde Kod oluşturucu öğesi yoktur ve Tablo özelliklerinin `Code Generator` sekmesi dosya kaydedemez.

Kodu kopyalamak için panelin alt kısmındaki `Copy` düğmesine tıklayın ya da kodun üzerine gelip sağ üst köşesindeki, Tablo özelliklerindeki tek yol olan kopyalama düğmesine tıklayın.  
Onay işaretli bir `Copied!` bildirimi bunu iki saniye boyunca doğrular. Tarayıcı veya ana uygulama panoya erişimi reddederse, bunun yerine uyarı işaretli bir `Couldn't copy to the clipboard` bildirimi bunu belirtir. Yeniden kopyalamak yeni bir bildirim eklemek yerine mevcut bildirimi değiştirir.  
Metin ayrıca seçilebilir, böylece yalnızca ihtiyacınız olan kısmı alabilirsiniz.
