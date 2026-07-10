export type ModalType = 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING' | 'QUESTION';

export interface HttpErrorData {
  status?: number;
  statusText?: string;
  url?: string;
  message?: string;
  payload?: unknown;
  error?: unknown;
}
