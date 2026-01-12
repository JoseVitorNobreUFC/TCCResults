// @ts-nocheck
async (tx) => {
  const isSameCollection = srcCollID === destCollID;
  const isMovingUp = nextRequest?.orderIndex < request.orderIndex;
  const nextReqOrderIndex = nextRequest?.orderIndex;
  const reqCountInDestColl = nextRequest
    ? undefined
    : await this.getRequestsCountInCollection(destCollID);
  if (isSameCollection) {
    const updateFrom = isMovingUp
      ? nextReqOrderIndex
      : request.orderIndex + 1;
    const updateTo = isMovingUp ? request.orderIndex : nextReqOrderIndex;
    await tx.teamRequest.updateMany({
      where: {
        collectionID: srcCollID,
        orderIndex: { gte: updateFrom, lt: updateTo },
      },
      data: {
        orderIndex: isMovingUp ? { increment: 1 } : { decrement: 1 },
      },
    });
  } else {
    await tx.teamRequest.updateMany({
      where: {
        collectionID: srcCollID,
        orderIndex: { gte: request.orderIndex },
      },
      data: { orderIndex: { decrement: 1 } },
    });

    if (nextRequest) {
      await tx.teamRequest.updateMany({
        where: {
          collectionID: destCollID,
          orderIndex: { gte: nextReqOrderIndex },
        },
        data: { orderIndex: { increment: 1 } },
      });
    }
  }
  let adjust: number;
  if (isSameCollection) adjust = nextRequest ? (isMovingUp ? 0 : -1) : 0;
  else adjust = nextRequest ? 0 : 1;
  const newOrderIndex =
    (nextReqOrderIndex ?? reqCountInDestColl) + adjust;
  const updatedRequest = await tx.teamRequest.update({
    where: { id: request.id },
    data: { orderIndex: newOrderIndex, collectionID: destCollID },
  });
  return E.right(updatedRequest);
};