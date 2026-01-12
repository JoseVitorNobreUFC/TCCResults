// @ts-nocheck
async function onMessageUpdate(updates) {
  for (const update of updates) {
    const jid = jidNormalizedUser(update.key.remoteJid!);
    if (!update.key.id) {
      continue;
    }
    if (!jid) {
      this.logger.warn(
        `got message update for unknown jid. update: '${JSON.stringify(
          update,
        )}'`,
      );
      continue;
    }
    const message = await this.messagesRepo.getByJidById(jid, update.key.id);
    if (!message) {
      this.logger.warn(
        `got update for non-existent message. update: '${JSON.stringify(
          update,
        )}'`,
      );
      continue;
    }
    const fields = { ...update.update };
    const onlyStatusField =
      Object.keys(fields).length === 1 &&
      'status' in fields &&
      fields.status !== null;
    if (onlyStatusField) {
      if (message.status >= fields.status) {
        continue;
      }
    }
    delete fields['key'];
    Object.assign(message, fields);
    const isYetRealMessage =
      isRealMessage(message, this.socket?.authState?.creds?.me?.id) || false;
    if (isYetRealMessage) {
      await this.messagesRepo.upsertOne(message);
    } else {
      await this.messagesRepo.deleteByJidByIds(jid, [update.key.id]);
    }
  }
}