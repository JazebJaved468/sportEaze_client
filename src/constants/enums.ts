export enum USER_TYPE {
  FAN = 1,
  PLAYER = 2,
  PATRON = 3,
  MENTOR = 4,
  GENERAL = 0,
  SUPER_ADMIN = 5,
}

export enum GENDER {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export enum MediaType {
  IMAGE = 1,
  VIDEO = 2,
  DOCUMENT = 3,
}

export enum PostVisibility {
  PUBLIC = 1,
  PRIVATE = 2,
  FOLLOWERS_ONLY = 3,
}

export enum PostReaction {
  LIKE = 1,
  HEART = 2,
  LAUGH = 3,
  SAD = 4,
  WOW = 5,
  Support = 6,
  Angry = 7,
}
export enum PlayingLevel {
  BEGINNER = 1,
  AMATEUR = 2,
  PROFESSIONAL = 3,
}

export enum ConnectionStatus {
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3,
}

export enum ConnectionReqResponse {
  ACCEPT = 1,
  REJECT = 2,
}
export enum PatronType {
  INDIVIDUAL = 1,
  ORGANIZATION = 2,
}

export enum FundingType {
  FULL_SPONSORSHIP = 1,
  PARTIAL_SPONSORSHIP = 2,
  EQUIPMENT_SUPPORT = 3,
  TRAINING_SUPPORT = 4,
  OTHER = 5,
}

export enum PatronAccountStatus {
  PENDING = 1,
  REJECTED = 2,
  MODIFICATION_REQUIRED = 3,
  APPROVED = 4,
}

export enum NotificationType {
  CONNECTION_REQUEST = 1,
  CONNECTION_ACCEPTED = 2,
  FOLLOW = 3,
  POST_LIKED = 4,
  POST_COMMENTED = 5,
  MSG_RECEIVED = 6,
  CONTRACT_CREATED = 7,
  CONTRACT_UPDATED = 8,
  CONTRACT_ACCEPTED = 9,
}
export enum ContractStatus {
  All = 0,
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}
