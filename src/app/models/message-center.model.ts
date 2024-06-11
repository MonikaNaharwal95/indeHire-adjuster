export interface DropdownModel {
     key: number;
     value: string;
}

export interface MessageList {
     messageID: number;
     folder: string;
     ContactCategoryID: number;
     contactCategoryName: string;
     referenceID: number;
     subject: string;
     body: string;
     createdDate: string;
     parentID: number;
     isRead: boolean;
}
export interface MessageDetail {
     messageID: number;
     ContactCategoryID: number;
     contactCategoryName: string;
     referenceID: number;
     parentID: number;
     subject: string;
     body: string;
     senderID: number;
     senderUserTypeID: string;
     createdDate: string;
}
export interface MessageReply {
     body: string;
     parentID: number;
}

export interface SendComposedMail {
     contactCategoryID: number;
     refID: number;
     subject: string;
     body: string;
     parentID: number;
     isAddcontractor: boolean;
 }