// @ts-nocheck
otherRefs.forEach((item) => {
  if (item.type === 'RECTANGLE') {
    if (itemRefs.length > 0) return;
    const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
    const newFrom = CoordsUtils.add(rectangle.from, delta);
    const newTo = CoordsUtils.add(rectangle.to, delta);
    scene.updateRectangle(item.id, { from: newFrom, to: newTo });
  } else if (item.type === 'TEXTBOX') {
    const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
    scene.updateTextBox(item.id, {
      tile: CoordsUtils.add(textBox.tile, delta)
    });
  } else if (item.type === 'CONNECTOR_ANCHOR') {
    const connector = getAnchorParent(item.id, scene.connectors);
    const newConnector = produce(connector, (draft) => {
      const anchor = getItemByIdOrThrow(connector.anchors, item.id);
      const itemAtTile = getItemAtTile({ tile, scene });
      switch (itemAtTile?.type) {
        case 'ITEM':
          draft.anchors[anchor.index] = {
            ...anchor.value,
            ref: {
              item: itemAtTile.id
            }
          };
          break;
        case 'CONNECTOR_ANCHOR':
          draft.anchors[anchor.index] = {
            ...anchor.value,
            ref: {
              anchor: itemAtTile.id
            }
          };
          break;
        default:
          draft.anchors[anchor.index] = {
            ...anchor.value,
            ref: {
              tile
            }
          };
          break;
      }
    });
    scene.updateConnector(connector.id, newConnector);
  }
});