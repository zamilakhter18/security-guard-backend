// User Type
export enum userTypeEnum {
  CLIENT = 'client',
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export enum socialLoinTypeEnum {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}

export enum deviceTypeEnum {
  IOS = 'ios',
  ANDROID = 'android',
}

export enum paymentStatusEnum {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum bookingStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}

export enum cancelReasonEnum {
  OTHER = 'other',
}

export enum refundStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}
