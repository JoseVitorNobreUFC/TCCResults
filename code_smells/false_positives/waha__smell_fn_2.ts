// @ts-nocheck
constructor(data ?: any[] | ({
    name?: string;
    startTime?: number;
    extraGuestsAllowed?: boolean;
    location?: EventLocation;
} & (({
    description?: string;
}) | ({
    endTime?: number;
})))) {
    super();
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
    if (!Array.isArray(data) && typeof data == `object`) {
        if (`name` in data && data.name != undefined) {
            this.name = data.name;
        }
        if (`description` in data && data.description != undefined) {
            this.description = data.description;
        }
        if (`startTime` in data && data.startTime != undefined) {
            this.startTime = data.startTime;
        }
        if (`endTime` in data && data.endTime != undefined) {
            this.endTime = data.endTime;
        }
        if (`extraGuestsAllowed` in data && data.extraGuestsAllowed != undefined) {
            this.extraGuestsAllowed = data.extraGuestsAllowed;
        }
        if (`location` in data && data.location != undefined) {
            this.location = data.location;
        }
    }
}