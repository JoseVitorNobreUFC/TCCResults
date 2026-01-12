// @ts-nocheck
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