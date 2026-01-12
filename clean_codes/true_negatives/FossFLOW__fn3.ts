// @ts-nocheck
export const createSmoothPath = (points: Coords[]): string => {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const previous = points[i - 1];
    const cpX = (previous.x + current.x) / 2;
    const cpY = (previous.y + current.y) / 2;
    if (i === 1) {
      path += ` L ${cpX},${cpY}`;
    } else {
      path += ` Q ${previous.x},${previous.y} ${cpX},${cpY}`;
    }
  }
  const lastPoint = points[points.length - 1];
  const secondLastPoint = points[points.length - 2];
  path += ` Q ${secondLastPoint.x},${secondLastPoint.y} ${lastPoint.x},${lastPoint.y}`;
  path += ' Z';
  return path;
};