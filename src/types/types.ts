export interface CreateUserRequestBody {
  nick_name: string;
  name: string;
  email: string;
  password: string;
}

export interface CreateSubjectsRequestBody {
  teacher_id: number;
  subject_name: string;
}

export interface CreateActivitiesRequestBody {
  subject_id: number;
  activity_name: string;
  content: string;
}

export interface CreateEnrollmentsRequestBody {
  user_id: number;
  subject_id: number;
  enrollment_date: Date;
}

export interface LoginUserRequestBody {
  email: string;
  password: string;
}

export interface TokenData {
  userId: string;
  userRoles: string;
}

export interface CreateTeacherRequestBody {
  user_id: number;
  photo: string;
  nick_name: string;
  name: string;
  email: string;
  password: string;
}
