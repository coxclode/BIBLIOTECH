export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Solicitud inválida") {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "No autorizado") {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Acceso denegado") {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Recurso no encontrado") {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflicto con el estado actual del recurso") {
    super(409, message);
  }
}
