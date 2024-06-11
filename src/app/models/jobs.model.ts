export interface JobTypeModel {
    jobID: number;
    jobCode: string;
    jobPostedDate: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    equipmentTypeID: string;
    isSave: boolean;
    isDisLike: boolean;
    distance: string;
    location: string;
    addressView?: string;
    postedTime: number;
    rateAmount: number;
    timezone: string;
    dayLight: boolean;
    isAccountPreValid: boolean;
    isAgreementAccepted: boolean;
    inspectionScheduleChoice: string;
}

