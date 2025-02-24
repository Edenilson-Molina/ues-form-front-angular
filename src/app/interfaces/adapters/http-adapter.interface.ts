export interface HttpAdapter<TConfig> {
    // Realiza una solicitud HTTP GET a la URL especificada.
    get<TResponse>(url: string, config?: TConfig): Promise<TResponse>
    
    // Realiza una solicitud HTTP POST para enviar datos al servidor.
    post<TRequest, TResponse>(
      url: string,
      data?: TRequest,
      config?: TConfig
    ): Promise<TResponse>
    
    // Realiza una solicitud HTTP PUT para actualizar un recurso existente.
    put<TRequest, TResponse>(
      url: string,
      data?: TRequest,
      config?: TConfig
    ): Promise<TResponse>
  
    // Realiza una solicitud HTTP DELETE para eliminar un recurso.
    delete<TResponse>(url: string, config?: TConfig): Promise<TResponse>
  
    // Proporciona una forma genérica de realizar cualquier tipo de solicitud HTTP, especificando el método (GET, POST, PUT, etc.).
    request<TRequest, TResponse>(
      method: string,
      url: string,
      data?: TRequest,
      config?: TConfig
    ): Promise<TResponse>
  
    // Permite configurar encabezados HTTP globales (como tokens de autorización) para todas las solicitudes.
    setHeaders(headers: Record<string, string>): Promise<void>
  }
  