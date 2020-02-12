export enum DeviceOnlineState {
    OFFLINE = 0,
    ONLINE = 1,
    UNKNOW = 2,
}

// See https://github.com/emqx/emqx-auth-http
export enum MQTTACLAccess {
    SUB = 1,
    PUB = 2,
    PUB_SUB = 3,
}

// See https://github.com/emqx/emqx-auth-http
export enum MQTTACLAlow {
    DENY = 0,
    ALLOW = 1,
}

export enum ConnectResult {
    SUCCESS = 0,
    NOT_FOUND = 1,
    PASSEORD_ERROR = 2,
    BANNED = 3,
}
export enum ACLResult {
    ALLOW = 0,
    NOT_FOUND = 1,
    DENY = 2
}