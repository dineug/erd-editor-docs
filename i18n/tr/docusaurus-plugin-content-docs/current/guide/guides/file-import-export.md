---
sidebar_position: 2
description: JSON, Şema SQL, GraphQL, DBML veya AML dosyalarını diyagramın yerine koyarak ya da altına ekleyerek içe aktarma ve JSON'u, Şema SQL'i ya da diyagramı PNG veya SVG görüntüsü olarak dışa aktarma.
---

# Dosyaları içe veya dışa aktarma

## Dış dosyaları içe aktarma {#importing-external-files}

Tuvalin bağlam menüsündeki `Import` alt menüsünden beş biçim içe aktarılabilir:

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import` öğesinin hemen altındaki `Import and Add` öğesi, diyagramı dosyayla değiştirmek yerine dosyayı diyagrama ekler. [İçe aktar ve ekle](#import-and-add) bölümüne bakın.  
Boş bir diyagramın gösterdiği karşılama ekranında aynı beş biçimi sunan bir `Import` satırı bulunur. [Karşılama ekranı](./editing-start.md#welcome-screen) bölümüne bakın.

Uzantılar büyük/küçük harf ayrımı yapılmadan eşleştirilir. Uzantısı seçilen biçimle eşleşmeyen bir dosya seçildiğinde içe aktarma iptal edilir ve `Only <format> files can be imported` iletisi gösterilir. Biçim, `Only sql files can be imported` iletisinde olduğu gibi `json`, `sql`, `graphql`, `dbml` veya `aml` olarak yazılır.

`Import` öğesi dosyayı geçerli belgeyle birleştirmek yerine belgeyi dosyayla değiştirir ve tek bir geri alma önceki diyagramı geri getirir.  
Bir JSON dosyası, [kilitleri](./settings.md#lock) de dahil olmak üzere kendi ayarlarını beraberinde getirir. Dosya sekmeyi, Kod oluşturucu dilini, bir ad biçimini veya tırnak türünü kilitliyorsa, önceden sahip olduğunuz değeri görmeye devam edersiniz, ancak kaydedilen değer dosyanın kilitli değeridir. Görünüm, kilitli olsun ya da olmasın, dosyanın belirttiği konuma geçer. Kilitler henüz yokken kaydedilmiş bir JSON dosyası, tüm kilitler etkin ve görünüm %100'de olacak şekilde içe aktarılır.  
Diğer biçimler kilitler dahil mevcut ayarlarınızı korur; yalnızca görünüm %100'den başlar.  
GraphQL, DBML ve AML ayrıştırıcıları asla başarısız olmaz: Okuyamadıkları bir dosya hata yerine boş bir diyagram üretir.

Bir JSON dosyası içerdiği konumları korur. Bir Şema SQL, GraphQL, DBML veya AML dosyasının tabloları diyagram değişmeden önce yerleştirilir:

- Dosyada iki veya daha fazla tablo ve en az bir ilişki varsa, tablolar [Otomatik düzenin](./table-related-functions.md#auto-layout) `Flow` düzeniyle, tuvalin sol üst köşesinden başlayarak ilişkiler boyunca soldan sağa yerleştirilir. Bir tablodan kendisine giden bir ilişki de sayılır.
- Aksi takdirde tablolar, en az sütunu olanlar önce gelecek şekilde, sol üstten başlayarak satırlara dizilir.
- Düzen hesaplaması 6 saniyeden uzun sürerse `Cancel` düğmesi olan bir `Placing tables` bilgi kutusu görünür. `Cancel` düğmesi ya da bilgi kutusu açıkken `Escape` tuşu düzen hesaplamasını iptal eder ve tabloları bunun yerine satırlara dizer. Düzen hesaplaması başarısız olduğunda, 60 saniye içinde hiçbir düzen sonucu gelmediğinde ya da ana uygulama paylaşımlı worker (SharedWorker) çalıştırmadığında da bilgi kutusu gösterilmeden satırlar kullanılır. [Web Worker'lar](../../api/installation.md#web-workers) bölümüne bakın.

Ardından diyagram tek adımda değiştirilir, böylece arada hiçbir şey görünmez. Tablolar yerleştirilirken değiştirdiğiniz sekme gibi bir ayar korunur ve bu sırada başka bir dosya içe aktarırsanız en son başlatılan içe aktarma geçerli olur.

Salt okunur bir düzenleyici `Import` öğesinden hiçbir şey yüklemez ve `Import and Add` öğesini sunmaz.

### İçe aktar ve ekle {#import-and-add}

`Import and Add` öğesi diyagramı korur ve altına bir dosya ekler. Tuvalin bağlam menüsünde ve ERD sekmesindeki [Hızlı aramada](./quick-search.md) bulunur ve `Import` öğesiyle aynı beş biçimi aynı uzantı denetimiyle sunar.

![Import and Add > Schema SQL üzerinden bir SQL dosyası ekleme, tablolarının ilişkileri boyunca düzenlenip seçili olarak diyagramın altına yerleşmesi](/img/demo-import-and-add.webp)

Dosya, yapıştırma işleminde olduğu gibi eklenir: İçerdiği her tablo, sütun, ilişki, dizin, not ve [tablo grubu](./table-groups.md) yeni bir öğe olarak eklenir, diyagramda zaten bulunan tablolar yerinden oynamaz ve hiçbir ayar değişmez, bu nedenle bir JSON dosyasının ayarları alınmaz.  
Adı diyagramda zaten bulunan bir tablo, mevcut tabloyla birleştirilmez, o adı taşıyan ikinci bir tablo olarak eklenir. İlişkiler ve dizinler yalnızca dosyadan gelir; bu nedenle dosyanın tanımlamadığı bir tabloya başvuran bir yabancı anahtar, diyagramda zaten bulunan bir tabloya bağlanmaz.

Eklenen blok, diyagramın içerdiği her şeyin hemen altına ve onun sol kenarıyla hizalı olarak, boş bir diyagramda ise sol üst köşeye yerleşir. [Görünüm seçenekleriyle](./table-related-functions.md#table-view-options) gizlenen notlar ve tablo grupları da hâlâ orada durdukları için hesaba katılır.  
Blok içinde bir JSON dosyası, tablo grupları da dahil olmak üzere kendi yerleşimini korur. Diğer biçimler `Import` öğesinin yerleştirdiği gibi, aynı kurallarla `Flow` düzeniyle ya da satırlara dizilerek yerleştirilir ve her tablo grubunun kutusu tablolarının çevresine oturtulur. Eklenen tablolar ve notlar, zaten orada bulunan her şeyin üstünde yer alır.

Blok yerleştiğinde yalnızca eklenenler seçilir: yeni tablolar, ayrıca gösterildikleri sürece yeni notlar ile tablo grupları. Bu sırada başka bir sekmeye geçtiyseniz, düzenleyici blok yerleşmeden önce ERD sekmesine geri döner. Ardından görünüm, blok zaten iyi görünmüyorsa geçerli yakınlaştırma düzeyinde bloğa kayar. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın. Tek bir geri alma eklemenin tamamını geri alır.  
Ayrıştırıcının okuyamadığı bir dosya ya da hiç tablo ve not içermeyen bir dosya hiçbir şey eklemez.

Biri hâlâ yerleştirilirken eklenen birden çok Şema SQL, GraphQL, DBML veya AML dosyasının tümü, başlatıldıkları sırayla yerleşir. Bu sırada eklenen bir JSON dosyası, okunur okunmaz onlardan önce yerleşir. Bir `Import` işlemi ya da başka bir belgenin yüklenmesi, hâlâ yerleştirilmekte olanları iptal eder.

Kodlama ajanları da aynı şekilde, MCP içe aktarma araçlarının `append` moduyla dosya ekler; bu mod bir JSON dosyasının yerleşimini korur, ancak diğer biçimlerin tablolarını hiçbir zaman `Flow` düzeniyle değil, satırlara dizerek yerleştirir. [İçe aktarma](../../mcp/tools.md#import) bölümüne bakın.

### JSON {#json}

[Düzenleyicide tanımlanan şema biçimindeki](../../api/advanced/schema.md) dosyaları içe aktarabilirsiniz.
Dosya adı `.json` ile bitmelidir; böylece `<database name>-<timestamp>.erd.json` olarak dışa aktarılan bir dosya olduğu gibi geri içe aktarılır. Uzantısı yalnızca `.erd` veya `.vuerd` olan bir dosya burada kabul edilmez. Önceki sürümlerin kaydettiği dosyalar da okunur.

![Import > json üzerinden kaydedilmiş bir dosyayı içe aktarma, taslak belgeyi ayarlarıyla birlikte değiştirme](/img/demo-import-json.webp)

### Şema SQL {#schema-sql}

SQL ile tanımlanmış şema dosyalarını da içe aktarabilirsiniz.  
Ayrıştırıcılar veritabanı sisteminden bağımsız olarak olabildiğince esnek yapılmış olsa da desteklenmeyen bazı söz dizimleri olabilir.  
Dosya adı `.sql` ile bitmelidir.  
[Desteklenen söz dizimini buradan inceleyebilirsiniz.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Import > Schema SQL üzerinden bir SQL dosyasını içe aktarma, tablolarının ilişkileri boyunca yerleştirilmesi, ardından tabloların üzerinde uzaklaştırma](/img/demo-import-sql.webp)

Sütunlar yalnızca `CREATE TABLE` ifadesinden alınır. `ALTER TABLE ... ADD COLUMN` ile eklenen bir sütun okunmaz.  
Bir `CREATE TABLE` ifadesinin sütun olmayan öğeleri sütun olarak okunmaz, atlanır: adsız bir `CHECK (...)`, PostgreSQL'in `LIKE` ve `EXCLUDE` öğeleri, MySQL'in `INDEX` veya `KEY` olmadan yazılan `FULLTEXT` ve `SPATIAL` öğeleri, T-SQL'in `PERIOD FOR` öğesi ve Oracle'ın `SUPPLEMENTAL LOG DATA` öğesi.  
Bunlardan birinin adını taşıyan bir sütun, `exclude BOOLEAN` örneğindeki gibi addan sonra yerleşik bir tür geldiğinde ya da `"check" int` örneğindeki gibi ad tırnak içinde yazıldığında yine de içe aktarılır. `like citext` gibi, ardından yerleşik olmayan bir tür gelen tırnaksız bir `like`, PostgreSQL'in `LIKE` öğesi olarak okunur ve atlanır.  
Düzenleyicide saklanacak bir yer olmadığından `CHECK` kısıtlamalarının kendileri içe aktarılmaz.

#### Veri türleri {#data-types}

Bir sütunun veri türü, [desteklenen veritabanlarının](./table-related-functions.md#databases) hiçbirinin yerleşik türü olmasa bile argüman listesiyle birlikte korunur.  
Buna `CREATE TYPE` ile oluşturulan bir enum veya bileşik tür, `CREATE DOMAIN` ile oluşturulan bir domain, `hstore`, `citext` ve `ltree` gibi uzantı türleri, `public.mood` gibi şema nitelikli adlar ve tırnaklarını ya da köşeli parantezlerini koruyan `"MyType"` ve `[dbo].[Phone]` gibi tırnaklı veya köşeli parantezli adlar dahildir. `CREATE TYPE`, `CREATE DOMAIN` ve `CREATE EXTENSION` ifadelerinin kendileri atlanır.  
Yerleşik bir türün tırnakları veya köşeli parantezleri atılır, bu nedenle `[int]` türü `int` olarak, `[nvarchar](50)` türü de `nvarchar(50)` olarak gelir. PostgreSQL'in `"char"` ve `"bit"` türleri tırnaklarını korur, çünkü bunlar `char` ve `bit` türlerinden farklı türlerdir.  
Dizi ekleri her türde korunur: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. SQLite'ın `UNSIGNED BIG INT` türü bütün olarak gelir.  
MySQL'in ve MariaDB'nin bir türden ve argümanlarından hemen sonra yazılan `UNSIGNED` ve `ZEROFILL` değiştiricileri, yazıldığı gibi türün parçası olarak kalır: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, mysqldump'ın `int unsigned` yazımı. Varsayılan olan `SIGNED` atılır, bu nedenle `TINYINT SIGNED` türü `TINYINT` olarak gelir. MySQL'in reddettiği `INT NOT NULL UNSIGNED` örneğindeki gibi başka bir sütun seçeneğinden sonra yazılan bir değiştirici atılır.  
`ENUM(...)` ve `SET(...)` değerleri tırnaklarını korur; bir değerin içindeki tırnak, `ENUM('a','it''s')` örneğindeki gibi iki kez yazılır. MySQL'in ters eğik çizgiyle kaçışlanan `'it\'s'` yazımı da aynı şekilde tırnağı iki kez yazılmış olarak gelir. Bir Databricks `STRUCT<...>` türünde tırnaklı alan adları ve bir alanın `COMMENT` değeri tırnaklarını korur.  
Türsüz bir SQLite sütunu ya da hesaplanan bir `AS` sütunu gibi türü belirtilmeden yazılan bir sütun türsüz kalır: `NOT`, `NULL`, `DEFAULT`, `PRIMARY` veya `REFERENCES` gibi bir anahtar sözcük ya da tek tırnaklı bir dize tür olarak okunmaz.

#### Varsayılan değerler {#defaults}

Bir sütunun `DEFAULT` değeri, sonraki sütun seçeneğine, bir virgüle ya da kapanış parantezine kadar `now()`, `0.5`, `CURRENT_TIMESTAMP` veya `ARRAY[]::text[]` gibi ifadesinin tamamını korur. Bir `CASE ... END` bütün olarak okunur.  
İfadenin tamamını saran parantezler kaldırılır; böylece SQL Server'ın `((0))` değeri `0` olarak, `(getdate())` değeri de `getdate()` olarak gelir. Bir sabit değerin tür dönüşümü de kaldırılır; böylece pg_dump'ın `'draft'::character varying` değeri `'draft'` olarak, `NULL::character varying` değeri de `NULL` olarak gelir. Diğer tür dönüşümleri ise `ARRAY[]::text[]` ve `lower('A'::text)` örneklerindeki gibi korunur.  
MySQL'in `ON UPDATE CURRENT_TIMESTAMP` özniteliği, bir sütunda bunun için yer olmadığından atılır; ondan önceki varsayılan değer korunur. Oracle'ın `DEFAULT ON NULL 0` yazımı, `FOR INSERT ONLY` veya `FOR INSERT AND UPDATE` ile ya da bunlar olmadan, `0` olarak gelir.  
`N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` veya `_utf8mb4'x'` gibi önekli bir dize, içinde parantez olsa bile tek bir dize olarak okunur.

SQL Server Management Studio, varsayılan değerleri tablolardan sonra `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]` biçiminde betik olarak yazar. Böyle bir ifade o sütunun varsayılan değerini (burada `1`) ayarlar ve kısıtlama adı atılır.

Şema SQL dışa aktarması, bir veritabanının varsayılan değerin ifadesini yalnızca parantez içinde okuduğu yerlerde parantezleri geri ekler. [Varsayılan değerler](./schema-sql.md#defaults) bölümüne bakın.

#### Otomatik artırma {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` ve `IDENTITY`, bir sütunun `Auto Increment` bayrağını açar; geride varsayılan değer bırakmayan `GENERATED ALWAYS AS IDENTITY` ve `GENERATED BY DEFAULT AS IDENTITY` de aynısını yapar.  
Tek bir PostgreSQL `nextval()` çağrısından oluşan varsayılan değer de aynısını yapar: serial bir sütunun aldığı, `nextval('s')` ya da pg_dump'ın yazdığı gibi `nextval('s'::regclass)` biçiminde yazılan varsayılan değer. Dizi adı korunmaz. `nextval('s') + 1` ya da SQL Server'ın `NEXT VALUE FOR s` yazımı gibi bir diziyi kullanmakla kalan bir varsayılan değer, düz bir varsayılan değer olarak kalır.  
pg_dump her ikisini de tablolardan sonra `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` ve `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY` olarak yazar. Bu ifadelerden her biri o sütunun `Auto Increment` bayrağını açar ve varsayılan değerini temizler. `CREATE SEQUENCE`, `ALTER SEQUENCE` ve diğer tüm `ALTER COLUMN` eylemleri atlanır.  
Türü satır içinde `serial`, `bigserial` veya `smallserial` olarak yazılan bir sütun bu türü korur ve `Auto Increment` bayrağı kapalı kalır.

Düzenleyici yalnızca `Auto Increment` bayrağını saklar ve dışa aktarmada her veritabanı kendi biçimini yazar. [Otomatik artırma](./schema-sql.md#auto-increment) bölümüne bakın. PostgreSQL dışa aktarması, hangi biçim içe aktarılmış olursa olsun `smallint`, `integer` veya `bigint` sütununa `GENERATED ALWAYS AS IDENTITY` yazar; `INT UNSIGNED` gibi diğer türlerde ise tablodan sonra yalnızca bir yorum satırı yazar. `START WITH 100` gibi dizi seçenekleri kaybolur.  
Birden çok serial veya identity sütunu olan bir tablo birden çok otomatik artırmalı sütunla içe aktarılır; MySQL, MariaDB ve SQL Server böyle bir tablonun dışa aktarması çalıştırıldığında tabloyu reddeder.

#### Birincil anahtarlar {#primary-keys}

Tablosundan sonra eklenen bir birincil anahtar, yani `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, sütunlarını birincil anahtar olarak işaretler.  
Sütun listesinden önce gelen SQL Server'ın `CLUSTERED` veya `NONCLUSTERED` sözcüklerinin ve MySQL'in `USING BTREE` yan tümcesinin üzerinden geçilir; böylece SQL Server Management Studio'nun betik olarak yazdığı `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` ifadesi `Id` sütununu anahtar yapar. Bellek için optimize edilmiş bir tablonun `PRIMARY KEY NONCLUSTERED HASH (...)` tanımı `ALTER TABLE` içinde de `CREATE TABLE` içinde de okunmaz.

#### Benzersiz anahtarlar ve dizinler {#unique-keys-and-indexes}

İki veya daha fazla sütunu kapsayan bir `UNIQUE` kısıtlaması, hangi yazımla olursa olsun tek bir benzersiz dizine dönüşür: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, SQL Server'ın satır içi `INDEX n UNIQUE (a, b)` yazımı ve `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Dizin, anahtarın dizin adını, o yoksa `CONSTRAINT` adını alır, o da yoksa adsız kalır ve her sütunun sıralama düzenini korur. Böyle bir dizin bir [alternatif anahtardır](./table-related-functions.md#alternate-keys).  
Tek bir sütunu kapsayan bir `UNIQUE` kısıtlaması ise, bu yazımlardan hangisiyle olursa olsun, bunun yerine o sütunu Benzersiz olarak işaretler ve dizin eklemez; böylece dışa aktarmanın yazdığı `UQ_<table name>_<column name>` kısıtlaması, yazılmasına kaynak olan bayrak olarak geri gelir. Tek bir sütunu kapsayan bir `CREATE UNIQUE INDEX` benzersiz dizin olarak kalır.

phpMyAdmin'in `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` biçiminde yazdığı gibi aynı anda birden çok anahtar ekleyen bir `ALTER TABLE` ifadesi, içindeki her benzersiz anahtarı korur: `uq_a` anahtarı `uq_a` adlı bir benzersiz dizin olarak, `uq_c` anahtarı ise `c` sütununun Benzersiz bayrağı olarak gelir. Bir `CONSTRAINT` adı yalnızca kendi yan tümcesindeki anahtarı adlandırır. MariaDB'nin `ADD UNIQUE INDEX IF NOT EXISTS n (...)` yazımı ile SQL Server'ın `ALTER TABLE t WITH CHECK ADD ...` ve `WITH NOCHECK ADD ...` yazımları da okunur.  
`CREATE INDEX` ve `CREATE UNIQUE INDEX` ifadeleri `public.t` ve `[dbo].[t]` gibi nitelikli adlarla, SQL Server'ın `CLUSTERED` ve `NONCLUSTERED` sözcükleriyle, PostgreSQL'in `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` ve `USING btree` yazımlarıyla ve hiç dizin adı olmadan da okunur. SQL Server'ın `ON [PRIMARY]` dosya grubu yok sayılır.  
`NULLS NOT DISTINCT` veya `USING BTREE` gibi anahtar seçenekleri anahtarın adı sanılmaz. Bir anahtarın sütun listesinde sütunu yalnızca ilk sözcük adlandırır; bu nedenle `b DESC NULLS LAST`, `b text_pattern_ops` ve `b COLLATE "C"` yazımlarının tümü `b` sütununu anahtar yapar ve `DESC` sıralama düzeni olarak korunur. `email(191)` gibi bir önek uzunluğunun üzerinden geçilir, ancak `lower(email)` gibi ifade içeren bir anahtar tamamen atlanır.

Kısmi bir benzersiz dizin, yani `CREATE UNIQUE INDEX ... WHERE ...` ya da SQL Server'ın satır içi `INDEX n UNIQUE (...) WHERE ...` yazımı, aynı ad ve sütunlara sahip düz bir dizin olarak gelir, çünkü tablonun tamamında benzersiz olan bir anahtar, dosyanın tanımladığı filtreli anahtardan daha katı olurdu. Bunun istisnası, yalnızca anahtarın sütunlarına uygulanan ve `AND` ile birleştirilen `IS NOT NULL` sınamalarından oluşan, SQL Server'ın benzersiz bir sütunun birden fazla NULL tutabilmesi için gerektirdiği filtredir: Bu anahtar benzersiz kalır.  
`ALTER TABLE ... ADD COLUMN` ile eklenen bir sütun gibi tabloda bulunmayan bir sütunu adlandıran benzersiz bir anahtar, var olan sütunlara indirgenmez, tamamen atılır. Düz bir dizin ise var olan sütunları korur.

Oracle'ın SQL Developer aracı ve `DBMS_METADATA` paketi, bir anahtarın kendi dizinini ayrı bir `CREATE UNIQUE INDEX` ifadesi olarak yazar; bu dizin anahtarın adını ya da ardından `USING INDEX` gelen adsız bir anahtar için `SYS_C0012345` gibi bir sistem adını taşır. İçe aktarma böyle bir dizini ve bir `ADD CONSTRAINT ... USING INDEX` ifadesinin adlandırdığı dizini, ait olduğu anahtarın parçası olarak okur: Bileşik bir benzersiz anahtar tek bir benzersiz dizin olarak, birincil anahtar ya da tek sütunlu benzersiz anahtar ise ek dizin olmadan sütun bayrakları olarak gelir. Ardından Oracle'a yapılan bir dışa aktarma dizini bir kez oluşturur.

MySQL, MariaDB, MSSQL, Oracle, PostgreSQL ve SQLite için bir Şema SQL dışa aktarması, geri içe aktarıldığında aynı Benzersiz bayraklarını ve dizinleri verir.  
Snowflake'te ikincil dizin olmadığından, onun dışa aktarması yalnızca benzersiz anahtarları geri getirir: bileşik olanı benzersiz bir dizin olarak, tek sütunlu olanı ise sütunun Benzersiz bayrağı olarak. Databricks dışa aktarması hiçbir benzersizlik tanımlamaz, bu nedenle hiçbiri geri gelmez.

#### Yabancı anahtarlar {#foreign-keys}

Bir yabancı anahtar şu yazımlarda ilişkiye dönüşür:

- `CONSTRAINT name` ile ya da onsuz, tablo düzeyinde bir `FOREIGN KEY (...) REFERENCES t (...)` tanımı.
- SQL Server Management Studio'nun betik olarak yazdığı `ALTER TABLE t WITH CHECK ADD ...` ve `WITH NOCHECK ADD ...` dahil olmak üzere `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`.
- `user_id INT REFERENCES users (id)` örneğindeki gibi bir sütunun satır içi `REFERENCES t (col)` tanımı ve SQL Server ile Snowflake'in aynı yerde izin verdiği `FOREIGN KEY REFERENCES t (col)`. Birden fazla sütuna yapılan satır içi başvuru atlanır.

Bir `ALTER TABLE` ifadesi en fazla bir ilişki verir ve bunu yalnızca ilk yan tümcesi bir yabancı anahtar eklediğinde yapar: Aynı ifadede bir `ADD PRIMARY KEY` veya `ADD UNIQUE` yan tümcesinden sonra gelen bir `FOREIGN KEY` yan tümcesi okunmaz. phpMyAdmin'in `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` biçiminde yazdığı gibi tek bir ifade birden çok yabancı anahtar eklediğinde yalnızca sonuncusu okunur.

Sütun listesi olmayan bir `REFERENCES t` tanımı, `t` tablosunun birincil anahtarı tek bir sütunsa o anahtarı gösterir. Bileşik bir birincil anahtar söz konusu olduğunda yabancı anahtar atlanır.  
Başvurulan sütunlarından hiçbiri bulunamadığında ya da iki tabloda bulunan sütunların sayısı farklı olduğunda, örneğin bir sütun tablolardan yalnızca birinde eksik olduğunda, yabancı anahtar atlanır ve sütunlarından hiçbiri yabancı anahtar olarak işaretlenmez. Her iki tabloda da sütunlarından aynı sayıda sütun eksikse, bulunan sütunlar yazıldıkları sırayla eşleştirilir ve ilişki yalnızca bunları içerir.  
İçe aktarılan her ilişki `Zero N` türündedir ve alt tablodaki sütunlarının her biri aynı zamanda birincil anahtarsa tanımlayıcıdır.

Her yabancı anahtarın `ON DELETE` ve `ON UPDATE` yan tümceleri, ilişkinin `On Delete` ve `On Update` değerleri olur: büyük ya da küçük harfle ve iki sıradan herhangi biriyle yazılmış `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` veya `SET DEFAULT`. Bunları içermeyen bir yabancı anahtar `Not set` olarak içe aktarılır. Bunları düzenleyicide ayarlamak için [İlişki düzenleme](./relationship-editing.md#on-delete-and-on-update) bölümüne bakın.  
PostgreSQL'in `ON DELETE SET NULL (a_id)` örneğindeki gibi `SET NULL` veya `SET DEFAULT` sonrasındaki sütun listesinin üzerinden geçilir: Eylem anahtarın tamamına uygulanır ve listeden sonra gelen bir `ON UPDATE` yine de okunur. `MATCH FULL`, `MATCH PARTIAL` ve `MATCH SIMPLE` yan tümceleri atlanır ve MySQL'in `ON UPDATE CURRENT_TIMESTAMP` sütun özniteliği bir eylem sanılmaz.  
Bir Şema SQL dışa aktarması, o veritabanının yazdığı eylemlerle geri içe aktarılır; bu nedenle MySQL'de `SET DEFAULT`, Oracle'da herhangi bir `ON UPDATE` ya da Snowflake'te `NO ACTION` dışındaki her şey gibi veritabanının yazmadığı bir eylem `Not set` olarak geri gelir.

#### Açıklamalar {#comments}

Tablo ve sütun açıklamaları, ayrıştırıcının okuduğu üç söz diziminden içe aktarılır: MySQL, MariaDB, Snowflake ve Databricks'in kullandığı `COMMENT` tablo seçeneği ve sütun özniteliği, PostgreSQL ile Oracle'ın kullandığı `COMMENT ON TABLE` ve `COMMENT ON COLUMN` ifadeleri ve SQL Server'ın `EXEC sp_addextendedproperty` ile ayarladığı `MS_Description` genişletilmiş özelliği.  
Dosyanın tanımlamadığı bir tabloyu veya sütunu adlandıran bir açıklama yok sayılır.

SQL Server'ın çağrıları, SQL Server Management Studio'nun her açıklamayı betik olarak yazdığı gibi adlandırılmış argümanlarla (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`) ve düzenleyicinin MSSQL dışa aktarmasının yazdığı gibi konumsal argümanlarla okunur.  
Yalnızca bir tablodaki ya da 2. düzeyde tablonun sütunlarından birindeki `MS_Description` özelliği bir açıklama verir. Başka bir özellik, bir görünüm, bir dizin veya bir kısıtlama açıklama vermez; bir değişkenle aktarılan ya da `+` ile oluşturulan bir açıklama da vermez.

Bir açıklamada, `DEFAULT` değeri ya da tırnaklı bir ad gibi tırnak içindeki her metinde olduğu gibi, iki kez yazılmış bir tırnak mysqldump ve pg_dump'ın yazdığı biçimde tek bir tırnağı temsil eder: `'it''s'` metni `it's` olarak okunur.  
MySQL ve MariaDB'nin `'it\'s'` biçiminde yazdığı gibi tırnaktan önce gelen bir ters eğik çizgi de tırnağı kaçışlar. Ardından boşluk, `,`, `;`, `)`, `]`, `:`, `|`, `+` ya da dosya sonu geldiğinde böyle bir tırnak yine de metni sonlandırır; bu nedenle `'C:\'`, pg_dump'ın `'C:\'::text` yazımı ve T-SQL'in `'C:\'+name` yazımı ters eğik çizgilerini korur.  
Bir `DEFAULT` değeri tırnaklarını korur ve içindeki bir tırnak, dosya onu nasıl kaçışlamış olursa olsun iki kez yazılmış olarak geri yazılır: `'it''s'`.  
İçe aktarma sırasında belgenin veritabanı Databricks ise tek tırnaklı metin bunun yerine Spark'ın kurallarına uyar: Her ters eğik çizgi kendisinden sonraki karakteri kaçışlar, bu nedenle `'C:\\dir'` metni `C:\dir` olarak okunur, `\n`, `\t` ve `\u0041` gibi kaçış dizileri çözülür ve bir `DEFAULT` değeri `'it\'s'` olarak saklanır.

Dışa aktarılan Şema SQL, bir tablo veya sütun açıklamasının içindeki tırnağı kaçışlar: MySQL, MariaDB ve Snowflake için `COMMENT 'it''s'`, PostgreSQL ve Oracle için `COMMENT ON TABLE` ve `COMMENT ON COLUMN ... IS 'it''s'`, MSSQL'in `sp_addextendedproperty` çağrılarında ise tablo ve sütun adları da dahil olmak üzere tırnağın aynı şekilde iki kez yazılması. Tırnak içermeyen bir açıklama olduğu gibi yazılır.  
Databricks ise tırnağı ve ters eğik çizgiyi bunun yerine `COMMENT 'it\'s'` örneğindeki gibi ters eğik çizgiyle kaçışlar; bu nedenle dışa aktarması yalnızca seçili veritabanı Databricks olduğu sürece birebir geri okunur.  
MSSQL her açıklamayı `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'` olarak, bir sütun için ardından `'column', '<column>'` ekleyerek yazar. `Bracket` ayarı `None` olduğunda `sales.users` adlı bir tablo `sales` şemasını ve `users` tablosunu verir; şeması olmayan bir ad ise `dbo` şemasında yer alır. Başka herhangi bir `Bracket` ayarında adın tamamı `dbo` şemasındaki tablonun adı olur.

Açıklamalar bir SQLite dışa aktarma ve içe aktarma gidiş-dönüşünde korunmaz: SQLite onları ayrıştırıcının okumadığı düz `--` satırları olarak yazar. Bir MSSQL dışa aktarmasının `sp_addextendedproperty` çağrıları ise aynı tablo ve sütun açıklamaları olarak geri içe aktarılır.

### GraphQL {#graphql}

Bir GraphQL SDL belgesini içe aktarabilirsiniz.  
Nesne türü tanımları tablolara dönüşür, bir `extend type` bloğu genişlettiği türle birleşir ve arayüz alanları onları uygulayan türlere miras kalır.  
Türü başka bir tablo olan bir alan, sütun yerine ilişkiye dönüşür; iki tarafta da liste olması bir bağlantı tablosu oluşturur.  
`buyer: User` gibi tekil bir alan önce, büyük/küçük harf ayrımı yapmadan ve alt çizgiler yok sayılarak, diğer türde adı `By` ve ardından o alanın adıyla biten, `orderListByBuyer` gibi tek alanla eşleştirilir; `buyer2` gibi numaralı bir alan da numarası olmadan aynı şekilde eşleştirilir. Kod oluşturucunun GraphQL çıktısı, iki tablo birden fazla ilişkiyi paylaştığında ya da bir tablo kendisine başvurduğunda alanları bu şekilde adlandırır; bu nedenle böyle bir çıktı tüm ilişkileriyle birlikte geri içe aktarılır.  
Kök türler (`Query`, `Mutation`, `Subscription`), iç gözlem (introspection) türleri ve `PageInfo`, `*Connection`, `*Edge` ve `*_aggregate` gibi Relay, federasyon ve Hasura sarmalayıcıları gürültü olarak kabul edilip atlanır.  
`@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` ve `@db.*` yönergeleri dikkate alınır.  
Dosya adı `.graphql`, `.gql` veya `.graphqls` ile bitmelidir. Bir Prisma `schema.prisma` dosyası GraphQL belgesi değildir ve burada içe aktarılamaz.

### DBML {#dbml}

Bir DBML dosyasını içe aktarabilirsiniz; DBML, dbdiagram.io ve dbdocs'un kullandığı biçimdir.  
`Table`, `TablePartial`, `Ref`, `Enum` ve `TableGroup` blokları okunur. `Project` ve bağımsız `Note` blokları, çevrelerindeki tabloları etkilemeden atlanır.  
Her ref yazımı kabul edilir: iki noktalı `Ref:` biçimi, adlandırılmış bir ref, `Ref { }` blok biçimi ve satır içi `[ref: > table.column]` sütun ayarı.  
Çoktan çoğa bir `<>` ref tanımı, adını iki taraftan alan bir bağlantı tablosu oluşturur.  
Bağımsız bir ref tanımının `delete` ve `update` ayarları, `Ref: users.id < posts.user_id [delete: cascade, update: set null]` örneğindeki gibi ilişkinin `On Delete` ve `On Update` değerleri olur. Değerler `cascade`, `restrict`, `set null`, `set default` ve `no action` olup büyük ya da küçük harfle yazılabilir. Başka herhangi bir değer ya da hiç ayar olmaması `Not set` olarak içe aktarılır ve `color` gibi diğer ayarlar yok sayılır.  
Satır içi `[ref: ...]` ayarı eylem taşımaz ve bir `<>` ref tanımının ayarları bağlantı tablosuna aktarılmaz. Aynı yabancı anahtar hem satır içinde hem de bağımsız bir ref olarak tanımlandığında satır içi olan, eylemler olmadan korunur.  
Bir tablonun `Table users [headercolor: #3498DB]` örneğindeki gibi `headercolor` ayarı, değer tırnaksız yazılmış bir `#rgb` veya `#rrggbb` onaltılık değeri olduğunda tablonun rengi olur. Başka herhangi bir değer atılır ve bir `TablePartial` bloğunun `headercolor` ayarı onu kullanan tablolara aktarılmaz.  
Her `TableGroup` bloğu, her satırda bir tane olacak şekilde ve bir `Ref` tanımındaki gibi adlandırılarak listelediği tabloları içeren bir [tablo grubuna](./table-groups.md) dönüşür. `[color: ...]` ayarı, `headercolor` ile aynı kurala göre grubun rengi olur; bilgi notu ve diğer ayarları atılır. İki grubun listelediği bir tablo ilk grupta kalır. Tablosuz kalan bir grup, ister dosyanın tanımladığı tablolardan hiçbirini listelemesin ister yalnızca önceki bir grubun aldığı tabloları listelesin, oluşturulmaz. Grubun kutusu, tablolar nereye yerleştirilirse yerleştirilsin tabloların çevresine oturtulur ve tablolar satırlara dizildiğinde bir grubun tabloları bir arada kalır.  
Dosya adı `.dbml` ile bitmelidir.

### AML {#aml}

Bir AML (Azimutt Markup Language) dosyasını içe aktarabilirsiniz. Hem güncel yazım hem de eski v1 yazımı kabul edilir.  
Varlıklar tablolara dönüşür ve iç içe öznitelikler `settings.slug` gibi noktalı bir sütun adına düzleştirilir.  
Öznitelikler `nullable` olarak işaretlenmedikçe `NOT NULL` olur ve düzenleyicide karşılığı olmayan `check`, `type` ve `tags` gibi yapılar reddedilmez, atılır. Görünüm olarak işaretlenmiş bir varlık düz bir tablo olarak gelir.  
Bir varlığın `users {color: red}` örneğindeki gibi `color` değeri, tablosunun rengi olur. AML'nin renk adları olan `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` ve `gray`, büyük ya da küçük harfle, tırnaklı ya da tırnaksız okunur ve her biri aynı adlı Tailwind renginin 500 tonu olarak alınır; örneğin `red` için `#ef4444`. `"#3498db"` gibi tırnaklı bir onaltılık değer yazıldığı gibi korunur; tırnaksız bir `#3498db` ise okunamaz, çünkü `#` bir AML yorumu başlatır. Başka herhangi bir değer ve bir öznitelik ya da ilişki üzerindeki bir `color` değeri atılır.  
Bağımsız bir `rel` ifadesi ya da eski yazımdaki `fk` ifadesi, `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}` örneğindeki gibi `onDelete` ve `onUpdate` özelliklerini ilişkinin `On Delete` ve `On Update` değerleri olarak korur. Değerler `cascade`, `restrict`, `set null`, `set default` ve `no action` olup tırnaklı ya da tırnaksız, büyük ya da küçük harfle yazılabilir. Diğer özellikler atılır.  
`user_id int -> users(id) {onDelete: cascade}` gibi satır içi bir ilişkide özellikler özniteliğe aittir; bu nedenle atılırlar ve ilişki `Not set` olarak içe aktarılır.  
Dosya adı `.aml` ile bitmelidir.

GraphQL, DBML ve AML gidiş-dönüş biçimleridir: Her biri aynı zamanda bir [Kod oluşturucu](./code-generator.md) hedefidir.  
DBML ve AML, her ilişkinin ON DELETE ve ON UPDATE değerlerini iki yönde de taşır. [Kod oluşturucu](./code-generator.md#on-delete-and-on-update) bölümüne bakın. GraphQL ikisini de taşımaz, bu nedenle bir GraphQL içe aktarması ikisini de `Not set` olarak bırakır.  
DBML ayrıca saydamlık dışında tablo renklerini ve tablo içeren her tablo grubunu iki yönde de taşır. Adı olmayan bir grup `group_1`, `group_2` vb. olarak geri gelir; yinelenen bir grup adı ise sonuna `_2`, `_3` vb. eklenerek geri gelir. AML bir tablo rengini yalnızca renk adlarından en yakını olarak taşır, bu nedenle `#FF8800` rengi `orange` olarak yazılır ve `#f97316` olarak geri gelir; AML grup da taşımaz. GraphQL ne renkleri ne de grupları taşır.

## Dışa aktarma {#exporting}

Tuvalin bağlam menüsündeki `Export` alt menüsünde üç öğe bulunur:

- json: Diyagramı, dosyasında tutulduğu biçimiyle `.erd.json` olarak kaydeder: sütunları ve dizinleriyle birlikte tablolar, ilişkiler, notlar ve tablo grupları, ayrıca her [kilitli ayar](./settings.md#lock) kendi kilitli değerinde olmak üzere ayarlar.
- Schema SQL: [Şema SQL](./schema-sql.md#saving-or-copying-the-sql) sekmesini, seçenekler paneli açık ve `Save file` düğmesi odakta olacak şekilde açar; böylece `Enter` tuşuna basmak, sekmenin gösterdiği SQL'i `.sql` olarak kaydeder. O ana kadar hiçbir şey kaydedilmez.
- Image: Diyagramı `.png` ya da `.svg` olarak kaydeden veya PNG olarak panoya kopyalayan `Export image` iletişim kutusunu açar. [Görüntü](#image) bölümüne bakın.

Üçü de salt okunur bir düzenleyicide çalışır.

Şema SQL, her ilişkinin ON DELETE ve ON UPDATE değerlerini, önce ON DELETE olmak üzere `REFERENCES` yan tümcesinden sonra yazar. `Not set` hiçbir şey yazmaz ve seçili veritabanının kabul etmediği bir eylem yer almaz. Hangi veritabanının hangi eylemi kabul ettiği için [İlişki düzenleme](./relationship-editing.md#on-delete-and-on-update) bölümüne bakın.

Dışa aktarılan her dosya, `<database name>-<timestamp>` ve ardından uzantısı biçiminde adlandırılır; zaman damgası yerel saatte `yyyy-MM-dd'T'HH_mm_ss` biçimindedir – örneğin `my-schema-2026-08-29T04_05_06.erd.json`. Boş bir veritabanı adı yerine `unnamed` kullanılır.  
Şema SQL sekmesindeki ve [Kod oluşturucudaki](./code-generator.md) `Save file` düğmeleri dosyalarını aynı şekilde adlandırır. Bir görüntü, veritabanı adının iletişim kutusu açıldığı andaki değerini alır.

`Import`, `Import and Add` ve `Export` öğeleri, tuvalin bağlam menüsündekiyle aynı öğelerle ERD sekmesindeki [Hızlı aramadan](./quick-search.md) da kullanılabilir.

Obsidian'da indirme ya da kaydetme iletişim kutusu görünmez: Dosya kasaya, Obsidian'ın o diyagram için yeni ekleri koyduğu yere yazılır ve bir bildirim dosyanın yolunu belirtir.  
Obsidian'ın dosya adında izin vermediği `\ / : * ? " < > |` karakterleri `-` ile değiştirilir.  
Obsidian'ın dosya gezgini, dışa aktarılan bir `.erd.json` veya `.sql` dosyasını yalnızca Settings → Files and links → Detect all file extensions açıkken listeler.

### Görüntü {#image}

Tuvalin bağlam menüsünden ya da Hızlı aramadan seçilen `Export` ▸ `Image`, `Export image` iletişim kutusunu açar: seçeneklerinin yanında görüntünün bir önizlemesi. Açık bir [Gezgin](./explorer.md#dialogs-beside-it) soluk alanın altında açık kalır.

![Export > Image öğesini açma, Dark mode ve Background seçeneklerini kapatma, 3x seçme ve görüntüyü panoya kopyalama](/img/demo-export.webp)

- `Background`: Varsayılan olarak açık. Kapalıyken tuval saydam kalır.
- `Dark mode`: Başlangıçta düzenleyicinin görünüşüyle eşleşir. Ekrandaki görünüşle eşleştiği sürece görüntü, [tema oluşturucuda](./language-and-theme.md) yapılan değişiklikler dahil tuvalin kendi renklerini alır; diğer görünüş ise aynı gri tonu ve vurgu rengine sahip hazır temayı kullanır.
- `Scale`: `1x`, `2x` veya `3x`; varsayılan olarak `2x` seçilidir. Yalnızca PNG'nin ve panoya kopyalanan görüntünün boyutunu belirler ve altındaki satır bu boyutu `PNG <width> × <height> px` biçiminde gösterir.

Seçimler düzenleyici kapanana kadar korunur ve hiçbir zaman belgeye kaydedilmez. Önizleme görüntüyle aynı şekilde çizilir ve `Background` ya da `Dark mode` değiştiğinde yeniden çizilir.

Görüntü, diyagramı iletişim kutusu açıldığı andaki durumuyla içerir; sonraki değişiklikleri almak için iletişim kutusunu kapatıp yeniden açın. Görüntü, ne kadar uzağa kaydırılmış olursa olsun diyagramın tamamını, diyagramın çizdiği alan artı bir kenar boşluğu olacak şekilde kırpılmış olarak içerir ve düzenleyici hangi yakınlaştırmayı gösterirse göstersin her zaman %100'de çizilir; böylece her tablo eksiksiz çizilir. [Görünüm seçeneklerinin](./table-related-functions.md#table-view-options) gizlediği öğeler – ilişkiler, bunların ON DELETE ve ON UPDATE etiketleri, tablo grupları ya da notlar – ne çizilir ne de onlara yer ayrılır ve tablo grupları diğer her şeyin arkasında çizilir.

Görüntüyü üç düğme yazar ve her biri iletişim kutusunu açık bırakır:

- `PNG`: Diyagramın %100'deki boyutunun `Scale` değeriyle çarpımı büyüklüğünde bir `.png` dosyası kaydeder. Tarayıcının canvas öğesi için fazla büyük bir PNG, başarısız olmak yerine düşük çözünürlükte yazılır: İletişim kutusu önceden `Reduced from <width> × <height> px, past what a browser canvas can hold` uyarısını gösterir ve sonrasında `Exported at a reduced resolution` yazan bir bilgi kutusu bunu bildirir.
- `SVG`: `Scale` değeri ne olursa olsun diyagramın %100'deki boyutunda ve hiçbir zaman küçültülmeden bir `.svg` dosyası kaydeder. Metni metin olarak kalır ve yazı tipleri gömülmez, adlarıyla belirtilir; bu nedenle düzenleyicinin yazı tipine sahip olmayan bir görüntüleyici başka bir yazı tipiyle çizer. Gölgeler yer almaz.
- `Copy to clipboard`: Seçilen `Scale` değerinde bir PNG'yi panoya koyar; tarayıcının canvas öğesi görüntüyü tutamadığında, kaydedilen bir PNG gibi çözünürlüğü düşürülür. Bunu `Copied the image to the clipboard` iletisiyle, görüntünün çözünürlüğü düşürüldüyse `Copied at a reduced resolution` iletisiyle onaylar. Tarayıcı veya ana uygulama pano erişimini reddettiği ya da görüntü çizilemediği için kopyalama başarısız olursa, `Couldn't copy the image` iletisi bunun yerine bir PNG kaydetmeyi önerir.

Ana uygulama bir arka plan worker'ı çalıştırıyorsa görüntü bu worker'da çizilir, böylece düzenleyici bu sırada kullanılabilir kalır. İşlem kısa bir süreden uzun sürdüğünde `Exporting PNG`, `Exporting SVG` veya `Copying image` yazan bir bilgi kutusu görünür ve bir hata `Couldn't export the PNG` veya `Couldn't export the SVG` olarak bildirilir. Bir dosya hâlâ çizilirken iletişim kutusunu kapatmak, o dosyanın kaydedilmesini durdurmaz.

İletişim kutusu açıldığında odak `PNG` düğmesindedir ve `Tab` tuşu odağı iletişim kutusunun içinde tutar. `Escape` tuşu, `x` düğmesi ya da çevresindeki soluk alana tıklamak iletişim kutusunu kapatır.  
İletişim kutusu açıkken geri alma ve yineleme dahil tuval kısayolları ile kopyalama ve yapıştırma hiçbir şey yapmaz. `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac) iletişim kutusunu kapatır ve Hızlı aramayı açar. `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) iletişim kutusunu kapatır ve metin imlecini [Gezginin](./explorer.md#opening-and-closing) Bul alanına yerleştirir; Gezgin kapalıysa onu açar, hiçbir zaman kapatmaz. Gezgini gösteremeyecek kadar dar bir düzenleyicide yine iletişim kutusunu kapatır, ancak metin imlecini taşımak yerine bir bildirim gösterir.
