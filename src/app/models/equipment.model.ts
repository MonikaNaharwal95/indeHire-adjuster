export interface EquipmentDocumentModel {
    documentID: string;
    documentPath: string;
    documentFileName: string;
}
export interface EquipmentDocumentTypeModel {
    equipmentTypeID: string;
    statusType: string;
    equipmentDocuments: EquipmentDocumentModel[];
    isChecked?: boolean;
    equipmentName?: string;
}
export interface EquipmentImageModel {
    equipments: EquipmentDocumentTypeModel[];
}
export interface UploadEquipmentImage {
    equipmentTypeID: string;
    documentID: string;
}