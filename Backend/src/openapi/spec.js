const jsonContent = schemaRef => ({
  'application/json': {
    schema: {
      $ref: schemaRef,
    },
  },
});

const createErrorResponse = (description, example) => ({
  description,
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ErrorResponse',
      },
      examples: {
        default: {
          value: {
            error: example,
          },
        },
      },
    },
  },
});

export const createOpenApiSpec = () => ({
  openapi: '3.0.3',
  info: {
    title: 'Fullstack Blog Backend API',
    version: '1.0.0',
    description:
      'Документация фактического Express API для fullstack-blog-coursework-2. Source of truth: текущий backend runtime и его валидация/ACL.',
  },
  servers: [
    {
      url: '/api',
      description: 'Relative API base for reverse proxy and direct backend access',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Service availability checks',
    },
    {
      name: 'Auth',
      description: 'Registration, login and current user session restore',
    },
    {
      name: 'Posts',
      description: 'Posts list, details and admin CRUD operations',
    },
    {
      name: 'Comments',
      description: 'Comment creation and moderation',
    },
    {
      name: 'Users',
      description: 'Admin-only user management',
    },
    {
      name: 'Roles',
      description: 'Admin-only roles directory',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token from POST /auth/login or POST /auth/register',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Human-readable error message returned by backend middleware',
          },
        },
        example: {
          error: 'Нужна авторизация',
        },
      },
      HealthResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
        },
      },
      Role: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'key', 'name'],
        properties: {
          id: {
            type: 'string',
            example: '69b125be064827dc7f497810',
          },
          key: {
            type: 'string',
            enum: ['admin', 'moder', 'reader', 'guest'],
            example: 'admin',
          },
          name: {
            type: 'string',
            example: 'Администратор',
          },
        },
      },
      User: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'login', 'role', 'registeredAt'],
        properties: {
          id: {
            type: 'string',
            example: '69b125be064827dc7f497820',
          },
          login: {
            type: 'string',
            example: 'admin',
          },
          role: {
            allOf: [{ $ref: '#/components/schemas/Role' }],
            nullable: true,
          },
          registeredAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-10T17:00:00.000Z',
          },
        },
      },
      AuthCredentials: {
        type: 'object',
        additionalProperties: false,
        required: ['login', 'password'],
        properties: {
          login: {
            type: 'string',
            pattern: '^\\w{3,15}$',
            example: 'reader',
            description: '3-15 symbols: letters, digits or underscore',
          },
          password: {
            type: 'string',
            pattern: '^[\\w#%]{6,30}$',
            example: 'admin123',
            description: '6-30 symbols: letters, digits, underscore, # or %',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['token', 'user'],
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      AuthMeResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['user'],
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        additionalProperties: false,
        required: ['page', 'limit', 'total', 'pages'],
        properties: {
          page: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
          limit: {
            type: 'integer',
            minimum: 1,
            example: 10,
          },
          total: {
            type: 'integer',
            minimum: 0,
            example: 25,
          },
          pages: {
            type: 'integer',
            minimum: 0,
            example: 3,
          },
        },
      },
      PostFilters: {
        type: 'object',
        additionalProperties: false,
        required: ['search'],
        properties: {
          search: {
            type: 'string',
            example: 'react',
          },
        },
      },
      PostListItem: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'title', 'imageUrl', 'publishedAt', 'commentsCount'],
        properties: {
          id: {
            type: 'string',
            example: '69b125be064827dc7f497830',
          },
          title: {
            type: 'string',
            example: 'Перевод блога на Express API',
          },
          imageUrl: {
            type: 'string',
            example: 'https://images.example.dev/post-cover.jpg',
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-10T18:30:00.000Z',
          },
          commentsCount: {
            type: 'integer',
            minimum: 0,
            example: 2,
          },
        },
      },
      Comment: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'authorId', 'author', 'postId', 'content', 'publishedAt'],
        properties: {
          id: {
            type: 'string',
            example: '69b125be064827dc7f497840',
          },
          authorId: {
            type: 'string',
            example: '69b125be064827dc7f497820',
          },
          author: {
            type: 'string',
            nullable: true,
            example: 'reader',
          },
          postId: {
            type: 'string',
            example: '69b125be064827dc7f497830',
          },
          content: {
            type: 'string',
            example: 'Рабочий API уже выглядит заметно чище.',
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-10T18:45:00.000Z',
          },
        },
      },
      PostDetail: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'title', 'imageUrl', 'content', 'publishedAt', 'comments'],
        properties: {
          id: {
            type: 'string',
            example: '69b125be064827dc7f497830',
          },
          title: {
            type: 'string',
            example: 'Перевод блога на Express API',
          },
          imageUrl: {
            type: 'string',
            example: 'https://images.example.dev/post-cover.jpg',
          },
          content: {
            type: 'string',
            example: '<p>Подробный текст поста...</p>',
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-10T18:30:00.000Z',
          },
          comments: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Comment',
            },
          },
        },
      },
      PostMutationRequest: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'content'],
        properties: {
          title: {
            type: 'string',
            maxLength: 150,
            example: 'Новый backend endpoint',
          },
          imageUrl: {
            type: 'string',
            example: 'https://images.example.dev/new-post.jpg',
            description: 'Optional string; backend stores empty string when omitted',
          },
          content: {
            type: 'string',
            maxLength: 20000,
            example: '<p>Контент поста</p>',
          },
        },
      },
      CommentMutationRequest: {
        type: 'object',
        additionalProperties: false,
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            maxLength: 1000,
            example: 'Спасибо, это помогло.',
          },
        },
      },
      UpdateUserRoleRequest: {
        type: 'object',
        additionalProperties: false,
        required: ['roleId'],
        properties: {
          roleId: {
            type: 'string',
            example: '69b125be064827dc7f497810',
          },
        },
      },
      PostsListResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['posts', 'pagination', 'filters'],
        properties: {
          posts: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PostListItem',
            },
          },
          pagination: {
            $ref: '#/components/schemas/PaginationMeta',
          },
          filters: {
            $ref: '#/components/schemas/PostFilters',
          },
        },
      },
      PostResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['post'],
        properties: {
          post: {
            $ref: '#/components/schemas/PostDetail',
          },
        },
      },
      CommentResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['comment'],
        properties: {
          comment: {
            $ref: '#/components/schemas/Comment',
          },
        },
      },
      UsersResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['users'],
        properties: {
          users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      UserResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['user'],
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      RolesResponse: {
        type: 'object',
        additionalProperties: false,
        required: ['roles'],
        properties: {
          roles: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Role',
            },
          },
        },
      },
    },
    responses: {
      BadRequest: createErrorResponse('Request validation failed or identifier is invalid', 'Некорректный идентификатор'),
      Unauthorized: createErrorResponse('Bearer token is missing, malformed or invalid', 'Нужна авторизация'),
      Forbidden: createErrorResponse('Authenticated user role is not allowed for this operation', 'Недостаточно прав'),
      NotFound: createErrorResponse('Requested entity or route was not found', 'Маршрут не найден'),
      Conflict: createErrorResponse('Operation conflicts with current backend state', 'Пользователь с таким логином уже существует'),
      InternalServerError: createErrorResponse('Unexpected backend failure', 'Внутренняя ошибка сервера'),
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check backend health',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Backend is running',
            content: jsonContent('#/components/schemas/HealthResponse'),
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new reader user',
        description: 'Creates a new user with the `reader` role and returns JWT access token.',
        operationId: 'registerUser',
        requestBody: {
          required: true,
          content: jsonContent('#/components/schemas/AuthCredentials'),
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: jsonContent('#/components/schemas/AuthResponse'),
          },
          400: createErrorResponse('Login or password validation failed', 'Логин должен содержать 3-15 символов: буквы, цифры или underscore'),
          409: createErrorResponse('Login already exists', 'Пользователь с таким логином уже существует'),
          500: createErrorResponse('Reader role bootstrap is missing or another internal error occurred', 'Роль reader не инициализирована'),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate user',
        description: 'Validates credentials and returns JWT access token with public user data.',
        operationId: 'loginUser',
        requestBody: {
          required: true,
          content: jsonContent('#/components/schemas/AuthCredentials'),
        },
        responses: {
          200: {
            description: 'User authenticated successfully',
            content: jsonContent('#/components/schemas/AuthResponse'),
          },
          400: createErrorResponse('Login or password validation failed', 'Пароль должен содержать 6-30 символов: буквы, цифры, #, % или underscore'),
          401: createErrorResponse('Credentials are invalid', 'Неверный логин или пароль'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        description: 'Returns currently authenticated user by JWT token.',
        operationId: 'getCurrentUser',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Authenticated user restored',
            content: jsonContent('#/components/schemas/AuthMeResponse'),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'List posts',
        description: 'Public endpoint with search and pagination. Posts are sorted by `publishedAt` descending.',
        operationId: 'getPosts',
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Case-insensitive title substring search',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: 'Paginated posts list',
            content: jsonContent('#/components/schemas/PostsListResponse'),
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Create post',
        description: 'Admin-only endpoint. Requires valid JWT and `admin` role.',
        operationId: 'createPost',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        requestBody: {
          required: true,
          content: jsonContent('#/components/schemas/PostMutationRequest'),
        },
        responses: {
          201: {
            description: 'Post created',
            content: jsonContent('#/components/schemas/PostResponse'),
          },
          400: createErrorResponse('Post body validation failed', 'Укажите заголовок поста'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/posts/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Get post by id',
        description: 'Public endpoint returning post details with comments sorted by `publishedAt` ascending.',
        operationId: 'getPostById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Post details',
            content: jsonContent('#/components/schemas/PostResponse'),
          },
          400: createErrorResponse('ObjectId cannot be parsed by MongoDB', 'Некорректный идентификатор'),
          404: createErrorResponse('Post was not found', 'Пост не найден'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      patch: {
        tags: ['Posts'],
        summary: 'Update post',
        description: 'Admin-only endpoint. Returns updated post details with comments.',
        operationId: 'updatePost',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: jsonContent('#/components/schemas/PostMutationRequest'),
        },
        responses: {
          200: {
            description: 'Post updated',
            content: jsonContent('#/components/schemas/PostResponse'),
          },
          400: createErrorResponse('Validation failed or identifier is invalid', 'Поле imageUrl должно быть строкой'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: createErrorResponse('Post was not found', 'Пост не найден'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Delete post',
        description: 'Admin-only endpoint. Deletes post and its related comments.',
        operationId: 'deletePost',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          204: {
            description: 'Post deleted',
          },
          400: createErrorResponse('Identifier is invalid', 'Некорректный идентификатор'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: createErrorResponse('Post was not found', 'Пост не найден'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/posts/{id}/comments': {
      post: {
        tags: ['Comments'],
        summary: 'Create comment for post',
        description:
          'Authenticated endpoint. Access is allowed to any existing authenticated role because only `authenticate` middleware is applied.',
        operationId: 'createPostComment',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin', 'moder', 'reader', 'guest'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Post identifier',
          },
        ],
        requestBody: {
          required: true,
          content: jsonContent('#/components/schemas/CommentMutationRequest'),
        },
        responses: {
          201: {
            description: 'Comment created',
            content: jsonContent('#/components/schemas/CommentResponse'),
          },
          400: createErrorResponse('Comment body validation failed or post id is invalid', 'Введите текст комментария'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          404: createErrorResponse('Post was not found', 'Пост не найден'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/comments/{id}': {
      delete: {
        tags: ['Comments'],
        summary: 'Delete comment',
        description: 'Moderation endpoint. Requires JWT and role `admin` or `moder`.',
        operationId: 'deleteComment',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin', 'moder'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          204: {
            description: 'Comment deleted',
          },
          400: createErrorResponse('Identifier is invalid', 'Некорректный идентификатор'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: createErrorResponse('Comment was not found', 'Комментарий не найден'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        description: 'Admin-only endpoint returning public user records without password hash.',
        operationId: 'getUsers',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        responses: {
          200: {
            description: 'Users list',
            content: jsonContent('#/components/schemas/UsersResponse'),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/users/{id}/role': {
      patch: {
        tags: ['Users'],
        summary: 'Update user role',
        description: 'Admin-only endpoint. Prevents demoting the last remaining admin.',
        operationId: 'updateUserRole',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: jsonContent('#/components/schemas/UpdateUserRoleRequest'),
        },
        responses: {
          200: {
            description: 'User role updated',
            content: jsonContent('#/components/schemas/UserResponse'),
          },
          400: createErrorResponse('User id or role id validation failed', 'Некорректный roleId'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: createErrorResponse('User or role was not found', 'Роль не найдена'),
          409: createErrorResponse('Attempt to demote the last admin', 'Нельзя удалить или разжаловать последнего администратора'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/users/{id}': {
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        description: 'Admin-only endpoint. Also deletes comments authored by the target user.',
        operationId: 'deleteUser',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          204: {
            description: 'User deleted',
          },
          400: createErrorResponse('User identifier validation failed', 'Некорректный идентификатор пользователя'),
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          404: createErrorResponse('User was not found', 'Пользователь не найден'),
          409: createErrorResponse('Attempt to remove the last admin', 'Нельзя удалить или разжаловать последнего администратора'),
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/roles': {
      get: {
        tags: ['Roles'],
        summary: 'List roles',
        description: 'Admin-only endpoint with available roles directory.',
        operationId: 'getRoles',
        security: [{ bearerAuth: [] }],
        'x-required-roles': ['admin'],
        responses: {
          200: {
            description: 'Roles list',
            content: jsonContent('#/components/schemas/RolesResponse'),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          403: {
            $ref: '#/components/responses/Forbidden',
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
  },
});
