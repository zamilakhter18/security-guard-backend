// User Type
export enum userTypeEnum {
  CLIENT = 'client',
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export enum serviceLookingForEnum {
  ARMED_SECURITY  = 'armedSecurity',
  UNARMED_SECURITY = 'unarmedSecurity',
  BUSINESS_OR_HOME_SAFETY_CHECKS = "businessOrHomeSafetyChecks ",
  ESCORT_SERVICE = 'escortServices',
  ALARM_RESPONSE = 'alarmResponse',
  NEIGHBORHOOD_WATCH_AREA_PATROL = 'neighborhoodWatchAreaPatrol'
}

export enum socialLoinTypeEnum {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}

export enum servicesLookingForEnum {
  SECURITY_GUARD = 'securityGuard',
  PRIVATE_INVESTIGATOR = 'privateInvestigator',
  SECURITY_TRANSTAPORTATION = 'securityTransportation',
  RAPID_RESPONSE_REQUEST = 'rapidResponseRequest',
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

