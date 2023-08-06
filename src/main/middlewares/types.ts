export interface AppMiddleware {
  when: 'dev' | 'production' | 'all'
  apply(): void
}
