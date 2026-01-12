// @ts-nocheck
constructor(
  messageOrOptions ?: NotificationOptions | NotificationMessageString,
  date ?: OldNotificationDateArg
) {
  if (typeof messageOrOptions === 'string') {
    console.warn(
      `Notification constructor with a string arg is deprecated. Please use NotificationOptions as args instead`
    );
    if (messageOrOptions) {
      this.message = this.prepareMessage(messageOrOptions);
    }
    if (date) {
      this.date = date;
    }
  } else if (messageOrOptions) {
    const { message, date, cluster } = messageOrOptions;
    if (message) {
      this.message = this.prepareMessage(message);
    }
    if (date) {
      if (date instanceof Date) {
        this.date = date.getTime();
      } else {
        this.date = date;
      }
    }
    if (cluster) {
      this.cluster = cluster;
    }
  }
  this.id = btoa(unescape(encodeURIComponent(`${this.date},${this.message},${this.cluster}`)));
}