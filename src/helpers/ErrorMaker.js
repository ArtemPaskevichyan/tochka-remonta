const ERROR_CODES = {
    emailValidationFailed: 432,
    passwordValidationFailed: 433,
    roleValidationFailed: 434,

    CPVAddressFailed: 435,
    CPVCityFailed: 436,
    CPVDescriptionFailed: 437,
    CPVDesignProjectFailed: 438,
    CPVHouseTypeFailed: 439,
    CPVNewBuildingFailed: 440,
    CPVPlanedBudgetDownFailed: 441,
    CPVPlanedBudgetUpFailed: 442,
    CPVRepairTypeFailed: 443,
    CPVSquareFailed: 444,
    CPVStartDateFailed: 445,
    CPVTitleFailed: 446,
    CPVImageListFailed: 447,

    PSVNumberFailed: 448,

    jsonParsingFailed: 540,
    privacyPolicyError: 541,
    emailVerificationExpired: 542,
    emailVerificationFake: 543,

    serverDataFail: 521,
}

function createError(message, code, coreError) {
    var error = Error()
    error.message = message
    error.code = code

    if (code == ERROR_CODES.serverDataFail) {
    }

    return error
}
export { createError, ERROR_CODES }