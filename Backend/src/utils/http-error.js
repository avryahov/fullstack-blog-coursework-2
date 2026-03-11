export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Нужна авторизация',
  FORBIDDEN: 'Недостаточно прав',
  INVALID_IDENTIFIER: 'Некорректный идентификатор',
  ROUTE_NOT_FOUND: 'Маршрут не найден',
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',
  LOGIN_VALIDATION: 'Логин должен содержать 3-15 символов: буквы, цифры или underscore',
  PASSWORD_VALIDATION: 'Пароль должен содержать 6-30 символов: буквы, цифры, #, % или underscore',
  POST_TITLE_REQUIRED: 'Укажите заголовок поста',
  POST_CONTENT_REQUIRED: 'Укажите текст поста',
  POST_TITLE_TOO_LONG: 'Заголовок поста слишком длинный',
  POST_CONTENT_TOO_LONG: 'Текст поста слишком длинный',
  POST_IMAGE_INVALID: 'Поле imageUrl должно быть строкой',
  COMMENT_CONTENT_REQUIRED: 'Введите текст комментария',
  COMMENT_CONTENT_TOO_LONG: 'Комментарий слишком длинный',
  USER_ID_INVALID: 'Некорректный идентификатор пользователя',
  ROLE_ID_REQUIRED: 'Укажите roleId',
  ROLE_ID_INVALID: 'Некорректный roleId',
  LOGIN_ALREADY_EXISTS: 'Пользователь с таким логином уже существует',
  READER_ROLE_NOT_INITIALIZED: 'Роль reader не инициализирована',
  INVALID_LOGIN_OR_PASSWORD: 'Неверный логин или пароль',
  POST_NOT_FOUND: 'Пост не найден',
  COMMENT_NOT_FOUND: 'Комментарий не найден',
  USER_NOT_FOUND: 'Пользователь не найден',
  ROLE_NOT_FOUND: 'Роль не найдена',
  LAST_ADMIN_REQUIRED: 'Нельзя удалить или разжаловать последнего администратора',
};

export const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};
