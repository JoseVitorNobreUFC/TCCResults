// @ts-nocheck
const getItemsInFreehandBounds = (
  pathTiles: Coords[],
  scene: any
): ItemReference[] => {
  const items: ItemReference[] = [];
  if (pathTiles.length < 3) return items;
  scene.items.forEach((item: any) => {
    if (isPointInPolygon(item.tile, pathTiles)) {
      items.push({ type: 'ITEM', id: item.id });
    }
  });
  scene.rectangles.forEach((rectangle: any) => {
    const corners = [
      rectangle.from,
      { x: rectangle.to.x, y: rectangle.from.y },
      rectangle.to,
      { x: rectangle.from.x, y: rectangle.to.y }
    ];
    const allCornersInside = corners.every(corner => isPointInPolygon(corner, pathTiles));
    if (allCornersInside) {
      items.push({ type: 'RECTANGLE', id: rectangle.id });
    }
  });
  scene.textBoxes.forEach((textBox: any) => {
    if (isPointInPolygon(textBox.tile, pathTiles)) {
      items.push({ type: 'TEXTBOX', id: textBox.id });
    }
  });
  return items;
};