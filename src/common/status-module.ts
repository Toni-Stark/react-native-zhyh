/**
 * 课程类型
 */
export const LESSON_TYPE_BIG = 1;
export const LESSON_TYPE_SMALL = 2;
export const LESSON_TYPE_GROUP = 3;
export const LESSON_TYPE_VOD = 9;

/**
 * 课程状态 1:创建,2:提交,3:发布,4:结束,9:取消
 */
export const LESSON_STATUS_CREATED = 1;
export const LESSON_STATUS_SUBMIT = 2;
export const LESSON_STATUS_PUBLISHED = 3;
export const LESSON_STATUS_STARTED = 4;
export const LESSON_STATUS_FINISHED = 4;
export const LESSON_STATUS_CANCELED = 4;
/**
 * 课堂状态
 */
export const SCHEDULE_STATUS_CREATED = 1;
export const SCHEDULE_STATUS_STARTED = 2;
export const SCHEDULE_STATUS_FINISHED = 3;
export const SCHEDULE_STATUS_COMPLETE = 4;
export const SCHEDULE_STATUS_UPLOAD_PLAYBACK = 5;
export const SCHEDULE_STATUS_CANCELED = 9;
/**
 * 作业类型:1教师布置2学生完成3教师评语
 */
export const HOMEWORK_TYPE_TEACHER_CREATED_ROOT = 1;
export const HOMEWORK_TYPE_STUDENT_SUBMIT_LEAF = 2;
export const HOMEWORK_TYPE_TEACHER_REVIEW_BRANCH = 3;

/**
 * 作业状态:1创建状态，已发布作业 2已提交状态，用于学生 3已退回状态，用于教师和学生,4:批阅,5:完成
 */
export const HOMEWORK_STATUS_CREATED = 1;
export const HOMEWORK_STATUS_SUBMIT = 2;
export const HOMEWORK_STATUS_REVIEW = 3;
export const HOMEWORK_STATUS_CORRECTION = 4;
export const HOMEWORK_STATUS_COMPLETE = 5;

/**
 * 用户类型:1教师 2家长 3学生
 */
export const USER_MODE_TEACHER = 1;
export const USER_MODE_PARENT = 2;
export const USER_MODE_STUDENT = 3;

/**
 * 用户类型:0管理员,1巡课,2教师,3学生
 */
export const USER_MODE_CLASS_TOUR = 1;
export const USER_MODE_CLASS_TEACHER = 2;
export const USER_MODE_CLASS_STUDENT = 3;

/**
 * 课程模式:1:开放访问,2:密码访问,3:支付模式,4:封闭的管理员模式
 */
export const LESSON_TYPE_PUBLIC = 1;
export const LESSON_TYPE_PASSWORD = 2;
export const LESSON_TYPE_NEED_PAY = 3;
export const LESSON_TYPE_PRIVATE = 4;

/**
 * 2直播课封面3直播课详情4点播课封面5点播课详情6资源课封面7资源课详情
 */
export const UPLOAD_IMAGE_COVER = 2;
export const UPLOAD_IMAGE_DETAILS = 3;
export const UPLOAD_IMAGE_RESOURCE_COVER = 4;
export const UPLOAD_IMAGE_RESOURCE_DETAILS = 5;
export const UPLOAD_IMAGE_VOD_COVER = 6;
export const UPLOAD_IMAGE_VOD_DETAILS = 7;

/**
 * 课程类型
 */
export const LESSON_TYPE_LIVE = 1;
export const LESSON_TYPE_DEMAND = 2;
export const LESSON_TYPE_FILE = 3;

/**
 * 资源类型 0:文件夹,1:图片,2:音频,3:视频,4:pdf文档,5:word文档,6:excel文档,7:ppt文档,99:其他
 */
export const FOLDER = 0;
export const PICTURE = 1;
export const AUDIO = 2;
export const VIDEO = 3;
export const PDF_DOCUMENT = 4;
export const WORD_DOCUMENT = 5;
export const EXCEL_DOCUMENT = 6;
export const PPT_DOCUMENT = 7;
export const OTHER = 99;
