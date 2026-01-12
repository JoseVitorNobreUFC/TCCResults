// @ts-nocheck
export function TagReceiptNodeToReceiptEvent(
  node: BinaryNode,
  me: Me,
): ReceiptEvent[] {
  const { attrs, content } = node;
  const status = getStatusFromReceiptType(attrs.type);
  if (status == null) {
    return null;
  }
  const from = jidNormalizedUser(jid(attrs.from));
  const participant = jidNormalizedUser(jid(attrs.participant));
  const recipient = jidNormalizedUser(jid(attrs.recipient));
  const isLid = from.includes('lid');
  const isNodeFromMe = areJidsSameUser(
    participant || from,
    isLid ? me?.lid : me?.id,
  );
  const remoteJid = !isNodeFromMe || isJidGroup(from) ? from : recipient;
  const fromMe = !recipient || (attrs.type === 'retry' && isNodeFromMe);
  if (status < proto.WebMessageInfo.Status.SERVER_ACK && isNodeFromMe) {
    return [];
  }
  const key: proto.IMessageKey = {
    remoteJid: remoteJid,
    id: '',
    fromMe: fromMe,
  };
  const ids = [attrs.id];
  if (Array.isArray(content)) {
    const items = getBinaryNodeChildren(content[0], 'item');
    ids.push(...items.map((i) => i.attrs.id));
  }
  if (isJidGroup(remoteJid) || isJidStatusBroadcast(remoteJid)) {
    if (participant) {
      key.participant = fromMe ? (isLid ? me.lid : me.id) : recipient;
      const eventParticipant = fromMe ? participant : isLid ? me.lid : me.id;
      return [
        {
          key: key,
          messageIds: ids,
          status: status as any,
          participant: eventParticipant,
          _node: node,
        },
      ];
    } else {
      return handleGroupedReceipts(node, key, status, fromMe, isLid, me);
    }
  }
  return [
    {
      key: key,
      messageIds: ids,
      status: status as any,
      _node: node,
    },
  ];
}