export type AvatarType = {
  id: string;
  url: string;
};
export type UserInfoType = {
  id: string;
  createdTime: Date;
  updatedTime: Date;
  username: string;
  phone: string;
  nickName: string;
  realName: string;
  avatar: Partial<AvatarType>;
  birthday: Date;
  sex: number;
  email: string;
  userType: number;
  certified: null;
  isEnabled: true;
  lastActiveTime: Date;
  createdBy: null;
  updatedBy: string;
  businessId: string;
};
export type HomeworkFilesType = {
  id: string;
  type: number;
  name: string;
  fileSize: string;
  pictureThumbnailUrl: string;
};
export interface AttachmentType {
  fileSize: string;
  id: string;
  type: number;
  fileId: string;
  url: string;
  pictureThumbnailUrl: string;
}

export type ImageType = {
  uri: string;
};
export type homeworkListType = {
  content: string;
  createdBy: string;
  createdTime: Date;
  id: string;
  lessonType: number;
  notSubmitCount: number;
  retreatCount: number;
  reviewCount: number;
  scheduleId: string;
  status: number;
  submitCount: number;
  title: string;
  updatedBy: string;
  updatedTime: Date;
};
