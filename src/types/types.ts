export interface CreateUserRequestBody {
    nick_name: string;
    name: string;
    email: string;
    password: string;
  }

export interface CreateSubjectsRequestBody {
    user_id: number;
    teacher_id: number;
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
    user_id: string;
    photo: string;
    name: string;
    email: string;
    password: string;
    subject: string;
  }