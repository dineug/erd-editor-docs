---
sidebar_position: 7
description: A force-directed graph of every table, its columns, and the relationships between them — zoom it, pan it, and light up a table's neighbourhood.
---

# Visualization

Draws the whole document as a force-directed graph, so you can see at a glance how tables relate to one another and which ones sit at the center of a domain.

Open it from the `Visualization` tab in the toolbar, or from [Quick Search](./quick-search.md) under `Tab`.

![demo-visualization](/img/demo-visualization.webp)

## Reading the Graph

Every table and every column is a node, and the two kinds are drawn in different colors.  
Each column node is linked to the table it belongs to, and two tables joined by a relationship are linked to each other.  
Tables joined by more than one relationship in the same direction are linked only once, and a relationship that starts and ends on the same table draws no link.

Table names appear on the graph as you zoom in, fading in between `50%` and `100%`, and a name longer than 15 characters is cut. Column nodes carry no label at any zoom — hover one to find out what it is.

## Getting Around the Graph

The wheel zooms, about whatever the pointer is over, from `10%` to `400%`.  
Drag the background to pan.

## Hover Preview

Hover a node to preview the table it belongs to, next to the cursor.  
Hovering a column node highlights that column in the preview.

The preview shows the same columns as the ERD canvas, in the same order — see [Table View Options](./table-related-functions.md#table-view-options) and [Adjusting Column Order](./settings.md#adjusting-column-order).  
It is display-only, and it is hidden while you drag a node or the background.

## Highlighting a Neighbourhood

Hovering a table also lights up its neighbourhood: the table itself, its own columns, the tables its relationships join in either direction, and the links between them.  
Everything else on the graph fades, so what the table touches reads on its own.

## Moving Nodes

Drag a node to pull it, and everything linked to it, into a new position.  
The node is pinned under the pointer for as long as you hold it and the layout reheats around it.  
It settles again when you let go — nothing stays pinned where you dropped it.

## The Graph Is a Snapshot

The graph is built from the document as it stands the moment you open this tab, and it is rebuilt from scratch every time you come back to it.
