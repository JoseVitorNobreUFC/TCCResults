// @ts-nocheck
function applyUpdate<
  ObjectInterface extends KubeObjectInterface,
  ObjectClass extends typeof KubeObject<ObjectInterface>
>(
  list: KubeList<KubeObject<ObjectInterface>>,
  update: KubeListUpdateEvent<ObjectInterface>,
  itemClass: ObjectClass,
  cluster: string
): KubeList<KubeObject<ObjectInterface>> {
  if (
    list.metadata.resourceVersion &&
    update.object.metadata.resourceVersion &&
    parseInt(update.object.metadata.resourceVersion) <= parseInt(list.metadata.resourceVersion)
  ) {
    return list;
  }
  const newItems = [...list.items];
  const index = newItems.findIndex(item => item.metadata.uid === update.object.metadata.uid);
  switch (update.type) {
    case 'ADDED':
    case 'MODIFIED':
      if (index !== -1) {
        newItems[index] = new itemClass(update.object, cluster);
      } else {
        newItems.push(new itemClass(update.object, cluster));
      }
      break;
    case 'DELETED':
      if (index !== -1) {
        newItems.splice(index, 1);
      }
      break;
    case 'ERROR':
      console.error('Error in update', update);
      break;
    default:
      console.error('Unknown update type', update);
  }
  return {
    ...list,
    metadata: {
      resourceVersion: update.object.metadata.resourceVersion!,
    },
    items: newItems,
  };
}