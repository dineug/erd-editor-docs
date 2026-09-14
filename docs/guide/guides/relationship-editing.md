---
sidebar_position: 5
description: Delete a relationship, change its type, read the connector notation, and work with N:M and identifying relationships.
---

# Relationship Editing

Relationships are drawn from the canvas context menu or with a shortcut — see [Editing Start](./editing-start.md).  
This page covers what you can do with one once it exists.

## Deletion

Possible to delete via the relationship context menu.

![Deleting the products-to-reviews relationship from its context menu](/img/demo-relationship-remove.webp)

There is no shortcut for it, because a relationship is not selected the way a table or a memo is.  
Relationships are also removed together with what they connect: deleting a table removes every relationship touching it, and deleting a column removes every relationship that uses it.

## Type Change

Change available through the relationship context menu.  
Four types are offered, and the current one is marked with a check:

- Zero One
- Zero N
- One Only
- One N

![Changing a relationship from Zero N to One Only and then One N in its context menu](/img/demo-relationship-type.webp)

These are the same four types you start a relationship with, each with its own shortcut — see [Editing Start](./editing-start.md).

## N:M Relationships

Because the editor is based on the physical model, an N:M relationship is expressed with a mapping table, as shown below.

![Drawing relationships from products and tags into the product_tags mapping table](/img/demo-relationship-n-m.webp)

Importing GraphQL, DBML, or AML builds the mapping table for you.  
A many-to-many declaration arrives as a table named `<left>_<right>`, commented `Junction table inferred from <left> <-> <right>`, joined to both sides by identifying relationships.  
See [Importing or Exporting Files](./file-import-export.md).

## Identifying Relationships

Drawing a relationship copies each primary key of the parent table onto the child table as a `NOT NULL` foreign key column, so a new relationship starts out non-identifying.  
To make it identifying, set those foreign key columns on the child table as primary keys with `Alt + K` or `Primary Key` in the table context menu.

![Toggling product_id as a primary key with Alt + K, turning its connector solid, then dashed](/img/demo-identifying-relationship.webp)

The editor keeps this in step on its own.  
A relationship is identifying while every column on its child side is a primary key, and turns non-identifying as soon as one of them is not.

## Reading a Connector

- An identifying relationship is drawn as a solid line, a non-identifying one as a dashed line.
- The child end carries the cardinality symbol of the relationship type: a ring and a bar for Zero One, a ring and a crow's foot for Zero N, two bars for One Only, and a bar and a crow's foot for One N.
- The parent end is a ring and a bar, like Zero One, when any of the foreign key columns allows `NULL`, and two bars, like One Only, when they are all `NOT NULL`.
- Hovering a connector highlights it along with the columns it links in both tables.

![Hovering three connectors in turn, each lighting up with the columns it links](/img/demo-relationship-hover.webp)

Hide connectors on the ERD canvas with the `Relationship` view option — see [Table-related Functions](./table-related-functions.md).  
[Flow mode](./visualization.md#flow-mode) on the Visualization tab draws connectors even with that option off, each as one smooth solid gray curve with the same end marks, so the dashed line and the routing described on this page apply to the ERD canvas only.

## Connector Routing

Connectors are routed orthogonally.  
A route bends around the tables that sit between its two ends instead of crossing them, and its corners are cut at 45 degrees.  
Routes leaving the same side of a table are spread onto separate corridors so they do not run down one another.

There is nothing to configure.  
Routes are recalculated automatically whenever anything on the canvas moves or resizes, so they never need touching by hand.

![Dragging the members table down and back while its connectors re-route around categories](/img/demo-connector-routing.webp)
