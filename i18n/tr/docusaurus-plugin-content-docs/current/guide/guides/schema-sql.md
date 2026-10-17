---
sidebar_position: 11
description: Şema SQL sekmesinde diyagramın DDL'ini okuma, seçenekler panelinde veritabanını, tırnak türünü, ifadeleri, başlığı ve tabloları seçme, tablolardan önce ve sonra kendi betiklerinizi ekleme, SQL'i kaydetme veya kopyalama.
---

# Şema SQL

`Schema SQL` sekmesi, diyagramın seçili veritabanına göre DDL'ini gösterir: diyagramın tablolarını anahtarları, dizinleri ve yabancı anahtarlarıyla birlikte oluşturan SQL.  
Araç çubuğunda `Schema SQL` sekmesine geçin veya [Hızlı aramada](./quick-search.md) `Tab` altında `Schema SQL` öğesini seçin. `Export` alt menüsünden `Schema SQL` öğesini seçmek de sekmeyi kaydetmeye hazır olarak açar. [SQL'i kaydetme veya kopyalama](#saving-or-copying-the-sql) bölümüne bakın.

SQL solda yer alır, sağında ise `Schema SQL` başlıklı bir seçenekler paneli SQL'i biçimlendiren seçimleri tutar. [Seçenekler paneli](#options-panel) bölümüne bakın. Sağdan sola yazılan bir görüntüleme dilinde de SQL solda kalır ve soldan sağa okunur.  
Panel, sekme ilk açıldığında düzenleyici 640 px genişlikten dar değilse kendiliğinden açılır. Panelin başlık satırındaki `Hide options` düğmesi paneli daraltır, kodun sağ üst köşesindeki `Show options` düğmesi ise geri getirir. Ardından panel, düzenleyici açık kaldığı sürece sekme geçişlerinde de bıraktığınız gibi açık ya da daraltılmış kalır. Kod oluşturucu sekmesinin panelinden bağımsız olarak daraltılır ve açılır, asla dosyaya kaydedilmez.

![Export > Schema SQL öğesini açma, ifadeleri Drop & re-create, başlığı USE olarak değiştirme, ardından tablolardan önce bir SET NAMES betiği ekleme](/img/demo-schema-sql-options.webp)

Bağlam menüsünü açmak için SQL'e sağ tıklayın:

- `Database` ve `Bracket`, her biri geçerli değeri işaretli gösteren bir alt menü.
- `Statements` ve `Header`, her biri etkin seçimi işaretli gösteren bir alt menü. Veritabanının desteklemediği bir seçim, `not in Oracle` gibi soluk bir bilgi notu taşır ve hiçbir şey yapmaz.
- `Options panel`, panel görünürken işaretli olan ve paneli daraltan ya da açan öğe.
- `Save file`

Bu sekme açıkken Hızlı arama şunları sunar: `Database` ve `Bracket`; yalnızca veritabanının desteklediği seçimleri listeleyen `Schema SQL: Statements` ve `Schema SQL: Header`; paneli daraltan ya da açan `Schema SQL: Options panel`.

SQL, sekme açıldığında yazılır ve panelin seçimlerinden biri, veritabanı adı veya bir betik her değiştiğinde yeniden yazılır. Sekme açıkken tablolarda yapılan bir düzenleme, örneğin bir ortak çalışanın veya bir kodlama ajanının düzenlemesi, sekmeden çıkıp geri döndüğünüzde ya da bunlardan biri değiştiğinde görünür.

[Tablo özelliklerinin](./table-related-functions.md#table-properties) tek bir tablonun DDL'ini gösteren kendi `Schema SQL` sekmesi vardır. Bu sekme her zaman başlık veya betik olmadan düz `CREATE` ifadeleri yazar, seçenekler paneli yoktur ve bağlam menüsü yalnızca `Database` ve `Bracket` öğelerini sunar.

## Seçenekler paneli {#options-panel}

Panel, her biri kendi başlık yazısının altında olan üç grup tutar:

1. `Saved in the document`: `Database` ve `Bracket`. [Veritabanı ve tırnak](#database-and-bracket) bölümüne bakın.
2. `This window only`: `Statements`, `Header` ve diyagramda bir [tablo grubu](./table-groups.md) olduğu sürece `Tables`. [İfadeler](#statements), [Başlık](#header) ve [Tablolar](#tables) bölümlerine bakın.
3. `Saved in the document · written as is for every database`: `Before tables` ve `After tables` betikleri. [Önceki ve sonraki betikler](#before-and-after-scripts) bölümüne bakın.

`Save file` ve `Copy` düğmeleri panelin alt kısmında yer alır. [SQL'i kaydetme veya kopyalama](#saving-or-copying-the-sql) bölümüne bakın.

`This window only` altındaki seçimler, onları yaptığınız düzenleyici penceresine aittir. Belgeye kaydedilmez, ortak çalışanlarla paylaşılmaz, geri alma geçmişine de eklenmez ve düzenleyici kapatıldığında ya da yeniden yüklendiğinde sıfırlanır; sekme değiştirmek ise onları korur.  
`Statements` seçeneği `If not exists`, `Header` seçeneği ise `CREATE + USE` değeriyle başlar. Düzenleyiciyi gömen bir sayfanın [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) yöntemiyle okuduğu SQL ve bir kodlama ajanının okuduğu SQL ise bunun yerine başlık olmadan `Create` ile başlar.

Seçili veritabanının desteklemediği bir seçim, `Not in Oracle` gibi bir `Not in <database>` araç ipucuyla soluk olarak panelde kalır ve ona basmak hiçbir şey yapmaz.  
SQL bu durumda veritabanının desteklediği en yakın biçimi kullanır ve o biçimin düğmesi basılı görünür: `If not exists` yerine `Create`, `CREATE + USE` yerine `USE` ya da veritabanında `USE` de yoksa `None`, `USE` yerine de `None` kullanılır. Seçiminiz korunur, bu yüzden onu destekleyen bir veritabanına geçmek seçimi geri getirir.

## Veritabanı ve tırnak {#database-and-bracket}

`Database`, diyagramın veritabanıdır ve tuvalin bağlam menüsündeki `Database` öğesiyle ve Kod oluşturucudakiyle aynı ayardır. [Veritabanları](./table-related-functions.md#databases) bölümüne bakın. Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake ve SQLite seçeneklerini listeler, MySQL ile başlar ve her düzenleme gibi dosyaya kaydedilir.

`Bracket`, tablo, sütun, kısıtlama ve dizin adlarının çevresine konan tırnağı belirler: `SingleQuote`, `DoubleQuote`, `Backtick` ya da hiç tırnak kullanılmaması için varsayılan değer olan `None`. Kod oluşturucudakiyle aynı ayardır. [Tırnak](./code-generator.md#bracket) bölümüne bakın.  
Adları yalnızca çift tırnak içine alan Snowflake, `None` dışındaki her seçimde çift tırnak kullanır, Databricks ise adları her zaman ters tırnak içine alır.  
`Bracket`, yalnızca Ayarlar sekmesindeki `Bracket Type` kilidi devre dışıyken dosyaya kaydedilir ve yeni bir diyagramda tüm kilitler etkindir. Kilit etkinken yapılan bir değişiklik ekranınızdaki SQL'i yeniden yazar, ancak dosya kilitli değeri korur ve diyagram bu değerle yeniden açılır. [Kilit](./settings.md#lock) bölümüne bakın.

Veritabanı Oracle iken SQL, Oracle 12.1 ve daha eski sürümlerin reddettiği 30 bayttan uzun bir ad içeriyorsa, iki listenin altındaki bir bilgi notu bu adların her birini belirtir: `Oracle 12.2+ for names over 30 bytes: <names>`. Bilgi notu tablo, sütun, şema, anahtar, dizin, dizi ve tetikleyici adlarını denetler. SQL'in kendisi değişmez.

## İfadeler {#statements}

`Statements`, tabloların nasıl oluşturulacağını belirler:

- `Create` düz `CREATE` ifadeleri yazar.
- `If not exists` zaten var olan tabloları ve dizinleri atlar. MySQL, MariaDB, PostgreSQL, SQLite ve Databricks bunu destekler; MSSQL, Oracle ve Snowflake bunun yerine `Create` yazar.
  - MySQL her tabloyu benzersiz kısıtlamaları, dizinleri ve yabancı anahtarları içinde olacak şekilde `CREATE TABLE IF NOT EXISTS` olarak yazar ve tüm ifadeleri `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` ile `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;` arasına koyar.
  - MariaDB her ifadeye `IF NOT EXISTS` ekler: `CREATE TABLE` ifadesine, her `UNIQUE` ve `FOREIGN KEY` kısıtlamasına ve her `CREATE INDEX` ifadesine.
  - PostgreSQL `CREATE TABLE IF NOT EXISTS` ve `CREATE INDEX IF NOT EXISTS` yazar, her yabancı anahtarı yeniden eklemeden önce `DROP CONSTRAINT IF EXISTS` ile siler.
  - SQLite `CREATE TABLE IF NOT EXISTS` ve `CREATE INDEX IF NOT EXISTS` yazar.
  - Databricks `CREATE TABLE IF NOT EXISTS` yazar ve her yabancı anahtarı yeniden eklemeden önce `DROP CONSTRAINT IF EXISTS` ile siler.
- `Drop & re-create`, Snowflake dışında, yazdığı her tabloyu yeniden oluşturmadan önce siler. Her veritabanı bunu destekler:
  - MySQL ve MariaDB, yabancı anahtar denetimlerini kapatıp yeniden açan aynı iki satırın arasında her tablo için bir `DROP TABLE IF EXISTS` yazar.
  - PostgreSQL her tabloyu adlandıran tek bir `DROP TABLE IF EXISTS` yazar; listenin dışındaki bir tablo bunlardan birine başvuruyorsa bu ifade başarısız olur. `CREATE + USE` başlığı altında, adında şema belirtilmeyen bir tablo o şemadan silinir, örneğin `shop.member` olarak.
  - MSSQL, düğmenin `SQL Server 2016+` araç ipucunun belirttiği gibi SQL Server 2016 veya sonraki bir sürüm gerektiren tek bir işlem yazar. Önce yazılan tabloların tuttuğu yabancı anahtarları, ardından tek bir `DROP TABLE IF EXISTS` ile tabloları siler ve bir hata oluşursa işlemi geri alır. Listenin dışındaki bir tablonun tuttuğu bir yabancı anahtar silmeyi yine de engeller.
  - SQLite, o bağlantı için yabancı anahtarları kapalı bırakan `PRAGMA foreign_keys=OFF;` ifadesini, ardından her tablo için bir `DROP TABLE IF EXISTS` yazar.
  - Oracle her tablo için `DROP TABLE … CASCADE CONSTRAINTS`, her otomatik artırma dizisi için `DROP SEQUENCE` yazar; her biri, bir `/` satırıyla biten ve tablo ya da dizi bulunmadığında oluşan hatayı yok sayan bir PL/SQL bloğu içindedir.
  - Databricks her tablo için bir `DROP TABLE IF EXISTS` yazar.
  - Snowflake hiçbir şeyi silmez, bunun yerine `CREATE OR REPLACE TABLE` yazar.

`Drop & re-create` etkinken paneldeki bir uyarı sildiği tabloları belirtir: `Drops <tables> before creating them. Their rows are lost.`, Snowflake'te ise `Replaces <tables>. Their rows are lost.`  
En fazla beş tablo tam olarak adlandırılır. Beşi aştığında uyarı ilk dört tabloyu adlandırır ve kalanların sayısını verir, örneğin `a, b, c, d, and 3 more tables`.

## Başlık {#header}

`Header`, SQL'i çalıştığı veritabanını veya şemayı oluşturan ya da seçen ifadelerle başlatır. Kullanılan ad, araç çubuğundaki `database name` alanına yazılan, diyagramın veritabanı adıdır ve `Bracket` karakteriyle tırnak içine alınır.

- MySQL ve MariaDB: `USE`, `USE shop;` yazar, `CREATE + USE` ise bunun önüne `CREATE DATABASE IF NOT EXISTS shop;` yazar.
- MSSQL: `USE`, `USE shop` ve `GO` yazar, `CREATE + USE` ise bunların önüne `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` ve `GO` yazar.
- PostgreSQL yalnızca `CREATE + USE` seçeneğini destekler, bu seçenek `CREATE SCHEMA IF NOT EXISTS shop;` ve `SET search_path TO shop, public;` yazar.
- Oracle yalnızca `USE` seçeneğini destekler, bu seçenek `ALTER SESSION SET CURRENT_SCHEMA = shop;` yazar. `CREATE + USE` yerine de bu seçenek kullanılır, bu yüzden Oracle'ın sekmenin varsayılan başlığı altında yazdığı satır budur.
- Snowflake ve Databricks: `USE`, `USE SCHEMA shop;` yazar, `CREATE + USE` ise bunun önüne `CREATE SCHEMA IF NOT EXISTS shop;` yazar.
- SQLite ikisini de desteklemez ve başlık yazmaz.

Veritabanı `USE` veya `CREATE + USE` seçeneğini desteklediğinde, düğmenin araç ipucu o veritabanında ne yazdığını belirtir, örneğin PostgreSQL'de `CREATE SCHEMA + SET search_path`.

Başlık yalnızca veritabanı adı basit bir tanımlayıcı olduğu sürece yazılır: bir ASCII harfi (`A`–`Z`, `a`–`z`) veya `_`, ardından ASCII harfleri, rakamlar veya `_`.  
Boş ad da dahil olmak üzere başka herhangi bir adla başlık yazılmaz ve PostgreSQL'in `DROP TABLE` ifadesi de bu durumda şema belirtmez. `None` dışında bir başlık etkinken, `Header` altındaki bir bilgi notu bunu bildirir: `Database name "<name>" is not a valid identifier.`  
Yeni bir diyagramın veritabanı adı boştur, bu yüzden ona bir ad verene kadar panel `Database name "" is not a valid identifier.` bilgi notunu gösterir.

## Tablolar {#tables}

Diyagramda gösterilsin ya da gizlensin en az bir [tablo grubu](./table-groups.md) olduğu sürece, `This window only` altında her seçim için bir onay kutusuyla `Tables` görünür:

- Her kutuyu işaretleyen veya işaretini kaldıran `All`. Yalnızca bazıları işaretliyken karışık bir durum gösterir.
- Diyagramın grup sırasıyla, her tablo grubu için grubun adıyla ya da adı olmayan bir grupta `unnamed` ile etiketlenen ve grubun bir rengi varsa o renkteki bir noktanın ardından gelen birer kutu.
- Hiçbir grupta olmayan tablolar için `No group`.

Tüm kutular işaretliyken sekme diyagramın tamamını yazar.  
Yalnızca bazıları işaretliyken, işaretli kutuların tablolarını dizinleri ve tuttukları yabancı anahtarlarla birlikte yazar; dışarıda bırakılan bir tabloya başvuran bir yabancı anahtar da bunlara dahildir. Önceki ve sonraki betikler yine yazılır, `Drop & re-create`, onun uyarısı ve uzun adlara ilişkin Oracle bilgi notu ise yalnızca bu tabloları kapsar.  
Hiçbir kutu işaretli değilken sekme hiçbir şey yazmaz ve kodun üzerindeki bir ipucunda `No tables chosen. Check some under Tables.` yazar. Bu durumda `Save file` boş bir dosya kaydeder, `Copy` ise boş bir metin kopyalar.

`Statements` ve `Header` seçeneklerinde olduğu gibi bu seçim de pencereye aittir. [Seçenekler paneli](#options-panel) bölümüne bakın.  
Sonradan eklenen bir grup, yalnızca o anda tüm kutular işaretliyse işaretli olarak başlar. Bir grubu kaldırmak kutusunu da kaldırır, son grubu kaldırmak ise her şeyi yeniden işaretler.  
Bu seçim yalnızca bu sekmeye uygulanır. Tablo özelliklerinin `Schema SQL` sekmesi ve `getSchemaSQL()` yöntemi bundan etkilenmez.

## Önceki ve sonraki betikler {#before-and-after-scripts}

`Before tables` ve `After tables`, tablolardan önce `CREATE EXTENSION` veya `SET` ifadeleri, tablolardan sonra ise yetkilendirmeler, görünümler ve başlangıç verileri gibi kendi SQL'inizi tutar.  
Bunlar belgeye kaydedilir; veritabanı ne olursa olsun tüm diyagram için tek bir çift vardır. Her biri SQL'e yazdığınız gibi, hiç denetlenmeden yazılır: önceki betik başlıktan sonra ve `DROP` ifadeleriyle tablolardan önce, sonraki betik ise en sona.

Satır sonları LF olarak yazılır, bir betiğin önündeki boş satırlar ve sonundaki boşluklar atılır.  
MSSQL'de, iki alanın altındaki satırın belirttiği gibi, son satırı `GO` (veya bir sayıyla yazılmış `GO`) olmayan bir betiğin ardından bir `GO` satırı eklenir. Oracle'da bir PL/SQL bloğunu `/` satırıyla kendiniz bitirin.

Alanlar SQL'i vurgular ve metinleriyle birlikte büyür.  
Bir düzenleme, başka bir yere tıklayarak veya sekme değiştirerek alandan çıktığınızda uygulanır ve yanındaki SQL ile belge ancak o zaman değişir. Yalnızca içine tıkladığınız bir alan hiçbir şeyi değiştirmez.  
Bir betik düzenlemesi diyagramı diğer her düzenleme gibi değiştirir: Dosyaya kaydedilir, ortak çalışanlar onu görür ve uygulanan her düzenleme [geri alma geçmişinde](./undo-redo.md), ERD sekmesinden geri alınan tek bir adımdır.  
Bir alana yazarken düzenleyicinin kendi kısayolları alana bırakılır; böylece `Ctrl + Z` (Windows/Linux) veya `⌘ + Z` (Mac) oradaki yazdıklarınızı geri alır, kopyalama, kesme ve yapıştırma da diyagram yerine metin üzerinde çalışır.  
Hızlı arama ve [Gezgindeki arama](./find-and-replace.md) yine kendi kısayollarıyla, `Ctrl + K` ve `Ctrl + F` (Windows/Linux) veya `⌘ + K` ve `⌘ + F` (Mac) ile açılır. `Ctrl + F` veya `⌘ + F` ERD sekmesine geçtiği için, her sekme geçişi gibi düzenlemenizi uygular.  
Klavye odağı olmayan bir alan, bir ortak çalışanın veya bir [kodlama ajanının](../../mcp/tools.md#settings) betiğinde yaptığı değişikliği izler. İçinde bulunduğunuz bir alan, hiçbir şey yazmadan çıktığınızda bu değişikliği gösterir. Bir şey yazdıysanız, çıktığınızda metniniz uygulanır ve onlarınkinin yerini alır.

## SQL'i kaydetme veya kopyalama {#saving-or-copying-the-sql}

Panelin alt kısmındaki veya bağlam menüsündeki `Save file`, tam olarak sekmenin gösterdiği SQL'i geçerli veritabanı, tırnak, ifadeler, başlık, tablolar ve betiklerle birlikte `<database name>-<timestamp>.sql` adıyla kaydeder. Diğer tüm dışa aktarmalar gibi adlandırılır ve kaydedilir. [Dışa aktarma](./file-import-export.md#exporting) bölümüne bakın.

Tuvalin bağlam menüsündeki veya Hızlı aramadaki `Export` ▸ `Schema SQL` tek başına hiçbir şey kaydetmez.  
Bu sekmeye geçer, daraltılmış olsa bile seçenekler panelini açar ve klavye odağını `Save file` düğmesine verir, böylece `Enter` tuşuna basmak dosyayı kaydeder.

Panelin alt kısmındaki `Copy` ya da kodun üzerine geldiğinizde sağ üst köşesinde beliren kopyalama düğmesi SQL'i kopyalar.  
Onay işaretli bir `Copied!` bildirimi bunu iki saniye boyunca doğrular. Tarayıcı veya ana uygulama panoya erişimi reddederse, bunun yerine uyarı işaretli bir `Couldn't copy to the clipboard` bildirimi durumu bildirir. Yeniden kopyalamak yeni bir bildirim eklemek yerine mevcut bildirimi değiştirir.  
SQL ayrıca seçilebilir, bu yüzden yalnızca bir kısmını alabilirsiniz.

## DDL'in yazdıkları {#what-the-ddl-writes}

Bu kurallar düzenleyicinin Şema SQL yazdığı her yerde geçerlidir: bu sekmede ve dosyasında, ayrıca düzenleyiciyi gömen bir sayfanın veya bir kodlama ajanının okuduğu SQL'de.  
Tablo özelliklerinin `Schema SQL` sekmesi, gösterdiği tek tablo için bu kurallara uyar. `CREATE TABLE` ifadesinin içinde yer alan SQLite yabancı anahtarları dışında yabancı anahtar yazmaz, Oracle dizisi veya tetikleyicisi de yazmaz.

Bölümler, aralarında birer boş satırla şu sırayla gelir: başlık, önceki betik, `DROP` ifadeleri, tablolar ve sonraki betik. Tablolar ad sırasına göre yazılır.  
Tablosu ve betiği olmayan bir diyagram, bir başlık seçili olsa bile hiçbir şey yazmaz.

### Otomatik artırma {#auto-increment}

`Auto Increment` olarak işaretlenmiş bir sütun her veritabanının yazdığı şekilde yazılır: MySQL ve MariaDB'de `AUTO_INCREMENT`, MSSQL'de `IDENTITY(1,1)`, Snowflake'te `AUTOINCREMENT`, PostgreSQL ve Databricks'te `GENERATED ALWAYS AS IDENTITY`.  
Oracle'da bir `SEQ_<table>` dizisi ve sütunu bu diziden dolduran bir `SEQ_TRG_<table>` tetikleyicisi oluşturulur. Tetikleyici bir `/` satırıyla biter, böylece SQL\*Plus ve SQLcl onu çalıştırır.

Bir veritabanı sütunun türünde otomatik artırmayı kabul etmediğinde yan tümce yer almaz ve tablodan sonraki bir yorum satırı sütunu belirtir:

- PostgreSQL bunu yalnızca `smallint`, `integer` veya `bigint` türlerinde, bunların herhangi bir adıyla kabul eder: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` veya `INT8`. Başka türdeki bir sütun ne yan tümceyi ne de bir varsayılan değeri alır ve yorumda örneğin `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.` yazar.
- Databricks bunu yalnızca `BIGINT` veya `LONG` türünde kabul eder.
- SQLite `AUTOINCREMENT` anahtar sözcüğünü yalnızca bir tablonun, genişlik belirtilsin ya da belirtilmesin `INT`, `BIGINT` veya `INT8` gibi tamsayı türündeki tek birincil anahtar sütununda kabul eder. Bu sütun `INTEGER`, anahtar ise `PRIMARY KEY (id AUTOINCREMENT)` olarak yazılır. Başka herhangi bir türdeki tek anahtar bu anahtar sözcük olmadan yazılır.

### Referans eylemleri {#referential-actions}

Her veritabanının hangi ON DELETE ve ON UPDATE eylemlerini yazdığı [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) bölümünde listelenir.  
Snowflake bir eylemi dışarıda bıraktığında, o yabancı anahtarın `ALTER TABLE` ifadesinin üstündeki bir yorum bu eylemi belirtir, örneğin `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Şema nitelikli tablo adları {#schema-qualified-table-names}

`Bracket` değeri `None` iken `sales.users` gibi nokta içeren bir tablo adı, köşeli parantezlerin veya çift tırnakların dışındaki son noktasından bölünerek bir şema ve bir tablo olarak okunur.

- MySQL, MariaDB, MSSQL, Oracle ve PostgreSQL yazdıkları otomatik adları yalnızca tablo kısmından oluşturur: beşinde de `FK_users_TO_orders` ve `IDX_users`, PostgreSQL dışındakilerde `UQ_users_email`, bunlardan birincil anahtara ad veren iki veritabanı olan MSSQL ve Oracle'da ise `PK_users`. Bu ikisinde `[sales].[users]` ve `"sales"."users"` da `PK_users` verir, `[Order]` ise `PK_Order` verir.
- SQLite kısıtlamalara ad vermez, bu yüzden oluşturduğu tek otomatik ad dizinin adıdır: `CREATE INDEX sales.IDX_users ON users`.
- Oracle tablonun dizinlerini ve otomatik artırmalı bir sütunun dizisi ile tetikleyicisini tablonun şemasında oluşturur: `sales.IDX_users`, `sales.SEQ_users` ve `sales.SEQ_TRG_users`.
- Oracle ve SQLite'ta, şemasını kendiniz verdiğiniz bir dizin adı bu şemayı korur.
- Büyük/küçük harf ayrımı yapmadan önceki bir adı tekrarlayan otomatik bir yabancı anahtar veya dizin adı bir numara alır. `orders` tablosundan hem `sales.users` hem de `hr.Users` tablosuna başvurulduğunda ikinci anahtar `FK_Users_TO_orders1` olur.

Başka herhangi bir `Bracket` değerinde tablo adının tamamı tek bir tanımlayıcıdır, örneğin `"PK_sales.users"`. Snowflake ve Databricks adın tamamını her zaman korur.  
[Dizinler](./table-related-functions.md#indexes) sekmesinin `Keys` satırları aynı adları gösterir.

### Varsayılan değerler {#defaults}

Bir sütunun varsayılan değeri yazdığınız gibi yazılır, ancak veritabanı o ifadeyi yalnızca parantez içinde okuyorsa parantez içine alınır. Zaten parantez içinde olan bir varsayılan değer olduğu gibi bırakılır.

- MySQL, bir sabit değer veya geçerli zaman dışındaki her şeyi parantez içine alır, örneğin `(uuid())`. Ayrıca bir `BLOB`, `TEXT`, `JSON`, uzamsal veya `LONG…` sütunundaki `NULL` dışındaki her varsayılan değeri ve `TIMESTAMP` ya da `DATETIME` dışındaki her sütundaki geçerli zamanı da parantez içine alır.
- MariaDB, bir sabit değer, geçerli zaman, bir işlev çağrısı veya bir ad dışındaki her şeyi parantez içine alır.
- SQLite, bir sabit değer veya bir ad dışındaki her şeyi parantez içine alır, örneğin `(datetime('now'))`.
- PostgreSQL yalnızca parantezlerin dışında `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` veya `= ANY` gibi bir sözcük içeren bir ifadeyi parantez içine alır, örneğin `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake ve Databricks her varsayılan değeri yazıldığı gibi yazar.

## Salt okunur düzenleyiciler {#read-only-editors}

`readonly` bir düzenleyicide sekme her zamanki gibi çalışır: `Database` ve `Bracket` gösterilen SQL'i yine değiştirir, `Statements`, `Header` ve `Tables` yine çalışır, `Save file` ve `Copy` de SQL'i yine kaydeder ve kopyalar.  
Yalnızca iki betik alanı salt okunurdur.
