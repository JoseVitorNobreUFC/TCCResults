// @ts-nocheck
function serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter();
    if (this.has_session)
        writer.writeMessage(1, this.session, () => this.session.serialize(writer));
    if (this.jid.length)
        writer.writeString(2, this.jid);
    if (this.text.length)
        writer.writeString(3, this.text);
    if (this.has_media)
        writer.writeMessage(4, this.media, () => this.media.serialize(writer));
    if (this.has_backgroundColor)
        writer.writeMessage(5, this.backgroundColor, () => this.backgroundColor.serialize(writer));
    if (this.has_font)
        writer.writeMessage(6, this.font, () => this.font.serialize(writer));
    if (this.linkPreview != false)
        writer.writeBool(7, this.linkPreview);
    if (this.linkPreviewHighQuality != false)
        writer.writeBool(8, this.linkPreviewHighQuality);
    if (this.replyTo.length)
        writer.writeString(9, this.replyTo);
    if (this.id.length)
        writer.writeString(10, this.id);
    if (this.participants.length)
        writer.writeRepeatedString(11, this.participants);
    if (this.has_preview)
        writer.writeMessage(12, this.preview, () => this.preview.serialize(writer));
    if (this.contacts.length)
        writer.writeRepeatedMessage(13, this.contacts, (item: vCardContact) => item.serialize(writer));
    if (this.has_event)
        writer.writeMessage(14, this.event, () => this.event.serialize(writer));
    if (this.has_poll)
        writer.writeMessage(15, this.poll, () => this.poll.serialize(writer));
    if (!w)
        return writer.getResultBuffer();
}