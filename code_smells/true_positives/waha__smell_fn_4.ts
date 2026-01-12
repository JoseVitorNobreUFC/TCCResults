// @ts-nocheck
function handleGroupedReceipts(
  node: BinaryNode,
  key: proto.IMessageKey,
  status: number,
  fromMe: boolean,
  isLid: boolean,
  me: Me,
): ReceiptEvent[] | null {
  const { content } = node;
  if (!Array.isArray(content)) {
    return [];
  }
  const participantsTags = content.filter((c) => c.tag === 'participants');
  if (participantsTags.length === 0) {
    return null;
  }
  const receiptEvents: ReceiptEvent[] = [];
  for (const participants of participantsTags) {
    const participantKey = participants.attrs?.key;
    if (!participantKey) continue;
    const users = getBinaryNodeChildren(participants, 'user');
    for (const user of users) {
      const userAttrs = user.attrs;
      if (!userAttrs) continue;
      const userJid = jidNormalizedUser(jid(userAttrs.jid));
      if (!userJid) continue;
      key.participant = fromMe ? (isLid ? me.lid : me.id) : userJid;
      const eventParticipant = fromMe ? userJid : isLid ? me.lid : me.id;
      const receiptEvent: ReceiptEvent = {
        key: {
          ...key,
          id: participantKey,
        },
        messageIds: [participantKey],
        status: status as any,
        participant: eventParticipant,
        _node: node,
      };
      receiptEvents.push(receiptEvent);
    }
  }
  return receiptEvents;
}