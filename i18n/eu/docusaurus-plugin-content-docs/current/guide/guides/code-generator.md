---
sidebar_position: 13
description: Sortu hogeita bi helburutarako kodea diagramatik, aukeratu lengoaia, datu-basea, izenen idazkera eta mugatzailea aukeren panelean, ikusi zein helburuk idazten dituzten erlazio baten ON DELETE eta ON UPDATE ekintzak, eta gorde edo kopiatu emaitza.
---

# Kode-sortzailea

Joan tresna-barrako `Code Generator` fitxara. Fitxak dokumentu osoaren kodea erakusten du ezkerrean, eta haren eskuinean `Code Generator` izenburua duen aukeren panel bat; bertan aukeratzen dituzu lengoaia, datu-basea, izenen idazkerak eta, helburu batzuetarako, mugatzailea.  
Panela berez irekitzen da, salbu eta fitxa lehen aldiz irekitzean editorea 640 px baino estuagoa bada. Panelaren goialdeko `Hide options` botoiak tolestu egiten du, eta kodearen goiko eskuineko `Show options` botoiak berriro zabaltzen du. Irekita edo tolestuta geratzen da fitxaz aldatu arren, editorea irekita dagoen bitartean, SQL eskema fitxaren panelarekiko modu independentean, eta ez da inoiz fitxategian gordetzen.

Egin eskuineko klik kodean haren laster-menua irekitzeko: `Language`, `Database`, `Table Name Case`, `Column Name Case` eta `Bracket` (`Doctrine`, `JPA` eta `SeaORM` helburuetarako soilik), bakoitza uneko balioa markatzen duen azpimenu batekin; ondoren `Options panel`, panela tolestu edo irekitzen duena eta panela ikusgai dagoen bitartean markatuta dagoena; eta `Save file`.  
Fitxa hau irekita dagoen bitartean, [Bilaketa azkarra](./quick-search.md) paletak `Database`, `Bracket` (`Doctrine`, `JPA` eta `SeaORM` helburuetarako soilik), `Language`, `Table Name Case` eta `Column Name Case` komandoak eskaintzen ditu, baita `Code Generator: Options panel` komandoa ere, panela tolestu edo irekitzen duena.

![TypeScript eta ondoren Rust hautatzea kodearen laster-menutik, zutabe-izenak Snake idazkerara aldatzea aukeren panelean, eta kodea kopiatzea](/img/demo-code-generator.webp)

Kode-ikuspegi bera [Taularen propietateak](./table-related-functions.md#table-properties) paneleko `Code Generator` fitxa ere bada; bertan, taula bakar horren kodea sortzen du, dokumentu osoarena sortu beharrean. Han ez du aukeren panelik, eta haren laster-menuak ezarpen berberak aldatzen ditu, baina ez du `Options panel` ez `Save file` aukerarik.  
Dokumentu osoaren kodea inportazio-sententziekin edo goiburu batekin hasten denean, taula bakarraren kodea taula horrek behar dituenekin hasten da, adibidez `PHP` helburuan `<?php`, `Swift` helburuan `import Foundation` edo `JSON Schema` helburuan `$schema`.

Kodea fitxa irekitzean idazten da, eta berriro lengoaia, datu-basea, izenen idazkeretako bat edo mugatzailea aldatzen den bakoitzean. Fitxa irekita dagoen bitartean diagraman egindako edizio bat, hala nola lankide batena edo kodetze-agente batena, fitxatik irten eta itzultzen zarenean agertzen da, edo ezarpen horietako bat aldatzen denean.

## Aukeren panela {#options-panel}

`Saved in the document` epigrafearen azpian, panelak `Language`, `Database`, `Table Name Case` eta `Column Name Case` zerrendatzen ditu, eta ondoren `Bracket`, lengoaia `Doctrine`, `JPA` edo `SeaORM` den bitartean. Bakoitza goitibeherako zerrenda bat da, eta aldaketa batek kodea berehala berridazten du.  
Hautatutako lengoaiak `Database` aukera edo izenen idazkerak alde batera uzten dituenean, panelean geratzen dira, lausotuta, azpian `Not used by DBML` bezalako azalpen batekin, eta oraindik ere alda daitezke.  
`Save file` eta `Copy` botoiak panelaren oinean daude. Ikus [Emaitza gordetzea edo kopiatzea](#saving-or-copying-the-result).

Diagramaren beraren ezarpenak dira, laster-menuak eta Bilaketa azkarrak ere aldatzen dituztenak. `Database` aukera fitxategian gordetzen da beste edozein edizio bezala.  
`Language`, `Table Name Case`, `Column Name Case` eta `Bracket` aukerak Ezarpenak fitxako beren blokeoa desaktibatuta dagoen bitartean soilik gordetzen dira (`Bracket Type` blokeoa `Bracket` aukerarako), eta diagrama berri batek blokeo guztiak aktibatuta ditu. Blokeo bat aktibatuta dagoen bitartean, aldaketa batek zure pantailako kodea berridazten du, baina fitxategiak balio blokeatua mantentzen du, eta diagrama balio horrekin irekitzen da berriro. Panelak ez du blokeoaren inolako zantzurik erakusten; aukera bat fitxategian gordetzeko, desaktibatu haren blokeoa. Ikus [Blokeoa](./settings.md#lock).  
Irakurtzeko soilik dagoen editore batean epigrafeak `This window only` dio horren ordez, bertako aldaketa batek leiho horretara bakarrik iristen baita. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).

## Lengoaia {#language}

Hogeita bi helburu onartzen dira, hiru taldetan zerrendatuta: lengoaiak, ORMak eta, azkenik, eskemak, talde bakoitza ordena alfabetikoan. Panelaren zerrendak eta laster-menuak marra bat jartzen dute taldeen artean, baina ez dute bat ere izendatzen:

| Helburua | Taldea | Erlazioak | Indizeak | ON DELETE / ON UPDATE | Gordetzeko luzapena |
| --- | --- | --- | --- | --- | --- |
| `C#` | Lengoaia | — | — | — | `.cs` |
| `Go` | Lengoaia | — | — | — | `.go` |
| `Java` | Lengoaia | — | — | — | `.java` |
| `Kotlin` | Lengoaia | — | — | — | `.kt` |
| `PHP` | Lengoaia | — | — | — | `.php` |
| `Rust` | Lengoaia | — | — | — | `.rs` |
| `Scala` | Lengoaia | — | — | — | `.scala` |
| `Swift` | Lengoaia | — | — | — | `.swift` |
| `TypeScript` | Lengoaia | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | ON DELETE soilik | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Bakarrak soilik | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Eskema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Eskema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Eskema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Eskema | — | — | — | `.json` |
| `Mermaid` | Eskema | ✓ | — | — | `.mmd` |
| `Zod` | Eskema | — | — | — | `.ts` |

Lehenetsia `GraphQL` da. Helburu guztiek zutabeak sortzen dituzte; ✓ markek helburu bakoitzak zer gehiago sortzen duen erakusten dute.  
Taulak izenaren arabera ordenatuta sortzen dira, ez oihalean duten ordenan, eta indizeak [Taularen propietateak](./table-related-functions.md#indexes) paneleko `Indexes` atalean zerrendatutakoak dira, ez haien gaineko `Keys` errenkadak. `SeaORM` helburuak indize bakarrak soilik idazten ditu, eta `Mermaid` helburuak balio bakarreko zutabe bat `UK` gisa markatzen du, baina ez du indizerik idazten.  
`Java`, `AML`, `DBML` eta `Mermaid` izan ezik, helburu guztiek gako nagusiko zutabe bat ez nulu gisa idazten dute, `Not Null` ezarrita duen ala ez. `Java` helburuak ez du adierazten zutabe batek nulua onartzen duen ala ez, eta `AML`, `DBML` eta `Mermaid` helburuek marka diagraman dagoen bezala mantentzen dute.

Helburu batzuek idazten dutena:

- `PHP`: mota esplizituko propietate publikoak dituzten klase arruntak, `<?php` eta `declare(strict_types=1);` lerroekin hasita.
- `Doctrine`: atributuak dituzten Doctrine ORM 3 entitateak, DBAL 4.2 edo berriagorako, zutabe bakoitza bere DBAL motarekin eta hautatutako datu-baserako aukerekin.
- `Rust`: `pub struct` bat taula bakoitzeko, motak bide-izen osoarekin idatzita, adibidez `chrono::NaiveDateTime` edo `rust_decimal::Decimal`, `use` lerrorik gabe.
- `SeaORM`: formatu trinkoko SeaORM 2.0 entitateak, taula bakoitza `pub mod` bat; beraz, testu osoa fitxategi bakar gisa konpilatzen da.
- `Swift`: `Codable`, `Hashable`, `Sendable` struct bat taula bakoitzeko; Swift 6.1 edo berriagoa behar du.
- `TypeScript`: `export interface` bat taula bakoitzeko, errenkada JSON gisa deskribatzen duena, `Zod` eskemak egiten duen bezala: data edo ordu bat `string` bat da, eta nulua onartzen duen zutabe bat `T | null` da.
- `Zod`: Zod 4 errenkada-eskema bat taula bakoitzeko eta hark ondorioztatzen duen mota, txertatze-eskemarik eta erlaziorik gabe.
- `JSON Schema`: JSON Schema draft 2020-12 bertsioko dokumentu bakar bat, taula bakoitzeko errenkada-eskema batekin `$defs` atalaren azpian.
- `Mermaid`: `erDiagram` bat, GitHubek bistaratzen duen motakoa; taula bakoitza entitate bat da, zutabe guztiak beren motarekin eta dagokien `PK`, `FK` edo `UK` markarekin zerrendatzen dituena, eta erlazio bakoitza bere bi taulen arteko marra bat.

`AML`, `DBML` eta `GraphQL` joan-etorriko formatuak dira: bakoitza inportazio-iturri bat ere bada. Ikus [Fitxategiak inportatzea edo esportatzea](./file-import-export.md). Gainerako eskemak, `JSON Schema`, `Mermaid` eta `Zod`, irteerarako soilik dira.  
`DBML` helburuak taula bakoitzaren kolorea `headercolor` gisa idazten du, eta, dokumentu osoaren kodean, `TableGroup` bloke bat `Ref` sententzien ondoren, taula bat duen [taula-talde](./table-groups.md) bakoitzeko. `AML` helburuak taula baten kolorea AMLren kolore-izenen artean hurbilena erabiliz idazten du.

## ON DELETE eta ON UPDATE {#on-delete-and-on-update}

Erlazio baten ON DELETE eta ON UPDATE ekintzak haren laster-menutik ezartzen dira. Ikus [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
[Lengoaia](#language) ataleko taulako `ON DELETE / ON UPDATE` zutabean ✓ duten helburuek erlazio batek ezartzen dituen ekintzak idazten dituzte; `Not set` balioan utzitako ekintza batek ez du ezer idazten.  
ORM helburuek zein ekintza mantentzen dituzten hautatutako datu-basearen araberakoa da; `AML` eta `DBML` helburuek, berriz, guztiak mantentzen dituzte. Ikus [Datu-basea](#database).

- `Doctrine` helburuak ON DELETE soilik idazten du, Doctrinek ez baitu ON UPDATE aukerarik. `onDelete: 'CASCADE'` gehitzen dio jabe-aldeko `ManyToOne` edo `OneToOne` erlazioaren `#[ORM\JoinColumn]` bakoitzari, adibidez `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, eta ez dio ezer gehitzen alderantzizko aldeko `OneToMany` edo `OneToOne` erlazioari. Gako nagusia ez den balio bakarreko zutabe baterako erlazio bat zutabe arrunt gisa geratzen da, eta Doctrinek asoziaziorik gabe mapatzen ditu zutabe horiek; beraz, ez du ekintzarik idazten.
- `Drizzle` helburuak minuskulaz idazten ditu. `.references()` deian aukera gisa doaz, adibidez `{ onDelete: "cascade", onUpdate: "set null" }`; zutabe anitzeko gako batek jasotzen duen `foreignKey()` dei batean, kateatuta doaz, adibidez `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` helburuak taula umearen `belongs_to` erlazioan idazten ditu, ON UPDATE lehenik, SeaORMren izenekin (`NoAction`, `Cascade`, `SetNull`, `SetDefault` eta `Restrict`), adibidez `on_update = "Cascade", on_delete = "SetNull"`. Taula gurasoaren `has_one` edo `has_many` erlazioak ez du bat ere jasotzen.
- `Sequelize` helburuak `onDelete: "CASCADE"` eta `onUpdate` sarrerak idazten ditu bi asoziazio-deietan: `hasMany` edo `hasOne` deian, eta `belongsTo` deian. Zutabe anitzeko gako batek ez du asoziazio-deirik jasotzen; beraz, `Sequelize` helburuak ez du ekintzarik idazten harentzat.
- `SQLAlchemy` helburuak `ondelete="CASCADE"` eta `onupdate` argumentuak pasatzen dizkio `ForeignKey()` funtzioari zutabe bakarreko gako baterako, eta `ForeignKeyConstraint()` funtzioari zutabe anitzeko gako baterako.
- `TypeORM` helburuak `onDelete: "CASCADE"` eta `onUpdate` aukerak idazten ditu jabe-aldeko `@ManyToOne` edo `@OneToOne` dekoratzailean, inoiz ez alderantzizko aldean. Beti uzten du kanpoan `SET DEFAULT`, TypeORMek `DEFAULT` gisa idatziko lukeelako, eta datu-base batek ere ez du hori onartzen.
- `DBML` helburuak ezarpenak gehitzen dizkio `Ref` sententziari, adibidez `[delete: set null, update: no action]`.
- `AML` helburuak ekintza bat duen erlazio bat propietateak dituen `rel` sententzia independente gisa idazten du, adibidez `{onDelete: cascade, onUpdate: "set null"}`, bere zutabearen lerroan bertan idatzi beharrean.

`JPA` helburuak ez du bat ere idazten: JPA arruntak ez du horietarako aukerarik, eta sortzaileak ez du Hibernateren `@OnDelete` anotazioa erabiltzen. `Mermaid` helburuak ere ez du bat ere idazten, `erDiagram` lerro batek ez baitu horietarako tokirik.  
Taula bakarra erakusten duen Taularen propietateak paneleko `Code Generator` fitxan, `DBML` helburuak ez du `Ref` sententziarik idazten, ezta `AML` helburuak `rel` sententziarik ere; beraz, bietako batek ere ez ditu ekintzak erakusten han. `AML` helburuak ekintzak dituen zutabe bakarreko erlazio bat bere zutabearen lerroan mantentzen du, ekintzarik gabeko bat bezala. `Mermaid` helburuak ez du inolako erlazio-marrarik idazten han. `Doctrine` eta `SeaORM` helburuek dokumentu osoan bezalako entitate bera idazten dute han, ekintzak barne.

## Izenen idazkera {#name-case}

`Table Name Case` eta `Column Name Case` aukera bakoitzak `Pascal`, `Camel`, `Snake` eta `None` balioak onartzen ditu.  
Balio lehenetsiak `Pascal` taula-izenetarako eta `Camel` zutabe-izenetarako dira. `None` balioak izen bat diagraman idatzita dagoen bezala sortzen du.  
Idazkera guztietan, helburuaren lengoaiak erreserbatzen duen izen bat ihes-ikur batekin idazten da lengoaia horrek hala egiteko modua duenean, adibidez `C#` lengoaian `@class` edo `Rust` lengoaian `r#type`, eta izena aldatzen zaio modurik ez duenean, adibidez `Java` lengoaian `class_`.

`AML`, `DBML` eta `Mermaid` helburuek bi ezarpenak alde batera uzten dituzte, eta beti diagramako izenak sortzen dituzte.  
`SeaORM` helburuak ere alde batera uzten ditu: eremuei eta moduluei snake case idazkeran ematen die izena, SeaORMek berriro irakurtzen duen forman, eta gordetako izenak `table_name` atributuan eta, desberdinak direnean, `column_name` atributuan ematen ditu.  
Lau helburu horietarako, panelak bi zerrendak lausotzen ditu, azpian `Not used by` azalpenarekin.

Helburu guztiek izen fisikoak idazten dituzte, [Izenen ikuspegiak](./logical-names.md#name-view) erakusten duena edozein dela ere.  
Bat ere ez du izen logikorik idazten, ezta iruzkin huts batean ere: fitxa honek ez du SQL eskema fitxako [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) etengailuaren parekorik.  
Era berean, bat ere ez du domeinurik idazten: domeinu bati lotutako zutabe bat bere datu motarekin idazten da, beste edozein zutabe bezala.

## Datu-basea {#database}

Datu motak hautatutako datu-basearen arabera ebazten dira. Ikus [Datu-baseak](./table-related-functions.md#databases).  
Aukeratu fitxa honetan panelaren `Database` zerrendatik, laster-menuko `Database` aukeratik edo Bilaketa azkarretik, eta kodea berehala berridazten da. Diagramaren datu-base ezarpen bakarra da, oihalaren laster-menuak eta [SQL eskema](./schema-sql.md) fitxak ezartzen duten bera; beraz, hemen egindako aldaketa bat han ere agertzen da.  
`Drizzle` helburuak ezarpen beretik hartzen du bere dialektoa: `pgTable` PostgreSQL datu-baserako, `mysqlTable` MySQL eta MariaDB datu-baseetarako, `sqliteTable` SQLite datu-baserako, eta `pgTable` beste datu-base guztietarako.  
`SeaORM` helburuak `column_type` bat idazten du, bestela SeaORMek zutabe mota desberdin bat sortuko lukeen kasuetan, PostgreSQL, MySQL, MariaDB edo SQLite datu-baseetan, eta bat ere ez MSSQL, Oracle, Snowflake edo Databricks datu-baseetan, SeaORMek ez baitu horietarako backendik.

Hautatutako datu-baseak erabakitzen du, halaber, ORM helburuek zein ON DELETE eta ON UPDATE ekintza idazten dituzten.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` eta `TypeORM` helburuek datu-base horren SQL eskemak kanpoan uzten duen edozein ekintza uzten dute kanpoan, adibidez `SET DEFAULT` MySQL eta MariaDB datu-baseetan, `RESTRICT` MSSQL datu-basean, edo `NO ACTION` ez den ekintza oro Snowflake eta Databricks datu-baseetan; beraz, datu-basearen lehenetsia aplikatzen da. Zerrenda osoa [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update) atalean dago.  
`Drizzle` helburuak, haren ordez, idazten duen dialektoari jarraitzen dio: `mysqlTable` kodeak `SET DEFAULT` uzten du kanpoan; `pgTable` eta `sqliteTable` kodeek, berriz, ekintza guztiak mantentzen dituzte, MSSQL, Oracle, Snowflake eta Databricks datu-baseetarako idazten duen `pgTable` kodea barne.

`AML`, `DBML` eta `Mermaid` helburuak dira salbuespena: datu mota bakoitza diagraman idatzita dagoen bezala sortzen dute; beraz, datu-basearen ezarpenak ez du haien irteera aldatzen, eta panelak `Database` aukera lausotzen du haientzat. `AML` eta `DBML` helburuek erlazio batek ezartzen dituen ekintza guztiak idazten dituzte, eta `Mermaid` helburuak ez du bat ere idazten.

## Mugatzailea {#bracket}

`Bracket` aukera panelean, laster-menuan eta Bilaketa azkarrean eskaintzen da, lengoaia `Doctrine`, `JPA` edo `SeaORM` den bitartean soilik.  
SQL eskema fitxako mugatzailearen ezarpen bera da; beraz, hemen egindako aldaketa batek SQL eskemak izenak komatxo artean nola jartzen dituen ere aldatzen du. Ikus [SQL eskema](./schema-sql.md#database-and-bracket). `SingleQuote`, `DoubleQuote`, `Backtick` eta `None` balioak eskaintzen ditu, eta `None` balioarekin hasten da.

- `Doctrine`: `None` ez den edozein mugatzailerekin, taulen, zutabeen eta join zutabeen izen guztiak alderantzizko komatxoen artean jartzen dira, horrela markatzen baitu Doctrinek komatxo artean jarri beharreko izen bat, adibidez ``#[ORM\Table(name: '`order`')]``. `None` balioarekin, behar duen izena soilik jartzen da horrela: datu-base batek erreserbatzen duen hitz bat, ASCII identifikatzaile arrunt bat ez den izen bat, edo komatxo artean idatzitako izen bat.
- `JPA`: `None` ez den edozein mugatzailerekin, hitz erreserbatua den taula-izen bat komatxo artean jartzen da `@Table` anotazioaren barruan, adibidez `@Table(name = "\"user\"")`. `None` balioarekin, komatxorik gabe uzten da, SQL eskemak uzten duen bezala.
- `SeaORM`: `None` balioarekin, izenak datu-baseak gordetzen dituen bezala idazten dira: puntu bat duen taula-izen bat `schema_name` eta `table_name` atributuetan zatitzen da, eta PostgreSQL datu-basean komatxorik gabeko izen bat minuskuletara bihurtzen da. Beste edozein mugatzailerekin, izen bat osorik mantentzen da, idatzi bezala.

## Emaitza gordetzea edo kopiatzea {#saving-or-copying-the-result}

`Save file` aukerak, aukeren panelaren oinean edo laster-menuan, erakutsitako kodea fitxategi gisa gordetzen du.  
Esportazio guztien izen-eredu bera du, `<database name>-<timestamp>`, eta horren ondoren [Lengoaia](#language) ataleko taulako luzapena, adibidez `shop-2026-10-12T04_05_06.ts`; zure ostalarian esportazio guztiak gordetzen diren lekuan gordetzen da. Ikus [Esportatzea](./file-import-export.md#exporting). `Java` eta `JPA` helburuek klase guztiak `.java` fitxategi bakar batean jartzen dituzte, fitxak erakusten dituen bezala.  
Export menuak ez du Kode-sortzailearen aukerarik, eta Taularen propietateak paneleko `Code Generator` fitxak ezin du fitxategirik gorde.

Kodea kopiatzeko, egin klik panelaren oineko `Copy` botoian, edo pasatu sagua kodearen gainetik eta egin klik haren goiko eskuineko kopiatzeko botoian; Taularen propietateak panelean, hori da modu bakarra.  
Egiaztatze-marka bat duen `Copied!` jakinarazpen batek berresten du bi segundoz. Nabigatzaileak edo ostalariak arbela ukatzen badu, abisu-ikur bat duen `Couldn't copy to the clipboard` jakinarazpen batek adierazten du hori haren ordez, bost segundoz. Berriro kopiatzean, jakinarazpena ordezten da, beste bat gehitu beharrean.  
Testua hautatu ere egin daiteke; beraz, behar duzun zatia soilik har dezakezu.

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, panelaren zerrendek, laster-menuak eta Bilaketa azkarrak `Language`, `Database`, `Table Name Case`, `Column Name Case` eta `Bracket` aukerak aldatzen dituzte oraindik, baina leiho horretan bakarrik; beraz, panelak `Saved in the document` ordez `This window only` jartzen du haien epigrafean.  
Aldaketa batek pantaila horretako kodea berridazten du, eta ez da fitxategian gordetzen, ez lankideekin partekatzen, ez desegiteko erregistratzen, blokeoek dioten guztia gorabehera; eta lankide batek zuk aukeratutako ezarpen bati egindako aldaketak zure aukera pantailan uzten du. `Database` eta `Bracket` SQL eskema fitxako ezarpenak ere badira; beraz, hemen egindako aukera batek leiho berean agertzen da han. Ikus [Irakurtzeko soilik dauden editoreak](./schema-sql.md#read-only-editors).  
Editorea berriro idazgarri bihurtzen denean, dokumentuaren ezarpenak itzultzen dira eta kodea haientzat idazten da.  
`Save file` eta `Copy` aukerek erakusten den kodea gordetzen eta kopiatzen dute.
